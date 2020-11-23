import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { commerce } from '../../lib/commerce';

const Checkout = ({ cart, onCaptureCheckout }) => {
  const history = useHistory();

  const [state, setState] = useState({
    checkoutToken: {},
    // Customer details
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@email.com',
    // Shipping details
    shippingName: 'Jane Doe',
    shippingStreet: '123 Fake St',
    shippingCity: 'San Francisco',
    shippingStateProvince: 'CA',
    shippingPostalZipCode: '94107',
    shippingCountry: 'US',
    // Payment details
    cardNum: '4242 4242 4242 4242',
    expMonth: '11',
    expYear: '2023',
    ccv: '123',
    billingPostalZipcode: '94107',
    // Shipping and fulfillment data
    shippingCountries: {},
    shippingSubdivisions: {},
    shippingOptions: [],
    shippingOption: '',
  });

  const fetchShippingCountries = async (checkoutTokenId) => {
    const countries = await commerce.services.localeListShippingCountries(checkoutTokenId);

    console.log(countries);

    setState({ ...state, shippingCountries: countries.countries });

    // return countries.countries;
  };

  const fetchSubdivisions = async (countryCode) => {
    const subdivisions = await commerce.services.localeListSubdivisions(countryCode);

    console.log(subdivisions);

    setState({ ...state, shippingSubdivisions: subdivisions.subdivisions });
  };

  const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
    console.log(checkoutTokenId, country, stateProvince);
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });
    const shippingOption = options[0] || null;

    console.log(options, shippingOption);

    setState({ ...state, shippingOption, shippingOptions: options });
  };
  let tokenn = null;

  const generateCheckoutToken = () => {
    if (cart.line_items.length) {
      return commerce.checkout.generateToken(cart.id, { type: 'cart' })
        .then((token) => {
          setState({ ...state, checkoutToken: token });
          console.log(1, token);
          tokenn = token;
        })
        .then(() => {
          console.log(2, tokenn);
          console.log(2, state.checkoutToken);
          fetchShippingCountries(tokenn.id);
        })
        .catch((error) => {
          console.log('There was an error in generating a token', error);
        });
    }
  };

  useEffect(() => {
    console.log(1, state.checkoutToken);
    generateCheckoutToken().then(() => fetchSubdivisions(state.shippingCountry)).then(() => fetchShippingOptions(tokenn.id, state.shippingCountry, state.shippingStateProvince));
    console.log(2, state.checkoutToken);
  }, []);

  //   useEffect(() => {
  //     console.log('SUCKS', state.checkoutToken);
  //     console.log('ROCKS', tokenn);

  //     fetchShippingOptions(tokenn.id, state.shippingCountry, state.shippingStateProvince);
  //     console.log(4, state.checkoutToken);
  //   }, [state.shippingCountry]);

  const handleFormChanges = (e) => setState({ ...state, [e.target.name]: e.target.value });

  const handleShippingCountryChange = (e) => fetchSubdivisions(e.target.value);

  const handleCaptureCheckout = (e) => {
    e.preventDefault();

    const orderData = {
      line_items: state.checkoutToken.live.line_items,
      customer: {
        firstname: state.firstName,
        lastname: state.lastName,
        email: state.email,
      },
      shipping: {
        name: state.shippingName,
        street: state.shippingStreet,
        town_city: state.shippingCity,
        county_state: state.shippingStateProvince,
        postal_zip_code: state.shippingPostalZipCode,
        country: state.shippingCountry,
      },
      fulfillment: {
        shipping_method: state.shippingOption.id,
      },
      payment: {
        gateway: 'test_gateway',
        card: {
          number: state.cardNum,
          expiry_month: state.expMonth,
          expiry_year: state.expYear,
          cvc: state.ccv,
          postal_zip_code: state.billingPostalZipcode,
        },
      },
    };

    onCaptureCheckout(state.checkoutToken.id, orderData);

    history.push('/confirmation');
  };

  const renderCheckoutForm = () => {
    console.log('STATE', state);

    return (
      <form className="checkout__form" onChange={handleFormChanges}>
        <h4 className="checkout__subheading">Customer information</h4>

        <label className="checkout__label" htmlFor="firstName">First name</label>
        <input className="checkout__input" type="text" onChange={handleFormChanges} value={state.firstName} name="firstName" placeholder="Enter your first name" required />

        <label className="checkout__label" htmlFor="lastName">Last name</label>
        <input className="checkout__input" type="text" onChange={handleFormChanges} value={state.lastName} name="lastName" placeholder="Enter your last name" required />

        <label className="checkout__label" htmlFor="email">Email</label>
        <input className="checkout__input" type="text" onChange={handleFormChanges} value={state.email} name="email" placeholder="Enter your email" required />

        <h4 className="checkout__subheading">Shipping details</h4>

        <label className="checkout__label" htmlFor="shippingName">Full name</label>
        <input className="checkout__input" type="text" onChange={handleFormChanges} value={state.shippingName} name="shippingName" placeholder="Enter your shipping full name" required />

        <label className="checkout__label" htmlFor="shippingStreet">Street address</label>
        <input className="checkout__input" type="text" onChange={handleFormChanges} value={state.shippingStreet} name="shippingStreet" placeholder="Enter your street address" required />

        <label className="checkout__label" htmlFor="shippingCity">City</label>
        <input className="checkout__input" type="text" onChange={handleFormChanges} value={state.shippingCity} name="shippingCity" placeholder="Enter your city" required />

        <label className="checkout__label" htmlFor="shippingPostalZipCode">Postal/Zip code</label>
        <input className="checkout__input" type="text" onChange={handleFormChanges} value={state.shippingPostalZipCode} name="shippingPostalZipCode" placeholder="Enter your postal/zip code" required />

        <label className="checkout__label" htmlFor="shippingCountry">Country</label>
        <select value={state.shippingCountry} name="shippingCountry" onChange={handleShippingCountryChange} className="checkout__select">
          <option disabled>Country</option>
          {Object.keys(state.shippingCountries).map((index) => <option value={index} key={index}>{state.shippingCountries[index]}</option>)}
        </select>

        <label className="checkout__label" htmlFor="shippingStateProvince">State/province</label>
        <select value={state.shippingStateProvince} name="shippingStateProvince" onChange={handleFormChanges} className="checkout__select">
          <option className="checkout__option" disabled>State/province</option>
          {Object.keys(state.shippingSubdivisions).map((index) => <option value={index} key={index}>{state.shippingSubdivisions[index]}</option>)}
        </select>

        <label className="checkout__label" htmlFor="shippingOption">Shipping method</label>
        <select value={state.shippingOption.id} name="shippingOption" onChange={handleFormChanges} className="checkout__select">
          <option className="checkout__select-option" disabled>Select a shipping method</option>
          {state.shippingOptions.map((method, index) => <option className="checkout__select-option" value={method.id} key={index}>{`${method.description} - $${method.price.formatted_with_code}` }</option>)};
        </select>

        <h4 className="checkout__subheading">Payment information</h4>

        <label className="checkout__label" htmlFor="cardNum">Credit card number</label>
        <input className="checkout__input" type="text" name="cardNum" onChange={handleFormChanges} value={state.cardNum} placeholder="Enter your card number" />

        <label className="checkout__label" htmlFor="expMonth">Expiry month</label>
        <input className="checkout__input" type="text" name="expMonth" onChange={handleFormChanges} value={state.expMonth} placeholder="Card expiry month" />

        <label className="checkout__label" htmlFor="expYear">Expiry year</label>
        <input className="checkout__input" type="text" name="expYear" onChange={handleFormChanges} value={state.expYear} placeholder="Card expiry year" />

        <label className="checkout__label" htmlFor="ccv">CCV</label>
        <input className="checkout__input" type="text" name="ccv" onChange={handleFormChanges} value={state.ccv} placeholder="CCV (3 digits)" />

        <button type="button" onClick={handleCaptureCheckout} className="checkout__btn-confirm">Confirm order</button>
      </form>
    );
  };

  const renderCheckoutSummary = () => (
    <>
      <div className="checkout__summary">
        <h4>Order summary</h4>
        {cart.line_items.map((lineItem) => (
          <>
            <div key={lineItem.id} className="checkout__summary-details">
              <img className="checkout__summary-img" src={lineItem.media.source} alt={lineItem.name} />
              <p className="checkout__summary-name">{lineItem.quantity} x {lineItem.name}</p>
              <p className="checkout__summary-value">{lineItem.line_total.formatted_with_symbol}</p>
            </div>
          </>
        ))}
        <div className="checkout__summary-total">
          <p className="checkout__summary-price">
            <span>Subtotal:</span>
            {cart.subtotal.formatted_with_symbol}
          </p>
        </div>
      </div>
    </>
  );

  if (!cart.line_items) return 'Loading';

  return (
    <div className="checkout">
      <h2 className="checkout__heading">
        Checkout
      </h2>
      <div className="checkout__wrapper">
        { renderCheckoutForm() }
        { renderCheckoutSummary() }
      </div>
    </div>
  );
};

export default Checkout;
