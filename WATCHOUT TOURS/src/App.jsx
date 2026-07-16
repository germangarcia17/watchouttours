import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AdminLayout } from './components/admin/AdminLayout'
import { ProtectedRoute } from './components/admin/ProtectedRoute'

import Home            from './pages/Home'
import SobreNosotras   from './pages/SobreNosotras'
import Productos       from './pages/Productos'
import Resenas         from './pages/Resenas'
import Blog            from './pages/Blog'
import BlogPost        from './pages/BlogPost'
import Contacto        from './pages/Contacto'
import Accesibilidad   from './pages/Accesibilidad'
import Privacidad      from './pages/Privacidad'
import AvisoLegal      from './pages/AvisoLegal'
import NotFound        from './pages/NotFound'

import AdminLogin      from './pages/admin/Login'
import AdminDashboard  from './pages/admin/Dashboard'
import AdminBlog       from './pages/admin/BlogAdmin'
import AdminBlogEditor from './pages/admin/BlogEditor'
import AdminResenas    from './pages/admin/ResenasAdmin'
import AdminImagenes   from './pages/admin/ImagenesAdmin'
import AdminSeo        from './pages/admin/SeoAdmin'

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas con layout principal */}
      <Route element={<Layout />}>
        <Route path="/"                 element={<Home />} />
        <Route path="/sobre-nosotras"   element={<SobreNosotras />} />
        {/* La filosofía vive ahora dentro de Sobre Nosotras */}
        <Route path="/filosofia"        element={<Navigate to="/sobre-nosotras" replace />} />
        <Route path="/productos"        element={<Productos />} />
        <Route path="/resenas"          element={<Resenas />} />
        <Route path="/blog"             element={<Blog />} />
        <Route path="/blog/:slug"       element={<BlogPost />} />
        <Route path="/contacto"         element={<Contacto />} />
        <Route path="/accesibilidad"    element={<Accesibilidad />} />
        <Route path="/privacidad"       element={<Privacidad />} />
        <Route path="/aviso-legal"      element={<AvisoLegal />} />
        <Route path="*"                 element={<NotFound />} />
      </Route>

      {/* Login admin (sin layout principal ni protección) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Panel admin — protegido */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin"              element={<AdminDashboard />} />
          <Route path="/admin/blog"         element={<AdminBlog />} />
          <Route path="/admin/blog/nuevo"   element={<AdminBlogEditor />} />
          <Route path="/admin/blog/:id"     element={<AdminBlogEditor />} />
          <Route path="/admin/resenas"      element={<AdminResenas />} />
          <Route path="/admin/imagenes"     element={<AdminImagenes />} />
          <Route path="/admin/seo"          element={<AdminSeo />} />
        </Route>
      </Route>
    </Routes>
  )
}
