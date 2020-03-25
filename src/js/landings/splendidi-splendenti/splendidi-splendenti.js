import LocomotiveScroll from 'locomotive-scroll';
import Swiper from 'swiper';
import PainterComponent from './painter/painter.component';

const TWEEN = true;

class SplendidiSplendenti {

	constructor() {
		this.initSpazzolino();
		this.initNonSolo();
		this.initBanners();
		this.initMouths();
		this.initPainter();
		this.initEmergency();
		this.initEmoji();

		setTimeout(() => {
			const scroll = this.getLocomotiveScroll();
		}, 500);

	}

	initSpazzolino() {
		const section = document.querySelector('.section--spazzolino');
		const swiper = new Swiper(section.querySelector('.swiper-container'), {
			slidesPerView: 1,
			spaceBetween: 0,
			loop: true,
			effect: 'fade',
			speed: 1000,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			keyboardControl: true,
			mousewheelControl: false,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
		});
		swiper.on('slideChange', () => {
			for (let i = 0; i < 5; i++) {
				section.classList.remove(`slide-${i}`);
			}
			section.classList.add(`slide-${swiper.realIndex}`);
			// console.log(swiper, swiper.realIndex);
		});
	}

	initNonSolo() {
		const section = document.querySelector('.section--nonsolo');
		const swiper = new Swiper(section.querySelector('.swiper-container'), {
			slidesPerView: 1,
			spaceBetween: 0,
			loop: true,
			effect: 'fade',
			speed: 1000,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			keyboardControl: true,
			mousewheelControl: false,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
		});
	}

	initBanners() {
		const banners = [].slice.call(document.querySelectorAll('.banner')).forEach(element => {
			const inner = element.querySelector('.inner');
			const span = inner.querySelector('span');
			const width = span.offsetWidth;
			const num = Math.ceil(3000 / width);
			for (let i = 0; i < num; i++) {
				const node = span.cloneNode();
				node.innerHTML = span.innerHTML;
				inner.appendChild(node);
			}
			if (TWEEN) {
				TweenMax.fromTo(inner, 2, { x: 0 }, { x: -width, ease: Linear.easeNone, repeat: -1 });
			}
			element.classList.add('init');
		});
	}

	initMouths() {
		const mouths = [].slice.call(document.querySelectorAll('[mouth]')).forEach(element => {
			let i = 0;
			element.addEventListener('click', () => {
				if (i < 5) {
					i++;
					TweenMax.to(element, 1.5, {
						scale: '+=0.1',
						rotation: `+=${-5 + Math.random() * 10}deg`,
						ease: Elastic.easeOut.config(1, 0.3),
						overwrite: 'all',
						onComplete: () => {
							i = 0;
							TweenMax.to(element, 1.5, {
								scale: 1,
								rotation: 0,
								ease: Elastic.easeOut.config(1, 0.3),
							});
						}
					});
				}
			});
			const img = element.querySelector('img');
		});
	}

	initEmergency() {
		const emergencies = [].slice.call(document.querySelectorAll('[emergency]')).forEach(element => {
			let i = 0;
			element.addEventListener('click', () => {
				if (i < 5) {
					i++;
					TweenMax.to(element, 1, {
						scale: '-=0.01',
						rotation: `+=${-2 + Math.random() * 4}deg`,
						ease: Elastic.easeOut.config(1, 0.3),
						overwrite: 'all',
						onComplete: () => {
							i = 0;
							TweenMax.to(element, 1.5, {
								scale: 1,
								rotation: 0,
								ease: Elastic.easeOut.config(1, 0.3),
							});
						}
					});
				}
			});
		});
	}

	initPainter() {
		const painters = [].slice.call(document.querySelectorAll('[painter]')).map(element => new PainterComponent(element));
	}

	initEmoji() {
		const emoji = [].slice.call(document.querySelectorAll('.emoji')).forEach(element => {
			if (TWEEN) {
				const r = (-10 + Math.floor(Math.random() * 20));
				TweenMax.fromTo(element, 2, {
					rotation: `${r}deg`
				}, {
					rotation: `${r * -1}deg`,
					ease: Elastic.easeOut.config(1, 0.3),
					delay: Math.random(),
					repeat: -1
				});
			}
		});
	}

	getLocomotiveScroll() {
		const scroll = new LocomotiveScroll({
			el: document.querySelector("#js-scroll"),
			smooth: true,
			getSpeed: true,
			getDirection: false,
			useKeyboard: true,
			smoothMobile: true,
			inertia: 1,
			class: "is-inview",
			scrollbarClass: "c-scrollbar",
			scrollingClass: "has-scroll-scrolling",
			draggingClass: "has-scroll-dragging",
			smoothClass: "has-scroll-smooth",
			initClass: "has-scroll-init"
		});
		return scroll;
	}

}

const splendidiSplendenti = new SplendidiSplendenti();
