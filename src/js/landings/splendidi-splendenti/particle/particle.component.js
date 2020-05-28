import IntersectionService from '../intersection/intersection.service';

export default class ParticleComponent {

	constructor(node) {
		this.node = node;
		node.setAttribute('class', 'coriander');
		const props = this.props = { pow: 0 };
		IntersectionService.observe(node, (intersect) => {
			if (intersect) {
				this.init();
				this.animate();
			} else {
				gsap.killTweensOf(props);
			}
		});
	}

	init() {
		const node = this.node;
		const props = this.props;
		props.pow = 0;
		gsap.set(node, {
			scale: 0.4 + Math.random() * 0.6,
			opacity: 1,
			x: 0,
			y: 0
		});
	}

	animate() {
		const node = this.node;
		const props = this.props;
		let vx = -10 + Math.random() * 20;
		let vy = -3 - Math.random() * 4;
		let vr = -3 + Math.random() * 6;
		const tween = gsap.fromTo(props, 2.5, {
			pow: 0
		}, {
			pow: 1,
			overwrite: 'all',
			onUpdate: () => {
				// console.log(props.pow);
				gsap.set(node, {
					opacity: (1 - props.pow) * (1 - props.pow),
					rotation: `+=${vr}deg`,
					x: `+=${vx}`,
					y: `+=${vy}`,
				})
				vx *= 0.98;
				vy += 0.1;
			},
			onRepeat: () => {
				// console.log(props.pow);
				vx = -10 + Math.random() * 20;
				vy = -3 - Math.random() * 4;
				gsap.set(node, {
					x: 0,
					y: 0,
				})
			},
			delay: Math.random() * 2.5,
			repeat: -1,
		});
	}

}
