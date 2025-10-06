export let cart = JSON.parse(localStorage.getItem('cart')) || [{
  productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
  quantity: 2,
  deliveryOptionId: '1'
}, {
  productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
  quantity: 1,
  deliveryOptionId: '2'
}];

export function addToCart(productId, quantity) {
  // matching item
  let matchingItem;
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });

  // add to cart
  if(matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      // productId: productId,
      // quantity: quantity
      productId,
      quantity
    });
  }

  saveToStorage();
}

export function displayCartMessage(addedMessageTimeoutId, productId) {
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

export function removeFromCart(productId) {
  let newCart = [];

  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function calculateCartQuantity() {
  // update quantity in cart
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if(cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;
  saveToStorage();
}