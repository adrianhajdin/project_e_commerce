import React, { Component } from 'react';
import { commerce } from '../../lib/commerce';

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    };

    this.handleFormChanges = this.handleFormChanges.bind(this);
    this.handleShippingCountryChange = this.handleShippingCountryChange.bind(this);
    this.handleCaptureCheckout = this.handleCaptureCheckout.bind(this);
  }

  componentDidMount() {
    this.generateCheckoutToken()
      .then(() => this.fetchSubdivisions(this.state.shippingCountry));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.shippingCountry !== prevState.shippingCountry) {
      this.fetchShippingOptions(this.state);
    }
  }

  // separate token and shipping

  /**
    *  Generates a checkout token
    *  https://commercejs.com/docs/sdk/checkout#generate-token
    */
  generateCheckoutToken() {
    const { cart } = this.props;

    if (cart.line_items && cart.line_items.length) {
      return commerce.checkout.generateToken(cart.id, { type: 'cart' })
        .then((token) => this.setState({ checkoutToken: token })
          .then(() => this.fetchShippingCountries(this.state.checkoutToken.id))
          .then(() => this.fetchShippingOptions(this.state.checkoutToken.id, this.state.shippingCountry, this.state.shippingStateProvince))
          .catch((error) => {
            console.log('There was an error in generating a token', error);
          }));
    }
  }

  /**
     * Fetches a list of countries available to ship to checkout token
     * https://commercejs.com/docs/sdk/checkout#list-available-shipping-countries
     *
     * @param {string} checkoutTokenId
     */
  fetchShippingCountries(checkoutTokenId) {
    commerce.services.localeListShippingCountries(checkoutTokenId).then((countries) => {
      this.setState({
        shippingCountries: countries.countries,
      });
    }).catch((error) => {
      console.log('There was an error fetching a list of shipping countries', error);
    });
  }

  /**
     * Fetches the subdivisions (provinces/states) for a country
     * https://commercejs.com/docs/sdk/checkout#list-all-subdivisions-for-a-country
     *
     * @param {string} countryCode
     */
  fetchSubdivisions(countryCode) {
    commerce.services.localeListSubdivisions(countryCode).then((subdivisions) => {
      this.setState({
        shippingSubdivisions: subdivisions.subdivisions,
      });
    }).catch((error) => {
      console.log('There was an error fetching the subdivisions', error);
    });
  }

  /**
     * Fetches the available shipping methods for the current checkout
     * https://commercejs.com/docs/sdk/checkout#get-shipping-methods
     *
     * @param {string} checkoutTokenId
     * @param {string} country
     * @param {string} stateProvince
     */
  fetchShippingOptions(checkoutTokenId, country, stateProvince = null) {
    commerce.checkout.getShippingOptions(checkoutTokenId,
      {
        country,
        region: stateProvince,
      }).then((options) => {
      // Pre-select the first available method
      const shippingOption = options[0] || null;
      this.setState({
        shippingOption,
        shippingOptions: options,
      });
    }).catch((error) => {
      console.log('There was an error fetching the shipping methods', error);
    });
  }

  handleFormChanges(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleShippingCountryChange(e) {
    const currentValue = e.target.value;
    this.fetchSubdivisions(currentValue);
  }

  handleCaptureCheckout(e) {
    e.preventDefault();
    const orderData = {
      line_items: this.state.checkoutToken.live.line_items,
      customer: {
        firstname: this.state.firstName,
        lastname: this.state.lastName,
        email: this.state.email,
      },
      shipping: {
        name: this.state.shippingName,
        street: this.state.shippingStreet,
        town_city: this.state.shippingCity,
        county_state: this.state.shippingStateProvince,
        postal_zip_code: this.state.shippingPostalZipCode,
        country: this.state.shippingCountry,
      },
      fulfillment: {
        shipping_method: this.state.shippingOption.id,
      },
      payment: {
        gateway: 'test_gateway',
        card: {
          number: this.state.cardNum,
          expiry_month: this.state.expMonth,
          expiry_year: this.state.expYear,
          cvc: this.state.ccv,
          postal_zip_code: this.state.billingPostalZipcode,
        },
      },
    };
    this.props.onCaptureCheckout(this.state.checkoutToken.id, orderData);
    this.props.history.push('/confirmation');
  }

  renderCheckoutForm() {
    const { shippingCountries, shippingSubdivisions, shippingOptions } = this.state;

    return (
      <form className="checkout__form" onChange={this.handleFormChanges}>
        <h4 className="checkout__subheading">Customer information</h4>

        <label className="checkout__label" htmlFor="firstName">First name</label>
        <input className="checkout__input" type="text" onChange={this.handleFormChanges} value={this.state.firstName} name="firstName" placeholder="Enter your first name" required />

        <label className="checkout__label" htmlFor="lastName">Last name</label>
        <input className="checkout__input" type="text" onChange={this.handleFormChanges} value={this.state.lastName} name="lastName" placeholder="Enter your last name" required />

        <label className="checkout__label" htmlFor="email">Email</label>
        <input className="checkout__input" type="text" onChange={this.handleFormChanges} value={this.state.email} name="email" placeholder="Enter your email" required />

        <h4 className="checkout__subheading">Shipping details</h4>

        <label className="checkout__label" htmlFor="shippingName">Full name</label>
        <input className="checkout__input" type="text" onChange={this.handleFormChanges} value={this.state.shippingName} name="shippingName" placeholder="Enter your shipping full name" required />

        <label className="checkout__label" htmlFor="shippingStreet">Street address</label>
        <input className="checkout__input" type="text" onChange={this.handleFormChanges} value={this.state.shippingStreet} name="shippingStreet" placeholder="Enter your street address" required />

        <label className="checkout__label" htmlFor="shippingCity">City</label>
        <input className="checkout__input" type="text" onChange={this.handleFormChanges} value={this.state.shippingCity} name="shippingCity" placeholder="Enter your city" required />

        <label className="checkout__label" htmlFor="shippingPostalZipCode">Postal/Zip code</label>
        <input className="checkout__input" type="text" onChange={this.handleFormChanges} value={this.state.shippingPostalZipCode} name="shippingPostalZipCode" placeholder="Enter your postal/zip code" required />

        <label className="checkout__label" htmlFor="shippingCountry">Country</label>
        <select
          value={this.state.shippingCountry}
          name="shippingCountry"
          onChange={this.handleShippingCountryChange}
          className="checkout__select"
        >
          <option disabled>Country</option>
          {
                        Object.keys(shippingCountries).map((index) => (
                          <option value={index} key={index}>{shippingCountries[index]}</option>
                        ))
                    };
        </select>

        <label className="checkout__label" htmlFor="shippingStateProvince">State/province</label>
        <select
          value={this.state.shippingStateProvince}
          name="shippingStateProvince"
          onChange={this.handleFormChanges}
          className="checkout__select"
        >
          <option className="checkout__option" disabled>State/province</option>
          {
                        Object.keys(shippingSubdivisions).map((index) => (
                          <option value={index} key={index}>{shippingSubdivisions[index]}</option>
                        ))
                    };

        </select>

        <label className="checkout__label" htmlFor="shippingOption">Shipping method</label>
        <select
          value={this.state.shippingOption.id}
          name="shippingOption"
          onChange={this.handleFormChanges}
          className="checkout__select"
        >
          <option className="checkout__select-option" disabled>Select a shipping method</option>
          {
                        shippingOptions.map((method, index) => (
                          <option className="checkout__select-option" value={method.id} key={index}>{`${method.description} - $${method.price.formatted_with_code}` }</option>
                        ))
                    };
        </select>

        <h4 className="checkout__subheading">Payment information</h4>

        <label className="checkout__label" htmlFor="cardNum">Credit card number</label>
        <input className="checkout__input" type="text" name="cardNum" onChange={this.handleFormChanges} value={this.state.cardNum} placeholder="Enter your card number" />

        <label className="checkout__label" htmlFor="expMonth">Expiry month</label>
        <input className="checkout__input" type="text" name="expMonth" onChange={this.handleFormChanges} value={this.state.expMonth} placeholder="Card expiry month" />

        <label className="checkout__label" htmlFor="expYear">Expiry year</label>
        <input className="checkout__input" type="text" name="expYear" onChange={this.handleFormChanges} value={this.state.expYear} placeholder="Card expiry year" />

        <label className="checkout__label" htmlFor="ccv">CCV</label>
        <input className="checkout__input" type="text" name="ccv" onChange={this.handleFormChanges} value={this.state.ccv} placeholder="CCV (3 digits)" />

        <button onClick={this.handleCaptureCheckout} className="checkout__btn-confirm">Confirm order</button>
      </form>
    );
  }

  renderCheckoutSummary() {
    const { cart } = this.props;

    if (!cart.line_items) {
      return 'Loading...';
    }

    return (
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
  }

  render() {
    return (
      <div className="checkout">
        <h2 className="checkout__heading">
          Checkout
        </h2>
        <div className="checkout__wrapper">
          { this.renderCheckoutForm() }
          { this.renderCheckoutSummary() }
        </div>
      </div>
    );
  }
}

export default Checkout;
