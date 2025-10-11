import {cart } from '../../data/cart-class.js';
import { getDeliveryOption } from '../../data/deliveryOption.js';
import { addOrder } from '../../data/orders.js';
import { getProduct } from '../../data/products.js';
import { currencyFormat } from '../utility/money.js';

export function renderPaymentSummary() {
  let itemsPriceCents = 0;
  let shippingPriceCents = 0;

  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    itemsPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = itemsPriceCents + shippingPriceCents;

  const taxCents = totalBeforeTaxCents * 0.1; // 10%
  const totalPriceCents = totalBeforeTaxCents + taxCents;
  
  const cartQuantity = cart.calculateCartQuantity();

  let paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">
        $${currencyFormat(itemsPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-payment-summary-shipping">
        $${currencyFormat(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${currencyFormat(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${currencyFormat(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-payment-summary-total">
        $${currencyFormat(totalPriceCents)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;
  
  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });
        
        const order = await response.json();
        addOrder(order);
      } catch(error) {
        console.log('Unexpected error. Try again later.');
      }

      window.location.href = 'orders.html';
    });
}