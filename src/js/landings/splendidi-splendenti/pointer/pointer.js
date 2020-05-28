const PointerModes = {
	HandPoint: 'hand-point',
	HandClick: 'hand-click',
	Pen: 'pen',
	Hammer: 'hammer',
};

export default class PointerComponent {

	set mode(mode) {
		if (this.mode_ !== mode) {
			this.mode_ = mode;
			Object.keys(PointerModes).forEach(x => {
				const key = PointerModes[x];
				key === mode ? this.node.classList.add(key) : this.node.classList.remove(key);
			});
		}
	}

	get mode() {
		return this.mode_;
	}

	constructor(node) {
		this.node = node;
		this.mode_ = PointerModes.HandPoint;
		this.ro_ = this.ro = 0;
		this.triggers = Array.prototype.slice.call(document.querySelectorAll('[pointer]')).map(node => {
			return { node, mode: node.getAttribute('pointer') };
		});
		this.addEventListener();
		this.animate();
	}

	animate() {
		this.ro_ += (this.ro - this.ro_) / 8;
		gsap.set(this.node, {
			rotation: `${this.ro_ * 3600}deg`,
			x: this.mx,
			y: this.my,
		});
		requestAnimationFrame(this.animate);
	}

	onMove(event) {
		this.node.classList.add('init');
		this.ro = this.mx !== undefined ? (event.pageX - this.mx) / window.innerWidth : 0;
		this.mx = event.pageX;
		this.my = event.pageY;
	}

	onDown(event) {
		this.node.classList.add('down');
		if (this.mode_ === PointerModes.HandPoint) {
			this.mode = PointerModes.HandClick;
		}
	}

	onUp(event) {
		this.node.classList.remove('down');
		if (this.mode_ === PointerModes.HandClick) {
			this.mode = PointerModes.HandPoint;
		}
	}

	addEventListener() {
		this.animate = this.animate.bind(this);
		this.onMove = this.onMove.bind(this);
		this.onDown = this.onDown.bind(this);
		this.onUp = this.onUp.bind(this);
		window.addEventListener('mousemove', this.onMove, false);
		window.addEventListener('mousedown', this.onDown, false);
		window.addEventListener('mouseup', this.onUp, false);
		this.triggers.forEach(x => {
			x.node.addEventListener('mouseenter', () => {
				if (!x.node.classList.contains('step-4')) {
					this.mode = x.mode;
				}
			}, false);
			x.node.addEventListener('mouseleave', () => {
				this.mode = PointerModes.HandPoint;
			}, false);
		});
	}
}
