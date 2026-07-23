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

/* Rutas públicas (hijas del Layout). Se renderizan dos veces: sin prefijo
   (español, por defecto) y bajo /en (inglés). Los slugs se mantienen; solo
   cambia el prefijo de idioma. `prefix` es '' para ES y '/en' para EN, y se
   usa para que los redirects apunten al idioma correcto. */
function paginasPublicas(prefix) {
  return [
    <Route key="home"    index                    element={<Home />} />,
    <Route key="sn"      path="sobre-nosotras"    element={<SobreNosotras />} />,
    <Route key="prod"    path="productos"         element={<Productos />} />,
    <Route key="res"     path="resenas"           element={<Resenas />} />,
    <Route key="blog"    path="blog"              element={<Blog />} />,
    <Route key="post"    path="blog/:slug"        element={<BlogPost />} />,
    <Route key="cont"    path="contacto"          element={<Contacto />} />,
    <Route key="acc"     path="accesibilidad"     element={<Accesibilidad />} />,
    <Route key="priv"    path="privacidad"        element={<Privacidad />} />,
    <Route key="aviso"   path="aviso-legal"       element={<AvisoLegal />} />,
    /* La filosofía vive ahora dentro de Sobre Nosotras */
    <Route key="filo"    path="filosofia"         element={<Navigate to={`${prefix}/sobre-nosotras`} replace />} />,
    <Route key="404"     path="*"                 element={<NotFound />} />,
  ]
}

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas en español (por defecto) */}
      <Route path="/" element={<Layout />}>
        {paginasPublicas('')}
      </Route>

      {/* Rutas públicas en inglés bajo /en */}
      <Route path="/en" element={<Layout />}>
        {paginasPublicas('/en')}
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
