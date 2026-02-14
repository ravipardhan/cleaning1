/* Back to Top Button & Sticky Header */
const header = document.querySelector('header');
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        backToTopButton.classList.add('active');
    } else {
        header.classList.remove('scrolled');
        backToTopButton.classList.remove('active');
    }
}, { passive: true });


/* Mobile Menu */
function toggleMenu(){
    document.getElementById("nav-links").classList.toggle("active");
}

/* Counter Animation */
const counters = document.querySelectorAll('.counter');
const speed = 200; // The lower the #, the faster the count

const runCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const updateCount = () => {
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 10);
        } else {
            counter.innerText = target;
        }
    };
    updateCount();
};

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

/* Testimonial Slider */
const slider = document.querySelector('.testimonial-slider');
if (slider) {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

/* Scroll Reveal Animation */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});


/* Form Validation & Popup */
const successPopup = document.getElementById('success-popup');
const closePopupButton = document.querySelector('.close-popup');

if (closePopupButton) {
    closePopupButton.addEventListener('click', () => {
        successPopup.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target == successPopup) {
        successPopup.style.display = 'none';
    }
});

function showSuccessPopup(message) {
    const popupMessage = successPopup.querySelector('p');
    popupMessage.textContent = message;
    successPopup.style.display = 'flex';
}

function validateBookingForm() {
    const form = document.getElementById('booking-form');
    const dateInput = document.getElementById('booking-date');
    
    // Basic validation
    if (form.checkValidity()) {
        // Date validation: should not be in the past
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0,0,0,0); // Reset time part

        if (selectedDate < today) {
            alert('Please select a future date.');
            return false;
        }

        // Gather form data
        const serviceType = document.getElementById('service-type').value;
        const date = dateInput.value;
        const timeSlotElement = document.querySelector('input[name="time-slot"]:checked');
        const timeSlot = timeSlotElement ? timeSlotElement.value : 'Not selected';
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const imageInput = document.getElementById('reference-image');
        const hasImage = imageInput && imageInput.files.length > 0 ? 'Yes (Please attach in WhatsApp)' : 'No';

        // WhatsApp Integration
        const whatsAppNumber = '919662755375';
        const message = `*New Booking Request*\n\n` +
                        `*Service:* ${serviceType}\n` +
                        `*Date:* ${date}\n` +
                        `*Time:* ${timeSlot}\n` +
                        `*Name:* ${name}\n` +
                        `*Email:* ${email}\n` +
                        `*Phone:* ${phone}\n` +
                        `*Address:* ${address}\n` +
                        `*Reference Image:* ${hasImage}`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsAppUrl, '_blank');

        showSuccessPopup('Thank you! Please send the pre-filled message on WhatsApp to confirm your booking.');
        form.reset(); // Clear the form
    } else {
        // This will trigger browser's default validation messages
        form.reportValidity();
    }
    
    return false; // Prevent actual form submission
}

function validateContactForm() {
    const form = document.getElementById('contact-form');

    if (form.checkValidity()) {
        // Gather form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const messageText = document.getElementById('message').value;

        // WhatsApp Integration
        const whatsAppNumber = '919662755375';
        const message = `*New Contact Inquiry*\n\n` +
                        `*Name:* ${name}\n` +
                        `*Email:* ${email}\n` +
                        `*Subject:* ${subject}\n` +
                        `*Message:* ${messageText}`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsAppUrl, '_blank');

        showSuccessPopup('Thank you! Please send the message on WhatsApp to connect with us.');
        form.reset();
    } else {
        form.reportValidity();
    }

    return false; // Prevent actual form submission
}

