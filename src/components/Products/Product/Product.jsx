import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';

import useStyles from './styles';

const Product = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image="https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
        title="Paella dish"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          Lizard
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
          across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to cart">
          <AddCircleIcon />
        </IconButton>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <Rating name="read-only" value={3} readOnly size="large" style={{ marginLeft: 'auto' }} />
      </CardActions>
    </Card>
  );
};

export default Product;

