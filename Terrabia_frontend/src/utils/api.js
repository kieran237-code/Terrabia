// src/utils/api.js
const API_BASE_URL = 'https://terrabia-1.onrender.com';;

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Méthode générique pour faire des requêtes
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Récupérer le token
        const token = localStorage.getItem('access_token');
        
        // Préparer les headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            ...options,
            headers,
        };
        
        try {
            const response = await fetch(url, config);
            
            // Gérer les réponses d'erreur
            if (!response.ok) {
                if (response.status === 401) {
                    // Essayer de rafraîchir le token
                    const refreshed = await this.refreshToken();
                    if (refreshed) {
                        // Réessayer la requête avec le nouveau token
                        return this.request(endpoint, options);
                    } else {
                        throw new Error('Session expirée');
                    }
                }
                
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erreur ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Rafraîchir le token
    async refreshToken() {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
            return false;
        }
        
        try {
            const response = await fetch(`${this.baseURL}/api/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access);
                return true;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
        
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        this.logout();
        return false;
    }

    // Déconnexion
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    // Méthodes spécifiques
    async getProduits() {
        return this.request('/api/produits/');
    }

    async getProduit(id) {
        return this.request(`/api/produits/${id}/`);
    }
    async getCategories() {
        return this.request('/api/categories/'); 
    }
    async login(email, password) {
        const response = await fetch(`${this.baseURL}/api/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.access) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            
            // Stocker les informations utilisateur
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('user_role', data.user.role || 'ACHETEUR');
            }
            
            return data;
        }
        
        throw new Error(data.error || 'Échec de la connexion');
    }
}

export const api = new ApiClient();