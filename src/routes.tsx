import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login' // Importa a tela de Login real

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login /> // Substitui o placeholder pelo componente real
  },
  {
    path: "/cadastro",
    element: <Register />
  },
  {
    path: "*",
    element: <Home />
  }
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}