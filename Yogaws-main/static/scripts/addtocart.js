const product = [
    {
        id: 0,
        image: "/static/assets/meditation.webp",
        title: 'Meditation',
        onlinePrice: 120,
        offlinePrice: 100,
        description: 'A practice of focusing the mind and achieving a state of mental clarity and relaxation.'
    },
    {
        id: 1,
        image: '/static/assets/iyengaryoga.webp',
        title: 'Iyenger Yoga',
        onlinePrice: 60,
        offlinePrice: 50,
        description: 'A style of yoga that emphasizes precise alignment and the use of props to aid in achieving postures.'
    },
    {
        id: 2,
        image: '/static/assets/advancedyoga.webp',
        title: 'Advance Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'Yoga practice involving complex postures and techniques for experienced practitioners.'
    },
    {
        id: 3,
        image: '/static/assets/ashtangayoga.webp',
        title: 'Ashtanga Yoga',
        onlinePrice: 100,
        offlinePrice: 80,
        description: 'A dynamic style of yoga consisting of a set sequence of postures performed in a specific order with a focus on breath and movement.'
    },
    {
        id: 4,
        image: '/static/assets/competitveyoga.webp',
        title: 'Competitive Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'A practice where individuals perform yoga postures and sequences to compete in events based on technique and form.'
    },
    {
        id: 5,
        image: '/static/assets/poweryoga.webp',
        title: 'Power Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: ' A vigorous and fitness-oriented form of yoga that focuses on strength, flexibility, and endurance.'
    },
    {
        id: 6,
        image: '/static/assets/photos/fifteen.png',
        title: 'Weight Loss Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'A yoga practice designed to enhance metabolism and aid in weight management through various poses and sequences.'
    },
    {
        id: 7,
        image: '/static/assets/aerialyoga.webp',
        title: 'Aerial Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'A form of yoga performed with the aid of a suspended fabric hammock to support and enhance postures.'
    },
    {
        id: 8,
        image: '/static/assets/pregnancyyoga.webp',
        title: 'Pregnancy Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'Yoga tailored for expectant mothers to support physical and emotional well-being during pregnancy.'
    },
    {
        id: 9,
        image: '/static/assets/vinyasayoga.webp',
        title: 'Vinyasa Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'A style of yoga characterized by a flowing sequence of poses linked with the breath, creating a smooth and dynamic practice.'
    },
    {
        id: 10,
        image: '/static/assets/yogatherapy.webp',
        title: 'Yoga Therapy',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'A therapeutic approach to yoga that uses specific postures and techniques to address individual health concerns and promote overall well-being.'
    },
    {
        id: 11,
        image: '/static/assets/stressmanagement.webp',
        title: 'Stress Management',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'Techniques and practices designed to reduce and manage stress, often incorporating yoga, mindfulness, and relaxation methods.'
    },
    {
        id: 12,
        image: '/static/assets/kidsyoga.webp',
        title: 'Kids Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'Yoga designed for children, focusing on playful poses, movement, and relaxation to promote physical and emotional development.'
    },
    {
        id: 13,
        image: '/static/assets/hathayoga.webp',
        title: 'Hatha Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'A comprehensive form of yoga aimed at improving strength and flexibility.'
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

    const description = item.description;

    productDiv.addEventListener('mouseenter', function () {
        descriptionBox.innerHTML = `<div class="description-content">${description}</div>`;
        descriptionBox.style.height = '100px';
    });

    productDiv.addEventListener('mouseleave', function () {
        descriptionBox.style.height = '0';
        descriptionBox.innerHTML = '';
    });
});

var cart = [];
let selectedCourseNames = []; // Array to store selected course names

function addtocart(a) {
    let existingItem = cart.find(item => item.id === categories[a].id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...categories[a], quantity: 1 });
    }
    selectedCourseNames.push(categories[a].title); // Save course name to the array
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
            var { id, image, title, onlinePrice, offlinePrice, quantity } = item;
            const price = isOnlineMode ? onlinePrice : offlinePrice;
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
    displaycart(); // Update cart prices as well
}

// Call updatePrices initially to set the correct prices on page load
updatePrices();

function submitPayment() {
    // Print the selected course names to the console
    console.log("Selected Courses:", selectedCourseNames);

    // Get the total amount from the h2 element
    const totalElement = document.getElementById("total");
    const totalText = totalElement.textContent;
    const amount = parseFloat(totalText.replace("Rs", "").trim()) * 100; // Convert to paisa

    if (amount <= 0) {
        alert("Total amount must be greater than 0!");
        return;
    }

    // Make a POST request to your Flask backend with the amount and course names
    fetch('/create_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount, courses: selectedCourseNames }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to the payment page with the order ID
            window.location.href = `/pay?order_id=${data.order_id}`;
        } else {
            alert("Order creation failed. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while creating the order.");
    });
}