/* Service Catalog Filter, Search, and WhatsApp Integration */
document.addEventListener('DOMContentLoaded', () => {
    const serviceGrid = document.querySelector('.service-grid');
    if (!serviceGrid) return; // Do nothing if the service grid is not on the page

    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('service-search');
    const serviceCards = document.querySelectorAll('.service-card');

    // --- Modal Logic ---
    const serviceModal = document.getElementById('service-detail-modal');
    if (serviceModal) {
        const closeModalBtn = serviceModal.querySelector('.close-modal');
        
        const closeServiceModal = () => {
            serviceModal.classList.remove('active');
            setTimeout(() => {
                serviceModal.style.display = 'none';
            }, 300);
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeServiceModal);
        
        window.addEventListener('click', (e) => {
            if (e.target === serviceModal) closeServiceModal();
        });
    }

    // --- Filter Functionality ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            serviceCards.forEach(card => {
                card.classList.add('hide'); // Hide all cards initially
                setTimeout(() => { // Use timeout for fade-out effect
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'flex';
                        setTimeout(() => card.classList.remove('hide'), 10); // Fade in
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // --- Search Functionality ---
    searchInput.addEventListener('keyup', () => {
        const searchTerm = searchInput.value.toLowerCase();
        serviceCards.forEach(card => {
            const serviceName = card.dataset.name.toLowerCase();
            if (serviceName.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // --- WhatsApp Booking Functionality ---
    serviceGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-whatsapp')) {
            const card = e.target.closest('.service-card');
            const serviceName = card.dataset.name;
            const servicePrice = card.dataset.price;
            const whatsAppNumber = '919662755375'; // Your WhatsApp number

            // Construct the message
            const message = `Hello Shyam Cleaning Service,\nI am interested in ${serviceName} (₹${servicePrice} onwards).\nPlease share available time slots and details.`;

            // Encode the message for the URL
            const encodedMessage = encodeURIComponent(message);

            // Create the WhatsApp URL
            const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;

            // Open WhatsApp in a new tab
            window.open(whatsAppUrl, '_blank');
        }

        // Bonus: "View Details" popup can be handled here
        if (e.target.classList.contains('btn-details') && e.target.tagName === 'BUTTON') {
            const card = e.target.closest('.service-card');
            const serviceName = card.dataset.name;
            const servicePrice = card.dataset.price;
            const imgSrc = card.querySelector('img').src;
            const description = card.querySelector('.card-content p').textContent;

            if (serviceModal) {
                document.getElementById('modal-service-name').textContent = serviceName;
                document.getElementById('modal-service-price').textContent = (servicePrice === '0' || servicePrice === 'Contact for Price') ? 'Contact for Price' : `₹${servicePrice} onwards`;
                document.getElementById('modal-service-img').src = imgSrc;
                document.getElementById('modal-service-desc').textContent = description;

                // Setup Book Button in Modal
                const modalBookBtn = document.getElementById('modal-book-btn');
                modalBookBtn.onclick = () => {
                     const whatsAppNumber = '919662755375';
                     const message = `Hello Shyam Cleaning Service,\nI am interested in ${serviceName} (₹${servicePrice} onwards).\nPlease share available time slots and details.`;
                     const encodedMessage = encodeURIComponent(message);
                     window.open(`https://wa.me/${whatsAppNumber}?text=${encodedMessage}`, '_blank');
                };

                serviceModal.style.display = 'flex';
                setTimeout(() => serviceModal.classList.add('active'), 10);
            } else {
                alert(`Showing details for: ${serviceName}`);
            }
        }
    });

    /* Make Service Request Section - WhatsApp Integration */
    const requestSection = document.querySelector('.make-request-section');
    if (requestSection) {
        requestSection.addEventListener('click', (e) => {
            const targetCard = e.target.closest('.large-card, .small-service-box');
            if (!targetCard) return;

            const serviceName = targetCard.dataset.service;
            if (!serviceName) return;

            const whatsAppNumber = '919662755375'; // Using the number from the footer
            const message = `Hello, I want to book ${serviceName} service. Please share details.`;
            const encodedMessage = encodeURIComponent(message);
            const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;

            window.open(whatsAppUrl, '_blank');
        });
    }
});