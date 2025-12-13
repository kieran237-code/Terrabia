import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Leaf,
    ShoppingCart,
    Star,
    ChevronLeft,
    User,
    Truck,
    Facebook,
    Instagram,
    Twitter,
    MapPin,
    Phone,
    Mail,
    MessageSquare,
    LogOut
} from 'lucide-react';

// Importez votre instance d'API
import { api } from '../utils/api';

const API_BASE_URL = "https://terrabia-1.onrender.com";

// --- Composants Réutilisés (Header et Footer) ---

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
                        <button className="btn btn-ghost btn-circle">
                            <ShoppingCart size={22} />
                        </button>
                    </a>

                    {isAuthenticated ? (
                        <>
                            <a href="/profil">
                                <button className="btn btn-ghost hidden sm:inline-flex">
                                    <User size={20} className="mr-2" />
                                    Mon Profil
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

const Footer = () => (
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
                    <li><a href="/produit" className="hover:text-green-500">Produits</a></li>
                    <li><a href="/categorie" className="hover:text-green-500">Catégories</a></li>
                    <li><a href="/livraison" className="hover:text-green-500">Agences de livraison</a></li>
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

// --- Fonctions Utilitaires ---

const renderRating = (value) => {
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`full-${i}`} size={16} className="text-yellow-400 fill-yellow-400" />);
    }
    if (hasHalfStar) {
        stars.push(<Star key="half" size={16} className="text-yellow-400 fill-yellow-400 opacity-75" />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300 stroke-current" />);
    }
    return stars;
};

// Modal pour donner son avis
const ReviewModal = ({ isOpen, onClose, onSubmit, productId, sellerId }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewType, setReviewType] = useState('produit'); // 'produit' ou 'vendeur'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (!comment.trim()) {
            setError("Veuillez ajouter un commentaire");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const reviewData = {
                note: rating,
                commentaire: comment,
                cible: reviewType === 'produit' ? productId : sellerId,
                type: reviewType
            };

            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_BASE_URL}/api/avis/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });

            if (response.ok) {
                onSubmit();
                onClose();
                setComment('');
                setRating(5);
            } else {
                const data = await response.json();
                setError(data.error || "Erreur lors de l'envoi de l'avis");
            }
        } catch (err) {
            setError("Erreur de connexion au serveur");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-md">
                <h3 className="font-bold text-lg mb-4">Donner votre avis</h3>

                <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Type d'avis</span>
                    </label>
                    <div className="flex space-x-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="reviewType"
                                className="radio radio-primary mr-2"
                                checked={reviewType === 'produit'}
                                onChange={() => setReviewType('produit')}
                            />
                            <span>Avis sur le produit</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="reviewType"
                                className="radio radio-primary mr-2"
                                checked={reviewType === 'vendeur'}
                                onChange={() => setReviewType('vendeur')}
                            />
                            <span>Avis sur le vendeur</span>
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Note</span>
                    </label>
                    <div className="rating rating-lg">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <input
                                key={star}
                                type="radio"
                                name="rating"
                                className="mask mask-star-2 bg-yellow-400"
                                checked={rating === star}
                                onChange={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="label">
                        <span className="label-text">Commentaire</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered w-full h-32"
                        placeholder="Partagez votre expérience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}

                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
                        Annuler
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={loading || !comment.trim()}
                    >
                        {loading ? 'Envoi en cours...' : 'Envoyer l\'avis'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Composant pour afficher un avis
const ReviewItem = ({ review }) => {
    const date = new Date(review.created_at || Date.now());
    const formattedDate = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="border-b border-gray-200 pb-4 mb-4 last:border-0">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="flex items-center mb-1">
                        <div className="flex space-x-1 mr-2">
                            {renderRating(review.note)}
                        </div>
                        <span className="font-semibold">{review.note}/5</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        Par {review.auteur?.email || 'Utilisateur anonyme'} • {formattedDate}
                    </p>
                </div>
                <span className="badge badge-sm badge-outline">
                    {review.type === 'produit' ? 'Produit' : 'Vendeur'}
                </span>
            </div>
            <p className="text-gray-700">{review.commentaire}</p>
        </div>
    );
};

// --- Composant Principal de la Page Détails ---
const ProductDetailPage = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartSuccess, setCartSuccess] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewsFilter, setReviewsFilter] = useState('tous'); // 'tous', 'produit', 'vendeur'

    // Calcul du prix total
    const calculateTotalPrice = () => {
        if (!product || !product.prix) return 0;
        const unitPrice = parseFloat(product.prix);
        return unitPrice * quantity;
    };

    // Récupérer le produit
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError("ID de produit manquant dans l'URL.");
                setLoading(false);
                return;
            }

            try {
                const data = await api.getProduit(id);
                console.log("Données du produit reçues:", data);

                setProduct(data);
                setError(null);

                // Récupérer les avis après avoir le produit
                fetchReviews(data.id);
            } catch (err) {
                console.error("Erreur lors du chargement du produit:", err);
                setError(`Impossible de charger le produit. ${err.message}`);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Récupérer les avis
    const fetchReviews = async (productId) => {
        try {
            setReviewsLoading(true);
            // Récupérer les avis pour ce produit
            const response = await fetch(`${API_BASE_URL}/api/avis/?cible=${productId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (err) {
            console.error("Erreur lors du chargement des avis:", err);
        } finally {
            setReviewsLoading(false);
        }
    };

    // Ajouter au panier - VERSION CORRIGÉE
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        setAddingToCart(true);
        setCartSuccess(false);

        try {
            const token = localStorage.getItem('access_token');

            if (!token) {
                throw new Error('Token d\'authentification manquant');
            }

            // Utiliser l'URL simplifiée pour ajouter au panier
            const response = await fetch(`${API_BASE_URL}/api/panier/ajouter/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    produit: product.id,
                    quantite: quantity
                }),
            });

            if (response.ok) {
                setCartSuccess(true);
                setTimeout(() => setCartSuccess(false), 3000);
            } else if (response.status === 401) {
                // Token invalide ou expiré
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                alert('Votre session a expiré. Veuillez vous reconnecter.');
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Impossible d\'ajouter au panier');
            }
        } catch (err) {
            console.error("Erreur lors de l'ajout au panier:", err);
            alert(err.message || "Erreur lors de l'ajout au panier. Veuillez réessayer.");
        } finally {
            setAddingToCart(false);
        }
    };

    // Gestion du changement de quantité
    const handleQuantityChange = (type) => {
        if (type === 'increment' && quantity < availableStock) {
            setQuantity(quantity + 1);
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Gestion de la saisie directe de la quantité
    const handleQuantityInput = (e) => {
        const newQuantity = parseInt(e.target.value) || 1;
        if (newQuantity >= 1 && newQuantity <= availableStock) {
            setQuantity(newQuantity);
        }
    };

    // Filtrer les avis
    const filteredReviews = reviews.filter(review => {
        if (reviewsFilter === 'tous') return true;
        if (reviewsFilter === 'produit') return review.type === 'produit';
        if (reviewsFilter === 'vendeur') return review.type === 'vendeur';
        return true;
    });

    const handleImageError = () => {
        console.log("Erreur de chargement de l'image");
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        console.log("Image chargée avec succès");
        setImageLoading(false);
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex flex-col justify-center items-center h-screen">
                    <span className="loading loading-spinner text-green-700 loading-lg"></span>
                    <p className="ml-3 text-lg text-gray-600">Chargement des détails du produit...</p>
                </div>
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Header />
                <div className="container mx-auto px-4 py-12 text-center min-h-[60vh]">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Erreur de Chargement</h1>
                    <p className="text-gray-600 mb-6">{error || "Le produit spécifié n'a pas été trouvé."}</p>
                    <Link to="/produit" className="text-green-700 hover:underline inline-flex items-center">
                        <ChevronLeft size={20} className="mr-1" />
                        Retourner à la liste des produits
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    // Mapping des données de l'API
    const {
        nom: name,
        categorie,
        description,
        prix: price,
        quantite: quantityInfo,
        images,
        stock,
        agriculteur: vendeur,
        etat: condition,
        unite: unitFromApi,
    } = product;

    // Gestion de l'image principale
    let imageSrc = null;
    let imageAlt = name;

    if (images && images.length > 0) {
        const firstImage = images[0];
        if (firstImage.image) {
            const imagePath = firstImage.image;
            if (typeof imagePath === 'string') {
                if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                    imageSrc = imagePath;
                } else if (imagePath.startsWith('/media/')) {
                    imageSrc = `${API_BASE_URL}${imagePath}`;
                } else if (imagePath.startsWith('media/')) {
                    imageSrc = `${API_BASE_URL}/${imagePath}`;
                } else {
                    imageSrc = `${API_BASE_URL}/media/${imagePath}`;
                }
            }
        }
    }

    if (!imageSrc) {
        imageSrc = 'https://via.placeholder.com/600x600?text=Image+Produit+Non+Disponible';
    }

    // Gestion de l'unité et quantité
    let unit = unitFromApi || 'unité';
    let availableStock = product.quantite || 0;

    if (quantityInfo) {
        if (typeof quantityInfo === 'object' && quantityInfo.unit) {
            unit = quantityInfo.unit;
        } else if (typeof quantityInfo === 'string') {
            unit = quantityInfo;
        }
    }

    const categoryName = categorie ? (categorie.nom || 'Catégorie') : 'Inconnue';
    const sellerName = vendeur ? (vendeur.user?.email || vendeur.email || 'Vendeur') : 'Inconnu';
    const sellerId = vendeur?.id;

    // Calcul de la note moyenne
    const productReviews = reviews.filter(r => r.type === 'produit');
    const averageRating = productReviews.length > 0
        ? productReviews.reduce((sum, review) => sum + review.note, 0) / productReviews.length
        : 4.5;

    const totalReviews = productReviews.length || 12;
    const deliveryCost = 1000;

    return (
        <div className="bg-white min-h-screen font-sans">
            <Header />

            <main className="container mx-auto px-4 py-8 md:py-12">
                {/* Bouton de retour */}
                <div className="mb-6">
                    <Link to="/produit" className="text-gray-600 hover:text-green-700 font-semibold inline-flex items-center transition-colors">
                        <ChevronLeft size={20} className="mr-1" />
                        Retour aux produits
                    </Link>
                </div>

                {/* Grille Principale (Image & Détails) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Colonne 1: Image du Produit */}
                    <div className="lg:col-span-1 bg-gray-100 rounded-xl shadow-lg overflow-hidden flex items-center justify-center p-4 min-h-[400px] relative">
                        {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <span className="loading loading-spinner text-green-700 loading-lg"></span>
                                <span className="ml-3 text-gray-600">Chargement de l'image...</span>
                            </div>
                        )}

                        {imageError ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                                <span className="text-gray-400 mb-2 text-lg">Image non disponible</span>
                                <img
                                    src="https://via.placeholder.com/600x600?text=Image+Produit"
                                    alt="Image par défaut"
                                    className="w-full max-h-[600px] object-contain rounded-lg opacity-50"
                                />
                            </div>
                        ) : (
                            <>
                                <img
                                    src={imageSrc}
                                    alt={imageAlt}
                                    className="w-full max-h-[600px] object-contain rounded-lg transition-opacity duration-300"
                                    style={{ opacity: imageLoading ? 0 : 1 }}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />

                                {images && images.length > 1 && (
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                        {images.map((img, index) => (
                                            <button
                                                key={index}
                                                className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-600' : 'bg-gray-400'}`}
                                                onClick={() => {
                                                    console.log("Changer d'image:", img);
                                                }}
                                                aria-label={`Voir l'image ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Colonne 2: Informations du Produit */}
                    <div className="lg:col-span-1">
                        {/* Catégorie et Nom */}
                        <p className="text-sm uppercase text-gray-500 font-medium tracking-wider mb-2">
                            {categoryName}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
                            {name}
                        </h1>

                        {/* Évaluation */}
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="flex space-x-0.5">
                                {renderRating(averageRating)}
                            </div>
                            <span className="text-lg font-bold text-gray-800">{averageRating.toFixed(1)}</span>
                            <span className="text-md text-gray-500">({totalReviews} avis)</span>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                            <p className="text-gray-600">
                                {description || 'Ce produit ne possède pas encore de description détaillée.'}
                            </p>
                        </div>

                        {/* État du produit */}
                        {condition && (
                            <div className="mb-6">
                                <span className={`badge ${condition === 'NEUF' ? 'badge-success' : 'badge-warning'} text-sm font-medium`}>
                                    {condition === 'NEUF' ? 'Neuf' : 'Occasion'}
                                </span>
                            </div>
                        )}

                        {/* Prix */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Prix</h3>
                            
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-4">
                                <div>
                                    <p className="text-5xl font-extrabold text-green-700 inline-flex items-end">
                                        {price ? price.toLocaleString('fr-FR') : '--'} FCFA
                                    </p>
                                    <span className="text-xl font-medium text-gray-500 ml-2">/ {unit}</span>
                                </div>
                                
                                <div className="mt-4 md:mt-0 text-right">
                                    <p className="text-lg text-gray-600">
                                        Total pour {quantity} {unit}{quantity > 1 ? 's' : ''} :
                                    </p>
                                    <p className="text-3xl font-bold text-green-800">
                                        {calculateTotalPrice().toLocaleString('fr-FR')} FCFA
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contrôle de quantité et Bouton Panier */}
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="join border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                <button
                                    className="join-item btn btn-ghost text-lg w-12 h-12"
                                    onClick={() => handleQuantityChange('decrement')}
                                    disabled={quantity <= 1}
                                >
                                    —
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityInput}
                                    min="1"
                                    max={availableStock}
                                    className="join-item input input-ghost w-16 text-center text-xl font-semibold bg-white focus:outline-none h-12 border-l border-r border-gray-300"
                                />
                                <button
                                    className="join-item btn btn-ghost text-lg w-12 h-12"
                                    onClick={() => handleQuantityChange('increment')}
                                    disabled={quantity >= availableStock}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="btn btn-success btn-lg flex-1 bg-green-700 hover:bg-green-800 text-white shadow-xl border-none h-12 relative"
                                disabled={availableStock === 0 || addingToCart}
                                onClick={handleAddToCart}
                            >
                                {cartSuccess ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Ajouté au panier !
                                    </span>
                                ) : (
                                    <>
                                        <ShoppingCart size={24} />
                                        {addingToCart ? 'Ajout en cours...' :
                                            availableStock === 0 ? 'Rupture de stock' : 
                                            `Ajouter - ${calculateTotalPrice().toLocaleString('fr-FR')} FCFA`}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Stock */}
                        <p className={`text-sm font-medium ${availableStock > 10 ? 'text-gray-600' : 'text-red-500'}`}>
                            {availableStock} {unit}{availableStock > 1 ? 's' : ''} en stock
                        </p>

                        {/* Bouton pour donner son avis */}
                        {isAuthenticated && (
                            <div className="mt-6">
                                <button
                                    className="btn btn-outline btn-primary w-full"
                                    onClick={() => setShowReviewModal(true)}
                                >
                                    <MessageSquare size={20} className="mr-2" />
                                    Donner votre avis
                                </button>
                            </div>
                        )}

                        <div className="divider my-8"></div>

                        {/* Information Vendeur */}
                        <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-4 mb-6 border border-gray-200">
                            <User size={30} className="text-green-700/80" />
                            <div>
                                <p className="font-bold text-gray-800 text-lg">{sellerName}</p>
                                <p className="text-sm text-gray-600">
                                    {vendeur && vendeur.user && vendeur.user.role === 'AGRICULTEUR' ? 'Agriculteur' : 'Vendeur'}
                                </p>
                            </div>
                        </div>

                        {/* Information Livraison */}
                        <div className="p-4 bg-gray-50 rounded-lg flex items-start space-x-4 border border-gray-200">
                            <Truck size={30} className="text-green-700/80 mt-1" />
                            <div>
                                <p className="font-bold text-gray-800 text-lg mb-1">Livraison disponible</p>
                                <p className="text-sm text-gray-600">
                                    3 agences partenaires disponibles. Frais à partir de {deliveryCost.toLocaleString('fr-FR')} FCFA.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section des avis */}
                <div className="mt-16">
                    <div className="flex justify-between items-center mb-6 border-b pb-2">
                        <h2 className="text-3xl font-bold text-gray-800">Avis des clients</h2>
                        <div className="flex space-x-2">
                            <button
                                className={`btn btn-sm ${reviewsFilter === 'tous' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setReviewsFilter('tous')}
                            >
                                Tous ({reviews.length})
                            </button>
                            <button
                                className={`btn btn-sm ${reviewsFilter === 'produit' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setReviewsFilter('produit')}
                            >
                                Produit ({productReviews.length})
                            </button>
                            <button
                                className={`btn btn-sm ${reviewsFilter === 'vendeur' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setReviewsFilter('vendeur')}
                            >
                                Vendeur ({reviews.length - productReviews.length})
                            </button>
                        </div>
                    </div>

                    {reviewsLoading ? (
                        <div className="flex justify-center py-10">
                            <span className="loading loading-spinner text-green-700"></span>
                            <span className="ml-3 text-gray-600">Chargement des avis...</span>
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                            <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun avis pour le moment</h3>
                            <p className="text-gray-500 mb-4">Soyez le premier à donner votre avis !</p>
                            {!isAuthenticated && (
                                <Link to="/login" className="btn btn-primary">
                                    Connectez-vous pour donner votre avis
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReviews.map((review) => (
                                <ReviewItem key={review.id} review={review} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* Modal pour donner son avis */}
            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onSubmit={() => {
                    // Rafraîchir les avis après soumission
                    fetchReviews(product.id);
                    setShowReviewModal(false);
                }}
                productId={product.id}
                sellerId={sellerId}
            />
        </div>
    );
};

export default ProductDetailPage;