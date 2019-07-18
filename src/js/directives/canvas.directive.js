/* jshint esversion: 6 */

import Rect from '../shared/rect';
import Canvas from './canvas/canvas';

export default class CanvasDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
		this.scope = {
			product: '=?canvas'
		};
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		const inner = node.querySelector('.inner');
		const product = scope.product || {
			model: 'models/professional-27.fbx',
			bristles: [],
			colors: []
		};
		const canvas = new Canvas(inner, product);
		canvas.on('load', () => {
			node.classList.add('loaded');
		});
		canvas.animate();
		const anchors = [...document.querySelectorAll('[data-anchor]')];
		const subscription = this.domService.scrollIntersection$(node).subscribe(event => {
			if (event.rect.top - (event.windowRect.height - event.rect.height) / 2 <= 0) {
				node.classList.remove('fixed');
			} else {
				node.classList.add('fixed');
			}
			const anchor = anchors.reduce((p, x, i) => {
				const rect = Rect.fromNode(x);
				if (rect.top < event.windowRect.height / 4 && rect.bottom > event.windowRect.height / 4) {
					return x;
				} else {
					return p;
				}
			}, null);
			anchors.forEach(x => {
				if (x === anchor) {
					const value = x.getAttribute('data-anchor');
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
		});
		scope.$on('onAnchor', ($scope, anchor) => {
			canvas.anchor = anchor;
		});
		scope.$on('onBristle', ($scope, bristle) => {
			canvas.bristle = bristle;
		});
		scope.$on('onColor', ($scope, color) => {
			console.log('onColor', color);
			canvas.color = color;
		});
		element.on('$destroy', () => {
			subscription.unsubscribe();
			canvas.destroy();
		});
	}

	static factory(DomService) {
		return new CanvasDirective(DomService);
	}

}

CanvasDirective.factory.$inject = ['DomService'];
