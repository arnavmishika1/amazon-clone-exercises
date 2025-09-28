let productHtml = '';

products.forEach((product) => {
  productHtml += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

document.querySelector('.js-products-grid').innerHTML = productHtml;

document.querySelectorAll('.js-add-to-cart-button')
  .forEach((button) => {

    let addedMessageTimeoutId;

    button.addEventListener('click', () => {
      // const productId = button.dataset.productId;
      // use destructuring
      const {productId} = button.dataset;

      // matching item
      let matchingItem;
      cart.forEach((item) => {
        if(productId === item.productId){
          matchingItem = item;
        }
      });

      // add quantity selector feature:
      const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantity = Number(quantitySelector.value);


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

      // reset the Quantity selector:
      quantitySelector.value = 1;

      // update quantity in cart
      let totalQuantity = 0;
      cart.forEach((item) => {
        totalQuantity += item.quantity;
      });

      document.querySelector('.js-cart-quantity').innerHTML = totalQuantity;

      console.log(cart);

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
    });
  });

