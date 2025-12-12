import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import RegisterPage from './components/Register'
import LoginPage from './components/Login'
import ProductListPage from './components/Produits'
import CategoriesPage from './components/Categorie'
import EmptyCartPage from './components/Panier'
import ProductDetailPage from './components/DetailProduits'
import DeliveryAgenciesPage from './components/Livraison'
import SellerDashboard from './components/Vendeur'
import ProtectedRoute from './components/ProtectedRoute' 

function App() {
  return (
    <>
    <Routes>
        
        {/* ==================================== */}
        {/* 🔒 ROUTES PUBLIQUES (Accessibles à tous) */}
        {/* ==================================== */}
        <Route path='/' element={<Home />}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        
        {/* ==================================== */}
        {/* 🔐 ROUTES PRIVÉES (Nécessitent une connexion) */}
        {/* ==================================== */}
        <Route element={<ProtectedRoute />}>
            <Route path='/produit'  element={<ProductListPage/>}/>
            <Route path='/categorie' element={<CategoriesPage/>}/>
            <Route path='/panier' element={<EmptyCartPage/>}/>
            {/* Note: Détail Produit est souvent public, mais ici nous le protégeons */}
            <Route path='/produit/:id' element={<ProductDetailPage/>}/> 
            <Route path='/livraison' element={<DeliveryAgenciesPage/>}/>
            <Route path='/vendeur' element={<SellerDashboard/>}/>
        </Route>
        <Route path='*' element={<h1>404 - Page non trouvée</h1>} />
        
    </Routes>
    </>
  )
}

export default App