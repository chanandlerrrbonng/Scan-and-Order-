import { memo } from 'react';
import { useCart } from '../context/CartContext.jsx';

function CartItem({ item }) {
  const { incQty, decQty, removeItem } = useCart();

  return (
    <li className="cart-item">
      <span className="cart-item-emoji" aria-hidden="true">{item.emoji || '🍽️'}</span>
      <div className="cart-item-body">
        <p className="cart-item-name">{item.name}</p>
        <p className="cart-item-price">₹{item.price} × {item.qty} = <strong>₹{item.price * item.qty}</strong></p>
      </div>
      <div className="cart-item-actions">
        <div className="qty-control">
          <button className="btn-qty" aria-label={`Decrease quantity of ${item.name}`} onClick={() => decQty(item.id)}>−</button>
          <span className="qty-val" aria-live="polite">{item.qty}</span>
          <button className="btn-qty" aria-label={`Increase quantity of ${item.name}`} onClick={() => incQty(item.id)}>+</button>
        </div>
        <button className="btn-remove" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}>Remove</button>
      </div>
    </li>
  );
}

export default memo(CartItem);
