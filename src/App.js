import './App.css';
import BasicExample from './components/BasicExample';
import BannerPage from './components/BannerPage';
import PropertyCard from './components/PropertyCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import OffPlan from './components/OffPlan';
import SaleProperty from './components/SaleProperty';
import Luxury from './components/Luxury';
import Locations from './components/location/Locations';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import PropertySection from './components/PropertySection';
import ContactUs from './components/ContactUs';  

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from './components/About';
import LoginPage from './components/login';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PropertyDetail from './components/PropertyDetail';
import CommercialProperties from './components/CommercialProperties';
import ResidentialProperties from './components/ResidentialProperties';
import PlotsProperties from './components/PlotsProperties';
import LuxuryProperties from './components/LuxuryProperties';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { UserAuthProvider } from './contexts/UserAuthContext';
import React, { useState } from 'react';

function App() {
  const [propertyFilter, setPropertyFilter] = useState('all'); // 'all', 'available', 'rented'
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    priceRange: '',
    bedrooms: ''
  });

  const handleSearchFiltersChange = (filters) => {
    setSearchFilters(filters);
  };

  return (
    <AuthProvider>
      <UserAuthProvider>
        <FavoritesProvider>
          <Router>
            <BasicExample />

        
        <Routes>
        <Route 
          path="/" 
          element={
            <>
              <BannerPage 
                onFilterChange={setPropertyFilter} 
                onSearchFiltersChange={handleSearchFiltersChange}
              />
              <PropertyCard 
                statusFilter={propertyFilter} 
                searchFilters={searchFilters}
              />
              <OffPlan 
                statusFilter={propertyFilter} 
                searchFilters={searchFilters}
              />
              <SaleProperty 
                statusFilter={propertyFilter} 
                searchFilters={searchFilters}
              />
              <Luxury 
                statusFilter={propertyFilter} 
                searchFilters={searchFilters}
              />
              <Locations />
              <PropertySection />
              <Testimonials />
              <Footer />
            </>
          } 
        />

        
        <Route path="/about" element={<About />} />

          <Route path="/ContactUs" element={<ContactUs />} />
        
        <Route path="/Login" element={<LoginPage />} />
        
        {/* Property Type Routes */}
        <Route path="/commercial-properties" element={<CommercialProperties />} />
        <Route path="/residential-properties" element={<ResidentialProperties />} />
        <Route path="/plots-properties" element={<PlotsProperties />} />
        <Route path="/luxury-properties" element={<LuxuryProperties />} />
        
        {/* Property Detail Route */}
        <Route path="/property/:propertyId" element={<PropertyDetail />} />
        
        {/* Protected Admin Dashboard Route */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        </Routes>
          </Router>
        </FavoritesProvider>
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;
