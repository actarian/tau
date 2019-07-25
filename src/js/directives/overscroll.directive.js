/* jshint esversion: 6 */

import Rect from '../shared/rect';

const MODES = {
	NONE: 0,
	FIXED: 1,
	ABSOLUTE: 2,
};

export default class OverscrollDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		const container = node.querySelector('.container');
		const overscroll = attributes.overscroll ? parseInt(attributes.overscroll) : 100;
		const anchors = [...node.querySelectorAll('[data-overscroll-anchor]')];
		const onClick = (event) => {
			const index = anchors.indexOf(event.currentTarget);
			const rect = Rect.fromNode(node);
			const h = container.offsetHeight;
			const d = h / 100 * overscroll;
			const s = d / anchors.length;
			const top = this.domService.scrollTop + rect.top + s * index + (s / 2);
			// console.log(`index ${index} h ${h} overscroll ${overscroll} d ${d} top ${top}`);
			window.scrollTo(0, top);
		};
		anchors.forEach(x => {
			x.addEventListener('click', onClick);
		});
		let windowRectWidth;
		const subscription = this.domService.scrollIntersection$(node).subscribe(event => {
			const rect = event.rect;
			const top = rect.top;
			if (event.windowRect.width !== windowRectWidth) {
				windowRectWidth = event.windowRect.width;
				container.setAttribute('style', '');
			}
			const h = container.offsetHeight;
			const d = h / 100 * overscroll;
			node.setAttribute('style', `position: relative; height: ${h + d}px;`);
			let y = 0;
			if (top < 0) {
				y = Math.min(-top, d);
			}
			const containerRect = Rect.fromNode(container);
			if (y === d) {
				if (element.mode !== MODES.ABSOLUTE) {
					element.mode = MODES.ABSOLUTE;
					container.setAttribute('style', `position: absolute; left: ${containerRect.left}px; width: ${containerRect.width}px; bottom: 0`);
				}
			} else if (y > 0) {
				if (element.mode !== MODES.FIXED) {
					element.mode = MODES.FIXED;
					container.setAttribute('style', `position: fixed; left: ${containerRect.left}px; width: ${containerRect.width}px; top: 0;`);
				}
			} else {
				if (element.mode !== MODES.NONE) {
					element.mode = MODES.NONE;
					container.setAttribute('style', '');
				}
			}
			if (top < event.windowRect.height / 4 && rect.bottom > event.windowRect.height / 4) {
				const index = Math.floor(y / d * anchors.length);
				anchors.forEach((x, i) => {
					if (i === index) {
						const value = x.getAttribute('data-overscroll-anchor');
						if (scope.$root.anchor !== value) {
							scope.$root.$broadcast('onAnchor', value);
						}
						if (!x.classList.contains('active')) {
							x.classList.add('active');
						}
					} else {
						if (x.classList.contains('active')) {
							x.classList.remove('active');
						}
					}
				});
			} else {
				anchors.forEach(x => {
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
		});
	}

	static factory(DomService) {
		return new OverscrollDirective(DomService);
	}

}

OverscrollDirective.factory.$inject = ['DomService'];
