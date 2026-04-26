let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let autoPlayTimer = setInterval(() => moveSlide(1), 5000);

function moveSlide(direction) {
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    document.getElementById('slider').style.transform =
        `translateX(-${currentSlide * 100}vw)`;
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => moveSlide(1), 5000);
}

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Animation for section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    const projectCards = document.querySelectorAll('.project-card');
    const aboutParagraphs = document.querySelectorAll('.about-content p');
    const contactMethods = document.querySelectorAll('.contact-method');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    sectionTitles.forEach(title => {
        observer.observe(title);
    });
    
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
    
    aboutParagraphs.forEach((paragraph, index) => {
        paragraph.style.animationDelay = `${index * 0.2}s`;
        observer.observe(paragraph);
    });
    
    contactMethods.forEach((method, index) => {
        method.style.animationDelay = `${index * 0.2}s`;
        observer.observe(method);
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        });
    });
});