const products = [
    {
        id: 1,
        name: "Nexia 3",
        price: 145000000,
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 2,
        name: "Gentra",
        price: 175000000,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 3,
        name: "Damas",
        price: 98000000,
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 4,
        name: "Nexia 2",
        price: 85000000,
        image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=85"
    }
];

let cart = [];

const cartOpen = document.getElementById("cartOpen");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const panelCount = document.getElementById("panelCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutModal = document.getElementById("checkoutModal");
const modalClose = document.getElementById("modalClose");
const checkoutForm = document.getElementById("checkoutForm");

function formatPrice(price) {
    return price.toLocaleString("en-US") + " UZS";
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function addToCart(id) {
    const product = products.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showToast(product.name + " added to your garage");
}

document.querySelectorAll(".order-button").forEach(button => {
    button.addEventListener("click", () => {
        addToCart(Number(button.dataset.id));
    });
});

function updateCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCount.textContent = count;
    panelCount.textContent = count;
    cartTotal.textContent = formatPrice(total);

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your garage is empty.</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)}</p>
                <div class="quantity">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join("");
}

function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(product => product.id !== id);
    updateCart();
    showToast("Car removed from your garage");
}

function toggleCart() {
    cartPanel.classList.toggle("show");
    cartOverlay.classList.toggle("show");
}

cartOpen.addEventListener("click", toggleCart);
cartClose.addEventListener("click", toggleCart);
cartOverlay.addEventListener("click", toggleCart);

const menuButton = document.getElementById("menuButton");
const navbar = document.getElementById("navbar");

menuButton.addEventListener("click", () => {
    navbar.classList.toggle("show");
});

document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("show");
    });
});

checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your garage is empty");
        return;
    }
    toggleCart();
    checkoutModal.classList.add("show");
});

modalClose.addEventListener("click", () => {
    checkoutModal.classList.remove("show");
});

checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove("show");
    }
});

checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("customerName").value;
    
    checkoutModal.classList.remove("show");
    cart = [];
    updateCart();
    checkoutForm.reset();
    showToast(`Thank you, ${name}! Car booking received.`);
});

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

const observerOptions = {
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            
            if (entry.target.querySelector(".counter")) {
                const counters = entry.target.querySelectorAll(".counter");
                counters.forEach(counter => {
                    const target = +counter.getAttribute("data-target");
                    let count = 0;
                    const speed = target / 30;
                    
                    const updateCount = () => {
                        count += speed;
                        if (count < target) {
                            counter.textContent = Math.ceil(count);
                            setTimeout(updateCount, 40);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    updateCount();
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});

const newsletterForm = document.getElementById("newsletterForm");
newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterForm.reset();
    showToast("Subscribed to CarZone updates!");
});

updateCart();   