(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* jshint esversion: 6 */

/* global window, document, TweenMax, ThreeJs */
var DragListener =
/*#__PURE__*/
function () {
  function DragListener(target, downCallback, moveCallback, upCallback) {
    _classCallCheck(this, DragListener);

    this.target = target || document;

    this.downCallback = downCallback || function (e) {
      console.log('DragListener.downCallback not setted', e);
    };

    this.moveCallback = moveCallback || function (e) {
      console.log('DragListener.moveCallback not setted', e);
    };

    this.upCallback = upCallback || function (e) {
      console.log('DragListener.upCallback not setted', e);
    };

    this.dragging = false;
    this.init();
  }

  _createClass(DragListener, [{
    key: "init",
    value: function init() {
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.onTouchStart = this.onTouchStart.bind(this);
      this.onTouchMove = this.onTouchMove.bind(this);
      this.onTouchEnd = this.onTouchEnd.bind(this);
      this.target.addEventListener('mousedown', this.onMouseDown, false);
      this.target.addEventListener('touchstart', this.onTouchStart, false);
    }
  }, {
    key: "onDown",
    value: function onDown(down) {
      this.down = down; // this.position ? { x: down.x - this.position.x, y: down.y - this.position.y } : down;

      this.strength = {
        x: 0,
        y: 0
      };
      this.distance = this.distance || {
        x: 0,
        y: 0
      };
      this.speed = {
        x: 0,
        y: 0
      };
      this.downCallback(this);
    }
  }, {
    key: "onDrag",
    value: function onDrag(position) {
      this.dragging = this.down !== undefined;
      var target = this.target;
      var distance = {
        x: position.x - this.down.x,
        y: position.y - this.down.y
      };
      var strength = {
        x: distance.x / window.innerWidth * 2,
        y: distance.y / window.innerHeight * 2
      };
      var speed = {
        x: this.speed.x + (strength.x - this.strength.x) * 0.1,
        y: this.speed.y + (strength.y - this.strength.y) * 0.1
      };
      this.position = position;
      this.distance = distance;
      this.strength = strength;
      this.speed = speed;
      this.moveCallback({
        position: position,
        distance: distance,
        strength: strength,
        speed: speed,
        target: target
      });
    }
  }, {
    key: "onUp",
    value: function onUp() {
      this.down = undefined;
      this.dragging = false;
      this.upCallback(this);
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(e) {
      this.target.removeEventListener('touchstart', this.onTouchStart);
      this.onDown({
        x: e.clientX,
        y: e.clientY
      });
      this.addMouseListeners();
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      this.onDrag({
        x: e.clientX,
        y: e.clientY
      });
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(e) {
      this.removeMouseListeners();
      /*
      this.onDrag({
      	x: e.clientX,
      	y: e.clientY
      });
      */

      this.onUp();
    }
  }, {
    key: "onTouchStart",
    value: function onTouchStart(e) {
      this.target.removeEventListener('mousedown', this.onMouseDown);

      if (e.touches.length > 1) {
        e.preventDefault();
        this.onDown({
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        });
        this.addTouchListeners();
      }
    }
  }, {
    key: "onTouchMove",
    value: function onTouchMove(e) {
      if (e.touches.length > 0) {
        e.preventDefault();
        this.onDrag({
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        });
      }
    }
  }, {
    key: "onTouchEnd",
    value: function onTouchEnd(e) {
      this.removeTouchListeners();
      this.onDrag(this.position);
      this.onUp();
    }
  }, {
    key: "addMouseListeners",
    value: function addMouseListeners() {
      document.addEventListener('mousemove', this.onMouseMove, false);
      document.addEventListener('mouseup', this.onMouseUp, false);
    }
  }, {
    key: "addTouchListeners",
    value: function addTouchListeners() {
      document.addEventListener('touchend', this.onTouchEnd, false);
      document.addEventListener('touchmove', this.onTouchMove, false);
    }
  }, {
    key: "removeMouseListeners",
    value: function removeMouseListeners() {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }, {
    key: "removeTouchListeners",
    value: function removeTouchListeners() {
      document.removeEventListener('touchend', this.onTouchEnd);
      document.removeEventListener('touchmove', this.onTouchMove);
    }
  }]);

  return DragListener;
}();

exports.default = DragListener;

},{}],2:[function(require,module,exports){
"use strict";

var _const = require("./three/const");

var _interactive = _interopRequireDefault(require("./three/interactive.mesh"));

var _orbit = _interopRequireDefault(require("./three/orbit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var COLORS = [0xFFFFFF, 0xFC4445, 0xFEEE6, 0x55BCC9, 0x97CAEF, 0xCAFAFE];

var Tau =
/*#__PURE__*/
function () {
  function Tau() {
    _classCallCheck(this, Tau);

    this.colorIndex = 0;
    this.count = 0;
    this.mouse = {
      x: 0,
      y: 0
    };
    this.parallax = {
      x: 0,
      y: 0
    };
    this.size = {
      width: 0,
      height: 0,
      aspect: 0
    };
    this.cameraDirection = new THREE.Vector3();
    this.init();
  }
  /*
  load(jsonUrl) {
  	try {
  		fetch(jsonUrl).then(response => response.json()).then(response => {
  			this.pivot.views = response.views;
  		});
  	} catch (error) {
  		this.debugInfo.innerHTML = error;
  	}
  }
  */


  _createClass(Tau, [{
    key: "init",
    value: function init() {
      var body = this.body = document.querySelector('body');
      var section = this.section = document.querySelector('.tau');
      var container = this.container = section.querySelector('.tau__container');
      var debugInfo = this.debugInfo = section.querySelector('.debug__info');
      var debugSave = this.debugSave = section.querySelector('.debug__save'); // Dom.detect(body);
      // body.classList.add('ready');

      this.onWindowResize = this.onWindowResize.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.onMouseWheel = this.onMouseWheel.bind(this);
      this.onSave = this.onSave.bind(this); //

      var scene = this.scene = this.addScene();
      var camera = this.camera = this.addCamera();
      var lights = this.lights = this.addLights(scene);
      var boxes = this.boxes = this.addBoxes(scene);
      var tau = this.tau = this.addTau(scene);
      var renderer = this.renderer = this.addRenderer(); // camera.target.z = ROOM_RADIUS;

      camera.lookAt(camera.target);
      var controls = this.controls = new THREE.OrbitControls(camera, renderer.domElement);
      camera.position.set(-40, 105, -78);
      controls.update();
      var orbit = this.orbit = new _orbit.default();
      var dragListener = this.dragListener = orbit.setDragListener(container); // raycaster

      var raycaster = this.raycaster = new THREE.Raycaster();
      window.addEventListener('resize', this.onWindowResize, false);
      window.addEventListener('keydown', this.onKeyDown, false);
      document.addEventListener('mousemove', this.onMouseMove, false);
      document.addEventListener('wheel', this.onMouseWheel, false);
      this.container.addEventListener('mousedown', this.onMouseDown, false);
      this.container.addEventListener('mouseup', this.onMouseUp, false);
      this.debugSave.addEventListener('click', this.onSave, false);
      this.section.classList.add('init');
      this.onWindowResize();
      this.updateBackgroundColor();
    }
  }, {
    key: "updateBackgroundColor",
    value: function updateBackgroundColor() {
      var _this = this;

      this.colorIndex++;
      this.colorIndex = this.colorIndex % COLORS.length;
      var color = COLORS[this.colorIndex];
      /*
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      */

      TweenMax.to(this.renderer.domElement, 0.7, {
        backgroundColor: color,
        // `rgba(${r},${g},${b},1)`,
        delay: 3,
        ease: Power2.easeInOut,
        onUpdate: function onUpdate() {
          _this.boxes.children.forEach(function (x) {
            x.material.color.setHex(color);
            x.material.needsUpdate = true;
          });
        },
        onComplete: function onComplete() {
          _this.updateBackgroundColor();
        }
      });
    }
  }, {
    key: "addRenderer",
    value: function addRenderer() {
      var renderer = new THREE.WebGLRenderer({
        antialias: true,
        // localClippingEnabled: true,
        // logarithmicDepthBuffer: true,
        // premultipliedAlpha: true,
        alpha: true
      });
      this.renderer = renderer; // renderer.shadowMap.enabled = true;

      renderer.setClearColor(0xffffff, 0); // renderer.setPixelRatio(window.devicePixelRatio);

      renderer.setPixelRatio(1.5);
      renderer.setSize(window.innerWidth, window.innerHeight); // container.innerHTML = '';

      this.container.appendChild(renderer.domElement);
      return renderer;
    }
  }, {
    key: "addScene",
    value: function addScene() {
      var scene = new THREE.Scene(); // scene.background = new THREE.Color(0x00000000);
      // scene.background = new THREE.Color(0x404040);
      // scene.fog = new THREE.Fog(scene.background, 10, 700);

      return scene;
    }
  }, {
    key: "addCamera",
    value: function addCamera() {
      var camera = new THREE.PerspectiveCamera(8, window.innerWidth / window.innerHeight, 0.01, _const.ROOM_RADIUS * 2);
      camera.zoom = 0.15;
      camera.target = new THREE.Vector3();
      return camera;
    }
  }, {
    key: "addLights",
    value: function addLights(scene) {
      /*
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
      hemiLight.color.setHSL(0.6, 1, 0.6);
      hemiLight.groundColor.setHSL(0.095, 1, 0.75);
      hemiLight.position.set(0, 50, 0);
      scene.add(hemiLight);
      */

      /*
      const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
      scene.add(hemiLightHelper);
      */
      var dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.color.setHSL(0.1, 1, 0.95);
      dirLight.position.set(-30, 40, 30);
      scene.add(dirLight);
      var dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
      dirLight2.color.setHSL(0.1, 1, 0.95);
      dirLight2.position.set(30, -40, -30);
      scene.add(dirLight2);
      /*
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      const d = 50;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.camera.far = 3500;
      dirLight.shadow.bias = -0.0001;
      */

      /*
      const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
      scene.add(dirLightHelper);
      */
    }
  }, {
    key: "getBox",
    value: function getBox(parent) {
      var geometry = new THREE.BoxGeometry(100, 100, 100);
      var material = new THREE.MeshBasicMaterial({
        color: 0xcccccc
      });
      var cube = new THREE.Mesh(geometry, material);
      parent.add(cube);
      return cube;
    }
  }, {
    key: "addBoxes",
    value: function addBoxes(parent) {
      var boxes = new THREE.Group();
      boxes.visible = false;
      var box;

      for (var i = 0; i < 12; i++) {
        box = this.getBox(boxes);
        var r = Math.PI * 2 / 12 * i;
        box.position.set(Math.cos(r) * 300, 300, Math.sin(r) * 300);
      }

      for (var _i = 0; _i < 12; _i++) {
        box = this.getBox(boxes);

        var _r = Math.PI * 2 / 12 * _i;

        box.position.set(Math.cos(_r) * 300, -300, Math.sin(_r) * 300);
      }
      /*
      box = this.getBox(boxes);
      box.position.set(0, -300, 0);
      */


      parent.add(boxes);
      return boxes;
    }
  }, {
    key: "addTau",
    value: function addTau(parent) {
      var _this2 = this;

      var tau = new THREE.Group();
      /*
      const texture = new THREE.loader().load('img/matcap.jpg');
      const material = new THREE.MeshMatcapMaterial({
      	color: 0xffffff,
      	matcap: texture,
      	transparent: true,
      	opacity: 1,
      });
      */
      // const texture = this.getEnvMap();

      this.getCubeCamera();
      var clear = this.clear = this.getClear();
      var silver = this.silver = this.getSilver();
      var red = this.red = this.getRed();
      var loader = new THREE.OBJLoader();
      loader.load('models/tau-marin_senzaspatole_low.obj', function (object) {
        var i = 0;
        object.traverse(function (child) {
          // console.log(child);
          if (child instanceof THREE.Mesh) {
            child.geometry.scale(0.7, 0.7, 0.7);
            child.geometry.translate(-70, 0, 0);
            child.geometry.rotateY(Math.PI);

            if (i === 0) {
              child.material = red;
            } else {
              child.material = clear;
              tau.child = child;
            }

            i++;
            /*
            const geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
            geometry.scale(0.01, 0.01, 0.01);
            child.geometry = new THREE.BufferGeometry().fromGeometry(geometry);
            */
          }
        });

        _this2.addLogo(object); // object.material = material;


        object.rotateZ(Math.PI / 8);
        console.log(object);
        tau.add(object);
      }, function (xhr) {// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }, function (error) {
        console.log('An error happened');
      });
      parent.add(tau);
      return tau;
    }
  }, {
    key: "addLogo",
    value: function addLogo(parent) {
      var geometry = new THREE.PlaneGeometry(32, 4, 3, 1);
      geometry.rotateX(-Math.PI / 2);
      geometry.rotateY(Math.PI);
      geometry.translate(-30, 2.4, 0);
      var logo = new THREE.Mesh(geometry, this.silver);
      parent.add(logo);
      return logo;
    }
  }, {
    key: "getCubeCamera",
    value: function getCubeCamera() {
      var cubeCamera0 = this.cubeCamera0 = new THREE.CubeCamera(0.01, 1000, 512);
      cubeCamera0.renderTarget.texture.generateMipmaps = true;
      cubeCamera0.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
      this.scene.add(cubeCamera0);
      var cubeCamera1 = this.cubeCamera1 = new THREE.CubeCamera(0.01, 1000, 512);
      cubeCamera1.renderTarget.texture.generateMipmaps = true;
      cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
      this.scene.add(cubeCamera1);
    }
  }, {
    key: "getEnvMap",
    value: function getEnvMap() {
      var textures = ['img/cubemaps/lights/', 'img/cubemaps/park/', 'img/cubemaps/pond/', 'img/cubemaps/lake/', 'img/cubemaps/square/'];
      var index = 0;
      var urls = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']; // const texture = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping(), render);

      var texture = new THREE.CubeTextureLoader().setPath(textures[index]).load(urls);
      texture.mapping = THREE.CubeRefractionMapping; // texture.render = render;

      /*
      // Note that the second parameter has been set to new THREE.CubeRefractionMapping().  This
      // is essential for making refraction work when this texture is used as an environment map
      // on an object -- and it doesn't stop the texture from working on theskybox.
      const shader = THREE.ShaderLib[ 'cube' ]; // contains the required shaders
      shader.uniforms[ 'tCube' ].value = texture; // data for the shaders
      const material = new THREE.ShaderMaterial({
      	// A ShaderMaterial uses custom vertex and fragment shaders.
      	fragmentShader: shader.fragmentShader,
      	vertexShader: shader.vertexShader,
      	uniforms: shader.uniforms,  // the texture is part of this object
      	depthWrite: false,
      	side: THREE.BackSide
      });
      */

      return texture;
    }
  }, {
    key: "getRed",
    value: function getRed() {
      var material = new THREE.MeshStandardMaterial({
        color: 0xff2222,
        roughness: 0.1,
        metalness: 0.2,
        envMap: this.cubeCamera1.renderTarget.texture,
        // The refractionRatio must have value in the range 0 to 1.
        // The default value, very close to 1, give almost invisible glass.
        refractionRatio: 0,
        reflectivity: 0.4,
        side: THREE.DoubleSide
      });
      return material;
    }
  }, {
    key: "getClear",
    value: function getClear() {
      var material = new THREE.MeshPhysicalMaterial({
        color: 0xc9d3da,
        roughness: 0.1,
        metalness: 0.9,
        clearCoat: 0.9,
        clearCoatRoughness: 0.1,
        envMap: this.cubeCamera1.renderTarget.texture,
        // The refractionRatio must have value in the range 0 to 1.
        // The default value, very close to 1, give almost invisible glass.
        refractionRatio: 0.99,
        reflectivity: 0.99,
        // wireframe: true,
        transparent: true,
        opacity: 0.55
        /*
        side: THREE.DoubleSide,
        */

      });

      if (false) {
        material.reflectivity = 0.5; // determines the fraction of light that is transmitted
      }

      return material;
    }
  }, {
    key: "getSilver",
    value: function getSilver() {
      var loader = new THREE.TextureLoader();
      var texture = loader.load('img/logo.jpg');
      var material = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        alphaMap: texture,
        lightMap: texture,
        roughness: 0.3,
        metalness: 0.9,

        /*
        clearCoat: 0.9,
        clearCoatRoughness: 0.1,
        */
        envMap: this.cubeCamera1.renderTarget.texture,
        // The refractionRatio must have value in the range 0 to 1.
        // The default value, very close to 1, give almost invisible glass.
        refractionRatio: 0.0,
        reflectivity: 0.99,
        // wireframe: true,
        alphaTest: 0.5,
        // if transparent is false
        transparent: false,
        // transparent: false,
        // opacity: 1,
        side: THREE.DoubleSide
      });
      return material;
    }
  }, {
    key: "updateCubeCamera",
    value: function updateCubeCamera() {
      if (this.tau.child) {
        var renderer = this.renderer;
        var scene = this.scene; // pingpong

        var count = this.count,
            cubeCamera0 = this.cubeCamera0,
            cubeCamera1 = this.cubeCamera1;
        renderer.setClearColor(0xffffff, 1);
        this.tau.child.visible = false;
        this.boxes.visible = true;

        if (count % 2 === 0) {
          this.clear.envMap = cubeCamera0.renderTarget.texture;
          this.silver.envMap = cubeCamera0.renderTarget.texture;
          this.red.envMap = cubeCamera0.renderTarget.texture;
          cubeCamera1.update(renderer, scene);
        } else {
          this.clear.envMap = cubeCamera1.renderTarget.texture;
          this.silver.envMap = cubeCamera1.renderTarget.texture;
          this.red.envMap = cubeCamera1.renderTarget.texture;
          cubeCamera0.update(renderer, scene);
        }

        this.count = count + 1;
        this.tau.child.visible = true;
        this.boxes.visible = false;
        renderer.setClearColor(0xffffff, 0);
      }
    } // events

  }, {
    key: "onWindowResize",
    value: function onWindowResize() {
      try {
        var container = this.container,
            renderer = this.renderer,
            camera = this.camera;
        var size = this.size;
        size.width = container.offsetWidth;
        size.height = container.offsetHeight;
        size.aspect = size.width / size.height;

        if (renderer) {
          renderer.setSize(size.width, size.height);
        }

        if (camera) {
          camera.aspect = size.width / size.height;
          camera.updateProjectionMatrix();
        }
      } catch (error) {
        this.debugInfo.innerHTML = error;
      }
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      try {
        // console.log(e.which, e.key);
        var key = "".concat(e.which, " ").concat(e.key);
        this.debugInfo.innerHTML = key;
      } catch (error) {
        this.debugInfo.innerHTML = error;
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(event) {
      if (_const.TEST_ENABLED) {
        // this.dragListener.start();
        this.controllers.setText('down');
        return;
      }

      try {
        this.mousedown = true;
        var raycaster = this.raycaster;
        raycaster.setFromCamera(this.mouse, this.camera);
      } catch (error) {
        this.debugInfo.innerHTML = error;
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
      try {
        var w2 = this.container.offsetWidth / 2;
        var h2 = this.container.offsetHeight / 2;
        this.mouse = {
          x: (event.clientX - w2) / w2,
          y: -(event.clientY - h2) / h2
        };
        var raycaster = this.raycaster;
        raycaster.setFromCamera(this.mouse, this.camera);

        _interactive.default.hittest(raycaster, this.mousedown);
      } catch (error) {
        this.debugInfo.innerHTML = error;
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(event) {
      if (_const.TEST_ENABLED) {
        // this.dragListener.end();
        this.controllers.setText('up');
        return;
      }

      console.log(this.camera.position);
      this.mousedown = false;
    }
  }, {
    key: "onMouseWheel",
    value: function onMouseWheel(event) {
      try {
        var camera = this.camera;
        var fov = camera.fov + event.deltaY * 0.01;
        camera.fov = THREE.Math.clamp(fov, 30, 75);
        camera.updateProjectionMatrix();
      } catch (error) {
        this.debugInfo.innerHTML = error;
      }
    }
  }, {
    key: "onSave",
    value: function onSave(event) {
      try {
        this.view.orientation = this.orbit.getOrientation();
      } catch (error) {
        this.debugInfo.innerHTML = error;
      }
    } // animation

  }, {
    key: "animate",
    value: function animate() {
      var _this3 = this;

      var renderer = this.renderer;
      renderer.setAnimationLoop(function () {
        _this3.render();
      });
    }
  }, {
    key: "render",
    value: function render(delta) {
      var controls = this.controls;
      controls.update();
      var renderer = this.renderer;
      var camera = this.camera;
      var scene = this.scene;
      this.updateCubeCamera();
      renderer.render(scene, camera);
    }
  }, {
    key: "updateCamera",
    value: function updateCamera() {
      var orbit = this.orbit;
      var camera = this.camera;
      orbit.update();
      camera.target.x = _const.ROOM_RADIUS * Math.sin(orbit.phi) * Math.cos(orbit.theta);
      camera.target.y = _const.ROOM_RADIUS * Math.cos(orbit.phi);
      camera.target.z = _const.ROOM_RADIUS * Math.sin(orbit.phi) * Math.sin(orbit.theta);
      camera.lookAt(camera.target);
      /*
      // distortion
      camera.position.copy( camera.target ).negate();
      */
    } // utils

  }, {
    key: "saveData",
    value: function saveData(data) {
      var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'console.json';

      if (!data) {
        console.error('Console.save: No data');
        return;
      }

      if (_typeof(data) === 'object') {
        data = JSON.stringify(data, undefined, 4);
      }

      var blob = new Blob([data], {
        type: 'text/json'
      });
      var event = document.createEvent('MouseEvents');
      var anchor = document.createElement('a');
      anchor.download = filename;
      anchor.href = window.URL.createObjectURL(blob);
      anchor.dataset.downloadurl = ['text/json', anchor.download, anchor.href].join(':');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      anchor.dispatchEvent(event);
    }
  }]);

  return Tau;
}();

var tau = new Tau();
/*
const loader = new THREE.loader();
loader.load('img/panorama-sm/panorama-01.jpg', (texture) => {
	texture.mapping = THREE.UVMapping;
	var options = {
		resolution: 1024,
		generateMipmaps: true,
		minFilter: THREE.LinearMipMapLinearFilter,
		magFilter: THREE.LinearFilter
	};
	tau.scene.background = new THREE.CubemapGenerator(tau.renderer).fromEquirectangular(texture, options);
	tau.animate();
});
*/
// tau.load('data/vr.json');

tau.animate();

},{"./three/const":3,"./three/interactive.mesh":5,"./three/orbit":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cm = cm;
exports.mm = mm;
exports.addCube = addCube;
exports.ORIGIN = exports.POINTER_RADIUS = exports.POINT_RADIUS = exports.PANEL_RADIUS = exports.ROOM_RADIUS = exports.TEST_ENABLED = void 0;

/* jshint esversion: 6 */

/* global window, document */
var TEST_ENABLED = false;
exports.TEST_ENABLED = TEST_ENABLED;
var ROOM_RADIUS = 200;
exports.ROOM_RADIUS = ROOM_RADIUS;
var PANEL_RADIUS = 100;
exports.PANEL_RADIUS = PANEL_RADIUS;
var POINT_RADIUS = 99;
exports.POINT_RADIUS = POINT_RADIUS;
var POINTER_RADIUS = 98;
exports.POINTER_RADIUS = POINTER_RADIUS;
var ORIGIN = new THREE.Vector3();
exports.ORIGIN = ORIGIN;

function cm(value) {
  return value / 100;
}

function mm(value) {
  return value / 1000;
}

function addCube(parent) {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  var cube = new THREE.Mesh(geometry, material);
  parent.add(cube);
  return cube;
}

THREE.Euler.prototype.add = function (euler) {
  this.set(this.x + euler.x, this.y + euler.y, this.z + euler.z, this.order);
  return this;
};

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* jshint esversion: 6 */

/* global window, document */
var EmittableMesh =
/*#__PURE__*/
function (_THREE$Mesh) {
  _inherits(EmittableMesh, _THREE$Mesh);

  function EmittableMesh(geometry, material) {
    var _this;

    _classCallCheck(this, EmittableMesh);

    geometry = geometry || new THREE.BoxGeometry(5, 5, 5);
    material = material || new THREE.MeshBasicMaterial({
      color: 0xff00ff // opacity: 1,
      // transparent: true,

    });
    _this = _possibleConstructorReturn(this, _getPrototypeOf(EmittableMesh).call(this, geometry, material)); // this.renderOrder = 10;

    _this.events = {};
    return _this;
  }

  _createClass(EmittableMesh, [{
    key: "on",
    value: function on(type, callback) {
      var _this2 = this;

      var event = this.events[type] = this.events[type] || [];
      event.push(callback);
      return function () {
        _this2.events[type] = event.filter(function (x) {
          return x !== callback;
        });
      };
    }
  }, {
    key: "off",
    value: function off(type, callback) {
      var event = this.events[type];

      if (event) {
        this.events[type] = event.filter(function (x) {
          return x !== callback;
        });
      }
    }
  }, {
    key: "emit",
    value: function emit(type, data) {
      var event = this.events[type];

      if (event) {
        event.forEach(function (callback) {
          // callback.call(this, data);
          callback(data);
        });
      }
    }
  }]);

  return EmittableMesh;
}(THREE.Mesh);

exports.default = EmittableMesh;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _emittable = _interopRequireDefault(require("./emittable.mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var InteractiveMesh =
/*#__PURE__*/
function (_EmittableMesh) {
  _inherits(InteractiveMesh, _EmittableMesh);

  _createClass(InteractiveMesh, null, [{
    key: "hittest",
    value: function hittest(raycaster, down) {
      var items = InteractiveMesh.items.filter(function (x) {
        return !x.freezed;
      });
      var intersections = raycaster.intersectObjects(items);
      var key, hit;
      var hash = {};
      intersections.forEach(function (intersection, i) {
        var object = intersection.object;
        key = object.id;

        if (i === 0 && InteractiveMesh.object != object) {
          InteractiveMesh.object = object;
          hit = object; // haptic feedback
        }

        hash[key] = intersection;
      });
      items.forEach(function (x) {
        var intersection = hash[x.id]; // intersections.find(i => i.object === x);

        x.intersection = intersection;
        x.over = intersection !== undefined;
        x.down = down;
      });
      return hit;
    }
  }]);

  function InteractiveMesh(geometry, material) {
    var _this;

    _classCallCheck(this, InteractiveMesh);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InteractiveMesh).call(this, geometry, material)); // this.renderOrder = 10;

    InteractiveMesh.items.push(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(InteractiveMesh, [{
    key: "over",
    get: function get() {
      return this.over_;
    },
    set: function set(over) {
      if (over) {
        this.emit('hit', this);
      }

      if (this.over_ !== over) {
        this.over_ = over;

        if (over) {
          this.emit('over', this);
        } else {
          this.emit('out', this);
        }
      }
    }
  }, {
    key: "down",
    get: function get() {
      return this.down_;
    },
    set: function set(down) {
      down = down && this.over;

      if (this.down_ !== down) {
        this.down_ = down;

        if (down) {
          this.emit('down', this);
        } else {
          this.emit('up', this);
        }
      }
    }
  }]);

  return InteractiveMesh;
}(_emittable.default);

exports.default = InteractiveMesh;
InteractiveMesh.items = [];

},{"./emittable.mesh":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _drag = _interopRequireDefault(require("../shared/drag.listener"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Orbit =
/*#__PURE__*/
function () {
  function Orbit() {
    _classCallCheck(this, Orbit);

    this.longitude = 0;
    this.latitude = 0;
    this.direction = 1; // this.speed = 1;

    this.inertia = new THREE.Vector2();
    this.set(0, 0);
  }

  _createClass(Orbit, [{
    key: "setOrientation",
    value: function setOrientation(orientation) {
      if (orientation) {
        this.set(orientation.longitude, orientation.latitude);
      }
    }
  }, {
    key: "getOrientation",
    value: function getOrientation() {
      return {
        latitude: this.latitude,
        longitude: this.longitude
      };
    }
  }, {
    key: "setDragListener",
    value: function setDragListener(container) {
      var _this = this;

      var longitude, latitude;
      var dragListener = new _drag.default(this.container, function (event) {
        longitude = _this.longitude;
        latitude = _this.latitude;
      }, function (event) {
        var direction = event.distance.x ? event.distance.x / Math.abs(event.distance.x) * -1 : 1;
        _this.direction = direction;
        var lon = longitude - event.distance.x * 0.1;
        var lat = latitude + event.distance.y * 0.1;

        _this.setInertia(lon, lat);

        _this.set(lon, lat); // console.log('longitude', this.longitude, 'latitude', this.latitude, 'direction', this.direction);

      }, function (event) {// this.speed = Math.abs(event.strength.x) * 100;
        // console.log('speed', this.speed);
      });

      dragListener.move = function () {};

      this.dragListener = dragListener;
      return dragListener;
    }
  }, {
    key: "set",
    value: function set(longitude, latitude) {
      latitude = Math.max(-80, Math.min(80, latitude));
      var phi = THREE.Math.degToRad(90 - latitude);
      var theta = THREE.Math.degToRad(longitude);
      this.longitude = longitude;
      this.latitude = latitude;
      this.phi = phi;
      this.theta = theta;
    }
  }, {
    key: "setInertia",
    value: function setInertia(longitude, latitude) {
      var inertia = this.inertia;
      inertia.x = (longitude - this.longitude) * 1;
      inertia.y = (latitude - this.latitude) * 1;
      this.inertia = inertia; // console.log(this.inertia);
    }
  }, {
    key: "updateInertia",
    value: function updateInertia() {
      var inertia = this.inertia;
      inertia.multiplyScalar(0.95);
      this.inertia = inertia;
      /*
      let speed = this.speed;
      speed = Math.max(1, speed * 0.95);
      this.speed = speed;
      */
    }
  }, {
    key: "update",
    value: function update() {
      if (this.dragListener && !this.dragListener.dragging) {
        this.set(this.longitude + this.inertia.x, this.latitude + this.inertia.y);
        this.updateInertia();
      }
    }
  }]);

  return Orbit;
}();

exports.default = Orbit;

},{"../shared/drag.listener":1}]},{},[2]);
//# sourceMappingURL=tau.js.map
