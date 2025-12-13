import React, { useState, useEffect } from 'react';
import { 
    Leaf, 
    ShoppingCart, 
    MapPin, 
    Phone, 
    MessageCircle, 
    Truck, 
    DollarSign, 
    Mail,
    User,
    LogOut,
    Loader2,
    AlertCircle,
    Home,
    Star,
    Clock,
    Shield,
    CheckCircle,
    Image
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
                            <a href="/profil">
                                <button className="btn btn-ghost hidden sm:inline-flex">
                                    <User size={20} className="mr-2" />
                                    {user?.email?.split('@')[0] || 'Mon Profil'}
                                </button>
                            </a>
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
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-3xl font-bold text-green-500 mb-2">Terrabia</h3>
                    <p className="text-sm text-gray-300">
                        Livraison de produits frais directement chez vous
                    </p>
                </div>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-300 hover:text-green-500">Facebook</a>
                    <a href="#" className="text-gray-300 hover:text-green-500">Instagram</a>
                    <a href="#" className="text-gray-300 hover:text-green-500">Twitter</a>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} Terrabia. Tous droits réservés.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    Contact: contact@terrabia.ci | +225 07 00 00 00
                </p>
            </div>
        </div>
    </footer>
);

// Composant de la Carte d'Agence de Livraison MODIFIÉ
const AgencyCard = ({ agency }) => {
    const { 
        id, 
        nom_agence: name, 
        localite: areas, 
        numero_telephone: phone, 
        email,
        note = 4.0,
        temps_livraison: deliveryTime = '2-3 jours'
    } = agency;
    
    // Fonction pour formater l'image
    const renderImage = () => {
        // Vérifier si l'agence a une image dans le backend
        if (agency.image_url) {
            const imageUrl = agency.image_url.startsWith('http') 
                ? agency.image_url 
                : `https://terrabia-1.onrender.com${agency.image_url}`;
            
            return (
                <figure className="h-48 overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                        onError={(e) => {
                            // Si l'image échoue, afficher l'icône
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                                <div class="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                    <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1h1" />
                                    </svg>
                                </div>
                            `;
                        }}
                    />
                </figure>
            );
        }
        
        // Afficher l'icône par défaut si pas d'image
        return (
            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <Truck size={64} className="text-green-600" />
            </div>
        );
    };
    
    // Fonction pour nettoyer le numéro de téléphone pour WhatsApp
    const formatPhoneNumber = (phone) => {
        if (!phone) return null;
        
        // Enlever tous les caractères non numériques
        let cleaned = phone.replace(/\D/g, '');
        
        // Si le numéro commence par 0, le remplacer par l'indicatif Côte d'Ivoire
        if (cleaned.startsWith('0')) {
            cleaned = '225' + cleaned.substring(1);
        }
        
        // S'assurer que le numéro a au moins 8 chiffres
        return cleaned.length >= 8 ? cleaned : null;
    };
    
    // Formater le numéro pour WhatsApp
    const formattedPhone = formatPhoneNumber(phone);
    
    // Créer un lien WhatsApp direct
    const whatsappLink = formattedPhone 
        ? `https://wa.me/${formattedPhone}?text=Bonjour%20${encodeURIComponent(name || '')}%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services%20de%20livraison%20Terrabia.`
        : null;

    // Créer un lien email
    const emailLink = email 
        ? `mailto:${email}?subject=Demande%20de%20livraison%20Terrabia&body=Bonjour%2C%0A%0AJe%20souhaite%20en%20savoir%20plus%20sur%20vos%20services%20de%20livraison.%0A%0ACordialement%2C`
        : null;

    return (
        <div className="card w-full bg-base-100 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            {renderImage()}
            
            <div className="card-body p-6">
                {/* Nom */}
                <div className="mb-3">
                    <h2 className="card-title text-xl font-bold text-gray-800 mb-2">
                        {name || 'Agence de livraison'}
                    </h2>
                    {/* Note - optionnelle */}
                    {note && (
                        <div className="flex items-center mb-2">
                            <div className="rating rating-sm">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <input
                                        key={star}
                                        type="radio"
                                        name={`rating-${id}`}
                                        className="mask mask-star-2 bg-yellow-400"
                                        checked={star <= Math.round(note)}
                                        readOnly
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-700 ml-2">
                                {note}/5
                            </span>
                        </div>
                    )}
                </div>

                {/* Infos de livraison */}
                <div className="space-y-3 mb-4">
                    {areas && (
                        <div className="flex items-start">
                            <MapPin size={18} className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-700 text-sm">Zones couvertes</p>
                                <p className="text-gray-600 text-sm">{areas}</p>
                            </div>
                        </div>
                    )}
                    
                    {deliveryTime && (
                        <div className="flex items-center">
                            <Clock size={18} className="text-green-600 mr-3 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-700 text-sm">Délai de livraison</p>
                                <p className="text-gray-600 text-sm">{deliveryTime}</p>
                            </div>
                        </div>
                    )}

                    {/* Contact Téléphone */}
                    {phone && (
                        <div className="flex items-center">
                            <Phone size={18} className="text-green-600 mr-3 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-700 text-sm">Contact</p>
                                <p className="text-gray-600 text-sm">{phone}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Message sur les prix */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <strong>💬 Contactez-nous :</strong> Les prix seront discutés directement via WhatsApp ou email
                    </p>
                </div>

                {/* Boutons d'action */}
                <div className="card-actions flex flex-col space-y-2 mt-2">
                    {whatsappLink ? (
                        <a 
                            href={whatsappLink}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-success w-full bg-green-500 hover:bg-green-600 text-white border-none font-semibold"
                        >
                            <MessageCircle size={20} className="mr-2" />
                            Contacter via WhatsApp
                        </a>
                    ) : emailLink ? (
                        <a 
                            href={emailLink}
                            className="btn btn-outline w-full btn-success"
                        >
                            <Mail size={20} className="mr-2" />
                            Envoyer un email
                        </a>
                    ) : (
                        <button 
                            className="btn btn-outline w-full btn-disabled"
                            disabled
                        >
                            Pas de contact disponible
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Composant Principal de la Page des Agences de Livraison MODIFIÉ
const DeliveryAgenciesPage = () => {
    const { isAuthenticated } = useAuth();
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('toutes'); // 'toutes', 'rapides', 'proches'
    const [searchTerm, setSearchTerm] = useState('');

    // Récupérer les agences depuis l'API
    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Récupérer le token d'authentification si disponible
                const token = localStorage.getItem('access_token');
                
                const headers = {
                    'Content-Type': 'application/json',
                };
                
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                const response = await fetch('https://terrabia-1.onrender.com/api/agences/', {
                    headers: headers,
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Gérer différents formats de réponse
                let agenciesData = [];
                if (Array.isArray(data)) {
                    agenciesData = data;
                } else if (data.results) {
                    agenciesData = data.results; // Pagination Django REST Framework
                } else if (data.agences) {
                    agenciesData = data.agences;
                } else if (typeof data === 'object') {
                    agenciesData = [data];
                }
                
                setAgencies(agenciesData);
                
            } catch (err) {
                console.error("Erreur lors du chargement des agences:", err);
                setError(err.message);
                
                setAgencies([]);
                
            } finally {
                setLoading(false);
            }
        };

        fetchAgencies();
    }, []);

    // Filtrer les agences - MODIFIÉ
    const filteredAgencies = agencies.filter(agency => {
        // Filtre de recherche
        const matchesSearch = 
            agency.nom_agence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agency.localite?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtre par type - MODIFIÉ
        if (filter === 'rapides') {
            return matchesSearch && agency.temps_livraison?.includes('24h');
        } else if (filter === 'proches') {
            return matchesSearch && agency.localite?.toLowerCase().includes('abidjan');
        }
        
        return matchesSearch;
    });

    // Statistiques MODIFIÉES
    const stats = {
        totalAgencies: agencies.length,
        fastDeliveryCount: agencies.filter(a => a.temps_livraison?.includes('24h')).length,
        abidjanCount: agencies.filter(a => a.localite?.toLowerCase().includes('abidjan')).length
    };

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
                {/* Section Hero */}
                <section className="bg-gradient-to-r from-green-700 to-emerald-600 py-16 text-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-8 md:mb-0 md:mr-8">
                                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                                    Nos Partenaires de Livraison
                                </h1>
                                <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                                    Des agences fiables pour vous livrer vos produits frais 
                                    directement du producteur à votre domicile.
                                </p>
                                <div className="flex flex-wrap gap-4 mt-6">
                                    <div className="badge badge-lg badge-outline p-3">
                                        <Shield size={16} className="mr-2" />
                                        Livraison sécurisée
                                    </div>
                                    <div className="badge badge-lg badge-outline p-3">
                                        <CheckCircle size={16} className="mr-2" />
                                        Suivi en temps réel
                                    </div>
                                    <div className="badge badge-lg badge-outline p-3">
                                        <Clock size={16} className="mr-2" />
                                        Livraison rapide
                                    </div>
                                </div>
                            </div>
                            <div className="stats shadow-lg bg-white/10 backdrop-blur-sm">
                                <div className="stat">
                                    <div className="stat-title text-white">Agences</div>
                                    <div className="stat-value text-white">{stats.totalAgencies}</div>
                                    <div className="stat-desc text-white/80">Partenaires</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title text-white">Rapides</div>
                                    <div className="stat-value text-white">{stats.fastDeliveryCount}</div>
                                    <div className="stat-desc text-white/80">En 24h</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title text-white">Abidjan</div>
                                    <div className="stat-value text-white">{stats.abidjanCount}</div>
                                    <div className="stat-desc text-white/80">Dans votre ville</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section de recherche et filtres MODIFIÉE */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Rechercher une agence ou une zone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered w-full pl-12 py-3 text-lg rounded-xl shadow-sm"
                            />
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                 width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 19l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            <button 
                                className={`btn ${filter === 'toutes' ? 'btn-success' : 'btn-outline'}`}
                                onClick={() => setFilter('toutes')}
                            >
                                Toutes
                            </button>
                            <button 
                                className={`btn ${filter === 'rapides' ? 'btn-success' : 'btn-outline'}`}
                                onClick={() => setFilter('rapides')}
                            >
                                <Clock size={16} className="mr-2" />
                                Rapides (24h)
                            </button>
                            <button 
                                className={`btn ${filter === 'proches' ? 'btn-success' : 'btn-outline'}`}
                                onClick={() => setFilter('proches')}
                            >
                                <MapPin size={16} className="mr-2" />
                                Près d'Abidjan
                            </button>
                        </div>
                    </div>

                    {/* Message d'information sur les prix */}
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start">
                            <MessageCircle className="text-green-500 mr-3 mt-1" size={20} />
                            <div>
                                <h3 className="font-bold text-green-700 mb-1">Comment ça marche ?</h3>
                                <p className="text-green-600 text-sm">
                                    Les prix de livraison ne sont pas fixes et varient selon plusieurs facteurs. 
                                    Contactez directement l'agence via WhatsApp ou email pour discuter des tarifs 
                                    personnalisés selon votre commande et votre localisation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages d'état */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="animate-spin text-green-600" size={48} />
                            <p className="mt-4 text-gray-600 text-lg">Chargement des agences de livraison...</p>
                            <p className="text-gray-400 text-sm mt-2">Connexion </p>
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
                                    : `Impossible de charger les agences : ${error}`
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
                                {filteredAgencies.length} agence{filteredAgencies.length > 1 ? 's' : ''} 
                                trouvée{filteredAgencies.length > 1 ? 's' : ''} pour "{searchTerm}"
                                {filter !== 'toutes' && ` (filtre: ${filter})`}
                            </p>
                        </div>
                    )}

                    {/* Grille des agences */}
                    {!loading && !error && filteredAgencies.length > 0 && (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {searchTerm ? 'Résultats de recherche' : 'Nos partenaires de livraison'}
                                </h2>
                                <p className="text-gray-600">
                                    Contactez directement chaque agence pour discuter des prix et conditions
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAgencies.map((agency) => (
                                    <AgencyCard key={agency.id} agency={agency} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Aucune agence trouvée avec filtres/recherche */}
                    {!loading && !error && agencies.length > 0 && filteredAgencies.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                            <Truck size={64} className="text-gray-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-700 mb-3">Aucune agence trouvée</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Aucune agence ne correspond à votre recherche "{searchTerm}" 
                                {filter !== 'toutes' ? ` avec le filtre "${filter}"` : ''}.
                            </p>
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilter('toutes');
                                }}
                                className="btn btn-primary"
                            >
                                Voir toutes les agences
                            </button>
                        </div>
                    )}

                    {/* Aucune agence disponible dans le backend */}
                    {!loading && !error && agencies.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                            <Truck size={64} className="text-gray-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-700 mb-3">Aucune agence disponible</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Aucune agence de livraison n'est actuellement disponible.
                            </p>
                            <p className="text-gray-400 text-sm mb-6">
                                Les agences de livraison seront ajoutées prochainement.
                            </p>
                            <a href="/produits" className="btn btn-primary">
                                Voir nos produits
                            </a>
                        </div>
                    )}
                </div>

                {/* Section Informations supplémentaires MODIFIÉE */}
                {!loading && !error && agencies.length > 0 && (
                    <section className="bg-gray-100 py-12">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                                Comment choisir votre agence ?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <MessageCircle size={32} className="text-green-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Contactez directement</h3>
                                    <p className="text-gray-600">
                                        Les prix sont à négocier directement avec chaque agence.
                                        Utilisez WhatsApp ou email pour discuter des tarifs.
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <Clock size={32} className="text-green-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Vérifiez les délais</h3>
                                    <p className="text-gray-600">
                                        Certaines agences proposent la livraison express (24h)
                                        tandis que d'autres ont des délais plus longs.
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <MapPin size={32} className="text-green-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Vérifiez la zone</h3>
                                    <p className="text-gray-600">
                                        Assurez-vous que l'agence dessert votre quartier
                                        pour éviter les mauvaises surprises.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default DeliveryAgenciesPage;