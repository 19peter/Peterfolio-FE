import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import BlogList from './pages/BlogList/BlogList';
import CV from './pages/CV/CV';
import BlogDetail from './pages/BlogDetail/BlogDetail';
import AdminLogin from './pages/Admin/AdminLogin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';
import PostManagement from './pages/Admin/PostManagement/PostManagement';
import PostEditor from './pages/Admin/PostEditor/PostEditor';
import CvEditor from './pages/Admin/CvEditor/CvEditor';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ACTIVE_THEME } from './config/themeConfig';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container glass-theme">
          {/* Animated Background Shapes */}
          <div className="bg-gradient-shapes">
            <div className="shape" style={{ width: '400px', height: '400px', background: 'var(--primary)', top: '-100px', left: '-100px' }}></div>
            <div className="shape" style={{ width: '350px', height: '350px', background: 'var(--secondary)', bottom: '5%', right: '5%', animationDelay: '-5s' }}></div>
            <div className="shape" style={{ width: '300px', height: '300px', background: 'var(--accent)', top: '40%', left: '30%', animationDelay: '-10s' }}></div>
          </div>

          <Navbar />

          {/* Spacer to prevent navbar overlap */}
          <div className="navbar-spacer"></div>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tech-blog" element={<BlogList type="Tech" />} />
              <Route path="/about-blog" element={<BlogList type="Personal" />} />
              <Route path="/cv" element={<CV />} />
              <Route path="/blog/:id" element={<BlogDetail />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/posts"
                element={
                  <ProtectedRoute>
                    <PostManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/create"
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit/:id"
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cv"
                element={
                  <ProtectedRoute>
                    <CvEditor />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
