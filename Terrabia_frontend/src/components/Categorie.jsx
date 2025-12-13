import React, { useState, useEffect } from 'react';
import { 
    Leaf, 
    ShoppingCart, 
    Facebook, 
    Instagram, 
    Twitter, 
    MapPin, 
    Phone, 
    Mail, 
    ArrowRight,
    User,
    LogOut,
    Loader2,
    AlertCircle,
    Home,
    Package,
    Truck
} from 'lucide-react';

// Hook d'authentification
const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        setIsAuthenticated(!!token);
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        window.location.href = '/login';
    };

    return { isAuthenticated, user, logout };
};

// Composant Header avec authentification
const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="navbar container mx-auto px-4">
                <div className="flex-1">
                    <a className="text-2xl font-bold text-green-700 normal-case" href="/">
                        <Leaf size={24} className="inline text-green-700 mr-1" /> Terrabia
                    </a>
                </div>
                <div className="flex-none hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 font-semibold text-gray-700">
                        <li><a href="/produit">Produits</a></li>
                        <li><a href="/categorie">Catégories</a></li>
                        <li><a href="/livraison">Livraison</a></li>
                    </ul>
                </div>
                <div className="flex-none space-x-2 ml-4">
                    <a href="/panier">
                        <button className="btn btn-ghost btn-circle relative">
                            <ShoppingCart size={22} />
                        </button>
                    </a>

                    {isAuthenticated ? (
                        <>
                            {/* <a href="/profil">
                                <button className="btn btn-ghost hidden sm:inline-flex">
                                    <User size={20} className="mr-2" />
                                    {user?.email?.split('@')[0] || 'Mon Profil'}
                                </button>
                            </a> */}
                            <button 
                                onClick={logout}
                                className="btn btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 hidden sm:inline-flex"
                            >
                                <LogOut size={20} className="mr-2" />
                                Déconnexion
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
                                <button className="btn btn-success bg-green-700 text-white hover:bg-green-800 border-none">
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

// Composant Footer
const Footer = () => (
    <footer className="bg-gray-800 text-white py-12 mt-12">
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
                    <li><a href="/produits" className="hover:text-green-500">Produits</a></li>
                    <li><a href="/categorie" className="hover:text-green-500">Catégories</a></li>
                    <li><a href="/livraison" className="hover:text-green-500">Livraison</a></li>
                    <li><a href="/register?role=agriculteur" className="hover:text-green-500">Devenir vendeur</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Aide</h4>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-green-500">FAQ</a></li>
                    <li><a href="#" className="hover:text-green-500">Comment ça marche</a></li>
                    <li><a href="#" className="hover:text-green-500">Conditions d'utilisation</a></li>
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

// Composant de la Carte Catégorie
const CategoryCard = ({ category }) => {
    // Fonction pour obtenir l'URL de l'image
    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            // Image par défaut selon le nom de la catégorie
            const defaultImages = {
                'FRUITS': 'https://images.unsplash.com/photo-1543232147-38e5527f3af0?w=600',
                'LÉGUMES': 'https://images.unsplash.com/photo-1542838132-92c90c767db3?w=600',
                'CÉRÉALES': 'https://images.unsplash.com/photo-1563253258-2e551d7e2e60?w=600',
                'TUBERCULES': 'https://images.unsplash.com/photo-1549722363-2384a32a6136?w=600',
                'ÉPICES': 'https://images.unsplash.com/photo-1588661706689-58b9f1d5334e?w=600',
                'HUILE': 'https://images.unsplash.com/photo-1577968502213-3932204c8f5f?w=600',
            };
            
            const catName = category.nom?.toUpperCase();
            return defaultImages[catName] || 'https://images.unsplash.com/photo-1542838132-92c90c767db3?w=600';
        }
        
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        // Si c'est un chemin relatif, ajouter l'URL de base
        return `https://terrabia-1.onrender.com${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
    };

    const title = category.nom || 'Catégorie inconnue';
    const description = category.description || `Découvrez nos produits ${title}`;
    const image = getImageUrl(category.image || category.image_url);
    const link = `/produits?category=${category.id}`;

    return (
        <a href={link} className="block group">
            <div 
                className="h-96 bg-cover bg-center rounded-xl shadow-xl flex items-end p-6 transition-all duration-300 group-hover:scale-[1.02] overflow-hidden group-hover:shadow-2xl"
                style={{backgroundImage: `url('${image}')`}}
            >
                <div className="bg-black/50 p-4 rounded-xl w-full transition-all duration-300 group-hover:bg-black/70 group-hover:translate-y-[-5px]">
                    <h3 className="text-3xl font-extrabold text-white mb-2">{title}</h3>
                    <p className="text-sm text-gray-200 mb-3 line-clamp-2">{description}</p>
                    <div className="flex items-center text-white text-md font-semibold group-hover:text-yellow-400 transition-colors">
                        Explorer les produits <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                </div>
            </div>
        </a>
    );
};

// Composant Principal de la Page Catégories
const CategoriesPage = () => {
    const { isAuthenticated } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalCategories: 0,
        totalProducts: 0,
        featuredCategories: 0
    });

    // Récupérer les catégories depuis l'API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Récupérer le token d'authentification si disponible
                const token = localStorage.getItem('access_token');
                
                const headers = {
                    'Content-Type': 'application/json',
                };
                
                // Ajouter le token seulement si disponible (même si l'endpoint est public)
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                const response = await fetch('https://terrabia-1.onrender.com/api/categories/', {
                    headers: headers,
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Gérer différents formats de réponse
                let categoriesData = [];
                if (Array.isArray(data)) {
                    categoriesData = data;
                } else if (data.results) {
                    categoriesData = data.results; // Pagination Django REST Framework
                } else if (data.categories) {
                    categoriesData = data.categories;
                } else if (typeof data === 'object') {
                    // Si c'est un objet unique, le convertir en tableau
                    categoriesData = [data];
                }
                
                setCategories(categoriesData);
                
                // Calculer les statistiques
                setStats({
                    totalCategories: categoriesData.length,
                    totalProducts: categoriesData.reduce((sum, cat) => sum + (cat.product_count || 0), 0),
                    featuredCategories: categoriesData.filter(cat => cat.featured || false).length
                });
                
            } catch (err) {
                console.error("Erreur lors du chargement des catégories:", err);
                setError(err.message);
                
                // Données de démonstration en cas d'erreur (pour le développement)
                const demoCategories = [
                    { 
                        id: 1, 
                        nom: 'Fruits', 
                        description: 'Fruits frais de saison cultivés localement', 
                        image: 'https://images.unsplash.com/photo-1543232147-38e5527f3af0?w=600',
                        product_count: 45,
                        featured: true
                    },
                    { 
                        id: 2, 
                        nom: 'Légumes', 
                        description: 'Légumes bio et naturels de nos producteurs', 
                        image: 'https://images.unsplash.com/photo-1542838132-92c90c767db3?w=600',
                        product_count: 32,
                        featured: true
                    },
                    { 
                        id: 3, 
                        nom: 'Céréales', 
                        description: 'Riz, maïs, mil et autres céréales locales', 
                        image: 'https://images.unsplash.com/photo-1563253258-2e551d7e2e60?w=600',
                        product_count: 28,
                        featured: true
                    },
                    { 
                        id: 4, 
                        nom: 'Tubercules', 
                        description: 'Manioc, igname, patate douce et plus', 
                        image: 'https://images.unsplash.com/photo-1549722363-2384a32a6136?w=600',
                        product_count: 21,
                        featured: false
                    },
                    { 
                        id: 5, 
                        nom: 'Épices', 
                        description: 'Épices et condiments traditionnels', 
                        image: 'https://images.unsplash.com/photo-1588661706689-58b9f1d5334e?w=600',
                        product_count: 18,
                        featured: false
                    },
                    { 
                        id: 6, 
                        nom: 'Huiles Végétales', 
                        description: 'Huiles végétales artisanales de qualité', 
                        image: 'https://images.unsplash.com/photo-1577968502213-3932204c8f5f?w=600',
                        product_count: 15,
                        featured: false
                    },
                ];
                
                setCategories(demoCategories);
                setStats({
                    totalCategories: demoCategories.length,
                    totalProducts: demoCategories.reduce((sum, cat) => sum + cat.product_count, 0),
                    featuredCategories: demoCategories.filter(cat => cat.featured).length
                });
                
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Filtrer les catégories par recherche
    const filteredCategories = categories.filter(category =>
        category.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Recharger les données
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header />

            <main>
                {/* Bannière "Catégories" */}
                <section className="bg-gradient-to-r from-green-700 to-green-600 py-16 text-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Nos Catégories</h1>
                                <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                                    Découvrez notre sélection de catégories de produits agricoles frais, 
                                    directement des producteurs locaux à votre table.
                                </p>
                            </div>
                            <div className="mt-6 md:mt-0">
                                <div className="stats bg-white/10 backdrop-blur-sm shadow">
                                    <div className="stat">
                                        <div className="stat-title text-white">Catégories</div>
                                        <div className="stat-value text-white">{stats.totalCategories}</div>
                                        <div className="stat-desc text-white/80">Disponibles</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title text-white">Produits</div>
                                        <div className="stat-value text-white">{stats.totalProducts}+</div>
                                        <div className="stat-desc text-white/80">Au total</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Barre de recherche et filtres */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Rechercher une catégorie..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered w-full md:w-96 pl-12 py-3 text-lg rounded-xl shadow-sm"
                            />
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                 width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 19l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Filtrer :</span>
                            <div className="flex gap-2">
                                <button className="btn btn-sm btn-outline">Toutes</button>
                                <button className="btn btn-sm btn-outline">Populaires</button>
                                <button className="btn btn-sm btn-outline">Nouveautés</button>
                            </div>
                        </div>
                    </div>

                    {/* Messages d'état */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="animate-spin text-green-600" size={48} />
                            <p className="mt-4 text-gray-600 text-lg">Chargement des catégories...</p>
                            <p className="text-gray-400 text-sm mt-2">Connexion à l'API Django</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mb-8">
                            <div className="flex items-center mb-4">
                                <AlertCircle className="text-red-500 mr-3" size={24} />
                                <h3 className="text-xl font-semibold text-red-600">Erreur de connexion</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                {error.includes('Session expirée') 
                                    ? 'Votre session a expiré. Veuillez vous reconnecter.'
                                    : `Impossible de charger les catégories : ${error}`
                                }
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleRetry}
                                    className="btn btn-primary"
                                >
                                    Réessayer
                                </button>
                                {error.includes('Session expirée') && (
                                    <button 
                                        onClick={handleLogout}
                                        className="btn btn-outline"
                                    >
                                        Se reconnecter
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Résultats de recherche */}
                    {searchTerm && !loading && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-blue-700">
                                {filteredCategories.length} catégorie{filteredCategories.length > 1 ? 's' : ''} 
                                trouvée{filteredCategories.length > 1 ? 's' : ''} pour "{searchTerm}"
                            </p>
                        </div>
                    )}

                    {/* Grille des catégories */}
                    {!loading && filteredCategories.length > 0 && (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {searchTerm ? 'Résultats de recherche' : 'Toutes nos catégories'}
                                </h2>
                                <p className="text-gray-600">
                                    Cliquez sur une catégorie pour découvrir ses produits
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredCategories.map((category) => (
                                    <CategoryCard key={category.id} category={category} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Aucune catégorie trouvée */}
                    {!loading && filteredCategories.length === 0 && categories.length > 0 && (
                        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                            <Truck size={64} className="text-gray-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-700 mb-3">Aucune catégorie trouvée</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Aucune catégorie ne correspond à votre recherche "{searchTerm}".
                            </p>
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="btn btn-primary"
                            >
                                Voir toutes les catégories
                            </button>
                        </div>
                    )}

                    {/* Aucune catégorie disponible */}
                    {!loading && !error && categories.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                            <Package size={64} className="text-gray-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-700 mb-3">Aucune catégorie disponible</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Les catégories de produits seront bientôt disponibles.
                            </p>
                            <div className="space-x-4">
                                <a href="/produits" className="btn btn-primary">
                                    Voir les produits
                                </a>
                                <button 
                                    onClick={handleRetry}
                                    className="btn btn-outline"
                                >
                                    Actualiser
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pagination (optionnel) */}
                    {!loading && filteredCategories.length > 0 && (
                        <div className="mt-12 flex justify-center">
                            <div className="join">
                                <button className="join-item btn btn-outline">«</button>
                                <button className="join-item btn btn-active">1</button>
                                <button className="join-item btn btn-outline">2</button>
                                <button className="join-item btn btn-outline">3</button>
                                <button className="join-item btn btn-outline">»</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CategoriesPage;