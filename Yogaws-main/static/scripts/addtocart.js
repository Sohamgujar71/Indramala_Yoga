const product = [
    {
        id: 0,
        image: "/static/assets/meditation.webp",
        title: 'General Yoga',
        onlinePrice: 120,
        offlinePrice: 100,
        description: "1. Minor muscle excercise<br>2.Major muscle excercise<br>3. Sun/Moon Salutations<br>4. General Asanas<br>5. Pranayama<br>6. Bandha<br>7. Mudras<br>8. Shanti Path"
    },
    {
        id: 1,
        image: '/static/assets/advancedyoga.webp',
        title: 'Advance Yoga',
        onlinePrice: 60,
        offlinePrice: 50,
        description: '1. Minor muscle excercise<br>2.Major muscle excercise<br>3. Sun/Moon Salutations<br>4. Advanced Asanas<br>5. Hatha Yoga<br>6. Power Yoga<br>7. Vinyasa<br>8. Tratak<br>9. Bandha<br>10. Mudras <br>11. Deep Breathing<br>12. Yog Nidra<br>13. Meditation<br>14. Shata Karma<br>15. Shanti Path'
    },
    {
        id: 2,
        image: '/static/assets/pranayam.webp',
        title: 'Pranayam',
        onlinePrice: 230,
        offlinePrice: 200,
        description: '1. Anulom-Vilom<br>2.Surya Bhedi<br>3. Chandra Bhedi<br>4. Bhastrika<br>5. Bhramari<br>6. Ujjayi<br>7. Kapal Bhati'
    },
    {
        id: 3,
        image: '/static/assets/kidsyoga.webp',
        title: 'Kids Yoga',
        onlinePrice: 100,
        offlinePrice: 80,
        description: 'Yoga practice appropriate for kids'
    },
    {
        id: 4,
        image: '/static/assets/medicalyoga.webp',
        title: 'Medical Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'Yoga practice appropriate for people with medical issues'
    },
    {
        id: 5,
        image: '/static/assets/poweryoga.webp',
        title: 'Yog Therapy',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'For people looking for a therapeutic experience in their Yoga practice'
    },
    {
        id: 6,
        image: '/static/assets/weightlossyoga.webp',
        title: 'Weight Loss Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'Yoga practice suitable for weight loss'
    },
    {
        id: 7,
        image: '/static/assets/aerialyoga.webp',
        title: 'Aerial Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'Yoga practice using silk fabric in a hanging fashion,<br>useful for icreasing core stability'
    },
    {
        id: 8,
        image: '/static/assets/pregnancyyoga.webp',
        title: 'Prenatal Yoga',
        onlinePrice: 230,
        offlinePrice: 200,
        description: 'Yoga appropriate for the soon to be mothers'
    }
];

const categories = [...new Set(product.map((item) => item))];
let i = 0;
let isOnlineMode = false; // Default mode

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

function updateClassFrequencyOptions() {
    const paymentManner = document.getElementById('payment-manner').value;
    const classFrequencyDropdown = document.getElementById('class-frequency');
    const monthlyclassFrequencyDropdown = document.getElementById('month-frequency');

    if (paymentManner === 'monthly') {
        // Disable class frequency dropdown and enable monthly frequency dropdown
        classFrequencyDropdown.disabled = true;
        classFrequencyDropdown.innerHTML = ''; // Clear options
        
        monthlyclassFrequencyDropdown.disabled = false;
        monthlyclassFrequencyDropdown.innerHTML = `
            <option value="4-sessions">4-sessions</option>
            <option value="8-sessions">8-sessions</option>
            <option value="12-sessions">12-sessions</option>
        `;
    } else {
        // Enable class frequency dropdown and disable monthly frequency dropdown
        classFrequencyDropdown.disabled = false;
        classFrequencyDropdown.innerHTML = `
            <option value="regular">Regular</option>
            <option value="alternate">Alternate</option>
        `;
        
        monthlyclassFrequencyDropdown.disabled = true;
        monthlyclassFrequencyDropdown.innerHTML = ''; // Clear options
    }
}
