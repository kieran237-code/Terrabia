import React from 'react';
import { ShoppingCart, LogIn, Menu, ArrowRight, Leaf, Truck, ShieldCheck, Users, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import tuberculeImage from '../assets/ADO_4050.jpg'; 
import aubergineImage from '../assets/aubergine.42d93792.jpg';
// --- DONNÉES DE DÉMONSTRATION MISES À JOUR ---
const popularProducts = [
  {
    id: 1,
    name: 'Mangues Kent',
    category: 'FRUITS',
    price: '2,500',
    unit: 'kg',
    rating: 4.8,
    reviews: 24,
    imageSrc: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&h=500&fit=crop',
    description: 'Mangues Kent mûres à point, cultivées sans pesticides dans...'
  },
  {
    id: 2,
    name: 'Ananas Pain de Sucre',
    category: 'FRUITS',
    price: '1,500',
    unit: 'pièce',
    rating: 4.6,
    reviews: 18,
    imageSrc: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&h=500&fit=crop',
    description: 'Ananas sucrés et juteux de la région de Tiassalé. Cultivés de...'
  },
  {
    id: 3,
    name: 'Tomates Fraîches Bio',
    category: 'LÉGUMES',
    price: '800',
    unit: 'kg',
    rating: 4.5,
    reviews: 32,
    imageSrc: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&h=500&fit=crop',
    description: 'Tomates rouges et fermes, idéales pour les sauces et...'
  },
  {
    id: 4,
    name: 'Aubergines Violettes',
    category: 'LÉGUMES',
    price: '600',
    unit: 'kg',
    rating: 4.3,
    reviews: 15,
    // ✅ NOUVELLE IMAGE POUR AUBERGINES VIOLETTES
    imageSrc: aubergineImage,
    description: 'Aubergines locales de qualité supérieure. Parfaites pour les...'
  },
];

const categoryData = [
  {
    title: 'Fruits',
    description: 'Fruits frais de saison cultivés localement',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=600&fit=crop'
  },
  {
    title: 'Légumes',
    description: 'Légumes bio et naturels de nos producteurs',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop'
  },
  {
    title: 'Céréales',
    description: 'Riz, maïs, mil et autres céréales locales',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop'
  },
  {
    title: 'Tubercules',
    description: 'Manioc, igname, patate douce et plus',
    // ✅ NOUVELLE IMAGE POUR TUBERCULES
    image: tuberculeImage
  },
];

const values = [
  { icon: Leaf, title: '100% Local', description: 'Produits cultivés en Côte d\'Ivoire', bgColor: 'bg-emerald-50' },
  { icon: Truck, title: 'Livraison Rapide', description: 'Livré chez vous via nos partenaires', bgColor: 'bg-emerald-100' },
  { icon: ShieldCheck, title: 'Qualité Garantie', description: 'Produits vérifiés et frais', bgColor: 'bg-white' },
  { icon: Users, title: 'Commerce Équitable', description: 'Prix justes pour les agriculteurs', bgColor: 'bg-white' },
];

// --- COMPOSANTS (inchangés) ---

const Header = () => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <div className="container mx-auto px-4">
      <div className="navbar">
        <div className="flex-1">
          <a className="flex items-center gap-2" href="/">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <Leaf className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">Terrabia</span>
          </a>
        </div>
        <div className="flex-none gap-2">

          <a href="/login">
            <button className="btn btn-ghost hidden sm:inline-flex">
              Connexion
            </button>
          </a>

          <a href="/register" >
            <button className="btn btn-emerald bg-emerald-600 text-white hover:bg-emerald-700 border-none">
              S'inscrire
            </button>
          </a>

          <div className="dropdown dropdown-end lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <Menu size={22} />
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Connexion</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const HeroSection = () => (
  <section
    className="relative h-[600px] md:h-[700px] bg-cover bg-center flex items-center"
    style={{
      backgroundImage: "linear-gradient(to bottom, rgba(5, 150, 105, 0.7), rgba(4, 120, 87, 0.8)), url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop')"
    }}
  >
    <div className="container mx-auto px-6 md:px-12 text-white">
      <div className="inline-flex items-center bg-emerald-400/90 text-emerald-900 text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
        <Leaf size={18} className="mr-2" />
        Du champ à votre table
      </div>

      <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl">
        Connectez-vous aux producteurs agricoles locaux
      </h1>

      <p className="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
        Terrabia met en relation les agriculteurs et les acheteurs pour des produits frais, de qualité et à prix équitable. Soutenez l'agriculture locale.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <a href="/login">
          <button className="btn btn-warning bg-orange-500 hover:bg-orange-600 border-none text-white px-8 h-14 text-base">
            Découvrir les produits
            <ArrowRight size={20} />
          </button>
        </a>

        <a href="/login">
          <button className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-emerald-700 px-8 h-14 text-base">
            Devenir vendeur
          </button>
        </a>

      </div>
    </div>
  </section>
);

const ValueProposition = () => (
  <section className="bg-gray-50 py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {values.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl shadow-md hover:shadow-lg transition-shadow ${item.bgColor} border border-gray-100`}
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <IconComponent size={32} className="text-emerald-600" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const CategoriesSection = () => (
  <section className="bg-white py-16">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Nos Catégories</h2>
          <p className="text-gray-600">Explorez notre sélection de produits agricoles</p>
        </div>
        <a href="/login" className="hidden md:flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition">
          Voir tout
          <ArrowRight size={20} className="ml-2" />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryData.map((cat, index) => (
          <div
            key={index}
            className="relative h-80 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
              <div className="text-white w-full">
                <h3 className="text-2xl font-bold mb-2">{cat.title}</h3>
                <p className="text-sm text-gray-200 mb-3">{cat.description}</p>
                <a href="/login" className="inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition">
                  Voir les produits
                  <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProductCard = ({ product }) => {
  const { name, category, price, unit, rating, reviews, imageSrc, description } = product;

  return (
    <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden group border border-gray-100">
      <figure className="relative h-64 overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </figure>
      <div className="card-body p-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{category}</p>
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
          {name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-yellow-400' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-bold text-gray-700">{rating}</span>
          <span className="text-xs text-gray-500">({reviews} avis)</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-emerald-600">{price} FCFA</span>
            <span className="text-sm text-gray-500">/{unit}</span>
          </div>
          <button className="btn btn-circle bg-emerald-600 hover:bg-emerald-700 border-none text-white shadow-md">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PopularProducts = () => (
  <section className="bg-gray-50 py-16">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Produits Populaires</h2>
          <p className="text-gray-600">Les favoris de nos clients</p>
        </div>
        <a href="/login" className="hidden md:flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition">
          Voir tout
          <ArrowRight size={20} className="ml-2" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  </section>
);

const FarmerCTA = () => (
  <section className="relative py-24 my-16">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=600&fit=crop')"
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 to-emerald-700/70" />

    <div className="relative container mx-auto px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Vous êtes agriculteur ?
        </h2>
        <p className="text-lg md:text-xl text-white/95 mb-8 leading-relaxed">
          Rejoignez Terrabia et vendez vos produits directement aux consommateurs. Augmentez vos revenus et atteignez plus de clients.
        </p>
        <a href="/login">
          <button className="btn btn-warning bg-orange-500 hover:bg-orange-600 border-none text-white px-10 h-16 text-lg shadow-2xl">
            Commencer à vendre
            <ArrowRight size={22} />
          </button>
        </a>

      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <Leaf className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold">Terrabia</span>
          </div>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            La plateforme qui connecte les producteurs agricoles locaux avec les acheteurs. Des produits frais, directement du champ à votre table.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4 text-emerald-400">Navigation</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition">Produits</a></li>
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition">Catégories</a></li>
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition">Agences de livraison</a></li>
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition">Devenir vendeur</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4 text-emerald-400">Aide</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition">FAQ</a></li>
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition">Comment ça marche</a></li>
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition">Conditions d'utilisation</a></li>
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition">Politique de confidentialité</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4 text-emerald-400">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-400">Yaounde , Cameroun</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-emerald-400 flex-shrink-0" />
              <span className="text-gray-400">+237 694907134</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-emerald-400 flex-shrink-0" />
              <span className="text-gray-400">contact@terrabia.ci</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Terrabia. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
);

// --- COMPOSANT PRINCIPAL ---
const Home = () => { // J'ai renommé App en Home pour correspondre à votre routage
  return (
    <div className="font-sans bg-white min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ValueProposition />
        <CategoriesSection />
        <PopularProducts />
        <FarmerCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;