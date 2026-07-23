
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AdminAuth } from './context/AdminAuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <AdminAuth>

        <App />
        </AdminAuth>
  
)
