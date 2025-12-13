import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, X, ShoppingCart, Leaf, Star, Facebook, Instagram, Twitter, MapPin, Phone, Mail, LogOut, User } from 'lucide-react';
import {api} from '../utils/api'
// URL de base de votre API
const API_BASE_URL = 'https://terrabia-1.onrender.com';
// URL de l'API des produits (d'après votre configuration DRF: /api/produits)
const PRODUCT_LIST_URL = `${API_BASE_URL}/api/produits/`; 

// --- Fonctions d'authentification (Inchangées) ---
const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const role = localStorage.getItem('user_role');
        setIsAuthenticated(!!token);
        setUserRole(role);
    }, []);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        setIsAuthenticated(false);
        setUserRole(null);
    };

    return { isAuthenticated, userRole, logout, setIsAuthenticated };
};

// Composant Header (Inchangé)
const Header = () => {
    const { isAuthenticated, userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };

    const profilePath = userRole === 'AGRICULTEUR' ? '/vendeur' : '/profil'; 

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="navbar container mx-auto px-4">
            <div className="flex-1">
              <a className="text-2xl font-bold text-green-700 normal-case" href="/">
                <Leaf size={24} className="inline text-green-700 mr-1"/> Terrabia
              </a>
            </div>
            <div className="flex-none hidden lg:flex">
              <ul className="menu menu-horizontal px-1 font-semibold text-gray-700">
                <li><a href="#">Produits</a></li>
                <li><a href="/categorie">Catégories</a></li>
                <li><a href="/livraison">Livraison</a></li>
              </ul>
            </div>
            <div className="flex-none space-x-2 ml-4">
                 <a href="/panier">
               <button className="btn btn-ghost btn-circle">
                <ShoppingCart size={22} />
              </button>
              </a>
             
              {isAuthenticated ? (
                <>
                    <a href={profilePath}>
                        <button className="btn btn-ghost hidden sm:inline-flex">
                          <User size={20} className="mr-1"/> Mon Profil
                        </button>
                    </a>
                    <button 
                        onClick={handleLogout}
                        className="btn btn-emerald bg-red-600 text-white hover:bg-red-700 border-none"
                    >
                        <LogOut size={20} /> Déconnexion
                    </button>
                </>
              ) : (
                <>
                    <a href="/login">
                        <button className="btn btn-ghost hidden sm:inline-flex">
                          Connexion
                        </button>
                    </a>
                    <a href="/register" >
                        <button className="btn btn-emerald bg-emerald-600 text-white hover:bg-emerald-700 border-none">
                          S'inscrire
                        </button>
                    </a>
                </>
              )}
            </div>
          </div>
        </header>
    );
};


// Composant ProductCard (Ajusté pour gérer la structure des données API)
const ProductCard = ({ product }) => {
  // Les champs 'name', 'category', 'price', 'id' correspondent à votre Serializer
  // 'imageSrc' doit être mappé à 'images[0].image' (URL de la première image)
  const { id, nom, quantite, prix, categorie, images } = product; 
  
  // L'URL de la première image ou une image de fallback
  const imageSrc = (images && images.length > 0) ? images[0].image : 'https://via.placeholder.com/400?text=Image+Non+Disponible';
  
  // Utiliser les champs du Serializer (nom, categorie.nom ou categorie, etc.)
  const displayName = nom || 'Produit Inconnu';
  const displayCategory = categorie ? (categorie.nom || categorie) : 'Catégorie Inconnue'; 
  const displayPrice = prix ? prix.toLocaleString('fr-FR') : 'N/A';
  const displayUnit = quantite ? quantite.unit : 'unité'; // Assurez-vous que l'unité est disponible ou utilisez un défaut
  
  // Simuler des données pour rating/reviews tant que non disponibles dans le Serializer Produit
  const rating = 4.5;
  const reviews = 32;

  const renderStars = () => (
        <div className="rating rating-sm">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <Star size={14} className="text-gray-300" />
        </div>
  );

  return (
    <a 
        href={`/produit/${id}`}
        className="card w-full bg-base-100 shadow-xl overflow-hidden group border border-gray-100 cursor-pointer transition-shadow duration-300 hover:shadow-2xl"
    >
      <figure className="overflow-hidden h-64 bg-gray-50">
        <img
          src={imageSrc}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" 
        />
      </figure>
      <div className="card-body p-4">
        <p className="text-xs text-gray-500 uppercase">{displayCategory}</p>
        <h3 className="card-title text-lg font-bold hover:text-green-700 transition-colors">
          {displayName}
        </h3>
        
        {/* Description non disponible dans le Serializer, on la retire ou on simule */}
        {/* <p className="text-sm text-gray-600 line-clamp-2">...</p> */}
        
        <div className="flex items-center space-x-2 mt-1">
          {renderStars()}
          <span className="text-sm text-gray-600 font-semibold">{rating}</span>
          <span className="text-xs text-gray-500">({reviews} avis)</span>
        </div>

        <div className="card-actions justify-between items-center mt-2">
          <p className="text-xl font-extrabold text-green-700">
            {displayPrice} FCFA<span className="text-base font-normal text-gray-500">/{displayUnit}</span>
          </p>
          <button 
              className="btn btn-sm btn-success transition duration-150 hover:bg-green-600"
              onClick={(e) => {
                  e.preventDefault();
                  console.log(`Ajouter au panier le produit ID: ${id}`);
              }}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </a> 
  );
};


