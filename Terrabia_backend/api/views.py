from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    User,
    Categorie,
    Produit,
    ProduitPhoto,
    Avis,
    Panier,
    PanierItem,
    AgenceLivraison
)

from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    CategorieSerializer,
    ProduitSerializer,
    ProduitPhotoSerializer,
    AvisSerializer,
    PanierSerializer,
    PanierItemSerializer,
    AgenceLivraisonSerializer
)

# ------------------------
# Authentification
# ------------------------

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, email=email, password=password)

        if not user:
            return Response({"error": "Identifiants invalides"}, status=status.HTTP_401_UNAUTHORIZED)

        # Génération des tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # User data adapté à ton modèle
        user_data = {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }

        return Response({
            "message": "Connexion réussie",
            "access": access_token,
            "refresh": str(refresh),
            "user": user_data
        }, status=status.HTTP_200_OK)


# ------------------------
# Catégories
# ------------------------

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticated]


# ------------------------
# Produits & Photos
# ------------------------

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        print(f"🔍 User connecté: {self.request.user.id} - {self.request.user.email}")
        serializer.save(agriculteur=self.request.user)
        print(f"✅ Produit créé pour agriculteur #{self.request.user.id}")


class ProduitPhotoViewSet(viewsets.ModelViewSet):
    queryset = ProduitPhoto.objects.all()
    serializer_class = ProduitPhotoSerializer
    permission_classes = [IsAuthenticated]


# ------------------------
# Avis
# ------------------------

class AvisViewSet(viewsets.ModelViewSet):
    queryset = Avis.objects.all()
    serializer_class = AvisSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(auteur=self.request.user)


# ------------------------
# Panier - Vues existantes
# ------------------------

class PanierViewSet(viewsets.ModelViewSet):
    queryset = Panier.objects.all()
    serializer_class = PanierSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retourner seulement le panier de l'utilisateur connecté
        return Panier.objects.filter(acheteur=self.request.user)

    def list(self, request, *args, **kwargs):
        # Récupérer ou créer le panier de l'utilisateur
        panier, created = Panier.objects.get_or_create(
            acheteur=request.user,
            statut="EN_COURS"
        )
        serializer = self.get_serializer(panier)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(acheteur=self.request.user)


class PanierItemViewSet(viewsets.ModelViewSet):
    queryset = PanierItem.objects.all()
    serializer_class = PanierItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Récupérer le panier de l'utilisateur
        panier, created = Panier.objects.get_or_create(
            acheteur=self.request.user,
            statut="EN_COURS"
        )
        # Sauvegarder avec le panier
        serializer.save(panier=panier)

    def get_queryset(self):
        # Retourner seulement les items du panier de l'utilisateur
        return PanierItem.objects.filter(panier__acheteur=self.request.user)



