import React from 'react';
import CartItem from './CartItem/CartItem';

const Cart = ({ cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart }) => {
  const handleEmptyCart = () => {
    onEmptyCart();
  };

  const renderEmptyCart = () => (
    <p>You have no items in your shopping cart, start adding some!</p>
  );

  const renderCart = () => (
    <>
      {cart.line_items.map((lineItem) => (
        <CartItem item={lineItem} key={lineItem.id} onUpdateCartQty={onUpdateCartQty} onRemoveFromCart={onRemoveFromCart} className="cart__inner" />
      ))}
      <div className="cart__total">
        <p className="cart__total-title">Subtotal:</p>
        <p className="cart__total-price">{cart.subtotal.formatted_with_symbol}</p>
      </div>
    </>
  );

  return (
    <div className="cart">
      <h4 className="cart__heading">Your Shopping Cart</h4>
      { !cart.line_items.length ? renderEmptyCart() : renderCart() }
      <button type="button" className="cart__btn-empty" onClick={handleEmptyCart}>Empty cart</button>
    </div>
  );
};

export default Cart;
