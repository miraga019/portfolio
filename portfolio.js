// =====================
// THEME
// =====================
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
});

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// =====================
// MOBILE MENU
// =====================
function openMenu() {
    document.getElementById('mobileMenu').classList.add('open');
}
function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
}

// =====================
// FILTER
// =====================
const filterBtns = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        items.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
                item.style.animation = 'fadeIn 0.4s ease forwards';
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// =====================
// LIGHTBOX
// =====================
const lightbox = document.getElementById('lightbox');
const lbSlides = document.getElementById('lbSlides');
const lbTitle = document.getElementById('lbTitle');
const lbDesc = document.getElementById('lbDesc');
const lbCat = document.getElementById('lbCat');
const lbDots = document.getElementById('lbDots');

let currentSlide = 0;
let slides = [];

// mockup images per item — extend as needed
const mockups = {
    0: ['./assets/work-1.png'],
    1: ['./assets/work-2.png'],
    2: ['./assets/work-3.png'],
    3: ['./assets/work-4.png'],
    4: ['./assets/work-5.png', './assets/work-5-2.png'],
    5: ['./assets/work-6.png', './assets/work-6-2.png'],
    6: ['./assets/work-7.png'],
    7: ['./assets/work-8.png'],
    8: ['./assets/work-9.png', './assets/work-9-2.png', './assets/work-9-3.png'],
};

items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(item, index));
});

function openLightbox(item, index) {
    const images = mockups[index] || [item.querySelector('.item-img').style.backgroundImage.replace(/url\(["']?(.+?)["']?\)/, '$1')];

    slides = images;
    currentSlide = 0;

    lbTitle.textContent = item.dataset.title;
    lbDesc.textContent = item.dataset.desc;
    lbCat.textContent = item.dataset.category.toUpperCase();

    renderSlides();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function renderSlides() {
    lbSlides.innerHTML = '';
    lbDots.innerHTML = '';

    slides.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'lb-slide' + (i === currentSlide ? ' active' : '');
        slide.style.backgroundImage = `url('${src}')`;
        lbSlides.appendChild(slide);

        const dot = document.createElement('button');
        dot.className = 'lb-dot' + (i === currentSlide ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        lbDots.appendChild(dot);
    });

    // show/hide arrows
    document.querySelector('.lb-prev').style.display = slides.length > 1 ? 'flex' : 'none';
    document.querySelector('.lb-next').style.display = slides.length > 1 ? 'flex' : 'none';
}

function goToSlide(n) {
    document.querySelectorAll('.lb-slide')[currentSlide]?.classList.remove('active');
    document.querySelectorAll('.lb-dot')[currentSlide]?.classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    document.querySelectorAll('.lb-slide')[currentSlide]?.classList.add('active');
    document.querySelectorAll('.lb-dot')[currentSlide]?.classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

// Keyboard navigation
document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') closeLightbox();
});

// =====================
// FADE IN ANIMATION
// =====================
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
}
.portfolio-item { animation: fadeIn 0.5s ease forwards; }
`;
document.head.appendChild(style);
