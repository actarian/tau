import LocomotiveScroll from 'locomotive-scroll';
import Swiper from 'swiper';
import Game from "./game/game";
import IntersectionService from './intersection/intersection.service';
import PainterComponent from './painter/painter.component';
import ParticleComponent from './particle/particle.component';
import PointerComponent from './pointer/pointer';

const TWEEN = true;

class SplendidiSplendenti {

	constructor() {
		this.scrollCallbacks = [];
		this.addScrollCallback(this.initHeader());
		this.addScrollCallback(this.initSpazzolino());
		this.addScrollCallback(this.initNonSolo());
		this.addScrollCallback(this.initBanners());
		this.addScrollCallback(this.initCoriander());
		this.addScrollCallback(this.initMouths());
		this.addScrollCallback(this.initDesigner());
		// this.addScrollCallback(this.initPainter());
		this.addScrollCallback(this.initEmergency());
		this.addScrollCallback(this.initPopup());
		this.addScrollCallback(this.initEmoji());
		this.initPointer();
		window.onload = () => {
			setTimeout(() => {
				const scroll = this.getLocomotiveScroll();
				if (scroll) {
					scroll.on("scroll", instance => {
						this.onPageDidScroll(instance.scroll.y);
					});
				} else {
					window.addEventListener("scroll", () => {
						this.onPageDidScroll(window.pageYOffset);
					}, true);
				}
			}, 1); // 500
			setTimeout(() => {
				if (location.search === '?game') {
					this.openGamePopup();
					window.dispatchEvent(new Event('resize'));
				}
			}, 1000);
		};
	}

	addScrollCallback(callback) {
		if (typeof callback === 'function') {
			this.scrollCallbacks.push(callback);
		}
	}

	onPageDidScroll(y) {
		this.scrollCallbacks.forEach(callback => callback(y));
	}

	initHeader() {
		const header = document.querySelector('header');
		const toggler = document.querySelector('.navbar-toggler');
		toggler.addEventListener('click', () => {
			if (header.classList.contains('opened')) {
				header.classList.remove('opened');
			} else {
				header.classList.add('opened');
			}
		});
		window.addEventListener('resize', () => {
			if (window.innerWidth >= 940) {
				header.classList.remove('opened');
			}
		});
		const search = document.querySelector('.section--search');
		const searchTogglers = Array.prototype.slice.call(document.querySelectorAll('.main-search, .close-search'));
		searchTogglers.forEach(x => {
			x.addEventListener('click', () => {
				if (search.classList.contains('show')) {
					search.classList.remove('show');
				} else {
					search.classList.add('show');
				}
			});
		});
		if (search) {
			return (y) => {
				if (true || window.innerWidth >= 768) {
					gsap.set(search, { y: y });
				}
			}
		}
	}

	initSpazzolino() {
		const section = document.querySelector('.section--spazzolino');
		// const container = section.querySelector('.swiper-container');
		const swiper = new Swiper('.section--spazzolino .swiper-container', {
			slidesPerView: 1,
			spaceBetween: 0,
			centeredSlides: true,
			breakpoints: {
				// when window width is >= 100px
				100: {
					slidesPerView: 1,
				},
				// when window width is >= 768px
				768: {
					slidesPerView: 2.5,
				}
			},
			on: {
				init: function() {
					setTimeout(() => {
						this.update();
					}, 1);
				}
			},
			// slidesPerView: 1,
			// spaceBetween: 0,
			// loop: true,
			// effect: 'fade',
			speed: 1000,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			keyboardControl: true,
			mousewheelControl: false,
			pagination: {
				el: '.section--spazzolino .swiper-pagination',
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
		});
		const picture = section.querySelector('.picture');
		const bullets = section.querySelector('.swiper-pagination-bullets');
		const professional = section.querySelector('.ico-professional-27');
		return (y) => {
			// if (window.innerWidth >= 768) {
			y = Math.min(y, picture.offsetTop + picture.offsetHeight - professional.offsetTop - 30);
			gsap.set(bullets, { y: y });
			gsap.set(professional, { y: y });
			// }
		}
	}

	initNonSolo() {
		// const section = document.querySelector('.section--nonsolo');
		// const container = section.querySelector('.swiper-container');
		const swiper = new Swiper('.section--nonsolo .swiper-container', {
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
				el: '.section--nonsolo .swiper-pagination',
				clickable: true,
			},
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
		});
	}

