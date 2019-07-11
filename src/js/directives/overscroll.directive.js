/* jshint esversion: 6 */

import Rect from '../shared/rect';

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
				container.setAttribute('style', `position: absolute; left: ${containerRect.left}px; width: ${containerRect.width}px; bottom: 0`);
			} else if (y > 0) {
				container.setAttribute('style', `position: fixed; left: ${containerRect.left}px; width: ${containerRect.width}px; top: 0;`);
			} else {
				container.setAttribute('style', '');
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
			}
		});
		element.on('$destroy', () => {
			subscription.unsubscribe();
		});
	}

	static factory(DomService) {
		return new OverscrollDirective(DomService);
	}

}

OverscrollDirective.factory.$inject = ['DomService'];
