from django.contrib import admin
from .models import User, AcheteurProfile, AgriculteurProfile, Categorie, Produit, ProduitPhoto, Avis, Panier, PanierItem,AgenceLivraison

admin.site.register(User)
admin.site.register(AcheteurProfile)
admin.site.register(AgriculteurProfile)
admin.site.register(Categorie)
admin.site.register(Produit)
admin.site.register(ProduitPhoto)
admin.site.register(Avis)
admin.site.register(Panier)
admin.site.register(PanierItem)
admin.site.register(AgenceLivraison)
