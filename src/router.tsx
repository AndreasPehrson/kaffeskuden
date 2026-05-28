import { createBrowserRouter, Navigate } from 'react-router-dom'
import { SiteLayout } from './layout/SiteLayout'
import { HomePage } from './pages/HomePage'
import { VoresRejserPage } from './pages/VoresRejserPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <SiteLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'vores-rejser', element: <VoresRejserPage /> },
      ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ],
  { basename },
)