// Composant Footer (Inchangé)
const Footer = () => (
// ... (Code du composant Footer)
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-3xl font-bold text-green-500 mb-4">Terrabia</h3>
          <p className="text-sm text-gray-300 mb-4">
            La plateforme qui connecte les producteurs agricoles locaux avec les acheteurs. Des produits frais, directement du champ à votre table.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-green-500"><Facebook size={20} /></a>
            <a href="#" className="text-gray-300 hover:text-green-500"><Instagram size={20} /></a>
            <a href="#" className="text-gray-300 hover:text-green-500"><Twitter size={20} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-500">Produits</a></li>
            <li><a href="#" className="hover:text-green-500">Catégories</a></li>
            <li><a href="#" className="hover:text-green-500">Agences de livraison</a></li>
            <li><a href="#" className="hover:text-green-500">Devenir vendeur</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Aide</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-500">FAQ</a></li>
            <li><a href="#" className="hover:text-green-500">Comment ça marche</a></li>
            <li><a href="#" className="hover:text-green-500">Conditions d’utilisation</a></li>
            <li><a href="#" className="hover:text-green-500">Politique de confidentialité</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <MapPin size={18} className="mr-3 text-green-500" />
              Abidjan, Côte d'Ivoire
            </li>
            <li className="flex items-center">
              <Phone size={18} className="mr-3 text-green-500" />
              +225 07 00 00 00
            </li>
            <li className="flex items-center">
              <Mail size={18} className="mr-3 text-green-500" />
              contact@terrabia.ci
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 text-center text-sm text-gray-500 pt-8 mt-8 border-t border-gray-700">
        © {new Date().getFullYear()} Terrabia. Tous droits réservés.
      </div>
    </footer>
);


// --- Composant Principal de la Page ---
const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [selectedCategory, setSelectedCategory] = useState('Toutes les catégories');
    const [sortBy, setSortBy] = useState('Plus récents');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Utilisez le service API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProduits();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error("Erreur lors du chargement des produits:", err);
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // Le tableau de dépendances vide assure que cela ne s'exécute qu'une seule fois au montage.


    // Logique de filtrage et de recherche (utilise l'état 'products' réel)
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'Toutes les catégories' || 
                                (product.categorie && product.categorie.nom === selectedCategory) ||
                                (typeof product.categorie === 'string' && product.categorie.toUpperCase() === selectedCategory);
                                
        const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesSearch;
    });

    // Remarque: La structure de 'product.categorie' dépend de comment elle est sérialisée.
    // Si c'est un ID, le filtrage par nom de catégorie sera complexe côté client.
    // L'idéal serait d'avoir un endpoint de recherche côté Django.

    const categories = ['Toutes les catégories', 'FRUITS', 'LÉGUMES', 'CÉRÉALES', 'TUBERCULES', 'ÉPICES'];
    const sortOptions = ['Plus récents', 'Prix croissant', 'Prix décroissant', 'Meilleure note'];
    
    const handleResetFilters = () => {
        setSelectedCategory('Toutes les catégories');
        setSortBy('Plus récents');
        setSearchTerm('');
    };


    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header />

            <main>
                <section className="bg-green-700/90 py-16 text-white">
                    <div className="container mx-auto px-4">
                        <h1 className="text-5xl font-extrabold mb-2">Nos Produits</h1>
                        <p className="text-lg opacity-90">
                            Découvrez une sélection de produits frais directement de nos agriculteurs partenaires.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    <aside className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Filtres</h2>

                        {/* Filtre Catégorie */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">Catégorie</label>
                            <div className="relative">
                                <select 
                                    className="select select-bordered w-full bg-gray-100 border-gray-300 pr-10 appearance-none"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Filtre Trier par */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">Trier par</label>
                            <div className="relative">
                                <select 
                                    className="select select-bordered w-full bg-gray-100 border-gray-300 pr-10 appearance-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    {sortOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        <button 
                            className="btn btn-ghost text-green-700 hover:bg-green-50 font-semibold w-full justify-start"
                            onClick={handleResetFilters}
                        >
                            <X size={20} className="mr-1" />
                            Réinitialiser les filtres
                        </button>
                    </aside>

                    <div className="lg:col-span-3">
                        
                        {/* Barre de recherche */}
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered w-full pl-12 py-3 text-lg rounded-lg shadow-md focus:border-green-600"
                            />
                            <Search size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* Message d'état (Chargement / Erreur) */}
                        {loading && (
                            <div className="text-center py-10">
                                <span className="loading loading-spinner text-green-600 loading-lg"></span>
                                <p className="text-gray-600 mt-2">Chargement des produits...</p>
                            </div>
                        )}
                        
                        {error && (
                            <div role="alert" className="alert alert-error bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                                <p className="font-semibold">Erreur de connexion</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {/* Compteur de résultats */}
                        {!loading && !error && (
                            <p className="text-gray-600 mb-6 text-lg">
                                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                            </p>
                        )}
                        

                        {/* Grille des produits */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {!loading && filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                            
                            {/* Message si aucun produit n'est trouvé */}
                            {!loading && filteredProducts.length === 0 && !error && (
                                <div className="col-span-3 text-center py-20 bg-white rounded-lg shadow-md">
                                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun produit trouvé</h3>
                                    <p className="text-gray-500">Essayez de réinitialiser les filtres ou de modifier votre recherche.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductListPage;