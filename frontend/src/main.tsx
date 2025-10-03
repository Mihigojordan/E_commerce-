import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { WishlistProvider } from './context/WishlistContext.tsx'
import { PurchasingUserAuthProvider } from './context/PurchasingUserAuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <PurchasingUserAuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </PurchasingUserAuthProvider>
    </AuthContextProvider>
  </StrictMode>,
)
