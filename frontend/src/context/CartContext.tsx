// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "../services/ProductService"; // adjust import path if needed

export interface CartItem extends Product {
  cartQuantity: number; // separate from product.stock/quantity
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage data immediately to prevent cart loss on refresh
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Check if we're in a browser environment (not SSR)
    if (typeof window === 'undefined') return [];
    
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Check if we're in a browser environment
  
    if (typeof window === 'undefined') return;

    
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    alert(id)
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cartQuantity: quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.cartQuantity * item.price, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};