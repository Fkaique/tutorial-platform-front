import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import VideoDetailsPage from './pages/VideoDetailsPage'
import NewVideoPage from './pages/NewVideoPage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import ManageCategoriesPage from './pages/ManageCategoriesPage'
import MyVideosPage from './pages/MyVideosPage'
import EditVideoPage from './pages/EditVideoPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/cadastro",
    element: <Register />
  },
  {
    path: '/video/:id',
    element: <VideoDetailsPage />,
  },
  {
    path: '/video/novo',
    element: <NewVideoPage />,
  },
  {
    path: '/configuracoes',
    element: <AccountSettingsPage />,
  },
  {
    path: '/categorias/gerenciar',
    element: <ManageCategoriesPage />,
  },
  {
    path: '/videos/me', // 💡 Defina o caminho que o usuário vai acessar
    element: <MyVideosPage />,
  },
  {
    path: '/videos/edit/:id',
    element: <EditVideoPage />,
  },
  {
    path: "*",
    element: <Home />
  }
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}