/* jshint esversion: 6 */

import Rect from '../shared/rect';

const MODES = {
	NONE: 0,
	FIXED: 1,
	ABSOLUTE: 2,
};

export default class OverscrollResponsiveDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		const container = node.querySelector('.container');
		const overscroll = attributes.overscrollResponsive ? parseInt(attributes.overscrollResponsive) : 100;
		const anchors = [...node.querySelectorAll('[data-overscroll-anchor]')];
		const onClick = (event) => {
			const breakpointDownSm = window.innerWidth < 860;
			const index = anchors.indexOf(event.currentTarget);
			const rect = Rect.fromNode(node);
			const h = container.offsetHeight;
			const d = breakpointDownSm ? h : h / 100 * overscroll;
			const s = d / anchors.length;
			const top = this.domService.scrollTop + rect.top + s * index + (s / 2);
			// console.log(`index ${index} h ${h} overscroll ${overscroll} d ${d} top ${top}`);
			this.domService.scrollTo(0, top);
		};
		console.log('overscroll', overscroll);
		anchors.forEach(x => {
			x.addEventListener('click', onClick);
		});
		const bulletsHtml = anchors.map(x => `<li class="bullet"></li>`).join('');
		const navBullets = document.createElement('ul');
		navBullets.classList.add('nav--bullets');
		navBullets.innerHTML = bulletsHtml;
		const bullets = [...navBullets.querySelectorAll('.bullet')];
		const onClickBullet = (event) => {
			const index = bullets.indexOf(event.currentTarget);
			const anchor = anchors[index];
			const rect = Rect.fromNode(anchor);
			/*
			const h = container.offsetHeight;
			const d = h / 100 * overscroll;
			const s = d / anchors.length;
			*/
			const top = this.domService.scrollTop + rect.top;
			// const top = this.domService.scrollTop + rect.top + window.innerHeight / 2 + s * index + (s / 2);
			this.domService.scrollTo(0, top);
		};
		bullets.forEach(x => {
			x.addEventListener('click', onClickBullet);
		});
		node.appendChild(navBullets);
		let windowRectWidth;
		const subscription = this.domService.scrollIntersection$(node).subscribe(event => {
			const rect = event.rect;
			const top = rect.top;
			if (event.windowRect.width !== windowRectWidth) {
				windowRectWidth = event.windowRect.width;
				container.setAttribute('style', '');
			}
			const breakpointDownSm = window.innerWidth < 860;
			const h = container.offsetHeight;
			const d = breakpointDownSm ? h : h / 100 * overscroll;
			let y = 0;
			if (top < 0) {
				y = Math.min(-top + (breakpointDownSm ? window.innerHeight / 2 : 0), d);
			}
			let elementStyle;
			if (breakpointDownSm) {
				elementStyle = ``;
				if (element.style !== elementStyle) {
					element.style = elementStyle;
					node.setAttribute('style', elementStyle);
				}
				if (element.mode !== MODES.NONE) {
					element.mode = MODES.NONE;
					container.setAttribute('style', '');
				}
				if (y > window.innerHeight / 2 && y < d) {
					node.classList.add('nav--bullets-active');
				} else {
					node.classList.remove('nav--bullets-active');
				}
			} else {
				elementStyle = `position: relative; height: ${h + d}px;`;
				if (element.style !== elementStyle) {
					element.style = elementStyle;
					node.setAttribute('style', elementStyle);
				}
				// const containerRect = Rect.fromNode(container);
				if (y === d) {
					if (element.mode !== MODES.ABSOLUTE) {
						element.mode = MODES.ABSOLUTE;
						// container.setAttribute('style', `position: absolute; left: ${containerRect.left}px; width: ${containerRect.width}px; bottom: 0`);
						container.style.position = `relative`;
						container.style.transform = `translateY(${y}px)`;
						// container.setAttribute('style', `position: relative; transform: translateY(${d}px);`);
					}
				} else if (y > 0) {
					if (element.mode !== MODES.FIXED) {
						element.mode = MODES.FIXED;
						// container.setAttribute('style', `position: fixed; left: ${containerRect.left}px; width: ${containerRect.width}px; top: 0;`);
						container.style.position = `relative`;
						// container.setAttribute('style', `position: relative; transform: translateY(${y}px);`);
					}
					container.style.transform = `translateY(${y}px)`;
				} else {
					if (element.mode !== MODES.NONE) {
						element.mode = MODES.NONE;
						// container.setAttribute('style', '');
						container.style.position = `relative`;
						container.style.transform = `none`;
					}
				}
			}
			if (top < event.windowRect.height / 4 && rect.bottom > event.windowRect.height / 4) {
				const index = Math.floor(y / d * anchors.length);
				anchors.forEach((x, i) => {
					const bullet = bullets[i];
					if (i === index) {
						const value = x.getAttribute('data-overscroll-anchor');
						if (scope.$root.anchor !== value) {
							scope.$root.$broadcast('onAnchor', value);
						}
						if (!x.classList.contains('active')) {
							x.classList.add('active');
						}
						if (!bullet.classList.contains('active')) {
							bullet.classList.add('active');
						}
					} else {
						if (x.classList.contains('active')) {
							x.classList.remove('active');
						}
						if (bullet.classList.contains('active')) {
							bullet.classList.remove('active');
						}
					}
				});
			} else {
				anchors.forEach(x => {
					if (x.classList.contains('active')) {
						x.classList.remove('active');
					}
				});
				bullets.forEach(x => {
					if (x.classList.contains('active')) {
						x.classList.remove('active');
					}
				});
			}
		});
		element.on('$destroy', () => {
			subscription.unsubscribe();
			anchors.forEach(x => {
				x.removeEventListener('click', onClick);
			});
			bullets.forEach(x => {
				x.removeEventListener('click', onClickBullet);
			});
		});
	}

	static factory(DomService) {
		return new OverscrollResponsiveDirective(DomService);
	}

}

OverscrollResponsiveDirective.factory.$inject = ['DomService'];
