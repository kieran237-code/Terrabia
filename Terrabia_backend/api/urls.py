from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router DRF
router = DefaultRouter()
router.register("categories", views.CategorieViewSet, basename="categorie")
router.register("produits", views.ProduitViewSet, basename="produit")
router.register("photos", views.ProduitPhotoViewSet, basename="photo")
router.register("avis", views.AvisViewSet, basename="avis")
router.register("paniers", views.PanierViewSet, basename="panier")
router.register("items", views.PanierItemViewSet, basename="item")
router.register("agences", views.AgenceLivraisonViewSet, basename="agence")

urlpatterns = [ 
    # Auth
    path("api/register/", views.RegisterView.as_view(), name="register"),
    path("api/login/", views.LoginView.as_view(), name="login"),
    
    # Contact
    path("api/contact/", views.ContactView.as_view(), name="contact"),
    
    # CRUD endpoints - Le router ajoute automatiquement les routes
    path("api/", include(router.urls)),
    
    # -------------------------------------------------
    # NOUVELLES ROUTES POUR LE PANIER (SIMPLIFIÉES)
    # -------------------------------------------------
    
    # Ajouter un produit au panier (version simplifiée)
    path("api/panier/ajouter/", views.ajouter_au_panier_simple, name="ajouter-panier-simple"),
    
    # Récupérer le panier de l'utilisateur (version simplifiée)
    path("api/panier/utilisateur/", views.get_panier_utilisateur, name="panier-utilisateur"),
    
    # -------------------------------------------------
    # ROUTES DE COMPATIBILITÉ (pour garder l'existant)
    # -------------------------------------------------
    
    # Redirection pour les anciennes URLs du frontend
    path("panier/", views.get_panier_utilisateur, name="panier-legacy"),
    path("panier/ajouter/", views.ajouter_au_panier_simple, name="panier-ajouter-legacy"),
    path('api/commandes/', views.creer_commande, name='creer-commande'),
]