/* jshint esversion: 6 */

class ProductCtrl {

	constructor(
		$scope,
		$timeout,
		DomService,
		ApiService
	) {
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.domService = DomService;
		this.apiService = ApiService;
		this.product = window.product || { bristles: [], colors: [] };
		if (this.product.bristles.length) {
			this.bristle = this.product.bristles[0];
		}
		if (this.product.colors.length) {
			this.color = this.product.colors[0];
		}
		$scope.$on('destroy', () => {});
	}

	get bristle() {
		return this.bristle_;
	}

	set bristle(bristle) {
		if (this.bristle_ !== bristle) {
			this.bristle_ = bristle;
			this.$scope.$broadcast('onBristle', bristle);
		}
	}

	get color() {
		return this.color_;
	}

	set color(color) {
		if (this.color_ !== color) {
			this.color_ = color;
			this.$scope.$broadcast('onColor', color);
		}
	}

}

ProductCtrl.$inject = ['$scope', '$timeout', 'DomService', 'ApiService'];

export default ProductCtrl;
