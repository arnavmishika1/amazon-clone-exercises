import { calculateCartQuantity, cart, removeFromCart, updateQuantity, updateDeliveryOption } from '../../data/cart.js';
import { getProduct, products } from '../../data/products.js';
import { currencyFormat } from '../utility/money.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../data/deliveryOption.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

export function renderOrderSummary() {
  let cartSummaryHTML = ''

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    // const today = dayjs();
    // const deliveryDate = today.add(
    //   deliveryOption.deliveryDays,
    //   'days'
    // );
    // const stringDate = deliveryDate.format('dddd, MMMM, D');
    const stringDate = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${stringDate}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name js-product-name-${matchingProduct.id}">
              ${matchingProduct.name}
            </div>
            <div class="product-price js-product-price-${matchingProduct.id}">
              $${currencyFormat(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-quantity-link"
                data-product-id="${cartItem.productId}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-quantity-link"
                data-product-id="${cartItem.productId}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-quantity-link
                js-delete-link-${matchingProduct.id}"
                data-product-id="${cartItem.productId}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `
  });

  function deliveryOptionHTML(matchingProduct, cartItem) {
    let html = '';
    
    deliveryOptions.forEach((option) => {
      // const today = dayjs();
      // const deliveryDate = today.add(
      //   option.deliveryDays,
      //   'days'
      // );
      // const dateString = deliveryDate.format('dddd, MMMM D');
      const dateString = calculateDeliveryDate(option);

      const shippingPrice = option.priceCents === 0
      ? 'FREE'
      : `$${currencyFormat(option.priceCents)} -`;

      const isChecked = cartItem.deliveryOptionId === option.id;

      html += `
        <div class="delivery-option js-delivery-option
          js-delivery-option-${matchingProduct.id}-${option.id}"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${option.id}"
          >
          <input type="radio" 
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input
            js-delivery-option-input-${matchingProduct.id}-${option.id}"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${shippingPrice} Shipping
            </div>
          </div>
        </div>
      `;
    });

    

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        // const container = document.querySelector(`.js-cart-item-container-${productId}`);
        // container.remove();

        renderOrderSummary();

        // updateCartQuantity();
        renderCheckoutHeader();

        // update payment summary
        renderPaymentSummary();
      });
    });

  // function updateCartQuantity(){
  //   const cartQuantity = calculateCartQuantity();
  //   document.querySelector('.js-return-to-home-link')
  //     .innerHTML = `${cartQuantity} items`;
  // }

  // updateCartQuantity();
  renderCheckoutHeader();


  document.querySelectorAll('.js-update-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(`.js-cart-item-container-${productId}`);

        container.classList.add('is-editing-quantity');
      });
    });

  document.querySelectorAll('.js-save-quantity-link')
    .forEach((link) => {
      const productId = link.dataset.productId;
      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

      link.addEventListener('click', () => {
        handleSaveQuantity(productId, quantityInput);

        // update payment summary
        renderPaymentSummary();
      });

      quantityInput.addEventListener('keydown', (event) => {
        if(event.key === 'Enter') {
          handleSaveQuantity(productId, quantityInput);

        // update payment summary
        renderPaymentSummary();
        }
      });
    });

  function handleSaveQuantity(productId, quantityInput) {
    const newQuantity = Number(quantityInput.value);

    if(newQuantity < 0 || newQuantity >= 1000) {
      alert('Quantity must be at least 0 and less than 1000');
      return;
    }
    updateQuantity(productId, newQuantity);

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.remove('is-editing-quantity');

    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

    quantityLabel.innerHTML = newQuantity;

    // updateCartQuantity();
    renderCheckoutHeader();
  }

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();

        // update payment summary
        renderPaymentSummary();
      });
    });
}