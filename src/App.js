import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';

import { Navbar, Sidebar, Products, Cart, Checkout, Confirmation } from './components';
import { commerce } from './lib/commerce';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

const App = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const classes = useStyles();
  const history = useHistory();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();

    setProducts(data);
  };

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };

  const handleAddToCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);

    setCart(item.cart);
  };

  const handleUpdateCartQty = async (lineItemId, quantity) => {
    const response = await commerce.cart.update(lineItemId, { quantity });

    setCart(response.cart);
  };

  const handleRemoveFromCart = async (lineItemId) => {
    const response = await commerce.cart.remove(lineItemId);

    setCart(response.cart);
  };

  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();

    setCart(response.cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
    console.log(incomingOrder);
    setOrder(incomingOrder);

    // Clear the cart
    refreshCart();
    // Send the user to the receipt
    history.push('/home');
    // Store the order in session storage so we can show it again if the
    // user refreshes the page!
    window.sessionStorage.setItem('order_receipt', JSON.stringify(order));
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  console.log(cart);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Navbar totalItems={cart.total_items} handleDrawerToggle={handleDrawerToggle} />
        <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart={handleAddToCart} handleUpdateCartQty />
          </Route>
          <Route exact path="/cart">
            <Cart cart={cart} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} onEmptyCart={handleEmptyCart} />
          </Route>
          <Route path="/checkout" exact>
            <Checkout
              history={history}
              cart={cart}
              onCaptureCheckout={handleCaptureCheckout}
            />

          </Route>
          <Route
            path="/confirmation"
            exact
            render={(props) => {
              if (!order) {
                return props.history.push('/');
              }
              return (
                <Confirmation
                  {...props}
                  order={order}
                />
              );
            }}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
