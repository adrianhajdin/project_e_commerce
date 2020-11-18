import React from 'react';
import { Container, Typography, Button, Grid, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';

import CartItem from './CartItem/CartItem';
import useStyles from './styles';

const Cart = ({ cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart }) => {
  const classes = useStyles();

  const handleEmptyCart = () => onEmptyCart();
  const renderEmptyCart = () => <p>You have no items in your shopping cart, start adding some!</p>;
  if (!cart.line_items) return 'Loading';

  const renderCart = () => (
    <>
      <Grid container spacing={3}>
        {cart.line_items.map((lineItem) => (
          <Grid item xs={12} sm={4} key={lineItem.id}>
            <CartItem
              item={lineItem}
              onUpdateCartQty={onUpdateCartQty}
              onRemoveFromCart={onRemoveFromCart}
              className="cart__inner"
            />
          </Grid>
        ))}
      </Grid>
      <Paper elevation={0} style={{ display: 'flex' }}>
        <Typography variant="h4">Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
        <Button type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty cart</Button>
        <Button component={Link} to="/checkout" type="button" variant="contained" color="primary">Checkout</Button>
      </Paper>
    </>
  );

  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography variant="h4" gutterBottom>Your Shopping Cart</Typography>
      { !cart.line_items.length ? renderEmptyCart() : renderCart() }
    </Container>
  );
};

export default Cart;
