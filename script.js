const LINES = [
    { type: 'cmd',    text: 'whoami' },
    { type: 'output', text: 'Rio Sato' },
    { type: 'cmd',    text: 'cat role.txt' },
    { type: 'output', text: 'Aspiring Web Developer' },
    { type: 'output', text: 'Web × AI × 3D Technologies' },
    { type: 'cmd',    text: 'ls skills/' },
    { type: 'output', text: 'React  Node.js  Three.js  TypeScript  Python' },
];
const CHAR_DELAY = 40;
const LINE_PAUSE = 300;

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function runTerminal() {
    const body   = document.getElementById('terminal-body');
    const btn    = document.getElementById('hero-btn');
    const cursor = document.createElement('span');
    cursor.className = 't-cursor';
    body.appendChild(cursor);

    for (const line of LINES) {
        const span = document.createElement('span');
        body.insertBefore(span, cursor);

        if (line.type === 'cmd') {
            span.className = 't-line';
            span.innerHTML = '<span class="t-prompt">$ </span>';
            for (const ch of line.text) {
                span.innerHTML += ch;
                await sleep(CHAR_DELAY);
            }
        } else {
            span.className = 't-line t-output';
            span.textContent = line.text;
        }
        await sleep(LINE_PAUSE);
    }

    cursor.remove();
    btn.style.opacity = '1';
}

runTerminal();

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const sectionTitles  = document.querySelectorAll('.section-title');
    const projectCards   = document.querySelectorAll('.project-card');
    const aboutParagraphs = document.querySelectorAll('.about-content p');
    const contactMethods = document.querySelectorAll('.contact-method');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    sectionTitles.forEach(title => observer.observe(title));

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
            const targetElement = document.querySelector(this.getAttribute('href'));
            window.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
        });
    });
});
