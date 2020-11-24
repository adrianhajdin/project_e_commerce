import React, { useState, useEffect } from 'react';
import { CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import useStyles from './styles';
import { commerce } from '../../../lib/commerce';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ cart, onCaptureCheckout, order }) => {
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const classes = useStyles();

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);

  useEffect(() => {
    if (cart.id) {
      const generateToken = async () => {
        const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

        setCheckoutToken(token);
      };

      generateToken();
    }
  }, [cart]);

  const test = (data) => {
    setShippingData(data);

    nextStep();
  };

  const Confirmation = () => (order.customer ? (
    <div>
      <div>
        <Typography variant="h5">Thank you for your purchase, {order?.customer?.firstname} {order?.customer?.lastname}!</Typography>
        <Divider style={{ margin: '20px 0' }} />
        <Typography variant="subtitle2">Order ref: {order?.customer_reference}</Typography>
      </div>
      <br />
      <Typography component={Link} variant="subtitle1" type="button" to="/">Back to home</Typography>
    </div>
  ) : <CircularProgress />);

  const Form = () => (activeStep === 0
    ? <AddressForm checkoutToken={checkoutToken} nextStep={nextStep} setShippingData={setShippingData} test={test} />
    : <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} />);

  return (
    <>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">Checkout</Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            {
            activeStep === steps.length
              ? <Confirmation />
              : checkoutToken && <Form />
            }
          </>
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
