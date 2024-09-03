document.addEventListener("DOMContentLoaded", function() {
  // Инициализация или загрузка корзины из localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || {};

  // Функция для обновления общей суммы корзины в хедере
  function updateCartTotalInHeader(total) {
      let cartTotalHeader = document.querySelector('.cart-total');
      if (cartTotalHeader) {
          cartTotalHeader.textContent = total.toFixed(2) + ' ₽';
      }
  }

  // Функция для обновления иконки с количеством товаров в корзине
  function updateCartIcon() {
      let cartCount = document.querySelector('.cart-count');
      let count = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
      cartCount.textContent = count;
  }

  // Функция для сохранения корзины в localStorage
  function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Функция для добавления товара в корзину
  function addToCart(name, price, image) {
      if (cart[name]) {
          cart[name].quantity++;
      } else {
          cart[name] = { price: price, quantity: 1, image: image };
      }
      updateCart();
      updateCartIcon();
      saveCart();
      updateCartTotalInHeader(getCartTotal());
  }

  // Функция для изменения количества товара
  function changeQuantity(item, change) {
      cart[item].quantity += change;
      if (cart[item].quantity <= 0) {
          delete cart[item];
      }
      updateCart();
      updateCartIcon();
      saveCart();
      updateCartTotalInHeader(getCartTotal());
  }

  // Функция для обновления отображения корзины
  function updateCart() {
      let cartItems = document.getElementById('cart-items');
      let cartTotal = document.querySelector('.cart-total');
      let cartTotalSummary = document.getElementById('cart-total');
      let bonusPoints = document.getElementById('bonus-points');

      if (cartItems && cartTotal && bonusPoints) {
          cartItems.innerHTML = '';
          let total = 0;

          for (let item in cart) {
              let itemTotal = cart[item].price * cart[item].quantity;
              total += itemTotal;

              let cartItem = document.createElement('div');
              cartItem.classList.add('cart-item');
              cartItem.innerHTML = `
                  <img src="${cart[item].image}" alt="${item}">
                  <div class="cart-item-info">
                      <p>${item}</p>
                      <div class="cart-item-quantity">
                          <button class="decrease-btn" data-item="${item}">-</button>
                          <input type="text" value="${cart[item].quantity}" readonly>
                          <button class="increase-btn" data-item="${item}">+</button>
                      </div>
                  </div>
                  <p class="cart-item-price">${itemTotal.toFixed(2)} ₽</p>
              `;
              cartItems.appendChild(cartItem);
          }

          cartTotal.textContent = total.toFixed(2) + ' ₽';
          if (cartTotalSummary) {
              cartTotalSummary.textContent = total.toFixed(2);
          }
          bonusPoints.textContent = Math.floor(total / 2);
      }

      // Добавляем обработчики для кнопок "-" и "+"
      let decreaseButtons = document.querySelectorAll('.decrease-btn');
      let increaseButtons = document.querySelectorAll('.increase-btn');

      decreaseButtons.forEach(button => {
          button.addEventListener('click', function() {
              let item = this.getAttribute('data-item');
              changeQuantity(item, -1);
          });
      });

      increaseButtons.forEach(button => {
          button.addEventListener('click', function() {
              let item = this.getAttribute('data-item');
              changeQuantity(item, 1);
          });
      });
  }

  // Функция для получения общей суммы корзины
  function getCartTotal() {
      let total = 0;
      for (let item in cart) {
          total += cart[item].price * cart[item].quantity;
      }
      return total;
  }

  // Инициализация состояния корзины при загрузке контента страницы
  updateCart();
  updateCartIcon();
  updateCartTotalInHeader(getCartTotal());

  // Обработчик событий для кнопок "В корзину" на странице каталога
  let addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
          let product = this.closest('.product-item');
          let name = product.querySelector('.product-name').textContent;
          let price = parseFloat(product.querySelector('.product-price').textContent);
          let image = this.getAttribute('data-image');
          addToCart(name, price, image);
      });
  });

  // Другой существующий код для операций с корзиной
  // ...

});