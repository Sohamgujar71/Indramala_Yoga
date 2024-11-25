const product = [
    {
        id: 0,
        image: "/static/assets/200.webp",
        title: 'YCB 200 hours',
        onlinePrice: 14999,
        offlinePrice: 19999,
    },
    {
        id: 1,
        image: '/static/assets/300.webp',
        title: 'YCB 300 hours',
        onlinePrice: 19999,
        offlinePrice: 29999,
    },
    {
        id: 2,
        image: '/static/assets/500.webp',
        title: 'YCB 300 hours',
        onlinePrice: 29999,
        offlinePrice: 39999,
    },
    {
        id: 3,
        image: '/static/assets/700.webp',
        title: 'YCB 700 hours',
        onlinePrice: 39999,
        offlinePrice: 49999,
    },
    {
        id: 4,
        image: '/static/assets/900.webp',
        title: 'YCB 900 hours',
        onlinePrice: 49999,
        offlinePrice: 59999,
    }
];

const categories = [...new Set(product.map((item) => item))];
let i = 0;

let isOnlineMode = true; // Default mode

document.getElementById('root').innerHTML = categories.map((item) => {
    var { image, title, onlinePrice, offlinePrice } = item;
    const price = isOnlineMode ? onlinePrice : offlinePrice;
    return (
        `<div class='box' id='product-${i}'>
            <div class='img-box'>
                <img class='images' src=${image}></img>
            </div>
            <div class='description-box' id='description-${i}'></div>
            <div class='bottom'>
                <p>${title}</p>
                <h2>Rs ${price}.00</h2>` +
                "<button onclick='addtocart(" + (i++) + ")'>Add to cart</button>" +
            `</div>
        </div>`
    );
}).join('');

categories.forEach((item, index) => {
    const productDiv = document.getElementById(`product-${index}`);
    const descriptionBox = document.getElementById(`description-${index}`);
    productDiv.addEventListener('mouseleave', function () {
        descriptionBox.style.height = '0';
        descriptionBox.innerHTML = '';
    });
});

var cart = [];

function addtocart(a) {
    let existingItem = cart.find(item => item.id === categories[a].id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...categories[a], quantity: 1 });
    }
    displaycart();
}

function updateQuantity(productId, change) {
    let itemIndex = cart.findIndex(item => item.id === productId); 
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity + change > 0) {
            cart[itemIndex].quantity += change; 
        } else {
            cart.splice(itemIndex, 1);
        }
        displaycart(); 
    }
}

function displaycart() {
    let total = 0;
    document.getElementById("count").innerHTML = cart.length;
    if (cart.length == 0) {
        document.getElementById('cartItem').innerHTML = "Your cart is empty";
        document.getElementById("total").innerHTML = "Rs " + 0 + ".00";
    } else {
        document.getElementById("cartItem").innerHTML = cart.map((item) => {
            var { id, image, title, price, quantity } = item;
            total += price * quantity;
            document.getElementById("total").innerHTML = "Rs " + total + ".00";
            return (
                `<div class='cart-item'>
                    <div class='row-img'>
                        <img class='rowimg' src=${image}>
                    </div>
                    <p style='font-size:12px;'>${title} x${quantity}</p>
                    <h2 style='font-size: 15px;'>Rs ${price * quantity}.00</h2>
                    <button class='qty-btn' onclick='updateQuantity(${id}, 1)'>+</button>
                    <button class='qty-btn' onclick='updateQuantity(${id}, -1)'>−</button>
                    <i class='fa-solid fa-trash' onclick='delElement(${id})'></i>
                </div>`
            );
        }).join('');
    }
}

function delElement(productId) {
    cart = cart.filter(item => item.id !== productId); // Remove the item with the matching ID
    displaycart();
}

document.getElementById('mode-toggle').addEventListener('change', function() {
    isOnlineMode = this.checked;
    document.getElementById('mode-status').textContent = isOnlineMode ? 'Online' : 'Offline';
    updatePrices();
});

function updatePrices() {
    categories.forEach((item, index) => {
        const priceElement = document.querySelector(`#product-${index} .bottom h2`);
        const price = isOnlineMode ? item.onlinePrice : item.offlinePrice;
        priceElement.textContent = `Rs ${price}.00`;
    });
}

// Call updatePrices initially to set the correct prices on page load
updatePrices();