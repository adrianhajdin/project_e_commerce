import React from 'react';
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from '@material-ui/core';

import useStyles from './styles';

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {
  const classes = useStyles();

  const handleUpdateCartQty = (lineItemId, newQuantity) => onUpdateCartQty(lineItemId, newQuantity);

  const handleRemoveFromCart = (lineItemId) => onRemoveFromCart(lineItemId);

  return (
    <Card className="cart-item">
      <CardMedia image={item.media.source} alt={item.name} style={{ height: 140 }} />
      <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">{item.name}</Typography>
        <Typography variant="h5">{item.line_total.formatted_with_symbol}</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button type="button" size="small" onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}>-</Button>
          <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
          <Button type="button" size="small" onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}>+</Button>
        </div>
        <Button variant="contained" type="button" color="secondary" onClick={() => handleRemoveFromCart(item.id)}>Remove</Button>
      </CardActions>
    </Card>
  );
};

export default CartItem;