	initEmergency__old() {
		const emergencies = [].slice.call(document.querySelectorAll('[emergency]')).forEach(element => {
			let i = 0;
			const setClass = () => {
				for (let j = 0; j < 5; j++) {
					element.classList.remove(`step-${j}`);
				}
				element.classList.add(`step-${i}`);
			};
			element.addEventListener('click', (event) => {
				if (i < 5) {
					i++;
					setClass();
					if (i === 5) {
						const box = element.querySelector('.box');
						gsap.to(box, 0.5, {
							opacity: 0,
							ease: Quad.easeOut,
						});
						const doc = element.querySelector('.document');
						gsap.to(doc, 0.5, {
							scale: 1.2,
							rotation: '-10deg',
							ease: Elastic.easeOut.config(1, 0.3),
						});
					}
					gsap.to(element, 1, {
						scale: '-=0.01',
						rotation: `+=${-2 + Math.random() * 4}deg`,
						ease: Elastic.easeOut.config(1, 0.3),
						overwrite: 'all',
						onComplete: () => {
							if (i < 5) {
								i = 0;
								setClass();
							}
							gsap.to(element, 1.5, {
								scale: 1,
								rotation: 0,
								ease: Elastic.easeOut.config(1, 0.3),
							});
						}
					});
					event.preventDefault();
					event.stopImmediatePropagation();
				} else if (i < 6) {
					i++;
					event.preventDefault();
					event.stopImmediatePropagation();
				} else {
					const popupNode = document.querySelector(element.getAttribute('emergency'));
					if (popupNode) {
						this.openPopup(popupNode);
					}
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});
		});
	}

	initEmergency() {
		const emergencies = [].slice.call(document.querySelectorAll('[emergency]')).forEach(element => {
			let i = 0;
			const setClass = () => {
				for (let j = 0; j < 5; j++) {
					element.classList.remove(`step-${j}`);
				}
				element.classList.add(`step-${i}`);
			};
			element.addEventListener('click', (event) => {
				const openPopup = () => {
					const popupNode = document.querySelector(element.getAttribute('emergency'));
					if (popupNode) {
						this.openPopup(popupNode);
					}
				}
				if (i < 4) {
					i++;
					setClass();
					gsap.to(element, 1, {
						scale: '-=0.01',
						rotation: `+=${-2 + Math.random() * 4}deg`,
						ease: Elastic.easeOut.config(1, 0.3),
						overwrite: 'all',
						onComplete: () => {
							if (i < 4) {
								i = 0;
								setClass();
							} else {
								openPopup();
							}
							gsap.to(element, 1.5, {
								scale: 1,
								rotation: 0,
								ease: Elastic.easeOut.config(1, 0.3),
							});
						}
					});
				} else {
					openPopup();
				}
				event.preventDefault();
				event.stopImmediatePropagation();
			});
		});
	}

	initPopup() {
		const popups = Array.prototype.slice.call(document.querySelectorAll('.group--popup')).map(node => {
			function Popup() {
				this.node = node;
				const body = document.querySelector('body');
				const onClose = () => {
					console.log('onClose', node);
					const closeButtons = node.querySelectorAll('.btn--close');
					Array.prototype.slice.call(closeButtons).forEach(button => button.removeEventListener('click', onClose));
					this.close();
				}
				this.open = () => {
					const closeButtons = node.querySelectorAll('.btn--close');
					Array.prototype.slice.call(closeButtons).forEach(button => button.addEventListener('click', onClose));
					node.classList.add('active');
					body.classList.add('popup--active');
					setTimeout(() => {
						node.classList.remove('exit');
						node.classList.add('enter');
					}, 1);
				}
				this.close = () => {
					node.classList.remove('enter');
					node.classList.add('exit');
					setTimeout(() => {
						node.classList.remove('active');
						node.classList.remove('exit');
						body.classList.remove('popup--active');
					}, 400);
				}
			}
			const popup = new Popup();
			return popup;
		});
		this.popups = popups;
		this.openPopup = (node) => {
			const popup = popups.find(x => x.node === node);
			if (popup) {
				popup.open();
			}
		};
		return (y) => {
			if (window.innerWidth >= 768) {
				popups.forEach(popup => {
					gsap.set(popup.node, { y: y });
				});
			}
		}
	}

	initBanners() {
		const banners = [].slice.call(document.querySelectorAll('.banner')).forEach(element => {
			const outer = element.querySelector('.outer');
			const direction = outer ? parseInt(outer.getAttribute('data-scroll-speed') / Math.abs(outer.getAttribute('data-scroll-speed'))) : 1;
			const inner = element.querySelector('.inner');
			const span = inner.querySelector('span');
			const width = span.offsetWidth;
			const num = Math.ceil(3000 / width);
			for (let i = 0; i < num; i++) {
				const node = span.cloneNode();
				node.innerHTML = span.innerHTML;
				inner.appendChild(node);
			}
			IntersectionService.observe(element, (intersect) => {
				if (intersect) {
					gsap.fromTo(inner, width / 50, { x: -width }, { x: -width + width * direction * -1, ease: Linear.easeNone, repeat: -1 });
				} else {
					gsap.killTweensOf(inner);
				}
			});
			element.classList.add('init');
		});
	}

	initCoriander() {
		const container = document.querySelector('.corianders');
		if (container) {
			const corianders = new Array(50).fill(0).map(() => new ParticleComponent(document.createElement("div"))).map(particle => {
				container.appendChild(particle.node);
			});
		}
	}

	initMouths() {
		const mouths = [].slice.call(document.querySelectorAll('[mouth]')).forEach(element => {
			let i = 0;
			element.addEventListener('click', () => {
				if (i < 5) {
					i++;
					gsap.to(element, 1.5, {
						scale: '+=0.1',
						rotation: `+=${-5 + Math.random() * 10}deg`,
						ease: Elastic.easeOut.config(1, 0.3),
						overwrite: 'all',
						onComplete: () => {
							i = 0;
							gsap.to(element, 1.5, {
								scale: 1,
								rotation: 0,
								ease: Elastic.easeOut.config(1, 0.3),
							});
						}
					});
				}
			});
			const flash = element.querySelector('.flash');
			if (flash) {
				const tweenFlash = () => {
					gsap.fromTo(flash, 1, {
						scale: 0.05,
						rotation: '0deg',
						opacity: 0
					}, {
						scale: 1,
						rotation: '360deg',
						opacity: 1,
						ease: Quad.easeOut,
						onComplete: () => {
							gsap.to(flash, 2, {
								scale: 1,
								rotation: '390deg',
								opacity: 1,
								ease: Linear.easeNone,
								onComplete: () => {
									tweenFlash();
								}
							});
						},
					});
				}
				IntersectionService.observe(flash, (intersect) => {
					if (intersect) {
						tweenFlash();
					} else {
						gsap.killTweensOf(flash);
					}
				});
			}
		});
	}

	initDesigner() {
		const button = document.querySelector('.section--designer .btn--cta')
		button.addEventListener('click', (event) => {
			this.openGamePopup();
			event.preventDefault();
			event.stopImmediatePropagation();
		});
	}

	openGamePopup() {
		let game;
		const openPopup = () => {
			const popupNode = document.querySelector('.section--designer .group--popup');
			if (popupNode) {
				this.openPopup(popupNode);
				if (!game) {
					game = new Game();
				}
			}
		}
		openPopup();
	}

	initPainter() {
		const painters = [].slice.call(document.querySelectorAll('[painter]')).map(element => new PainterComponent(element));
	}

	initEmoji() {
		const emoji = [].slice.call(document.querySelectorAll('.emoji')).forEach(element => {
			const r = (-10 + Math.floor(Math.random() * 20));
			const randomRotate = () => {
				gsap.fromTo(element, 2, {
					rotation: `${r}deg`
				}, {
					rotation: `${r * -1}deg`,
					ease: Elastic.easeOut.config(1, 0.3),
					delay: Math.random(),
					repeat: -1
				});
			};
			IntersectionService.observe(element, (intersect) => {
				if (intersect) {
					randomRotate();
				} else {
					gsap.killTweensOf(element);
				}
			});
			element.addEventListener('click', () => {
				gsap.to(element, 1, {
					rotation: '+=90deg',
					ease: Elastic.easeOut.config(1, 0.3),
					overwrite: 'all',
					onComplete: () => {
						randomRotate();
					}
				});
			});
		});
	}

	initPointer() {
		setTimeout(() => {
			const pointer = new PointerComponent(document.querySelector('.pointer'));
		}, 1);
	}

	getLocomotiveScroll() {
		if (document.querySelector("#locomotive-scroll").offsetWidth >= 768) {
			const scroll = new LocomotiveScroll({
				el: document.querySelector("#locomotive-scroll"),
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
		} else {
			document.querySelector('html').classList.add('has-scroll-init');
		}
	}

}

const splendidiSplendenti = new SplendidiSplendenti();
