// Mobile Navigation Toggle
document.querySelector('.nav-toggle').addEventListener('click', () => {
    document.querySelector('nav ul').classList.toggle('active');
});
// --- NAVBAR TOGGLE FOR MOBILE (OPTIONAL) ---
document.addEventListener('DOMContentLoaded', function() {
    var navToggle = document.querySelector('.nav-toggle');
    var navUl = document.querySelector('#main-nav ul');
    if(navToggle && navUl){
        navToggle.addEventListener('click', function() {
            navUl.classList.toggle('active');
        });
    }

    // --- IMAGE SLIDER CODE ---
    const slides = document.querySelectorAll('.slider-img');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let current = 0;

    function showSlide(idx) {
        slides.forEach((img, i) => {
            img.classList.toggle('active', i === idx);
        });
    }

    if (prevBtn && nextBtn && slides.length > 0) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            current = (current - 1 + slides.length) % slides.length;
            showSlide(current);
        });
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            current = (current + 1) % slides.length;
            showSlide(current);
        });
        // Also click image to advance
        slides.forEach(img => {
            img.addEventListener('click', () => {
                current = (current + 1) % slides.length;
                showSlide(current);
            });
        });
    }
});