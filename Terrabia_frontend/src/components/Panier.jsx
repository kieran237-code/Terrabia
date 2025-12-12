import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ShoppingCart, 
    ArrowRight, 
    Trash2, 
    Plus, 
    Minus,
    Package,
    Truck,
    X,
    Phone,
    Mail,
    MapPin,
    AlertCircle,
    Info
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [deliveryCost] = useState(1000);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [selectedAgency, setSelectedAgency] = useState('');
    const [agencyNumber, setAgencyNumber] = useState('');

    // Fonction pour récupérer le panier
    const fetchCart = async () => {
        setLoading(true);
        setError(null);
        
        const accessToken = localStorage.getItem('access_token'); 

        if (!accessToken) {
            setError("Vous devez être connecté pour voir votre panier.");
            setLoading(false);
            return;
        }

        console.log("🔍 Tentative de récupération du panier...");
        console.log("Token utilisé:", accessToken?.substring(0, 20) + "...");

        try {
            const response = await fetch(`${API_BASE_URL}/api/panier/utilisateur/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("📡 Status de la réponse:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("✅ Données reçues:", data);
                
                setCart(data);
                
                let items = [];
                if (data.items && Array.isArray(data.items)) {
                    items = data.items;
                } else if (Array.isArray(data)) {
                    items = data;
                }
                
                setCartItems(items);
                
                const total = items.reduce((sum, item) => {
                    const produit = item.produit || item;
                    const prix = produit?.prix || 0;
                    const quantite = item.quantite || 1;
                    return sum + (prix * quantite);
                }, 0);
                setCartTotal(total);
                
            } else if (response.status === 401) {
                console.log("🔐 Erreur 401 - Token invalide");
                setError("Votre session a expiré. Veuillez vous reconnecter.");
                
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                
            } else if (response.status === 404) {
                console.log("ℹ️  Aucun panier trouvé");
                setCartItems([]);
                setCartTotal(0);
            } else {
                const errorText = await response.text();
                console.log("❌ Erreur serveur:", errorText);
                setError("Erreur lors du chargement du panier.");
            }
        } catch (err) {
            console.error("💥 Erreur réseau:", err);
            setError("Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Mettre à jour la quantité
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        const accessToken = localStorage.getItem('access_token');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/items/${itemId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantite: newQuantity }),
            });

            if (response.ok) {
                fetchCart();
            } else {
                alert("Erreur lors de la mise à jour de la quantité");
            }
        } catch (err) {
            console.error("Erreur:", err);
            alert("Erreur lors de la mise à jour");
        }
    };

    // Supprimer un article
    const removeItem = async (itemId) => {
        const accessToken = localStorage.getItem('access_token');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/items/${itemId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok || response.status === 204) {
                fetchCart();
            } else {
                alert("Erreur lors de la suppression");
            }
        } catch (err) {
            console.error("Erreur:", err);
            alert("Erreur lors de la suppression");
        }
    };

    // Vider le panier
    const clearCart = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir vider votre panier ?")) return;

        const accessToken = localStorage.getItem('access_token');
        
        try {
            for (const item of cartItems) {
                await fetch(`${API_BASE_URL}/api/items/${item.id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
            }
            
            fetchCart();
            alert("Panier vidé avec succès");
        } catch (err) {
            console.error("Erreur:", err);
            alert("Erreur lors du vidage du panier");
        }
    };

    // MODIFIÉ: Gestion de la commande avec popup
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Votre panier est vide");
            return;
        }
        
        // Afficher le modal de sélection de l'agence de livraison
        setShowDeliveryModal(true);
    };

    // MODIFIÉ: Fonction pour passer la commande après sélection de l'agence
    const proceedWithOrder = async () => {
        if (!agencyNumber.trim()) {
            alert("Veuillez entrer le numéro de l'agence de livraison");
            return;
        }

        const accessToken = localStorage.getItem('access_token');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/commandes/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    panier_id: cart?.id || null,
                    total: cartTotal + deliveryCost,
                    frais_livraison: deliveryCost,
                    agence_livraison: selectedAgency,
                    numero_agence: agencyNumber,
                    informations_livraison: `Agence: ${selectedAgency || 'Non spécifiée'} - Tél: ${agencyNumber}`
                }),
            });

            if (response.ok) {
                const commande = await response.json();
                alert("Commande passée avec succès ! Le vendeur a été informé de votre agence de livraison.");
                setCartItems([]);
                setCartTotal(0);
                setShowDeliveryModal(false);
                setSelectedAgency('');
                setAgencyNumber('');
                window.location.href = `/commande/${commande.id}`;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Impossible de passer la commande');
            }
        } catch (err) {
            console.error("Erreur lors de la commande:", err);
            alert("Erreur lors du passage de commande. Veuillez réessayer.");
        }
    };

    // Composant pour afficher un article du panier
    const CartItem = ({ item }) => {
        const produit = item.produit || item;
        const quantite = item.quantite || 1;
        
        let imageSrc = 'https://via.placeholder.com/100x100?text=Produit';
        if (produit?.images && produit.images.length > 0) {
            const imagePath = produit.images[0].image;
            if (imagePath) {
                if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                    imageSrc = imagePath;
                } else if (imagePath.startsWith('/media/')) {
                    imageSrc = `${API_BASE_URL}${imagePath}`;
                } else {
                    imageSrc = `${API_BASE_URL}/media/${imagePath}`;
                }
            }
        }

        const totalPrice = produit?.prix ? produit.prix * quantite : 0;

        return (
            <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 flex-shrink-0 mr-4">
                    <img
                        src={imageSrc}
                        alt={produit?.nom || 'Produit'}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100x100?text=Produit';
                        }}
                    />
                </div>

                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{produit?.nom || 'Nom inconnu'}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                        {produit?.categorie?.nom || 'Catégorie'} • {produit?.unite || 'unité'}
                    </p>
                    <p className="text-green-700 font-bold">
                        {produit?.prix ? produit.prix.toLocaleString('fr-FR') : '0'} FCFA / {produit?.unite || 'unité'}
                    </p>
                </div>

                <div className="flex items-center space-x-3 mr-6">
                    <button
                        onClick={() => updateQuantity(item.id, quantite - 1)}
                        className="btn btn-sm btn-circle btn-outline"
                        disabled={quantite <= 1}
                    >
                        <Minus size={16} />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{quantite}</span>
                    <button
                        onClick={() => updateQuantity(item.id, quantite + 1)}
                        className="btn btn-sm btn-circle btn-outline"
                        disabled={quantite >= (produit?.quantite || 99)}
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="text-right">
                    <p className="text-xl font-bold text-green-700 mb-2">
                        {totalPrice.toLocaleString('fr-FR')} FCFA
                    </p>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="btn btn-sm btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        );
    };

    // MODAL pour la sélection de l'agence de livraison - MODIFIÉ
    const DeliveryModal = () => {
        if (!showDeliveryModal) return null;

        return (
            <div className="modal modal-open">
                <div className="modal-box max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                            📦 Informations de livraison
                        </h3>
                        <button
                            onClick={() => {
                                setShowDeliveryModal(false);
                                setSelectedAgency('');
                                setAgencyNumber('');
                            }}
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="alert alert-info mb-4">
                            <div className="flex">
                                <Info size={24} className="mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold">Processus de livraison</h4>
                                    <p className="text-sm">
                                        Pour finaliser votre commande, vous devez choisir une agence de livraison 
                                        et fournir son numéro de contact. Ces informations seront transmises au vendeur.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                            <h4 className="font-bold text-green-800 mb-3">Étapes à suivre :</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-green-700">
                                <li className="flex items-start">
                                    <span className="mr-2">1.</span>
                                    <span>Choisissez une agence de livraison de votre choix</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">2.</span>
                                    <span>Contactez l'agence pour organiser la livraison (frais, délai, etc.)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">3.</span>
                                    <span>Indiquez le numéro de l'agence ci-dessous pour que le vendeur puisse coordonner la livraison</span>
                                </li>
                            </ol>
                        </div>

                        {/* Formulaire pour l'agence de livraison */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom de l'agence de livraison
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Express Livraison, Rapid Transit, etc."
                                    className="input input-bordered w-full"
                                    value={selectedAgency}
                                    onChange={(e) => setSelectedAgency(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone size={16} className="inline mr-2" />
                                    Numéro de téléphone de l'agence
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: +225 01 23 45 67"
                                    className="input input-bordered w-full"
                                    value={agencyNumber}
                                    onChange={(e) => setAgencyNumber(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Ce numéro sera envoyé au vendeur pour faciliter la coordination de la livraison
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                                    <AlertCircle size={18} className="mr-2" />
                                    Note importante
                                </h4>
                                <p className="text-sm text-blue-700">
                                    Après validation de votre commande, le vendeur contactera directement 
                                    l'agence de livraison que vous avez indiquée pour organiser 
                                    l'envoi de vos produits.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button
                            onClick={() => {
                                setShowDeliveryModal(false);
                                setSelectedAgency('');
                                setAgencyNumber('');
                            }}
                            className="btn btn-ghost"
                        >
                            Annuler
                        </button>
                        <Link
                            to="/livraison"
                            className="btn btn-outline"
                            onClick={() => setShowDeliveryModal(false)}
                        >
                            Voir les agences recommandées
                        </Link>
                        <button
                            onClick={proceedWithOrder}
                            className="btn btn-success"
                            disabled={!agencyNumber.trim()}
                        >
                            Valider et passer commande
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- Affichage du Panier Vide ---
    const renderEmptyCart = () => (
        <div className="flex flex-col items-center justify-center p-10 bg-white shadow-lg rounded-xl mt-10 max-w-lg mx-auto">
            <div className="text-gray-400 mb-6">
                <ShoppingCart size={96} />
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8 text-center">
                Découvrez nos produits frais et locaux et <br/> commencez votre commande.
            </p>
            
            <Link to="/produit" className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-300">
                Voir les produits <ArrowRight size={20} className="inline ml-2" />
            </Link>
        </div>
    );

    // --- Affichage du Panier avec Produits --- MODIFIÉ
    const renderCartWithItems = () => {
        const finalTotal = cartTotal + deliveryCost;

        return (
            <>
                <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-6">🛒 Mon Panier ({cartItems.length} articles)</h1>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        
                        {/* Colonne des Items du Panier */}
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-700">
                                    Vos articles
                                </h2>
                                <button
                                    onClick={clearCart}
                                    className="btn btn-sm btn-ghost text-red-500 hover:text-red-700"
                                    disabled={cartItems.length === 0}
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Vider le panier
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {cartItems.map((item, index) => (
                                    <CartItem key={item.id || index} item={item} />
                                ))}
                            </div>
                        </div>
                        
                        {/* Colonne du Résumé de la Commande - MODIFIÉ */}
                        <div className="md:col-span-1 bg-white p-6 shadow-md rounded-lg h-fit sticky top-24">
                            <h2 className="text-2xl font-bold mb-4">Récapitulatif</h2>
                            
                            <div className="flex justify-between mb-3">
                                <span className="text-gray-600">Sous-total</span>
                                <span className="font-semibold">{cartTotal.toLocaleString('fr-FR')} FCFA</span>
                            </div>
                            
                            <div className="flex justify-between mb-6">
                                <span className="text-gray-600">
                                    <Truck size={16} className="inline mr-2" />
                                    Frais de livraison estimés
                                </span>
                                <span className="font-semibold">{deliveryCost.toLocaleString('fr-FR')} FCFA</span>
                            </div>

                            <div className="divider"></div>

                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>Total estimé</span>
                                <span className="text-green-700">{finalTotal.toLocaleString('fr-FR')} FCFA</span>
                            </div>
                            
                            <button 
                                onClick={handleCheckout}
                                className="btn btn-success w-full text-white font-medium rounded-lg hover:bg-green-700 transition duration-300"
                                disabled={cartItems.length === 0}
                            >
                                Finaliser la commande
                            </button>

                            {/* Informations sur la livraison - MODIFIÉ */}
                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="flex items-start">
                                    <Info size={18} className="text-yellow-600 mt-1 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-yellow-800 font-medium mb-2">
                                            Information importante
                                        </p>
                                        <p className="text-xs text-yellow-700">
                                            Vous devrez sélectionner une agence de livraison et fournir son numéro 
                                            de contact pour finaliser votre commande. Le vendeur sera informé 
                                            pour coordonner la livraison.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-start">
                                    <Package size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-green-800 font-medium">
                                            Livraison personnalisée
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            Vous choisissez l'agence, nous nous occupons de la coordination avec le vendeur
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal pour la livraison */}
                <DeliveryModal />
            </>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="loading loading-spinner text-green-700 loading-lg"></div>
                <p className="mt-4 text-gray-600">Chargement de votre panier...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-lg mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-red-600 mb-4">Erreur</h1>
                <p className="text-gray-600 mb-6 text-lg">{error}</p>
                <div className="space-x-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                    >
                        Réessayer
                    </button>
                    <Link to="/login" className="btn btn-outline">
                        Se reconnecter
                    </Link>
                </div>
            </div>
        );
    }

    // Si panier vide
    if (cartItems.length === 0) {
        return renderEmptyCart();
    }

    // Si panier avec articles
    return renderCartWithItems();
};

export default CartPage;