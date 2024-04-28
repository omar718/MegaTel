function scrollHeader() {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) header.classList.add('scroll-header');
}

window.addEventListener('scroll', scrollHeader);

document.addEventListener('DOMContentLoaded', function () {
    var swiperPopular = new Swiper(".popular__container", {
        spaceBetween: 32,
        grabCursor: true,
        centeredSlides: true, // Corrected property name
        slidesPerView: 'auto', // Corrected property name
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
});

const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () =>{
  	const scrollDown = window.scrollY

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
			  sectionTop = current.offsetTop - 58,
			  sectionId = current.getAttribute('id'),
			  sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

		if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
			sectionsClass.classList.add('active-link')
		}else{
			sectionsClass.classList.remove('active-link')
		}                                                    
	})
}
window.addEventListener('scroll', scrollActive)
/*----show scrollup----*/
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						: scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)
/*--------------dark light theme------------*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx bx-moon' : 'bx bx-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx bx-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})


const sr=ScrollReveal({
    origin:'top',
    distance: '60px',
    duration: 2500,
    delay:400,
    reset: true
})

sr.reveal('.home__title, .popular__container, .subscribe__container, .footer__container')
sr.reveal('.home__description, .footer__info',{delay: 500})
sr.reveal('.home__search',{delay: 600})
sr.reveal('.home__value',{delay: 700})
sr.reveal('.home__images',{delay: 800 ,origin:'bottom'})
sr.reveal('.logos__img',{interval:100})
sr.reveal('.value__images,.contact__content',{origin:'left'})
sr.reveal('.value__content, .contact__images',{origin:'right'})

///////
const wrapper =document.querySelector('.wrapper');
const loginLink =document.querySelector('.login-link');
const registerLink =document.querySelector('.register-link');
const btnPopup =document.querySelector('.btnLogin-popup');
const iconClose=document.querySelector('.icon-close');

registerLink.addEventListener('click',()=>{
    wrapper.classList.add('active');

});


loginLink.addEventListener('click',()=>{
    wrapper.classList.remove('active');

});

btnPopup.addEventListener('click',()=>{
    wrapper.classList.add('active-popup');

});

iconClose.addEventListener('click',()=>{
    wrapper.classList.remove('active-popup');

});
