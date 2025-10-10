import {validDeliveryOption} from './deliveryOption.js';

class Cart {
  cartItems;
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));

    if(!this.cartItems) {
      this.cartItems = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }]; // export module
    }
  }

  addToCart(productId, quantity) {
    // matching item
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if(productId === cartItem.productId){
        matchingItem = cartItem;
      }
    });

    // add to cart
    if(matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        // productId: productId,
        // quantity: quantity
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }

    this.saveToStorage();
  }

  displayCartMessage(addedMessageTimeoutId, productId) {
    // added message
    const addedElement = document.querySelector(`.js-added-to-cart-${productId}`);
    addedElement.classList.add('added-to-cart-display');
    // disappear message after 2 seconds
    setTimeout(() => {
      // Check if a previous timeoutId exists. If it does,
      // we will stop it.
      if(addedMessageTimeoutId) {
        clearTimeout(addedMessageTimeoutId)
      }

      const timeoutId = setTimeout(() => {
        addedElement.classList.remove('added-to-cart-display');
      }, 2000);
      
      // Save the timeoutId so we can stop it later.
      addedMessageTimeoutId = timeoutId;
    });
  }

  removeFromCart(productId) {
    let newCart = [];

    this.cartItems.forEach((cartItem) => {
      if(cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });

    this.cartItems = newCart;
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  calculateCartQuantity() {
    // update quantity in cart
    let cartQuantity = 0;
    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
  }

  updateQuantity(productId, newQuantity) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if(cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });

    matchingItem.quantity = newQuantity;
    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if(productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if(!matchingItem) {
      return;
    }
    
    if (!validDeliveryOption(deliveryOptionId)) {
      return;
    }

    matchingItem.deliveryOptionId = deliveryOptionId;

    this.saveToStorage();
  }
}

export const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

console.log(cart);
console.log(businessCart);

console.log(businessCart instanceof Cart);

