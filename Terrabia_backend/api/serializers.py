from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import AgenceLivraison

from .models import (
    AcheteurProfile,
    AgriculteurProfile,
    Categorie,
    Produit,
    ProduitPhoto,
    Avis,
    Panier,
    PanierItem,
)

User = get_user_model()

# ------------------------
# User & Auth
# ------------------------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "role"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    specialite = serializers.CharField(write_only=True, required=False)
    photo_profil = serializers.ImageField(write_only=True, required=False)
    nom = serializers.CharField(write_only=True, required=False)
    prenom = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["email", "password", "role", "specialite", "photo_profil", "nom", "prenom"]

    def create(self, validated_data):
        role = validated_data.get("role", "ACHETEUR")
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            role=role
        )

        if role == "ACHETEUR":
            AcheteurProfile.objects.create(
                user=user,
                nom=validated_data.get("nom", ""),
                prenom=validated_data.get("prenom", ""),
                photo_profil=validated_data.get("photo_profil", None)
            )
        elif role == "AGRICULTEUR":
            AgriculteurProfile.objects.create(
                user=user,
                specialite=validated_data.get("specialite", "FRUIT"),
                photo_profil=validated_data.get("photo_profil", None)
            )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


# ------------------------
# Produits & Catégories
# ------------------------

class ProduitPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProduitPhoto
        fields = ["id", "image"]

class ProduitSerializer(serializers.ModelSerializer):
    # Champ pour uploader les images en écriture
    photos = serializers.ListField(
        child=serializers.ImageField(max_length=None, allow_empty_file=False, use_url=True),
        write_only=True,
        required=False
    )
    # Champ read-only pour renvoyer les images liées au produit
    images = ProduitPhotoSerializer(many=True, read_only=True, source="photos")

    class Meta:
        model = Produit
        fields = ["id", "nom", "quantite", "prix", "etat", "categorie", "agriculteur", "photos", "images"]
        read_only_fields = ["agriculteur"]

    def create(self, validated_data):
        photos_data = validated_data.pop("photos", [])
        produit = Produit.objects.create(**validated_data)
        for photo in photos_data:
            ProduitPhoto.objects.create(produit=produit, image=photo)
        return produit


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = "__all__"


# ------------------------
# Avis
# ------------------------

class AvisSerializer(serializers.ModelSerializer):
    auteur = UserSerializer(read_only=True)

    class Meta:
        model = Avis
        fields = ["id", "note", "commentaire", "auteur", "cible"]
        read_only_fields = ["auteur"]


# ------------------------
# Panier
# ------------------------

class PanierItemSerializer(serializers.ModelSerializer):
    produit = ProduitSerializer(read_only=True)

    class Meta:
        model = PanierItem
        fields = ["id", "produit", "quantite"]

class PanierSerializer(serializers.ModelSerializer):
    items = PanierItemSerializer(many=True, read_only=True)

    class Meta:
        model = Panier
        fields = ["id", "acheteur", "date_creation", "statut", "montant_total", "items"]
        read_only_fields = ["acheteur"]


# ------------------------
# Agence Livraison
# ------------------------

class AgenceLivraisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgenceLivraison
        fields = ["id", "nom_agence", "numero_telephone", "localite", "email"]
