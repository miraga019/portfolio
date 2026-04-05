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

// HTML'deki sıraya göre index:
// 0  → work-1  (GameKings)
// 1  → work-2  (Halcyon Watches)
// 2  → work-3  (John Lowry Photography)
// 3  → work-4  (Whole Soybean Salad)
// 4  → work-5  (TruPoint)
// 5  → work-6  (Makolli)
// 6  → work-7  (Seafood)
// 7  → work-8  (Data Wave)
// 8  → work-9  (Thrills)
// 9  → work-10 (Be Right Burger)
// 10 → work-11 (Berry Company)
// 11 → work-12 (Globtag)
// 12 → work-13 (Boost Studios)
// 13 → work-14 (Oisix label)

const mockups = {
    0:  ['./assets/work-1.png'],
    1:  ['./assets/work-2.png'],
    2:  ['./assets/work-3.png'],
    3:  ['./assets/work-15.png', './assets/work-15-2.png'],
    4:  ['./assets/work-5.png', './assets/work-5-2.png'], 
    5:  ['./assets/work-6.png', './assets/work-6-2.png'],
    6:  ['./assets/work-7.png'],
    7:  ['./assets/work-8.png'],
    8:  ['./assets/work-9.png', './assets/work-9-2.png', './assets/work-9-3.png'],
    9:  ['./assets/work-10.png', './assets/brb.mp4'],
    10: ['./assets/work-17.png', './assets/work-17-2.png'],
    11: ['./assets/work-12.png', './assets/work-12-2.png', './assets/work-12-3.png'],
    12: ['./assets/work-13.jpg'],
    13: ['./assets/work-14.png'],
    14: ['./assets/work-4.png'],
    15: ['./assets/work-16.png', './assets/work-16-2.png'],
    16: ['./assets/work-11.png', './assets/work-11-2.png', './assets/work-11-3.png'],
    17: ['./assets/work-18.png', './assets/work-18-2.png'],
    18: ['./assets/work-19.png'],
    19: ['./assets/work-20.png'],
    20: ['./assets/work-21.png'],
    21: ['./assets/work-22.png'],
    22: ['./assets/work-23.png', './assets/work-23-2.png', './assets/work-23-3.png'],
    23: ['./assets/work-24.png', './assets/work-24-2.png'],
    24: ['./assets/work-25.png'],
    25: ['./assets/work-26.png', './assets/work-26-2.png', './assets/work-26-3.png', './assets/work-26-4.png'],
    26: ['./assets/work-27.jpg', './assets/work-27-2.jpg', './assets/work-27-3.jpg', './assets/work-27-4.jpg', './assets/work-27-5.jpg', './assets/work-27-6.jpg', './assets/work-27-7.jpg', './assets/work-27-8.jpg', './assets/work-27-9.jpg', './assets/work-27-10.jpg', './assets/work-27-11.jpg', './assets/work-27-12.jpg'],
    27: ['./assets/work-28.jpg', './assets/work-28-2.jpg', './assets/work-28-3.jpg', './assets/work-28-4.jpg', './assets/work-28-5.jpg', './assets/work-28-6.jpg', './assets/work-28-7.jpg', './assets/work-28-8.jpg', './assets/work-28-9.jpg', './assets/work-28-10.jpg', './assets/work-28-11.jpg', './assets/work-28-12.jpg', './assets/work-28-13.jpg', './assets/work-28-14.jpg'],
    28: ['./assets/work-30.png', './assets/work-30-2.png', './assets/work-30-3.png', './assets/work-30-4.png', './assets/work-30-5.png'],
    29: ['./assets/work-29.jpg', './assets/work-29-2.jpg', './assets/work-29-3.jpg'],
    30: ['./assets/work-31.png', './assets/work-31-1.png', './assets/work-31-2.png'],
    31: ['./assets/work-32.jpg', './assets/work-32-2.jpg', './assets/work-32-3.jpg'],
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

function isVideo(src) {
    return /\.(mp4|webm|mov)$/i.test(src);
}

function renderSlides() {
    lbSlides.innerHTML = '';
    lbDots.innerHTML = '';

    slides.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'lb-slide' + (i === currentSlide ? ' active' : '');

        if (isVideo(src)) {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.style.cssText = 'width:100%;height:100%;object-fit:contain;';
            slide.appendChild(video);
        } else {
            slide.style.backgroundImage = `url('${src}')`;
        }

        lbSlides.appendChild(slide);

        const dot = document.createElement('button');
        dot.className = 'lb-dot' + (i === currentSlide ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        lbDots.appendChild(dot);
    });

    document.querySelector('.lb-prev').style.display = slides.length > 1 ? 'flex' : 'none';
    document.querySelector('.lb-next').style.display = slides.length > 1 ? 'flex' : 'none';
}

function goToSlide(n) {
    const allSlides = document.querySelectorAll('.lb-slide');
    const allDots = document.querySelectorAll('.lb-dot');

    const currentVideo = allSlides[currentSlide]?.querySelector('video');
    if (currentVideo) currentVideo.pause();

    allSlides[currentSlide]?.classList.remove('active');
    allDots[currentSlide]?.classList.remove('active');

    currentSlide = (n + slides.length) % slides.length;

    allSlides[currentSlide]?.classList.add('active');
    allDots[currentSlide]?.classList.add('active');

    const nextVideo = allSlides[currentSlide]?.querySelector('video');
    if (nextVideo) nextVideo.play();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function closeLightbox() {
    document.querySelectorAll('.lb-slide video').forEach(v => v.pause());
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
