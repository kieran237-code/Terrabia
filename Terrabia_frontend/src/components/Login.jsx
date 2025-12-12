import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ Import de ArrowLeft
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowLeft } from 'lucide-react'; 

const API_BASE_URL = 'http://localhost:8000';
const LOGIN_URL = `${API_BASE_URL}/api/login/`;

// Composant InputField (inchangé)
const InputField = ({ label, type = 'text', placeholder, icon: Icon, value, onChange, name, isPassword = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    
    if (type === 'file') return null; 
  
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

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Réponse du serveur:", data);

      if (response.ok) {
        // Stocker le token d'accès
        if (data.access) {
          localStorage.setItem('access_token', data.access);
          console.log("Token stocké");
        }
        
        // Stocker le refresh token
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        
        // Stocker les informations utilisateur
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log("Utilisateur stocké:", data.user);
          
          // Rediriger selon le rôle
          if (data.user.role === 'AGRICULTEUR') {
            navigate('/vendeur');
          } else if (data.user.role === 'ACHETEUR') {
            navigate('/produit');
          } else {
            navigate('/');
          }
        } else {
          // Si pas d'info utilisateur, utiliser l'email
          const userData = {
            email: formData.email,
            role: data.role || 'ACHETEUR'
          };
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/produit');
        }
        
      } else {
        const errorMessage = data.detail || data.message || "Identifiants invalides";
        setError(`Échec de la connexion: ${errorMessage}`);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour naviguer vers la page d'accueil
  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
      
      {/* ⬅️ Flèche de retour vers l'accueil */}
      <button 
        onClick={handleGoBack}
        className="absolute top-8 left-8 p-3 rounded-full bg-white text-gray-600 hover:bg-gray-200 transition-colors shadow-md hidden sm:block"
        aria-label="Retour à l'accueil"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="flex justify-center items-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <Leaf className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 ml-3">Terrabia</h1>
        </div>

        {/* Formulaire */}
        <div className="bg-white shadow-xl rounded-3xl p-8">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h2>
            <p className="text-gray-500">Accédez à votre compte</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p>{error}</p>
              </div>
            )}
            
            <InputField 
              label="Email" 
              name="email" 
              type="email" 
              placeholder="votre@email.com" 
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <InputField 
              label="Mot de passe" 
              name="password" 
              placeholder="Votre mot de passe" 
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              isPassword={true}
              required
            />

            <button 
              type="submit" 
              className="btn btn-success w-full h-14 text-lg mt-6 bg-emerald-600 text-white hover:bg-emerald-700 border-none"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Pas de compte ?{' '}
              <a href="/register" className="text-emerald-600 font-semibold hover:underline">
                S'inscrire
              </a>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;