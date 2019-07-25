/* jshint esversion: 6 */

import Rect from '../shared/rect';
import Canvas from '../threejs/canvas';
import { VR_MODE } from '../threejs/vr/vr';

export default class CanvasDirective {

	constructor(
		$timeout,
		DomService
	) {
		this.$timeout = $timeout;
		this.domService = DomService;
		this.restrict = 'A';
		this.scope = {
			product: '=?canvas'
		};
	}

	link(scope, element, attributes, controller) {
		if (!scope.product) {
			return;
		}
		const node = element[0];
		const inner = node.querySelector('.inner');
		/*
		const product = scope.product || {
			model: 'threejs/models/toothbrush/....fbx',
			bristles: [],
			colors: []
		};
		*/
		const canvas = new Canvas(inner, product);
		canvas.on('vrmode', (vrmode) => {
			let vrMode;
			switch (vrmode) {
				case VR_MODE.VR:
				case VR_MODE.XR:
					vrMode = 'vrmode--enabled';
					break;
				case VR_MODE.NONE:
					vrMode = 'vrmode--none';
					break;
			}
			this.$timeout(() => {
				scope.$root.vrmode = vrmode;
			});
			document.body.classList.add(vrMode);
		});
		canvas.on('load', () => {
			node.classList.add('loaded');
		});
		canvas.animate();
		const anchors = [...document.querySelectorAll('[data-anchor]')];
		const rafSubscription = this.domService.rafAndScroll$(node).subscribe(event => {
			const rect = Rect.fromNode(node);
			const top = rect.top - (window.innerHeight - rect.height) / 2;
			const innerStyle = top <= 0 ? `transform: translateX(-50%) translateY(${top - inner.offsetHeight / 2}px)` : `transform: translateX(-50%) translateY(-50%)`;
			if (element.innerStyle !== innerStyle) {
				element.innerStyle = innerStyle;
				inner.style = innerStyle;
			}
		});
		const scrollSubscription = this.domService.scrollIntersection$(node).subscribe(event => {
			/*
			if (event.rect.top - (event.windowRect.height - event.rect.height) / 2 <= 0) {
				node.classList.remove('fixed');
			} else {
				node.classList.add('fixed');
			}
			*/
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
			rafSubscription.unsubscribe();
			scrollSubscription.unsubscribe();
			canvas.destroy();
		});
	}

	static factory($timeout, DomService) {
		return new CanvasDirective($timeout, DomService);
	}

}

CanvasDirective.factory.$inject = ['$timeout', 'DomService'];
