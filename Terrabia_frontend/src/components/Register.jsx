import React, { useState } from 'react';
// 1. Importer useNavigate si vous utilisez React Router
import { useNavigate } from 'react-router-dom'; 
import { Mail, Lock, Eye, EyeOff, User, Leaf, ShoppingBag, Tractor, Image, Globe, Truck } from 'lucide-react';

// URL de base de votre API (à remplacer par votre adresse réelle)
const API_BASE_URL = 'http://localhost:8000'; 
const REGISTER_URL = `${API_BASE_URL}/api/register/`;

// Composant InputField (inchangé)
const InputField = ({ label, type = 'text', placeholder, icon: Icon, value, onChange, name, isPassword = false, accept }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  if (type === 'file') {
    return (
      <div className="form-control w-full mb-5">
        <label className="label pb-2">
          <span className="label-text font-semibold text-gray-800 text-base">{label}</span>
        </label>
        <div className="relative">
          <label htmlFor={name} className="input w-full pl-12 pr-4 h-14 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-700 placeholder:text-gray-400 flex items-center cursor-pointer hover:border-emerald-500">
            {Icon && (
              <Icon size={22} className="text-gray-400 mr-3" />
            )}
            <span className="truncate text-gray-500">
              {value ? value.name : placeholder}
            </span>
          </label>
          <input
            type="file"
            name={name}
            id={name}
            onChange={onChange}
            accept={accept}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="form-control w-full mb-5">
      <label className="label pb-2">
        <span className="label-text font-semibold text-gray-800 text-base">{label}</span>
      </label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input w-full pl-12 pr-12 h-14 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-700 placeholder:text-gray-400"
        />
        {Icon && (
          <Icon size={22} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
        {isPassword && (
          <button 
            type="button" 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        )}
      </div>
    </div>
  );
};

// Composant principal de la page d'inscription
const RegisterPage = () => {
  const [role, setRole] = useState('ACHETEUR'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // 2. Initialiser le hook de navigation
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    nom: '',           
    prenom: '',          
    specialite: 'FRUIT',
    nom_agence: '',
    numero_telephone: '',
    localite: '',
    photo_profil: null,      
  });

  // Composant pour les cartes de sélection de rôle (modifié pour inclure AGENCE)
  const RoleCard = ({ selectedRole, currentRole, icon: Icon, title, subtitle, onClick }) => (
    <div
      className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 w-1/3 h-40 ${
        selectedRole === currentRole 
          ? 'border-emerald-600 bg-emerald-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={() => onClick(currentRole)}
    >
      <div className={`p-3 rounded-xl mb-3 ${selectedRole === currentRole ? 'bg-white' : 'bg-gray-50'}`}>
        <Icon size={40} className={`${selectedRole === currentRole ? 'text-emerald-600' : 'text-gray-500'}`} />
      </div>
      <h4 className="font-bold text-lg text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-500 text-center">{subtitle}</p>
    </div>
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError(null);
    if (name === 'photo_profil' && files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    // Réinitialiser les champs spécifiques au rôle
    setFormData(prev => ({
        ...prev,
        nom: '', 
        prenom: '',
        specialite: 'FRUIT',
        nom_agence: '',
        numero_telephone: '',
        localite: '',
    }));
  };
  
  /**
   * Fonction pour envoyer les données au backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    setLoading(true);
    
    const form = new FormData();
    
    form.append('email', formData.email);
    form.append('password', formData.motDePasse);
    form.append('role', role);
    
    if (role === 'ACHETEUR') {
      form.append('nom', formData.nom);
      form.append('prenom', formData.prenom);
    } else if (role === 'AGRICULTEUR') {
      form.append('specialite', formData.specialite);
    } else if (role === 'AGENCE') {
      form.append('nom_agence', formData.nom_agence);
      form.append('numero_telephone', formData.numero_telephone);
      form.append('localite', formData.localite);
    }

    if (formData.photo_profil) {
      form.append('photo_profil', formData.photo_profil);
    }

    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        console.log("Inscription réussie:", data);
        
        // 3. Redirection après 3 secondes
        setTimeout(() => {
            navigate('/login');
        }, 3000);
        
      } else {
        const errorMessages = Object.entries(data)
          .map(([key, value]) => `${key}: ${value.join(' ')}`)
          .join(' | ');
        setError(`Échec de l'inscription. Détails: ${errorMessages}`);
        console.error("Erreur d'inscription:", data);
      }
    } catch (err) {
      console.error("Erreur réseau/inattendue:", err);
      setError("Une erreur réseau ou inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
      
      <div className="w-full max-w-2xl">
        
        {/* Logo et titre */}
        <div className="flex justify-center items-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <Leaf className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 ml-3">Terrabia</h1>
        </div>

        {/* Carte principale */}
        <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12">
          
          {/* En-tête du formulaire */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h2>
            <p className="text-gray-500">Rejoignez la communauté Terrabia</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Messages de statut */}
            {error && (
              <div role="alert" className="alert alert-error bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                <p className="font-semibold">Erreur</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div role="alert" className="alert alert-success bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 rounded-lg">
                <p className="font-semibold">Succès!</p>
                <p className="text-sm">Votre compte a été créé avec succès. Redirection vers la page de connexion...</p>
              </div>
            )}

            {/* Section 1: Sélection de rôle */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-800 mb-4 text-lg">Je suis...</h4>
              <div className="flex gap-4">
                <RoleCard
                  selectedRole={role}
                  currentRole="ACHETEUR"
                  icon={ShoppingBag}
                  title="Acheteur"
                  subtitle="Je veux acheter des produits"
                  onClick={handleRoleChange}
                />
                <RoleCard
                  selectedRole={role}
                  currentRole="AGRICULTEUR"
                  icon={Tractor}
                  title="Agriculteur"
                  subtitle="Je veux vendre mes produits"
                  onClick={handleRoleChange}
                />
                <RoleCard
                  selectedRole={role}
                  currentRole="AGENCE"
                  icon={Truck}
                  title="Agence de livraison"
                  subtitle="Je veux livrer des produits"
                  onClick={handleRoleChange}
                />
              </div>
            </div>

            {/* Section 2: Champs d'information communs */}
            
            <InputField 
              label="Email" 
              name="email" 
              type="email" 
              placeholder="votre@email.com" 
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
            />
            
            <InputField 
              label="Mot de passe" 
              name="motDePasse" 
              placeholder="Minimum 8 caractères" 
              icon={Lock}
              value={formData.motDePasse}
              onChange={handleChange}
              isPassword={true}
            />

            <InputField 
              label="Confirmer le mot de passe" 
              name="confirmerMotDePasse" 
              placeholder="Doit correspondre au mot de passe" 
              icon={Lock}
              value={formData.confirmerMotDePasse}
              onChange={handleChange}
              isPassword={true}
            />

            {/* Section 3: Champs spécifiques au rôle */}
            
            {/* Champs pour ACHETEUR */}
            {role === 'ACHETEUR' && (
                <div className="border-t pt-6 mt-6 border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">Vos coordonnées</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField 
                            label="Prénom" 
                            name="prenom" 
                            placeholder="Jean" 
                            icon={User}
                            value={formData.prenom}
                            onChange={handleChange}
                        />
                        <InputField 
                            label="Nom" 
                            name="nom" 
                            placeholder="Dupont" 
                            icon={User}
                            value={formData.nom}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}
            
            {/* Champs pour AGRICULTEUR */}
            {role === 'AGRICULTEUR' && (
                <div className="border-t pt-6 mt-6 border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">Détails agriculteur</h4>
                    
                    <div className="form-control w-full mb-5">
                      <label className="label pb-2">
                        <span className="label-text font-semibold text-gray-800 text-base">Spécialité</span>
                      </label>
                      <div className="relative">
                        <select
                          name="specialite"
                          value={formData.specialite}
                          onChange={handleChange}
                          className="select w-full pl-12 h-14 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-700"
                        >
                          <option value="FRUIT">Fruits</option>
                          <option value="LEGUME">Légumes</option>
                          <option value="CEREALE">Céréales</option>
                          <option value="AUTRE">Autre</option>
                        </select>
                        <Globe size={22} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                </div>
            )}
            
            {/* Champs pour AGENCE */}
            {role === 'AGENCE' && (
                <div className="border-t pt-6 mt-6 border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">Informations de l'agence</h4>
                    
                    <InputField 
                        label="Nom de l'agence" 
                        name="nom_agence" 
                        placeholder="Nom de votre agence" 
                        icon={Truck}
                        value={formData.nom_agence}
                        onChange={handleChange}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <InputField 
                            label="Numéro de téléphone" 
                            name="numero_telephone" 
                            placeholder="Ex: +221771234567" 
                            type="tel"
                            icon={User}
                            value={formData.numero_telephone}
                            onChange={handleChange}
                        />
                        <InputField 
                            label="Localité" 
                            name="localite" 
                            placeholder="Ville/Région" 
                            icon={Globe}
                            value={formData.localite}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-2">
                        Le numéro de téléphone servira aussi de contact WhatsApp pour vos clients.
                    </p>
                </div>
            )}
            
            {/* Champ Photo de profil (commun à tous) */}
            <div className="border-t pt-6 mt-6 border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 text-lg">Photo de profil (Optionnel)</h4>
                <InputField 
                    label="Choisir une photo" 
                    name="photo_profil" 
                    type="file"
                    placeholder={formData.photo_profil ? formData.photo_profil.name : "Sélectionner un fichier image..."} 
                    icon={Image}
                    value={formData.photo_profil}
                    onChange={handleChange}
                    accept="image/*"
                />
            </div>

            {/* Bouton de soumission */}
            <div className="form-control mt-8">
              <button 
                type="submit" 
                className={`btn bg-emerald-600 hover:bg-emerald-700 border-none text-white text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </button>
            </div>
          </form>

          {/* Lien de connexion */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Déjà un compte ? 
              <a href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 ml-1 transition-colors">
                Se connecter
              </a>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;