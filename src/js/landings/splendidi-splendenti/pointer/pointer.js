export default class PointerComponent {
	constructor(node) {
		this.node = node;
		this.ro_ = this.ro = 0;
		this.addEventListener();
		this.animate();
	}

	animate() {
		this.ro_ += (this.ro - this.ro_) / 8;
		TweenMax.set(this.node, {
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
	}

	onUp(event) {
		this.node.classList.remove('down');
	}

	addEventListener() {
		this.animate = this.animate.bind(this);
		this.onMove = this.onMove.bind(this);
		this.onDown = this.onDown.bind(this);
		this.onUp = this.onUp.bind(this);
		window.addEventListener('mousemove', this.onMove, false);
		window.addEventListener('mousedown', this.onDown, false);
		window.addEventListener('mouseup', this.onUp, false);
	}
}
