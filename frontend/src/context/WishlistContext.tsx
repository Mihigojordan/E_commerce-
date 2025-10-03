// src/context/WishlistContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "../services/ProductService";
import productService from "../services/ProductService"; // your API service

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // On mount, load wishlist from localStorage and fetch valid products
  useEffect(() => {
    const loadWishlist = async () => {
      if (typeof window === "undefined") return;

      try {
        const storedWishlist = localStorage.getItem("wishlist");
        if (!storedWishlist) return;

        const parsedWishlist: Product[] = JSON.parse(storedWishlist);
        const validWishlist: Product[] = [];

        for (const item of parsedWishlist) {
          try {
            const product = await productService.getProductById(item.id);
            validWishlist.push(product);
          } catch (error) {
            console.warn(`Product ${item.id} not found in DB, removing from wishlist`);
          }
        }

        setWishlist(validWishlist);
        localStorage.setItem("wishlist", JSON.stringify(validWishlist));
      } catch (error) {
        console.error("Failed to load wishlist from localStorage or backend:", error);
      }
    };

    loadWishlist();
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) return prev; // already exists
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const clearWishlist = () => setWishlist([]);

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
};
