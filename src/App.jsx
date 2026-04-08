import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import SinglePost from './pages/SinglePost';
import PortfolioPage from './pages/PortfolioPage';
import CustomWebDevelopment from './pages/CustomWebDevelopment';
import WordPressDevelopment from './pages/WordPressDevelopment';
import EcommerceDevelopment from './pages/EcommerceDevelopment';
import WebOptimization from './pages/WebOptimization';
import SoftwareSolutions from './pages/SoftwareSolutions';
import UiUxDesign from './pages/UiUxDesign';
import { Toaster } from 'react-hot-toast';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import UsersAdmin from './pages/admin/UsersAdmin';
import PostsAdmin from './pages/admin/PostsAdmin';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import ContactsAdmin from './pages/admin/ContactsAdmin';

// Dummy components to avoid breaking imports for CRM features yet to be fully coded on frontend
const DummyAdminPage = ({ title }) => (
  <div className="admin-page">
    <div className="admin-header"><h2>{title}</h2><p>CRM Feature Coming Soon</p></div>
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
      <p className="text-secondary">UI interface for this module is currently matching up with the backend API.</p>
    </div>
  </div>
);

const MainSiteLayout = () => (
  <div className="app-container">
    <Header />
    <Outlet />
    <Footer />
  </div>
);

function App() {
  useEffect(() => {
    // Initialize standard Lenis smooth scroll globally
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#2d3748', color: '#fff', borderRadius: '10px' }
      }} />
      <Routes>
        {/* Main Website Client Routes */}
        <Route element={<MainSiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/services/custom-web-development" element={<CustomWebDevelopment />} />
          <Route path="/services/wordpress-development" element={<WordPressDevelopment />} />
          <Route path="/services/ecommerce-development" element={<EcommerceDevelopment />} />
          <Route path="/services/web-optimization" element={<WebOptimization />} />
          <Route path="/software-solutions" element={<SoftwareSolutions />} />
          <Route path="/ui-ux-design" element={<UiUxDesign />} />
          <Route path="/post/:slug" element={<SinglePost />} />
        </Route>

        {/* Admin Dashboard Protected Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contacts" element={<ContactsAdmin />} />
          <Route path="posts" element={<PostsAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
