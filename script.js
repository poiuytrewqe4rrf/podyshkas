// Функція пошуку товарів
function searchProducts(event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки при відправці форми

    let query = document.querySelector('#searchForm input').value.toLowerCase();
    let productsList = document.querySelector('.products-list');
    productsList.innerHTML = ''; // Очищуємо список товарів

    // Відображаємо товари на сторінці
    getProducts().then(function (products) {
        let foundProducts = 0; // Лічильник знайдених товарів
        let productsList = document.querySelector('.products-list');

        products.forEach(function (product) {
            if (product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)) {
                productsList.innerHTML += getCardHTML(product);
                foundProducts++; // Збільшуємо лічильник при знаходженні товару
            }
        });

        // Якщо не знайдено жодного товару, показуємо alert
        if (foundProducts === 0) {
            alert("Такої подушки ще на жаль немає 💢💢💢");
        }

        // Отримуємо всі кнопки "Купити" на сторінці
        let buyButtons = document.querySelectorAll('.products-list .cart-btn');
        // Навішуємо обробник подій на кожну кнопку "Купити"
        if (buyButtons) {
            buyButtons.forEach(function (button) {
                button.addEventListener('click', addToCart);
            });
        }
    });
}

// Навішуємо обробник подій на форму пошуку
let searchForm = document.querySelector('#searchForm');
searchForm.addEventListener('submit', searchProducts);


// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';');

    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Видаляємо зайві пробіли

        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1); // +1 для пропуску символу "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна повернути null
    return '';
}

let themeBtn = document.querySelector("#themeToggle")

function setTheme(theme) {
    if (theme == 'light') {
        document.body.classList.add("light-theme");
        themeBtn.innerHTML = '<i class="bi bi-moon"></i>';
    } else {
        document.body.classList.remove("light-theme");
        themeBtn.innerHTML = '<i class="bi bi-brightness-high"></i>';
    }
}

let theme = getCookieValue('theme')
setTheme(theme)

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle('light-theme'); // Перемикаємо клас теми
    if (theme == 'light') {
        theme = 'dark'
    } else {
        theme = 'light'
    }
    setTheme(theme)
    // Зберігаємо JSON рядок у кукі
    document.cookie = `theme=${theme}; max-age=${60 * 60 * 24 * 7}; path=/`;
}) 

// Очікуємо завантаження сторінки
document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо всі написи для анімації
    const textElements = document.querySelectorAll('.fade-in-text');

    // Додаємо клас "show" для запуску анімації
    textElements.forEach(element => {
        element.classList.add('show');
    });
});


// Отримуємо дані про товари з JSON файлу
async function getProducts() {
    let response = await fetch("store_db.json");
    let products = await response.json();
    return products;
};

// Генеруємо HTML-код для карточки товару
function getCardHTML(product) {
    // Створюємо JSON-строку з даними про товар і зберігаємо її в data-атрибуті
    let productData = JSON.stringify(product)

    return `
        <div class="my-card" style="">
            <img src="${product.image}">
            <h5 class="card-title">${product.title}</h5>
            <p class="description-card">
            ${product.description}
            </p>
            <p class="price-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-currency-hryvnia"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a2.64 2.64 0 0 1 2.562 -2h3.376a2.64 2.64 0 0 1 2.562 2a2.57 2.57 0 0 1 -1.344 2.922l-5.876 2.938a3.338 3.338 0 0 0 -1.78 3.64a3.11 3.11 0 0 0 3.05 2.5h2.888a2.64 2.64 0 0 0 2.562 -2" /><path d="M6 10h12" /><path d="M6 14h12" /></svg>
            ${product.price}
           </p>
            <button type="button" class="cart-btn" data-product='${productData}'>
            <svg class="bell" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12.5 17h-6.5v-14h-2" /><path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
            Купити</button>
        </div>
    `;
}

// Відображаємо товари на сторінці
getProducts().then(function (products) {
    let productsList = document.querySelector('.products-list')
    if (productsList) {
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product)
        })
    }

    // Отримуємо всі кнопки "Купити" на сторінці
    let buyButtons = document.querySelectorAll('.products-list .cart-btn');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    }
})


// Отримуємо кнопку "Кошик"
const cartBtn = document.getElementById('cartBtn')

// Навішуємо обробник подій на клік кнопки "Кошик"
cartBtn.addEventListener("click", function () {
    // Переходимо на сторінку кошика
    window.location.assign('cart.html')
})



// Створення класу кошика
class ShoppingCart {
    constructor() {
        this.items = {};
        this.cartCounter = document.querySelector('.cart-counter');// отримуємо лічильник кількості товарів у кошику
        this.cartElement = document.querySelector('#cart-items'); 
        this.loadCartFromCookies(); // завантажуємо з кукі-файлів раніше додані в кошик товари
    }

    // Додавання товару до кошика
    addItem(item) {
        if (this.items[item.title]) {
            this.items[item.title].quantity += 1; // Якщо товар вже є, збільшуємо його кількість на одиницю
        } else {
            this.items[item.title] = item; // Якщо товару немає в кошику, додаємо його
            this.items[item.title].quantity = 1;
        }
        this.updateCounter(); // Оновлюємо лічильник товарів
        this.saveCartToCookies();
    }

    // Зміна кількості товарів товарів
    updateQuantity(itemTitle, newQuantity) {
        if (this.items[itemTitle]) {
            this.items[itemTitle].quantity = newQuantity;
            if (this.items[itemTitle].quantity == 0) {
                delete this.items[itemTitle];
            }
            this.updateCounter();
            this.saveCartToCookies();
        }
    }

    // Оновлення лічильника товарів
    updateCounter() {
        let count = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            count += this.items[key].quantity; // рахуємо кількість усіх товарів
        }
        this.cartCounter.innerHTML = count; // оновлюємо лічильник на сторінці
    }

    // Зберігання кошика в кукі
    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    // Завантаження кошика з кукі
    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
            this.updateCounter();
        }
    }
    // Обчислення загальної вартості товарів у кошику
    calculateTotal() {
        let total = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            total += this.items[key].price * this.items[key].quantity; // рахуємо вартість усіх товарів
        }
        return total;
    }
}

// Створення об'єкта кошика 
let cart = new ShoppingCart();


// Функція для додавання товару до кошика при кліку на кнопку "Купити"
function addToCart(event) {
    // Отримуємо дані про товар з data-атрибута кнопки
    const productData = event.target.getAttribute('data-product');
    const product = JSON.parse(productData);

    // Додаємо товар до кошика
    cart.addItem(product);
    console.log(cart);
}

