import React from 'react';

import useStyles from './styles';

const ProductDetails = () => {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <h1>Product Details</h1>
    </div>
  );
};

export default ProductDetails;
