import React from 'react';

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {
  const handleUpdateCartQty = (lineItemId, newQuantity) => {
    onUpdateCartQty(lineItemId, newQuantity);
  };

  const handleRemoveFromCart = (lineItemId) => {
    onRemoveFromCart(lineItemId);
  };

  return (

    <div className="cart-item">
      <img className="cart-item__image" src={item.media.source} alt={item.name} />
      <div className="cart-item__details">
        <h4 className="cart-item__details-name">{item.name}</h4>
        <div className="cart-item__details-qty">
          <button type="button" onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)} title="Reduce quantity">-</button>
          <p>{item.quantity}</p>
          <button type="button" onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)} title="Increase quantity">+</button>
        </div>
        <div className="cart-item__details-price">{item.line_total.formatted_with_symbol}</div>
      </div>
      <button onClick={() => handleRemoveFromCart(item.id)} type="button">Remove</button>
    </div>
  );
};

export default CartItem;
