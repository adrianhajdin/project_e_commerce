import React, { useState, useEffect } from 'react';
import { CssBaseline, Paper, Stepper, Step, StepLabel, Button, Link, Typography } from '@material-ui/core';

import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import useStyles from './styles';
import { commerce } from '../../../lib/commerce';

const steps = ['Shipping address', 'Payment details'];

const getStepContent = (step, checkoutToken, nextStep, setShippingData, shippingData, test, onCaptureCheckout) => {
  switch (step) {
    case 0: return <AddressForm checkoutToken={checkoutToken} nextStep={nextStep} setShippingData={setShippingData} test={test} />;
    case 1: return <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} />;
    default: throw new Error('Unknown step');
  }
};

const Checkout = ({ cart, onCaptureCheckout, order }) => {
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const classes = useStyles();
  const [shippingData, setShippingData] = useState({});

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
    console.log(data);

    setShippingData(data);
    nextStep();
  };

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
            {activeStep === steps.length ? (
              <div>
                <div>
                  <Typography variant="h4">Thank you for your purchase, {order?.customer?.firstname} {order?.customer?.lastname}!</Typography>
                  <Typography variant="subtitle2">Order ref: {order?.customer_reference}</Typography>
                </div>
                <Typography variant="subtitle1" component={Link} type="button" to="/">Back to home</Typography>
              </div>
            ) : (
              <>
                {checkoutToken ? getStepContent(activeStep, checkoutToken, nextStep, setShippingData, shippingData, test, onCaptureCheckout) : null}
              </>
            )}
          </>
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
