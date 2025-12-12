
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Vérifier si l'utilisateur est connecté
  // La clé 'access_token' est celle utilisée dans LoginPage.jsx
  const isAuthenticated = localStorage.getItem('access_token'); 

  if (!isAuthenticated) {
    // 2. Si non authentifié, rediriger vers la page de connexion
    return <Navigate to="/login" replace />;
  }

  // 3. Si authentifié, afficher le contenu de la route enfant
  // <Outlet> est utilisé pour rendre l'élément enfant de la Route.
  return <Outlet />;
};

export default ProtectedRoute;