import React, { useState, useEffect } from 'react';
import { Leaf, Plus, X, LogOut, Trash2, Package } from 'lucide-react';

const API_BASE_URL = 'https://terrabia-1.onrender.com/api';

const FarmerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    quantite: '',
    prix: '',
    etat: 'disponible',
    categorie: '', 
    photos: [] // CORRIGÉ: doit être un tableau
  });
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const getCategoryName = (id) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.nom : `Catégorie ${id}`;
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      console.error("Refresh token manquant.");
      handleLogout();
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Échec du rafraîchissement du token');
      }

      const data = await response.json();
      
      localStorage.setItem('access_token', data.access);
      
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
      
      return data.access;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      return null;
    }
  };

  const getToken = async () => {
    let token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error("Token d'authentification manquant.");
      return null;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const currentTime = Date.now();

      if (currentTime >= expirationTime - 300000 || currentTime >= expirationTime) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            token = newToken;
          } else {
            handleLogout();
            return null;
          }
        } catch (error) {
          console.error('Erreur lors du rafraîchissement du token:', error);
          handleLogout();
          return null;
        }
      }

      return token;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      handleLogout();
      return null;
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/categories/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : data.results || []);
        
        if (data.length === 0 || (data.results && data.results.length === 0)) {
          console.log('Aucune catégorie trouvée, création possible');
        }
      } else if (response.status === 404) {
        console.log('Endpoint /categories/ non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const createDefaultCategories = async () => {
    const defaultCategories = [
      { nom: "Fruits", description: "Fruits frais de saison" },
      { nom: "Légumes", description: "Légumes frais du potager" },
      { nom: "Tubercules", description: "Manioc, igname, patate douce, etc." },
      { nom: "Céréales", description: "Maïs, riz, mil, sorgho" },
      { nom: "Légumineuses", description: "Haricots, arachides, niébé" },
      { nom: "Épices", description: "Piment, gingembre, ail, oignon" },
      { nom: "Produits laitiers", description: "Lait, fromage, yaourt" },
      { nom: "Viandes", description: "Poulet, bœuf, porc, chèvre" },
      { nom: "Poissons", description: "Poissons frais et fumés" },
      { nom: "Autres", description: "Autres produits agricoles" },
    ];

    try {
      const token = await getToken();
      if (!token) return;
      
      const createdCategories = [];
      
      for (const category of defaultCategories) {
        const response = await fetch(`${API_BASE_URL}/categories/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: category.nom,
            description: category.description
          })
        });
        
        if (response.ok) {
          const newCategory = await response.json();
          createdCategories.push(newCategory);
          console.log(`Catégorie ${category.nom} créée avec ID: ${newCategory.id}`);
        } else {
          console.log(`Erreur lors de la création de la catégorie ${category.nom}:`, response.status);
        }
      }
      
      if (createdCategories.length > 0) {
        setCategories(createdCategories);
        alert(`${createdCategories.length} catégories créées avec succès!`);
      }
      
    } catch (error) {
      console.error('Erreur lors de la création des catégories:', error);
    }
  };

  const fetchProducts = async () => {
    const token = await getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/produits/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setProducts([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: files
    }));

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async () => {
    if (!formData.nom || !formData.quantite || !formData.prix || !formData.categorie || formData.photos.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires et ajouter au moins une photo.');
      return;
    }

    setLoading(true);
    const token = await getToken();
    if (!token) {
        setLoading(false);
        return;
    }

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('quantite', parseInt(formData.quantite));
      formDataToSend.append('prix', parseFloat(formData.prix));
      formDataToSend.append('etat', formData.etat);
      
      const categorieId = parseInt(formData.categorie);
      if (isNaN(categorieId)) {
        throw new Error('ID de catégorie invalide');
      }
      formDataToSend.append('categorie', categorieId);
      
      // CORRIGÉ: Ajouter chaque image avec le même nom de champ "photos"
      formData.photos.forEach((photo, index) => {
        formDataToSend.append('photos', photo);
      });

      // DEBUG: Afficher le contenu du FormData
      console.log('FormData envoyé:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }

      const response = await fetch(`${API_BASE_URL}/produits/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Ne pas mettre 'Content-Type' pour FormData
        },
        body: formDataToSend
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts(prev => [newProduct, ...prev]);
        setShowModal(false);
        resetForm();
        alert('Produit ajouté avec succès !');
      } else {
        const errorData = await response.json();
        console.error('Erreur détails:', errorData);
        alert(`Erreur lors de l'ajout du produit: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      quantite: '',
      prix: '',
      etat: 'disponible',
      categorie: '',
      photos: []
    });
    // Libérer les URLs d'aperçu
    previewImages.forEach(preview => URL.revokeObjectURL(preview));
    setPreviewImages([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('refresh_token'); 
    localStorage.removeItem('user'); 
    window.location.href = '/login';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    const token = await getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/produits/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) { 
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('Produit supprimé avec succès');
      } else if (response.status === 401) {
        handleLogout();
      } else {
        throw new Error(`Erreur de suppression: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAV BAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a className="text-2xl font-bold text-green-700" href="/">
              <Leaf size={24} className="inline text-green-700 mr-1" /> Terrabia
            </a>
            <div className="flex items-center gap-4">
                <a 
                    href="/publications" 
                    className="px-4 py-2 text-green-600 font-medium border-b-2 border-green-600"
                >
                    Publication
                </a>
                <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                <LogOut size={20} />
                Déconnexion
                </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* PARTIE 1: Formulaire */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 shadow-xl rounded-lg sticky top-24">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Plus size={24} className="text-green-600" /> 
                        Allez, on fait une publication !
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Remplissez le formulaire ci-dessous pour mettre votre produit en vente.
                    </p>
                    
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md mb-4"
                    >
                        <Plus size={20} />
                        Ajouter un nouveau produit
                    </button>

                    {categories.length === 0 && (
                      <button
                        onClick={createDefaultCategories}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
                      >
                        <Plus size={20} />
                        Créer les catégories par défaut
                      </button>
                    )}
                    
                    <div className="mt-8 pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-700">Statut actuel:</p>
                        <p className="text-lg text-green-600 mt-1">{products.length} produit(s) en ligne.</p>
                        <p className="text-sm text-gray-500 mt-1">{categories.length} catégorie(s) disponible(s)</p>
                    </div>
                </div>
            </div>

            {/* PARTIE 2: Liste des produits */}
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Mes Publications</h1>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun produit publié</h3>
                        <p className="text-gray-500 mb-6">Commencez par ajouter votre premier produit en utilisant le formulaire à gauche.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                                <div className="h-48 bg-gray-200 relative">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].image} 
                                            alt={product.nom}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <Package size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.nom}</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p className="flex justify-between">
                                        <span>Catégorie:</span>
                                        <span className="font-semibold text-gray-700">
                                            {getCategoryName(product.categorie)} 
                                        </span>
                                        </p>
                                        <p className="flex justify-between">
                                        <span>Prix:</span>
                                        <span className="font-semibold text-green-600">{product.prix} FCFA</span>
                                        </p>
                                        <p className="flex justify-between">
                                        <span>Quantité:</span>
                                        <span className="font-semibold">{product.quantite}</span>
                                        </p>
                                        <p className="flex justify-between">
                                        <span>État:</span>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            product.etat === 'disponible' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {product.etat}
                                        </span>
                                        </p>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <button
                                        onClick={() => handleDelete(product.id)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                                        >
                                        <Trash2 size={16} />
                                        Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Ajouter un produit</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* NOM DU PRODUIT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Tomates fraîches"
                />
              </div>

              {/* CATÉGORIE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                {categories.length === 0 ? (
                  <div className="text-center p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-700 mb-2">Aucune catégorie disponible</p>
                    <button
                      onClick={createDefaultCategories}
                      className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                    >
                      Créer les catégories par défaut
                    </button>
                    <p className="text-sm text-yellow-600 mt-2">Après création, fermez et rouvrez ce formulaire</p>
                  </div>
                ) : (
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nom} - {cat.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* PRIX */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    name="prix"
                    value={formData.prix}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="5000"
                  />
                </div>
                {/* QUANTITÉ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité *
                  </label>
                  <input
                    type="number"
                    name="quantite"
                    value={formData.quantite}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* ÉTAT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État *
                </label>
                <select
                  name="etat"
                  value={formData.etat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="disponible">Disponible</option>
                  <option value="rupture">Rupture de stock</option>
                  <option value="bientot">Bientôt disponible</option>
                </select>
              </div>

              {/* PHOTOS - CORRIGÉ: multiple images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos du produit *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Vous pouvez sélectionner plusieurs images</p>
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {previewImages.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                        onLoad={() => URL.revokeObjectURL(preview)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || categories.length === 0}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProductsPage;