function scrollHeader() {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) header.classList.add('scroll-header');
}

window.addEventListener('scroll', scrollHeader);

document.addEventListener('DOMContentLoaded', function () {
    var swiperPopular = new Swiper(".popular__container", {
        spaceBetween:32,
        grabCursor:true,
        centeredSlides:true,
        slidesPerview:'auto',
        loop:true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
});