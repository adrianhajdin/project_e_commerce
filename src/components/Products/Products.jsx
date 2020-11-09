import React from 'react';
import Grid from '@material-ui/core/Grid';

import Product from './Product/Product';
import useStyles from './styles';

import products from '../../products';

const Products = () => {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Grid container justify="center" spacing={4}>
        {[0, 1, 2, 3, 4, 5, 6, 8].map((value) => (
          <Grid key={value} item xs={12} sm={6} md={4} lg={3}>
            <Product />
          </Grid>
        ))}
      </Grid>
    </main>
  );
};

export default Products;

