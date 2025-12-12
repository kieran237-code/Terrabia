import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';

// --- Composant Modale d'Ajout de Produit ---
const AddProductModal = ({ isModalOpen, closeModal }) => {
    // État local pour gérer les données du formulaire
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        unit: 'kg', // Valeur par défaut
        stock: '',
        category: '',
        imageUrl: '',
    });

    // Données de démonstration pour les options de sélection
    const units = ['kg', 'pièce', 'botte', 'litre'];
    const categories = ['FRUITS', 'LÉGUMES', 'CÉRÉALES', 'TUBERCULES', 'ÉPICES'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Nouveau produit à ajouter :", formData);
        // Ici, vous intégreriez la logique d'appel API (POST /products)
        closeModal(); // Ferme la modale après l'envoi (simulé)
        setFormData({ // Réinitialiser le formulaire
            name: '',
            description: '',
            price: '',
            unit: 'kg',
            stock: '',
            category: '',
            imageUrl: '',
        });
    };

    // La classe 'modal' de DaisyUI utilise l'attribut 'open' pour afficher la modale
    return (
        <dialog id="add_product_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
            <div className="modal-box p-8 max-w-lg bg-white rounded-xl shadow-2xl">
                
                {/* En-tête de la modale */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Ajouter un produit</h3>
                    <button 
                        className="btn btn-sm btn-ghost btn-circle text-gray-500 hover:text-red-500"
                        onClick={closeModal}
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Nom du Produit */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Nom du produit</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Ex: Mangues Kent"
                            className="input input-bordered w-full focus:border-green-600"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Description</span>
                        </label>
                        <textarea
                            name="description"
                            placeholder="Décrivez votre produit..."
                            className="textarea textarea-bordered h-24 w-full resize-none focus:border-green-600"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    {/* Prix et Unité (Alignés) */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-700">Prix (FCFA)</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                placeholder="2500"
                                className="input input-bordered w-full focus:border-green-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-700">Unité</span>
                            </label>
                            <select
                                name="unit"
                                className="select select-bordered w-full focus:border-green-600"
                                value={formData.unit}
                                onChange={handleChange}
                                required
                            >
                                {units.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* Stock et Catégorie (Alignés) */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-700">Stock</span>
                            </label>
                            <input
                                type="number"
                                name="stock"
                                placeholder="100"
                                className="input input-bordered w-full focus:border-green-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={formData.stock}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-700">Catégorie</span>
                            </label>
                            <select
                                name="category"
                                className="select select-bordered w-full focus:border-green-600"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Sélectionner</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* URL de l'image */}
                    <div className="form-control mb-6">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">URL de l'image</span>
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            placeholder="https://..."
                            className="input input-bordered w-full focus:border-green-600"
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />
                         {/* Optionnel : Champ de type fichier, si vous préférez l'upload direct */}
                         {/*
                        <div className="mt-2">
                             <input type="file" className="file-input file-input-bordered file-input-success w-full" />
                        </div>
                         */}
                    </div>

                    {/* Bouton de soumission */}
                    <div className="modal-action mt-0 p-0 block">
                        <button type="submit" className="btn btn-success w-full bg-green-700 hover:bg-green-800 text-white font-bold border-none">
                            <Plus size={20} />
                            Ajouter le produit
                        </button>
                    </div>
                </form>

            </div>
            {/* Overlay pour fermer en cliquant à l'extérieur (DaisyUI) */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={closeModal}>fermer</button>
            </form>
        </dialog>
    );
};

export default AddProductModal;