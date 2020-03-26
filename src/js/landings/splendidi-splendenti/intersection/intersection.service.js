export default class IntersectionService {

	static callbacks() {
		if (!this.callbacks_) {
			this.callbacks_ = [];
		}
		return this.callbacks_;
	}

	static observer() {
		if (!this.observer_) {
			this.observer_ = new IntersectionObserver(entries => {
				const callbacks = this.callbacks();
				entries.forEach(entry => {
					const state = entry !== undefined && entry.isIntersecting;
					const c = callbacks.find(x => x.node === entry.target);
					if (c.state !== state) {
						c.state = state;
						c.callback(state);
					}
				});

			});
		}
		return this.observer_;
	}

	static observe(node, callback) {
		if ('IntersectionObserver' in window) {
			if (typeof callback === 'function') {
				const callbacks = this.callbacks();
				callbacks.push({ node, callback });
			}
			const observer = this.observer();
			observer.observe(node);
		} else if (typeof callback === 'function') {
			callback(true);
		}
	}

	static unobserve(node) {
		if ('IntersectionObserver' in window) {
			const observer = this.observer();
			observer.unobserve(node);
		}
	}

}
