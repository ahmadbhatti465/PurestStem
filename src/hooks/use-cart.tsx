"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_KEY = "cart:guest";

function loadGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(GUEST_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [];
}

function saveGuestCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function clearGuestCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_KEY);
}

async function fetchDbCart(): Promise<CartItem[]> {
  const res = await fetch("/api/cart", {
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Failed to fetch cart: ${res.status} ${text}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid cart response: expected array");
  }
  return data.map((dbItem: any) => ({
    productId: dbItem.productId,
    name: dbItem.product?.name ?? "Product",
    price: dbItem.product?.salePrice ?? dbItem.product?.price ?? 0,
    quantity: dbItem.quantity ?? 1,
    image: dbItem.product?.image ?? undefined,
  }));
}

async function syncAddToDb(item: CartItem) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Failed to add to cart: ${res.status} ${text}`);
  }
}

async function syncRemoveFromDb(productId: string) {
  const res = await fetch(`/api/cart/${productId}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Failed to remove from cart: ${res.status} ${text}`);
  }
}

async function syncUpdateDb(productId: string, quantity: number) {
  const res = await fetch(`/api/cart/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Failed to update cart: ${res.status} ${text}`);
  }
}

function mergeItems(a: CartItem[], b: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of a) map.set(item.productId, { ...item });
  for (const item of b) {
    const existing = map.get(item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      map.set(item.productId, { ...item });
    }
  }
  return Array.from(map.values());
}

function addOrMerge(prev: CartItem[], item: CartItem): CartItem[] {
  const existing = prev.find((i) => i.productId === item.productId);
  if (existing) {
    return prev.map((i) =>
      i.productId === item.productId
        ? { ...i, quantity: i.quantity + item.quantity }
        : i
    );
  }
  return [...prev, item];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user?.id;
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const lastAuthState = useRef<boolean | null>(null);

  // Load cart whenever auth state actually changes (not on every render)
  useEffect(() => {
    if (lastAuthState.current === isLoggedIn) return;
    lastAuthState.current = isLoggedIn;

    let active = true;

    async function load() {
      if (isLoggedIn) {
        try {
          const dbItems = await fetchDbCart();
          const guestItems = loadGuestCart();

          if (guestItems.length > 0) {
            // Merge guest cart into DB
            for (const item of guestItems) {
              const dbItem = dbItems.find((d) => d.productId === item.productId);
              const qty = dbItem
                ? dbItem.quantity + item.quantity
                : item.quantity;
              await syncAddToDb({ ...item, quantity: qty });
            }
            clearGuestCart();
            const refreshed = await fetchDbCart();
            if (active) setItems(refreshed);
          } else {
            if (active) setItems(dbItems);
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("[CartProvider] Failed to load DB cart:", err);
          if (active) setItems([]);
        }
      } else {
        const guestItems = loadGuestCart();
        // Merge with anything already in state (prevents race with user clicks)
        if (active) {
          setItems((prev) => {
            if (prev.length === 0) return guestItems;
            return mergeItems(guestItems, prev);
          });
        }
      }
      if (active) setReady(true);
    }

    load();
    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  // Persist guest cart
  useEffect(() => {
    if (ready && !isLoggedIn) {
      saveGuestCart(items);
    }
  }, [items, ready, isLoggedIn]);

  const addItem = useCallback(
    async (item: CartItem) => {
      // Optimistically update UI immediately
      setItems((prev) => addOrMerge(prev, item));
      setIsOpen(true);

      if (isLoggedIn) {
        try {
          await syncAddToDb(item);
          const refreshed = await fetchDbCart();
          setItems(refreshed);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("[useCart] addItem failed:", err);
          // Revert optimistic update on failure
          setItems((prev) =>
            prev
              .map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.max(0, i.quantity - item.quantity) }
                  : i
              )
              .filter((i) => i.quantity > 0)
          );
        }
      }
    },
    [isLoggedIn]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      // Optimistically update UI immediately
      setItems((prev) => prev.filter((i) => i.productId !== productId));

      if (isLoggedIn) {
        try {
          await syncRemoveFromDb(productId);
          const refreshed = await fetchDbCart();
          setItems(refreshed);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("[useCart] removeItem failed:", err);
          // Revert is tricky without knowing the item; just refresh from DB
          try {
            const refreshed = await fetchDbCart();
            setItems(refreshed);
          } catch {
            // ignore
          }
        }
      }
    },
    [isLoggedIn]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }

      // Optimistically update UI immediately
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
      );

      if (isLoggedIn) {
        try {
          await syncUpdateDb(productId, quantity);
          const refreshed = await fetchDbCart();
          setItems(refreshed);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("[useCart] updateQuantity failed:", err);
          // Revert by refreshing from DB
          try {
            const refreshed = await fetchDbCart();
            setItems(refreshed);
          } catch {
            // ignore
          }
        }
      }
    },
    [isLoggedIn, removeItem]
  );

  const clearCart = useCallback(async () => {
    // Optimistically clear UI immediately
    setItems([]);

    if (isLoggedIn) {
      try {
        for (const item of items) {
          await syncRemoveFromDb(item.productId);
        }
        const refreshed = await fetchDbCart();
        setItems(refreshed);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[useCart] clearCart failed:", err);
        // Revert by refreshing from DB
        try {
          const refreshed = await fetchDbCart();
          setItems(refreshed);
        } catch {
          // ignore
        }
      }
    }
  }, [isLoggedIn, items]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const contextValue = React.useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      isOpen,
      setIsOpen,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, isOpen]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
