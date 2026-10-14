
const products = [
  { id: 1, name: "Класичний бургер", category: "burger",
    price: 149, emoji: "🍔", description: "Яловичина, сир, салат і соус" },
  { id: 2, name: "Чізбургер", category: "burger",
    price: 169, emoji: "🍔", description: "Подвійний сир і соковита котлета" },
  { id: 3, name: "Пепероні", category: "pizza",
    price: 229, emoji: "🍕", description: "Сир, томатний соус і пепероні" },
  { id: 4, name: "Чотири сири", category: "pizza",
    price: 249, emoji: "🍕", description: "Піца з чотирма видами сиру" },
  { id: 5, name: "Кола", category: "drink",
    price: 45, emoji: "🥤", description: "Холодний газований напій" },
  { id: 6, name: "Кава", category: "drink",
    price: 55, emoji: "☕", description: "Ароматна гаряча кава" },
  { id: 7, name: "Пончик", category: "dessert",
    price: 65, emoji: "🍩", description: "Солодкий пончик із глазур'ю" },
  { id: 8, name: "Морозиво", category: "dessert",
    price: 75, emoji: "🍦", description: "Ніжне вершкове морозиво" }
];

let cart = [];
let currentCategory = "all";

const productsBox = document.getElementById("products");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalElement = document.getElementById("total");
const orderForm = document.getElementById("order-form");
const orderMessage = document.getElementById("order-message");

function renderProducts() {
  const filtered = products.filter(product =>
    currentCategory === "all" ||
    product.category === currentCategory
  );

  productsBox.innerHTML = filtered.map(product => `
    <article class="product">
      <div class="product-image">${product.emoji}</div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-bottom">
        <span class="price">${product.price} грн</span>
        <button class="add-btn" data-add="${product.id}">
          + Додати
        </button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = count;
  totalElement.textContent = total;

  if (cart.length === 0) {
    cartItems.textContent = "Кошик поки порожній";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <b>${item.emoji} ${item.name}</b><br>
        ${item.price} грн × ${item.quantity}
      </div>
      <div>
        <button data-minus="${item.id}">−</button>
        <button data-plus="${item.id}">+</button>
        <button data-remove="${item.id}">🗑️</button>
      </div>
    </div>
  `).join("");
}

productsBox.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const product = products.find(
    item => item.id === Number(button.dataset.add)
  );

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  orderMessage.textContent = "";
  renderCart();
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(
    button.dataset.minus ??
    button.dataset.plus ??
    button.dataset.remove
  );

  const item = cart.find(item => item.id === id);
  if (!item) return;

  if (button.hasAttribute("data-plus")) {
    item.quantity++;
  }

  if (button.hasAttribute("data-minus")) {
    item.quantity--;
  }

  if (
    button.hasAttribute("data-remove") ||
    item.quantity <= 0
  ) {
    cart = cart.filter(item => item.id !== id);
  }

  renderCart();
});

document.querySelector(".filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  currentCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

orderForm.addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) {
    orderMessage.textContent = "Спочатку додай товари в кошик!";
    return;
  }

  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const address = document.getElementById("customer-address").value.trim();

  if (!name || !phone || !address) {
    orderMessage.textContent = "Заповни всі поля!";
    return;
  }

  const orderTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  orderMessage.textContent =
    `Дякуємо, ${name}! Замовлення №${orderNumber}. ` +
    `Сума: ${orderTotal} грн. Це демо — замовлення не відправлено.`;

  cart = [];
  renderCart();
  orderForm.reset();
});

renderProducts();
renderCart();
