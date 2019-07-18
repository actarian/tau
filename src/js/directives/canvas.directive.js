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
			canvas: '='
		};
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		const inner = node.querySelector('.inner');
		const model = scope.model || 'models/professional-27.fbx';
		const canvas = new Canvas(inner, model);
		canvas.on('load', () => {
			node.classList.add('loaded');
		});
		/*
		const loader = new THREE.loader();
		loader.load('img/panorama-sm/panorama-01.jpg', (texture) => {
			texture.mapping = THREE.UVMapping;
			const options = {
				resolution: 1024,
				generateMipmaps: true,
				minFilter: THREE.LinearMipMapLinearFilter,
				magFilter: THREE.LinearFilter
			};
			canvas.scene.background = new THREE.CubemapGenerator(canvas.renderer).fromEquirectangular(texture, options);
			canvas.animate();
		});
		*/
		// canvas.load('data/vr.json');
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