##############################
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creer_commande(request):
    """
    Créer une commande à partir du panier de l'utilisateur
    """
    try:
        agence_id = request.data.get('agence_livraison')
        
        if not agence_id:
            return Response(
                {'error': 'Agence de livraison requise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Récupérer le panier EN_COURS de l'utilisateur
        panier = Panier.objects.filter(
            acheteur=request.user,
            statut='EN_COURS'
        ).first()
        
        if not panier:
            return Response(
                {'error': 'Aucun panier en cours'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not panier.items.exists():
            return Response(
                {'error': 'Le panier est vide'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier que l'agence existe
        try:
            agence = AgenceLivraison.objects.get(id=agence_id)
        except AgenceLivraison.DoesNotExist:
            return Response(
                {'error': 'Agence introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Calculer le montant total
        montant_total = sum(
            item.produit.prix * item.quantite 
            for item in panier.items.all()
        )
        
        # Mettre à jour le panier
        panier.statut = 'VALIDE'
        panier.montant_total = montant_total
        panier.save()
        
        print(f"✅ Commande créée: Panier #{panier.id}, Montant: {montant_total} FCFA")
        
        return Response({
            'success': True,
            'message': 'Commande créée avec succès',
            'id': panier.id,
            'montant_total': str(montant_total),
            'agence': {
                'id': agence.id,
                'nom': agence.nom_agence,
                'localite': agence.localite,
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"❌ Erreur création commande: {e}")
        return Response(
            {'error': f'Erreur serveur: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



# ------------------------
# Nouvelles vues pour le panier (simplifiées)
# ------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ajouter_au_panier_simple(request):
    """
    Vue simple pour ajouter un produit au panier
    Retourne du JSON même en cas d'erreur
    """
    try:
        produit_id = request.data.get('produit')
        quantite = request.data.get('quantite', 1)
        
        if not produit_id:
            return Response(
                {"error": "ID produit manquant", "details": "Le champ 'produit' est requis"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier si le produit existe
        try:
            produit = Produit.objects.get(id=produit_id)
        except Produit.DoesNotExist:
            return Response(
                {"error": "Produit non trouvé", "details": f"Le produit avec ID {produit_id} n'existe pas"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Récupérer ou créer le panier de l'utilisateur
        panier, created = Panier.objects.get_or_create(
            acheteur=request.user,
            statut="EN_COURS"
        )
        
        # Vérifier si le produit est déjà dans le panier
        try:
            item = PanierItem.objects.get(panier=panier, produit=produit)
            item.quantite += int(quantite)
            item.save()
            message = "Quantité mise à jour"
            created_new = False
        except PanierItem.DoesNotExist:
            item = PanierItem.objects.create(
                panier=panier,
                produit=produit,
                quantite=quantite
            )
            message = "Produit ajouté au panier"
            created_new = True
        
        # Sérialiser la réponse
        serializer = PanierItemSerializer(item)
        
        return Response({
            "success": True,
            "message": message,
            "item": serializer.data,
            "created": created_new
        }, status=status.HTTP_201_CREATED if created_new else status.HTTP_200_OK)
        
    except Exception as e:
        # Retourner une erreur JSON au lieu d'une page HTML
        return Response({
            "success": False,
            "error": "Erreur lors de l'ajout au panier",
            "details": str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_panier_utilisateur(request):
    """
    Récupérer le panier complet de l'utilisateur connecté
    """
    try:
        # Récupérer le panier en cours de l'utilisateur
        panier = Panier.objects.filter(
            acheteur=request.user,
            statut="EN_COURS"
        ).first()
        
        if not panier:
            return Response({
                "success": True,
                "message": "Panier vide",
                "panier_id": None,
                "items": [],
                "total": 0,
                "count": 0
            }, status=status.HTTP_200_OK)
        
        # Récupérer tous les items du panier
        items = PanierItem.objects.filter(panier=panier).select_related('produit')
        
        # Sérialiser les items
        serializer = PanierItemSerializer(items, many=True)
        
        # Calculer le total
        total = 0
        for item in items:
            total += float(item.produit.prix) * item.quantite
        
        return Response({
            "success": True,
            "panier_id": panier.id,
            "items": serializer.data,
            "total": total,
            "count": items.count()
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "success": False,
            "error": "Erreur lors de la récupération du panier",
            "details": str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


# ------------------------
# Contact
# ------------------------

class ContactView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        mode = request.data.get("mode")  # "call" ou "whatsapp"
        try:
            target = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur introuvable"}, status=404)

        if mode == "call":
            return Response({"message": f"Appeler {target.email} via téléphone"})
        elif mode == "whatsapp":
            return Response({"message": f"Contacter {target.email} via WhatsApp"})
        else:
            return Response({"error": "Mode invalide"}, status=400)


# ------------------------
# Agences de Livraison
# ------------------------

class AgenceLivraisonViewSet(viewsets.ModelViewSet):
    queryset = AgenceLivraison.objects.all()
    serializer_class = AgenceLivraisonSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"], url_path="contact-whatsapp")
    def contact_whatsapp(self, request, pk=None):
        agence = self.get_object()
        numero = agence.numero_telephone
        return Response({
            "message": f"Contacter {agence.nom_agence} via WhatsApp",
            "whatsapp_link": f"https://wa.me/{numero}"
        })



# views.py
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creer_commande(request):
    panier = Panier.objects.filter(acheteur=request.user, statut="EN_COURS").first()
    if not panier:
        return Response({"error": "Panier non trouvé"}, status=404)
    
    # Changer le statut du panier
    panier.statut = "VALIDE"
    panier.save()
    
    return Response({
        "message": "Commande créée",
        "panier_id": panier.id,
        "statut": panier.statut
    })