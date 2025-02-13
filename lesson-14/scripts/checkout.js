import {cart, removeFromCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js'; // This loads the ESM module from the internet when we have naming conflicts.
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'; // we dont need brackets for dayjs. // The syntax is called "default export": another way of exporting from a file; only when we want to export one thing from a file. 
import {deliveryOption} from '../data/deliveryOptions.js';

hello(); // runs the function hello();
const today = dayjs(); // runs the function dayjs(); Gives us the object of the current day and time.
const deliveryDate = today.add(7, 'days'); // adds 7 days to the current date.
console.log(deliveryDate.format('dddd, MMMM YYYY')); // formats the current date. Thursday, February 2025



let cartSummaryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;

  let selectedDeliveryOption;

  deliveryOption.forEach((option) => {  // Change from deliveryOptions to deliveryOption
    if(option.id === deliveryOptionId) {
      selectedDeliveryOption = option;
    }
  });

  const today = dayjs(); // calls today's date
  const deliveryDate = today.add(
    selectedDeliveryOption.deliveryDays,
    'days'
  );
  const dateString = deliveryDate.format('dddd, MMMM D');

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
            <span class="update-quantity-link link-primary">Update</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)} <!-- Using this function -->
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOption.forEach((option) => {  // Again, update from deliveryOptions to deliveryOption
    const today = dayjs(); // calls today's date
    const deliveryDate = today.add(
      option.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = option.priceCents === 0
      ? 'FREE'
      : `$${formatCurrency(option.priceCents)} - `;

    const isChecked = option.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div>
    `;
  });

  return html;
}

document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
    });
  });