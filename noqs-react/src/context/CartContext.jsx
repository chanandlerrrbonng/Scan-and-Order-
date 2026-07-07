import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'noqs:cart:v2';
const TAX_RATE = 0.05;        // 5% GST
const SERVICE_RATE = 0.05;    // 5% service
const FREE_DELIVERY_OVER = 500;
const DELIVERY_FEE = 30;

/** Cart state shape: { items: [{ id, name, price, emoji, qty }], promoCode: '' } */
const initialState = { items: [], promoCode: '' };

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      // Replace state with persisted version (immutable)
      return action.payload ?? state;
    }

    case 'ADD_ITEM': {
      const { item } = action;
      const existing = state.items.find((i) => i.id === item.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [
            ...state.items,
            { id: item.id, name: item.name, price: item.price, emoji: item.emoji, qty: 1 }
          ];
      return { ...state, items };
    }

    case 'REMOVE_ITEM': {
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    }

    case 'INC_QTY': {
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty + 1 } : i
        )
      };
    }

    case 'DEC_QTY': {
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0)
      };
    }

    case 'APPLY_PROMO': {
      return { ...state, promoCode: action.code.toUpperCase() };
    }

    case 'CLEAR': {
      return { items: [], promoCode: '' };
    }

    default:
      return state;
  }
}

/** Lazy initializer – reads cache once on mount, never on re-renders */
function init(initial) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) return parsed;
    }
  } catch {
    /* ignore */
  }
  return initial;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, init);

  // Ticket 611 Phase 1 – persist to localStorage whenever cart state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / private mode */
    }
  }, [state]);

  // Cross-tab sync: if user has app open in two tabs, keep carts in sync.
  useEffect(() => {
    function onStorage(e) {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const next = JSON.parse(e.newValue);
        dispatch({ type: 'HYDRATE', payload: next });
      } catch {
        /* malformed */
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // ── Derived totals via useMemo (Ticket 610 Phase 2) ──
  const totals = useMemo(() => {
    const count = state.items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    let discount = 0;
    if (state.promoCode === 'NOQS10') discount = Math.min(Math.round(subtotal * 0.1), 100);

    const tax = Math.round((subtotal - discount) * TAX_RATE);
    const service = Math.round((subtotal - discount) * SERVICE_RATE);
    const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
    const grandTotal = Math.max(0, subtotal - discount + tax + service + delivery);

    return { count, subtotal, discount, tax, service, delivery, grandTotal };
  }, [state.items, state.promoCode]);

  // ── Stable action handlers passed down via props (Ticket 610 Phase 3) ──
  const addItem    = useCallback((item) => dispatch({ type: 'ADD_ITEM', item }), []);
  const removeItem = useCallback((id)   => dispatch({ type: 'REMOVE_ITEM', id }), []);
  const incQty     = useCallback((id)   => dispatch({ type: 'INC_QTY', id }), []);
  const decQty     = useCallback((id)   => dispatch({ type: 'DEC_QTY', id }), []);
  const applyPromo = useCallback((code) => dispatch({ type: 'APPLY_PROMO', code }), []);
  const clearCart  = useCallback(()     => dispatch({ type: 'CLEAR' }), []);

  const value = useMemo(
    () => ({
      items: state.items,
      promoCode: state.promoCode,
      totals,
      addItem, removeItem, incQty, decQty, applyPromo, clearCart
    }),
    [state.items, state.promoCode, totals, addItem, removeItem, incQty, decQty, applyPromo, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
