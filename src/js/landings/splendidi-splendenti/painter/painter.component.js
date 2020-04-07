import tinycolor from 'tinycolor2';

const BUTTON = 0b01;

export default class PainterComponent {

	constructor(canvas, colour = '#0b0c11', strokeWidth = 10, varyBrightness = 5) {
		// Brush colour and size
		this.colour = colour;
		this.strokeWidth = strokeWidth;
		this.varyBrightness = varyBrightness;
		// Drawing state
		this.latestPoint = undefined;
		this.drawing = false;
		this.currentAngle = undefined;
		// Set up our drawing context
		this.canvas = canvas;
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		const context = this.context = canvas.getContext('2d');
		let currentBrush = this.currentBrush = this.makeBrush(strokeWidth);
		setTimeout(() => {
			this.addEventListeners();
			this.onResize();
		}, 1000);
	}

	rotatePoint(distance, angle, origin) {
		return [origin[0] + distance * Math.cos(angle), origin[1] + distance * Math.sin(angle)];
	}

	varyColour(sourceColour) {
		const amount = Math.round(Math.random() * 2 * this.varyBrightness);
		const c = tinycolor(sourceColour);
		const varied = amount > this.varyBrightness ? c.brighten(amount - this.varyBrightness) : c.darken(amount);
		return varied.toHexString();
	}

	makeBrush(size) {
		const brush = [];
		let bristleCount = Math.round(size / 3);
		const gap = this.strokeWidth / bristleCount;
		for (let i = 0; i < bristleCount; i++) {
			const distance = i === 0 ? 0 : gap * i + (Math.random() * gap) / 2 - gap / 2;
			brush.push({
				distance,
				thickness: Math.random() * 2 + 2,
				colour: this.varyColour(this.colour)
			});
		}
		return brush;
	}

	getBearing(origin, destination) {
		return (Math.atan2(destination[1] - origin[1], destination[0] - origin[0]) - Math.PI / 2) % (Math.PI * 2);
	}

	getNewAngle(origin, destination, oldAngle) {
		const bearing = this.getBearing(origin, destination);
		if (typeof oldAngle === 'undefined') {
			// console.log(bearing);
			return bearing;
		}
		return oldAngle - this.angleDiff(oldAngle, bearing);
	}

	angleDiff(angleA, angleB) {
		const twoPi = Math.PI * 2;
		const diff = ((angleA - (angleB > 0 ? angleB : angleB + twoPi) + Math.PI) % twoPi) - Math.PI;
		return diff < -Math.PI ? diff + twoPi : diff;
	}

	strokeBristle(origin, destination, bristle, controlPoint) {
		const context = this.context;
		context.beginPath();
		context.moveTo(origin[0], origin[1]);
		context.strokeStyle = bristle.colour;
		context.lineWidth = bristle.thickness;
		context.lineCap = 'round';
		context.lineJoin = 'round';
		context.shadowColor = bristle.colour;
		context.shadowBlur = bristle.thickness / 2;
		context.quadraticCurveTo(
			controlPoint[0],
			controlPoint[1],
			destination[0],
			destination[1]
		);
		context.lineTo(destination[0], destination[1]);
		context.stroke();
	}

	drawStroke(bristles, origin, destination, oldAngle, newAngle) {
		const context = this.context;
		bristles.forEach(bristle => {
			context.beginPath();
			let bristleOrigin = this.rotatePoint(
				bristle.distance - this.strokeWidth / 2,
				oldAngle,
				origin
			);
			let bristleDestination = this.rotatePoint(
				bristle.distance - this.strokeWidth / 2,
				newAngle,
				destination
			);
			const controlPoint = this.rotatePoint(
				bristle.distance - this.strokeWidth / 2,
				newAngle,
				origin
			);
			bristleDestination = this.rotatePoint(
				bristle.distance - this.strokeWidth / 2,
				newAngle,
				destination
			);
			this.strokeBristle(bristleOrigin, bristleDestination, bristle, controlPoint);
		});
	}

	continueStroke(newPoint) {
		const newAngle = this.getNewAngle(this.latestPoint, newPoint, this.currentAngle);
		this.drawStroke(this.currentBrush, this.latestPoint, newPoint, this.currentAngle, newAngle);
		this.currentAngle = newAngle % (Math.PI * 2);
		this.latestPoint = newPoint;
	}

	startStroke(point) {
		const colour = this.colour; // colour = document.getElementById('colourInput').value;
		this.currentAngle = undefined;
		this.currentBrush = this.makeBrush(this.strokeWidth);
		this.drawing = true;
		this.latestPoint = point;
	}

	getTouchPoint(event) {
		if (!event.currentTarget) {
			return [0, 0];
		}
		const rect = event.currentTarget.getBoundingClientRect();
		const touch = event.targetTouches[0];
		// console.log(rect, touch);
		return [touch.clientX - rect.left, touch.clientY - rect.top];
	}

	mouseButtonIsDown(buttons) {
		return (BUTTON & buttons) === BUTTON;
	}

	mouseMove(event) {
		if (!this.drawing) {
			return;
		}
		this.continueStroke([event.offsetX, event.offsetY]);
	}

	mouseDown(event) {
		if (this.drawing) {
			return;
		}
		// event.preventDefault();
		this.canvas.addEventListener('mousemove', this.mouseMove, false);
		this.startStroke([event.offsetX, event.offsetY]);
	}

	mouseEnter(event) {
		if (!this.mouseButtonIsDown(event.buttons) || this.drawing) {
			return;
		}
		this.mouseDown(event);
	}

	endStroke(event) {
		if (!this.drawing) {
			return;
		}
		this.drawing = false;
		event.currentTarget.removeEventListener('mousemove', this.mouseMove, false);
	}

	touchStart(event) {
		if (this.drawing) {
			return;
		}
		event.preventDefault();
		this.startStroke(this.getTouchPoint(event));
	}

	touchMove(event) {
		if (!this.drawing) {
			return;
		}
		this.continueStroke(this.getTouchPoint(event));
	}

	touchEnd(event) {
		this.drawing = false;
	}

	onResize(event) {
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
	}

	addEventListeners() {
		// Register event handlers
		this.touchStart = this.touchStart.bind(this);
		this.touchEnd = this.touchEnd.bind(this);
		this.touchEnd = this.touchEnd.bind(this);
		this.touchMove = this.touchMove.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.mouseMove = this.mouseMove.bind(this);
		this.endStroke = this.endStroke.bind(this);
		this.endStroke = this.endStroke.bind(this);
		this.mouseEnter = this.mouseEnter.bind(this);
		this.onResize = this.onResize.bind(this);
		const canvas = this.canvas;
		canvas.addEventListener('touchstart', this.touchStart, false);
		canvas.addEventListener('touchend', this.touchEnd, false);
		canvas.addEventListener('touchcancel', this.touchEnd, false);
		canvas.addEventListener('touchmove', this.touchMove, false);
		canvas.addEventListener('mousedown', this.mouseDown, false);
		canvas.addEventListener('mouseup', this.endStroke, false);
		canvas.addEventListener('mouseout', this.endStroke, false);
		canvas.addEventListener('mouseenter', this.mouseEnter, false);
		window.addEventListener('resize', this.onResize, false);
	}

}
