/* jshint esversion: 6 */

import CanvasDirective from './directives/canvas.directive';
import { VR_MODE } from './threejs/vr/vr';
import LazyScriptDirective from './directives/lazy-script.directive';
import LazyDirective from './directives/lazy.directive';
import OverscrollDirective from './directives/overscroll.directive';
import { TrustedFilter } from './filters/trusted.filter';
import ProductCtrl from './product/product.controller';
import RootCtrl from './root.controller';
import ApiService from './services/api.service';
import DomService from './services/dom.service';
import LocationService from './shared/location.service';
import PromiseService from './shared/promise.service';
import StateService from './shared/state.service';
import { CookieService, LocalStorageService, SessionStorageService } from './shared/storage.service';

const MODULE_NAME = 'tau';

const app = angular.module(MODULE_NAME, ['ngSanitize']);

app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('*');
}]);

app.factory('ApiService', ApiService.factory)
	.factory('DomService', DomService.factory)
	.factory('LocationService', LocationService.factory)
	.factory('PromiseService', PromiseService.factory)
	.factory('StateService', StateService.factory)
	.factory('CookieService', CookieService.factory)
	.factory('LocalStorageService', LocalStorageService.factory)
	.factory('SessionStorageService', SessionStorageService.factory);

app.directive('canvas', CanvasDirective.factory)
	.directive('overscroll', OverscrollDirective.factory)
	.directive('lazy', LazyDirective.factory)
	.directive('lazyScript', LazyScriptDirective.factory);

app.controller('RootCtrl', RootCtrl)
	.controller('ProductCtrl', ProductCtrl);

app.filter('trusted', ['$sce', TrustedFilter]);

app.run(['$rootScope', ($rootScope) => {
	$rootScope.vrmodes = VR_MODE;
	$rootScope.vrmode = VR_MODE.NONE;
}]);

export default MODULE_NAME;
