from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# ------------------------
# User & Profiles
# ------------------------

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, role="ACHETEUR", **extra_fields):
        if not email: 
            raise ValueError("L'utilisateur doit avoir un email")
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", "ADMIN")
        user = self.create_user(email, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("ADMIN", "Admin"),
        ("AGRICULTEUR", "Agriculteur"),
        ("ACHETEUR", "Acheteur"),
    ]
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="ACHETEUR")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"


class AcheteurProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="acheteur_profile")
    nom = models.CharField(max_length=100, blank=True)
    prenom = models.CharField(max_length=100, blank=True)
    photo_profil = models.ImageField(upload_to="acheteurs/", blank=True, null=True)

    def __str__(self):
        return f"{self.nom} {self.prenom}"



class AgriculteurProfile(models.Model):
    SPECIALITE_CHOICES = [
        ("FRUIT", "Fruit"),
        ("TUBERCULE", "Tubercule"),
        ("LEGUME", "Légume"),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="agriculteur_profile")
    specialite = models.CharField(max_length=20, choices=SPECIALITE_CHOICES)
    photo_profil = models.ImageField(upload_to="agriculteurs/", blank=True, null=True)

    def __str__(self):
        return f"{self.user.email} - {self.specialite}"

# ------------------------
# Produits & Catégories
# ------------------------

class Categorie(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.nom


class Produit(models.Model):
    nom = models.CharField(max_length=100)
    quantite = models.IntegerField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    etat = models.CharField(max_length=50)
    categorie = models.ForeignKey(Categorie, on_delete=models.CASCADE, related_name="produits")
    agriculteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name="produits")  # ✅ User au lieu de AgriculteurProfile

    def __str__(self):
        return f"{self.nom} - {self.agriculteur.email}"

class ProduitPhoto(models.Model):
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="produits/")

    def __str__(self):
        return f"Photo de {self.produit.nom}"


# ------------------------
# Avis
# ------------------------

class Avis(models.Model):
    auteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name="avis_donnes")
    cible = models.ForeignKey(AgriculteurProfile, on_delete=models.CASCADE, related_name="avis_recus")
    note = models.IntegerField()
    commentaire = models.TextField()

    def __str__(self):
        return f"Avis {self.note}/5 par {self.auteur.email}"


# ------------------------
# Panier
# ------------------------

class Panier(models.Model):
    STATUT_CHOICES = [
        ("EN_COURS", "En cours"),
        ("VALIDE", "Validé"),
        ("ANNULE", "Annulé"),
    ]
    acheteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name="paniers")
    date_creation = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="EN_COURS")
    montant_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Panier {self.id} - {self.acheteur.email}"


class PanierItem(models.Model):
    panier = models.ForeignKey(Panier, on_delete=models.CASCADE, related_name="items")
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    quantite = models.IntegerField()

    def __str__(self):
        return f"{self.quantite} x {self.produit.nom}"

class AgenceLivraison(models.Model):
    nom_agence = models.CharField(max_length=150)
    numero_telephone = models.CharField(max_length=20)
    localite = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.nom_agence} ({self.localite})"
