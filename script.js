// Terminal-style Portfolio JavaScript

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger?.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Typing Animation
class TypeWriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.speed / 2 : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing animation
const typingElement = document.querySelector('.typing-text');
if (typingElement) {
    const texts = JSON.parse(typingElement.getAttribute('data-texts') || '[]');
    if (texts.length > 0) {
        new TypeWriter(typingElement, texts, 100);
    }
}

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate counters
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (target && stat.textContent === '0') {
                    animateCounter(stat, target);
                }
            });

            // Animate skill bars
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                if (width && !bar.style.width) {
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                }
            });

            // Fade in sections
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinksElements = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Terminal command effect on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Code background animation
const codeLines = document.querySelectorAll('.code-line');
codeLines.forEach((line, index) => {
    line.style.animationDelay = `${index * 5}s`;
});

// Glitch effect on hover for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch 0.3s ease';
    });
});

// Add glitch animation
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
    }
`;
document.head.appendChild(style);

// Terminal-style cursor effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (cursor && e.target.closest('.hero-subtitle')) {
        // Cursor already in typing text
    }
});

// Console log easter egg
console.log('%c🚀 Welcome to the Terminal Portfolio!', 'color: #39ff14; font-size: 20px; font-weight: bold;');
console.log('%cBuilt by Sowmith Kuppa', 'color: #00ffff; font-size: 14px;');
console.log('%cType "help" for commands', 'color: #e6db74; font-size: 12px;');

// Terminal command handler (easter egg)
let commandHistory = [];
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const command = prompt('Terminal Command:');
        if (command) {
            handleCommand(command);
        }
    }
});

function handleCommand(cmd) {
    commandHistory.push(cmd);
    const lowerCmd = cmd.toLowerCase().trim();
    
    switch(lowerCmd) {
        case 'help':
            console.log('%cAvailable commands:', 'color: #39ff14; font-weight: bold;');
            console.log('  help - Show this help message');
            console.log('  clear - Clear console');
            console.log('  about - About the developer');
            console.log('  skills - List technical skills');
            break;
        case 'clear':
            console.clear();
            break;
        case 'about':
            console.log('%cSowmith Kuppa - AI/ML Engineer', 'color: #00ffff; font-weight: bold;');
            console.log('AI Research Intern at Old Dominion University');
            console.log('Specializing in ML, MLOps, and Cloud Infrastructure');
            break;
        case 'skills':
            console.log('%cTechnical Skills:', 'color: #39ff14; font-weight: bold;');
            console.log('  • PyTorch, TensorFlow, RAG');
            console.log('  • GCP, Kubernetes, Docker');
            console.log('  • Terraform, Ansible, Jenkins');
            console.log('  • Python, Go, SQL, JavaScript');
            break;
        default:
            console.log(`%cCommand not found: ${cmd}`, 'color: #f92672;');
            console.log('Type "help" for available commands');
    }
}

// Parallax effect for code background
window.addEventListener('scroll', () => {
    const codeBackground = document.querySelector('.code-background');
    if (codeBackground) {
        const scrolled = window.pageYOffset;
        codeBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Initialize on load
window.addEventListener('load', () => {
    // Trigger initial animations
    document.body.style.opacity = '1';
    
    // Add loaded class for CSS transitions
    document.body.classList.add('loaded');
});
