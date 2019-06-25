(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _const = require("./three/const");

var _interactive = _interopRequireDefault(require("./three/interactive.mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var USE_CUBE_CAMERA = true;
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
      var lights = this.lights = this.addLights(scene); // const addons = this.addons = this.addBoxes(scene);

      var addons = this.addons = this.addSpheres(scene);
      this.getCubeCamera();
      var texture = this.cubeCamera1.renderTarget.texture; // const hdr = this.hdr = this.getEnvMap((texture, textureData) => {

      var tau = this.tau = this.addTau(scene, texture); // const lights = this.lights = this.addLights(tau);

      this.tweenTau(); // });

      var renderer = this.renderer = this.addRenderer();
      /*
      // camera.target.z = ROOM_RADIUS;
      // camera.lookAt(camera.target);
      const controls = this.controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.maxDistance = 250;
      controls.minDistance = 100;
      // controls.maxPolarAngle = Math.PI / 2;
      // controls.minPolarAngle = Math.PI / 2;
      // camera.position.set(60, 205, -73);
            // camera.position.set(0, 50, 100);
      camera.position.set(6.3, 4.5, 111.5);
      camera.position.multiplyScalar(1.5);
      controls.update();
            */

      camera.position.set(0, 0, 150);
      /*
      const orbit = this.orbit = new Orbit();
      const dragListener = this.dragListener = orbit.setDragListener(container);
      // raycaster
      const raycaster = this.raycaster = new THREE.Raycaster();
      */

      window.addEventListener('resize', this.onWindowResize, false);
      /*
      window.addEventListener('keydown', this.onKeyDown, false);
      document.addEventListener('mousemove', this.onMouseMove, false);
      document.addEventListener('wheel', this.onMouseWheel, false);
      this.container.addEventListener('mousedown', this.onMouseDown, false);
      this.container.addEventListener('mouseup', this.onMouseUp, false);
            this.debugSave.addEventListener('click', this.onSave, false);
            */

      this.section.classList.add('init');
      this.onWindowResize(); // this.updateBackgroundColor();
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
          _this.addons.children.forEach(function (x) {
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
      renderer.setSize(window.innerWidth, window.innerHeight);
      /*
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
      */
      // container.innerHTML = '';

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
      var camera = new THREE.PerspectiveCamera(8, window.innerWidth / window.innerHeight, 0.01, 2000);
      camera.zoom = 0.25;
      camera.target = new THREE.Vector3();
      return camera;
    }
  }, {
    key: "addLights",
    value: function addLights(parent) {
      var lights = new THREE.Group();
      var light0 = new THREE.HemisphereLight(0xf4fbfb, 0x91978a, 0.9);
      light0.position.set(0, 10, 0);
      lights.add(light0);
      /*
      const helper0 = new THREE.HemisphereLightHelper(light0, 10, 0x888888);
      lights.add(helper0);
      */

      var light1 = new THREE.DirectionalLight(0xffffff, 1.4);
      light1.position.set(0, 0, -50);
      lights.add(light1);
      /*
      const light1 = new THREE.DirectionalLight(0xffffff, 2);
      light1.position.set(-50, 50, -50);
      lights.add(light1);
      */

      /*
      const helper1 = new THREE.DirectionalLightHelper(light1, 10, 0x888888);
      lights.add(helper1);
      */

      /*
      const light2 = new THREE.DirectionalLight(0xffffff, 2);
      light2.position.set(50, 50, 50);
      lights.add(light2);
      */

      /*
      const helper2 = new THREE.DirectionalLightHelper(light2, 10, 0x888888);
      lights.add(helper2);
      */

      /*
      const light3 = new THREE.PointLight(0xffffff, 1);
      light3.position.set(-50, 50, 50);
      lights.add(light3);
      */

      /*
      const helper3 = new THREE.DirectionalLightHelper(light3, 10, 0x888888);
      lights.add(helper3);
      */

      /*
      const light4 = new THREE.PointLight(0xffffff, 1);
      light4.position.set(50, 50, -50);
      lights.add(light4);
      */

      /*
      const helper4 = new THREE.DirectionalLightHelper(light4, 10, 0x888888);
      lights.add(helper4);
      */

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
      parent.add(dirLightHelper);
      */

      parent.add(lights);
      return lights;
    }
  }, {
    key: "addBox",
    value: function addBox(parent) {
      var geometry = new THREE.BoxGeometry(600, 30, 30);
      var material = new THREE.MeshBasicMaterial({
        color: 0xafb3bc
      });
      var cube = new THREE.Mesh(geometry, material);
      parent.add(cube);
      return cube;
    }
  }, {
    key: "addBoxes",
    value: function addBoxes(parent) {
      var _this2 = this;

      var group = new THREE.Group();
      group.visible = true;
      var boxes = new Array(12).fill(null).map(function (x, i) {
        var box = _this2.addBox(group);

        var r = Math.PI * 2 / 12 * i;
        box.position.set(0, Math.sin(r) * 300, Math.cos(r) * 300);
        return box;
      });
      parent.add(group);
      return group;
    }
  }, {
    key: "addSpheres",
    value: function addSpheres(parent) {
      var group = new THREE.Group();
      group.visible = false;
      var icosahedron = new THREE.IcosahedronGeometry(200, 1);
      var geometry = new THREE.Geometry();
      icosahedron.vertices.forEach(function (v, i) {
        var sphereGeometry = new THREE.SphereGeometry(30, 12, 12);
        sphereGeometry.translate(v.x, v.y, v.z);
        geometry.merge(sphereGeometry);
        sphereGeometry.dispose();
      });
      icosahedron.dispose();
      var material = new THREE.MeshBasicMaterial({
        color: 0x9196a1
      });
      var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
      geometry.dispose();
      var spheres_ = new THREE.Mesh(bufferGeometry, material);
      group.add(spheres_);
      parent.add(group);
      return group;
    }
  }, {
    key: "addTau",
    value: function addTau(parent, texture) {
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

      var clear = this.clear = this.getClear(texture);
      var silver = this.silver = this.getSilver(texture);
      var red = this.red = this.getRed(texture);
      var blue = this.blue = this.getBlue();
      var green = this.green = this.getGreen();
      var loader = new THREE.OBJLoader();
      loader.load('models/tau-marin_2.obj', // 'models/scalare-33-b/scalare-33-b.obj',
      function (object) {
        var i = 0;
        object.traverse(function (child) {
          // console.log(child);
          if (child instanceof THREE.Mesh) {
            /*
            child.castShadow = true;
            child.receiveShadow = true;
            */
            child.geometry.scale(10, 10, 10); // child.geometry.rotateX(-Math.PI / 2);
            // child.geometry.computeVertexNormals(true);
            // child.geometry.computeTangents();
            // THREE.BufferGeometryUtils.computeTangents(child.geometry);

            if (i === 0) {
              child.material = red;
            } else if (i === 1) {
              child.material = clear;
              tau.body = child;
            } else if (i === 2) {
              child.material = clear;
              tau.body = child;
            } else if (i === 3) {
              child.material = silver;
            } else if (i === 4) {
              child.material = silver;
            } else if (i === 5) {
              child.material = silver;
            } else if (i === 6) {
              child.material = green;
            } else if (i === 7) {
              child.material = blue;
            }

            i++;
            /*
            child.geometry.scale(150, 150, 150);
            child.geometry.rotateX(-Math.PI / 2);
            // child.geometry.computeVertexNormals(true);
            // child.geometry.computeTangents();
            THREE.BufferGeometryUtils.computeTangents(child.geometry);
            if (i === 0) {
            	child.material = red;
            } else if (i === 1) {
            	child.material = green;
            } else if (i === 2) {
            	child.material = blue;
            } else if (i === 3) {
            	child.material = clear;
            	tau.body = child;
                              }
                              */
          }
        }); // this.addLogo(object);
        // object.material = material;
        // object.rotateZ(Math.PI / 8);

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
    key: "tweenTau",
    value: function tweenTau() {
      var _this3 = this;

      var rotations = [[Math.PI / 4, Math.PI / 4, Math.PI / 4], [Math.PI / 4, Math.PI - Math.PI / 4, Math.PI / 4], [0, 0, Math.PI / 2], [Math.PI / 2, 0, 0], [Math.PI / 4, Math.PI / 4, 0], [0, -Math.PI / 2, Math.PI / 16]];
      var tau = this.tau;
      var ri = tau.ri !== undefined ? tau.ri : -1;
      ri++;
      ri = ri % rotations.length;
      tau.ri = ri;
      console.log(tau, ri);
      var rotation = rotations[ri];
      TweenMax.to(this.tau.rotation, 0.7, {
        x: rotation[0],
        y: rotation[1],
        z: rotation[2],
        delay: 4,
        onComplete: function onComplete() {
          _this3.tweenTau();
        }
      });
    }
  }, {
    key: "addLogo",
    value: function addLogo(parent) {
      var geometry = new THREE.PlaneGeometry(24, 3, 3, 1);
      geometry.rotateX(-Math.PI / 2);
      geometry.translate(20, 2, 0);
      geometry.rotateY(Math.PI); // geometry.translate(0, 2.2, -24);

      var logo = new THREE.Mesh(geometry, this.silver);
      parent.add(logo);
      return logo;
    }
  }, {
    key: "getCubeCamera",
    value: function getCubeCamera() {
      if (USE_CUBE_CAMERA) {
        var cubeCamera0 = this.cubeCamera0 = new THREE.CubeCamera(0.01, 1000, 256);
        cubeCamera0.renderTarget.texture.generateMipmaps = true;
        cubeCamera0.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        this.scene.add(cubeCamera0);
        var cubeCamera1 = this.cubeCamera1 = new THREE.CubeCamera(0.01, 1000, 256);
        cubeCamera1.renderTarget.texture.generateMipmaps = true;
        cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        this.scene.add(cubeCamera1);
      }
    }
  }, {
    key: "getEnvMap_",
    value: function getEnvMap_(callback) {
      var textures = ['img/cubemaps/lights/', 'img/cubemaps/park/', 'img/cubemaps/pond/', 'img/cubemaps/lake/', 'img/cubemaps/square/'];
      var index = 0;
      var urls = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']; // const texture = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping(), render);

      var loader = new THREE.CubeTextureLoader().setPath(textures[index]).load(urls, function (texture, textureData) {
        texture.mapping = THREE.CubeRefractionMapping;

        if (typeof callback === 'function') {
          callback(texture, textureData);
        }
      });
      return loader;
    }
  }, {
    key: "getEnvMap",
    value: function getEnvMap(callback) {
      var _this4 = this;

      var loader = new THREE.TextureLoader().load('img/hdr-04.jpg', function (source, textureData) {
        // source.encoding = THREE.sRGBEncoding;
        source.mapping = THREE.UVMapping;
        var options = {
          resolution: 1024,
          generateMipmaps: true,
          minFilter: THREE.LinearMipMapLinearFilter,
          magFilter: THREE.LinearFilter
        }; // this.scene.background = new THREE.CubemapGenerator(this.renderer).fromEquirectangular(source, options);

        var cubemapGenerator = new THREE.EquirectangularToCubeGenerator(source, options); // pngBackground = cubemapGenerator.renderTarget;

        var texture = cubemapGenerator.update(_this4.renderer);
        /*
        var pmremGenerator = new THREE.PMREMGenerator( cubeMapTexture );
        pmremGenerator.update( renderer );
        var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
        pmremCubeUVPacker.update( renderer );
        pngCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
        */

        source.dispose();
        /*
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();
        */

        texture.mapping = THREE.CubeReflectionMapping;
        texture.mapping = THREE.CubeRefractionMapping;
        /*
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        */
        // texture.generateMipmaps = false;
        // texture.flipY = true;
        // this.renderer.toneMappingExposure = 2.0;

        if (typeof callback === 'function') {
          callback(texture);
        }
      }); //

      return loader;
    }
  }, {
    key: "getHDRMap",
    value: function getHDRMap(callback) {
      var _this5 = this;

      var type = THREE.UnsignedByteType; // const type = THREE.FloatType;

      var loader = new THREE.RGBELoader().setType(type).load('img/hdr/studio_small_02_1k.hdr', function (source, sourceData) {
        switch (type) {
          case THREE.UnsignedByteType:
            source.encoding = THREE.RGBEEncoding;
            source.minFilter = THREE.NearestFilter;
            source.magFilter = THREE.NearestFilter;
            break;

          case THREE.FloatType:
            source.encoding = THREE.LinearEncoding;
            source.minFilter = THREE.LinearFilter;
            source.magFilter = THREE.LinearFilter;
            break;
        }

        source.generateMipmaps = false;
        source.flipY = true;
        var cubemapGenerator = new THREE.EquirectangularToCubeGenerator(source, {
          resolution: 512
        });
        _this5.renderer.toneMappingExposure = 2.0;
        var texture = cubemapGenerator.update(_this5.renderer);
        source.dispose();

        if (typeof callback === 'function') {
          callback(texture);
        }
      }); //

      return loader;
    }
  }, {
    key: "getBlue",
    value: function getBlue(texture) {
      var material = new THREE.MeshStandardMaterial({
        color: 0x0007d8,
        // emissive: 0x000066,
        roughness: 0.3,
        metalness: 0.0
      });
      return material;
    }
  }, {
    key: "getGreen",
    value: function getGreen(texture) {
      var material = new THREE.MeshStandardMaterial({
        color: 0x00d84d,
        // emissive: 0x006600,
        roughness: 0.3,
        metalness: 0.0
      });
      return material;
    }
  }, {
    key: "getRed",
    value: function getRed(texture) {
      var material = new THREE.MeshStandardMaterial({
        color: 0xe11e26,
        emissive: 0x4f0300,
        roughness: 0.2,
        metalness: 0.2,
        envMap: texture,
        envMapIntensity: 0.4,
        // The refractionRatio must have value in the range 0 to 1.
        // The default value, very close to 1, give almost invisible glass.
        refractionRatio: 0,
        side: THREE.DoubleSide
      });
      return material;
    }
  }, {
    key: "getClear",
    value: function getClear(texture) {
      var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        refractionRatio: 0.99,
        // reflectivity: 0.99,
        envMap: texture,
        // envMapIntensity: 2.0,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide // blending: THREE.AdditiveBlending,

      });
      return material;
    }
  }, {
    key: "getSilver",
    value: function getSilver(texture) {
      var material = new THREE.MeshStandardMaterial({
        color: 0x999999,
        roughness: 0.5,
        metalness: 0.9,
        // envMap: texture,
        // refractionRatio: 0.0,
        // reflectivity: 0.9,
        side: THREE.DoubleSide
      });
      return material;
    }
  }, {
    key: "updateCubeCamera",
    value: function updateCubeCamera() {
      if (USE_CUBE_CAMERA && this.tau && this.tau.body) {
        var renderer = this.renderer;
        var scene = this.scene; // pingpong

        var count = this.count,
            cubeCamera0 = this.cubeCamera0,
            cubeCamera1 = this.cubeCamera1;
        renderer.setClearColor(0xffffff, 1);
        this.tau.body.visible = false;
        this.addons.visible = true;

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
        this.tau.body.visible = true;
        this.addons.visible = false;
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
    value: function onSave(event) {}
    /*
    try {
    	this.view.orientation = this.orbit.getOrientation();
    } catch (error) {
    	this.debugInfo.innerHTML = error;
    }
    */
    // animation

  }, {
    key: "animate",
    value: function animate() {
      var _this6 = this;

      var renderer = this.renderer;
      renderer.setAnimationLoop(function () {
        _this6.render();
      });
    }
  }, {
    key: "render",
    value: function render(delta) {
      var controls = this.controls;

      if (controls) {
        controls.update();
      } // this.lights.rotation.set(0, this.lights.rotation.y + 0.003, 0);
      // this.tau.rotation.set(Math.cos(this.count / 100) * Math.PI / 180 * 2, Math.cos(this.count / 100) * Math.PI / 180 * 2, 0);


      var renderer = this.renderer;
      var camera = this.camera;
      var scene = this.scene;
      this.updateCubeCamera();
      renderer.render(scene, camera);
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
	const options = {
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

},{"./three/const":2,"./three/interactive.mesh":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./emittable.mesh":3}]},{},[1]);
//# sourceMappingURL=tau.js.map
