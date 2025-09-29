export let cart = [{
  productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
  quantity: 2
}, {
  productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
  quantity: 1
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
  console.log(cart);
}