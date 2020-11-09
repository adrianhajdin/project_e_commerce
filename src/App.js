import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Navbar, Sidebar, Products, ProductDetails } from './components';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

const App = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const classes = useStyles();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Navbar handleDrawerToggle={handleDrawerToggle} />
        <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        <Switch>
          <Route exact path="/">
            <Products />
          </Route>
          <Route exact path="/product-details">
            <ProductDetails />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
