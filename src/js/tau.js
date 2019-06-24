/* jshint esversion: 6 */
/* global window, document, TweenMax, THREE, WEBVR */

import { ROOM_RADIUS, TEST_ENABLED } from './three/const';
import InteractiveMesh from './three/interactive.mesh';
import Orbit from './three/orbit';

const COLORS = [0xFFFFFF, 0xFC4445, 0xFEEE6, 0x55BCC9, 0x97CAEF, 0xCAFAFE];

class Tau {

	constructor() {
		this.colorIndex = 0;
		this.count = 0;
		this.mouse = { x: 0, y: 0 };
		this.parallax = { x: 0, y: 0 };
		this.size = { width: 0, height: 0, aspect: 0 };
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

	init() {
		const body = this.body = document.querySelector('body');
		const section = this.section = document.querySelector('.tau');
		const container = this.container = section.querySelector('.tau__container');
		const debugInfo = this.debugInfo = section.querySelector('.debug__info');
		const debugSave = this.debugSave = section.querySelector('.debug__save');
		// Dom.detect(body);
		// body.classList.add('ready');
		this.onWindowResize = this.onWindowResize.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseWheel = this.onMouseWheel.bind(this);
		this.onSave = this.onSave.bind(this);
		//
		const scene = this.scene = this.addScene();
		const camera = this.camera = this.addCamera();
		const lights = this.lights = this.addLights(scene);
		const boxes = this.boxes = this.addBoxes(scene);
		const tau = this.tau = this.addTau(scene);
		const renderer = this.renderer = this.addRenderer();
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
		const orbit = this.orbit = new Orbit();
		const dragListener = this.dragListener = orbit.setDragListener(container);
		// raycaster
		const raycaster = this.raycaster = new THREE.Raycaster();
		window.addEventListener('resize', this.onWindowResize, false);
		window.addEventListener('keydown', this.onKeyDown, false);
		document.addEventListener('mousemove', this.onMouseMove, false);
		document.addEventListener('wheel', this.onMouseWheel, false);
		this.container.addEventListener('mousedown', this.onMouseDown, false);
		this.container.addEventListener('mouseup', this.onMouseUp, false);
		this.debugSave.addEventListener('click', this.onSave, false);
		this.section.classList.add('init');
		this.onWindowResize();
		// this.updateBackgroundColor();
	}

	updateBackgroundColor() {
		this.colorIndex++;
		this.colorIndex = this.colorIndex % COLORS.length;
		const color = COLORS[this.colorIndex];
		/*
		const r = Math.floor(Math.random() * 255);
		const g = Math.floor(Math.random() * 255);
		const b = Math.floor(Math.random() * 255);
		*/
		TweenMax.to(this.renderer.domElement, 0.7, {
			backgroundColor: color, // `rgba(${r},${g},${b},1)`,
			delay: 3,
			ease: Power2.easeInOut,
			onUpdate: () => {
				this.boxes.children.forEach(x => {
					x.material.color.setHex(color);
					x.material.needsUpdate = true;
				});
			},
			onComplete: () => {
				this.updateBackgroundColor();
			}
		});
	}

	addRenderer() {
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			// localClippingEnabled: true,
			// logarithmicDepthBuffer: true,
			// premultipliedAlpha: true,
			alpha: true,
		});
		this.renderer = renderer;
		// renderer.shadowMap.enabled = true;
		renderer.setClearColor(0xffffff, 0);
		// renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setPixelRatio(1.5);
		renderer.setSize(window.innerWidth, window.innerHeight);
		// container.innerHTML = '';
		this.container.appendChild(renderer.domElement);
		return renderer;
	}

	addScene() {
		const scene = new THREE.Scene();
		// scene.background = new THREE.Color(0x00000000);
		// scene.background = new THREE.Color(0x404040);
		// scene.fog = new THREE.Fog(scene.background, 10, 700);
		return scene;
	}

	addCamera() {
		const camera = new THREE.PerspectiveCamera(8, window.innerWidth / window.innerHeight, 0.01, 2000);
		camera.zoom = 0.15;
		camera.target = new THREE.Vector3();
		return camera;
	}

	addLights(scene) {
		const lights = new THREE.Group();
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
		const light1 = new THREE.DirectionalLight(0xffffff, 0.9);
		light1.position.set(-60, 5, 50);
		lights.add(light1);

		const light2 = new THREE.DirectionalLight(0xffffff, 0.9);
		light2.position.set(0, 30, 0);
		lights.add(light2);

		const light3 = new THREE.DirectionalLight(0xffffff, 0.9);
		light3.position.set(60, 5, -50);
		lights.add(light3);

		/*
		const geometry = new THREE.BoxGeometry(2, 2, 2);
		const material = new THREE.MeshBasicMaterial({ color: 0xafb3bc });
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(0, 2, 0);
		this.scene.add(cube);
		*/

		/*
		const light4 = new THREE.DirectionalLight(0xffffff, 0.8);
		light4.position.set(50, -100, -50);
		lights.add(light4);
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
		scene.add(dirLightHelper);
		*/
		scene.add(lights);
		return lights;
	}

	getBox(parent) {
		const geometry = new THREE.BoxGeometry(600, 30, 30);
		const material = new THREE.MeshBasicMaterial({ color: 0xafb3bc });
		const cube = new THREE.Mesh(geometry, material);
		parent.add(cube);
		return cube;
	}

	addBoxes(parent) {
		const group = new THREE.Group();
		group.visible = false;

		const boxes = new Array(12).fill(null).map((x, i) => {
			const box = this.getBox(group);
			const r = Math.PI * 2 / 12 * i;
			box.position.set(0, Math.sin(r) * 300, Math.cos(r) * 300);
			return box;
		});

		parent.add(group);
		return group;
	}

	addTau(parent) {
		const tau = new THREE.Group();
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
		const clear = this.clear = this.getClear();
		const silver = this.silver = this.getSilver();
		const red = this.red = this.getRed();
		const blue = this.blue = this.getBlue();
		const green = this.green = this.getGreen();
		const loader = new THREE.OBJLoader();
		loader.load('models/scalare-33-b/scalare-33-b.obj',
			(object) => {
				let i = 0;
				object.traverse((child) => {
					// console.log(child);
					if (child instanceof THREE.Mesh) {
						// child.geometry.computeVertexNormals(true);
						child.geometry.scale(150, 150, 150);
						child.geometry.rotateX(-Math.PI / 2);
						// child.geometry.rotateY(Math.PI);
						// child.geometry.rotateZ(Math.PI);
						// child.geometry.scale(0.7, 0.7, 0.7);
						// child.geometry.translate(-70, 0, 0);
						// child.geometry.rotateY(Math.PI / 2);
						// child.geometry.rotateY(Math.PI);
						if (i === 0) {
							child.material = red;
						} else if (i === 1) {
							child.material = green;
						} else if (i === 2) {
							child.material = blue;
						} else if (i === 3) {
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
				this.addLogo(object);
				// object.material = material;
				// object.rotateZ(Math.PI / 8);
				console.log(object);
				tau.add(object);
			},
			(xhr) => {
				// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			(error) => {
				console.log('An error happened');
			}
		);
		parent.add(tau);
		return tau;
	}

	addLogo(parent) {
		const geometry = new THREE.PlaneGeometry(24, 3, 3, 1);
		geometry.rotateX(-Math.PI / 2);
		geometry.translate(20, 2, 0);
		geometry.rotateY(Math.PI);
		// geometry.translate(0, 2.2, -24);
		const logo = new THREE.Mesh(geometry, this.silver);
		parent.add(logo);
		return logo;
	}

	getCubeCamera() {
		const cubeCamera0 = this.cubeCamera0 = new THREE.CubeCamera(0.01, 1000, 512);
		cubeCamera0.renderTarget.texture.generateMipmaps = true;
		cubeCamera0.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.scene.add(cubeCamera0);
		const cubeCamera1 = this.cubeCamera1 = new THREE.CubeCamera(0.01, 1000, 512);
		cubeCamera1.renderTarget.texture.generateMipmaps = true;
		cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.scene.add(cubeCamera1);
	}

	getEnvMap() {
		const textures = [
			'img/cubemaps/lights/',
			'img/cubemaps/park/',
			'img/cubemaps/pond/',
			'img/cubemaps/lake/',
			'img/cubemaps/square/'
		];
		const index = 0;
		const urls = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'];
		// const texture = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping(), render);
		const texture = new THREE.CubeTextureLoader().setPath(textures[index]).load(urls);
		texture.mapping = THREE.CubeRefractionMapping;
		// texture.render = render;
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

	getBlue() {
		const material = new THREE.MeshStandardMaterial({
			color: 0x0000ff,
			// emissive: 0x000066,
			roughness: 0.0,
			metalness: 0.0,
			side: THREE.DoubleSide,
		});
		return material;
	}

	getGreen() {
		const material = new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			// emissive: 0x006600,
			roughness: 0.0,
			metalness: 0.0,
			side: THREE.DoubleSide,
		});
		return material;
	}

	getRed() {
		const material = new THREE.MeshStandardMaterial({
			color: 0xe11e26,
			emissive: 0x4f0300,
			roughness: 0.2,
			metalness: 0.2,
			envMap: this.cubeCamera1.renderTarget.texture,
			envMapIntensity: 0.4,
			// The refractionRatio must have value in the range 0 to 1.
			// The default value, very close to 1, give almost invisible glass.
			refractionRatio: 0,
			side: THREE.DoubleSide,
		});
		return material;
	}

	getClear() {
		const material = new THREE.MeshPhysicalMaterial({
			color: 0xe0e3e5, // 0xc9d3da,
			roughness: 0.0,
			metalness: 1.0,
			reflectivity: 1.0,
			clearCoat: 1.0,
			clearCoatRoughness: 1.0,
			envMap: this.cubeCamera1.renderTarget.texture,
			// The refractionRatio must have value in the range 0 to 1.
			// The default value, very close to 1, give almost invisible glass.
			refractionRatio: 0.99,
			// wireframe: true,
			transparent: true,
			opacity: 0.5,
			/*
			side: THREE.DoubleSide,
			*/
		});
		if (false) {
			material.reflectivity = 0.5; // determines the fraction of light that is transmitted
		}
		return material;
	}

	getSilver() {
		const loader = new THREE.TextureLoader();
		const texture = loader.load('img/logo.jpg');
		const material = new THREE.MeshStandardMaterial({
			color: 0xaaaaaa,
			alphaMap: texture,
			roughness: 0.0,
			metalness: 0.99,
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
			alphaTest: 0.5, // if transparent is false
			transparent: false,
			// transparent: false,
			// opacity: 1,
			side: THREE.DoubleSide,
		});
		return material;
	}

	updateCubeCamera() {
		if (this.tau.child) {
			const renderer = this.renderer;
			const scene = this.scene;
			// pingpong
			const count = this.count,
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
	}

	// events

	onWindowResize() {
		try {
			const container = this.container,
				renderer = this.renderer,
				camera = this.camera;
			const size = this.size;
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

	onKeyDown(e) {
		try {
			// console.log(e.which, e.key);
			const key = `${e.which} ${e.key}`;
			this.debugInfo.innerHTML = key;
		} catch (error) {
			this.debugInfo.innerHTML = error;
		}
	}

	onMouseDown(event) {
		if (TEST_ENABLED) {
			// this.dragListener.start();
			this.controllers.setText('down');
			return;
		}
		try {
			this.mousedown = true;
			const raycaster = this.raycaster;
			raycaster.setFromCamera(this.mouse, this.camera);
		} catch (error) {
			this.debugInfo.innerHTML = error;
		}
	}

	onMouseMove(event) {
		try {
			const w2 = this.container.offsetWidth / 2;
			const h2 = this.container.offsetHeight / 2;
			this.mouse = {
				x: (event.clientX - w2) / w2,
				y: -(event.clientY - h2) / h2,
			};
			const raycaster = this.raycaster;
			raycaster.setFromCamera(this.mouse, this.camera);
			InteractiveMesh.hittest(raycaster, this.mousedown);
		} catch (error) {
			this.debugInfo.innerHTML = error;
		}
	}

	onMouseUp(event) {
		if (TEST_ENABLED) {
			// this.dragListener.end();
			this.controllers.setText('up');
			return;
		}
		console.log(this.camera.position);
		this.mousedown = false;
	}

	onMouseWheel(event) {
		try {
			const camera = this.camera;
			const fov = camera.fov + event.deltaY * 0.01;
			camera.fov = THREE.Math.clamp(fov, 30, 75);
			camera.updateProjectionMatrix();
		} catch (error) {
			this.debugInfo.innerHTML = error;
		}
	}

	onSave(event) {
		try {
			this.view.orientation = this.orbit.getOrientation();
		} catch (error) {
			this.debugInfo.innerHTML = error;
		}
	}

	// animation

	animate() {
		const renderer = this.renderer;
		renderer.setAnimationLoop(() => {
			this.render();
		});
	}

	render(delta) {
		const controls = this.controls;
		controls.update();
		// this.lights.rotation.set(0, this.lights.rotation.y + 0.003, 0);
		// this.tau.rotation.set(Math.cos(this.count / 100) * Math.PI / 180 * 2, Math.cos(this.count / 100) * Math.PI / 180 * 2, 0);
		const renderer = this.renderer;
		const camera = this.camera;
		const scene = this.scene;
		this.updateCubeCamera();
		renderer.render(scene, camera);
	}

	updateCamera() {
		const orbit = this.orbit;
		const camera = this.camera;
		orbit.update();
		camera.target.x = ROOM_RADIUS * Math.sin(orbit.phi) * Math.cos(orbit.theta);
		camera.target.y = ROOM_RADIUS * Math.cos(orbit.phi);
		camera.target.z = ROOM_RADIUS * Math.sin(orbit.phi) * Math.sin(orbit.theta);
		camera.lookAt(camera.target);
		/*
		// distortion
		camera.position.copy( camera.target ).negate();
		*/
	}

	// utils

	saveData(data, filename = 'console.json') {
		if (!data) {
			console.error('Console.save: No data');
			return;
		}
		if (typeof data === 'object') {
			data = JSON.stringify(data, undefined, 4);
		}
		const blob = new Blob([data], { type: 'text/json' });
		const event = document.createEvent('MouseEvents');
		const anchor = document.createElement('a');
		anchor.download = filename;
		anchor.href = window.URL.createObjectURL(blob);
		anchor.dataset.downloadurl = ['text/json', anchor.download, anchor.href].join(':');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		anchor.dispatchEvent(event);
	}

}

const tau = new Tau();
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
