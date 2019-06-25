/* jshint esversion: 6 */
/* global window, document, TweenMax, THREE, WEBVR */

import { TEST_ENABLED } from './three/const';
import InteractiveMesh from './three/interactive.mesh';

const USE_CUBE_CAMERA = true;
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
		// const addons = this.addons = this.addBoxes(scene);
		const addons = this.addons = this.addSpheres(scene);
		this.getCubeCamera();
		const texture = this.cubeCamera1.renderTarget.texture;

		// const hdr = this.hdr = this.getEnvMap((texture, textureData) => {
		const tau = this.tau = this.addTau(scene, texture);
		// const lights = this.lights = this.addLights(tau);
		this.tweenTau();
		// });
		const renderer = this.renderer = this.addRenderer();
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
				this.addons.children.forEach(x => {
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
		/*
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
		*/
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
		camera.zoom = 0.25;
		camera.target = new THREE.Vector3();
		return camera;
	}

	addLights(parent) {
		const lights = new THREE.Group();

		const light0 = new THREE.HemisphereLight(0xf4fbfb, 0x91978a, 0.9);
		light0.position.set(0, 10, 0);
		lights.add(light0);
		/*
		const helper0 = new THREE.HemisphereLightHelper(light0, 10, 0x888888);
		lights.add(helper0);
		*/

		const light1 = new THREE.DirectionalLight(0xffffff, 1.4);
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

	addBox(parent) {
		const geometry = new THREE.BoxGeometry(600, 30, 30);
		const material = new THREE.MeshBasicMaterial({ color: 0xafb3bc });
		const cube = new THREE.Mesh(geometry, material);
		parent.add(cube);
		return cube;
	}

	addBoxes(parent) {
		const group = new THREE.Group();
		group.visible = true;
		const boxes = new Array(12).fill(null).map((x, i) => {
			const box = this.addBox(group);
			const r = Math.PI * 2 / 12 * i;
			box.position.set(0, Math.sin(r) * 300, Math.cos(r) * 300);
			return box;
		});
		parent.add(group);
		return group;
	}

	addSpheres(parent) {
		const group = new THREE.Group();
		group.visible = false;
		const icosahedron = new THREE.IcosahedronGeometry(200, 1);
		const geometry = new THREE.Geometry();
		icosahedron.vertices.forEach((v, i) => {
			const sphereGeometry = new THREE.SphereGeometry(30, 12, 12);
			sphereGeometry.translate(v.x, v.y, v.z);
			geometry.merge(sphereGeometry);
			sphereGeometry.dispose();
		});
		icosahedron.dispose();
		const material = new THREE.MeshBasicMaterial({ color: 0x9196a1 });
		const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
		geometry.dispose();
		const spheres_ = new THREE.Mesh(bufferGeometry, material);
		group.add(spheres_);
		parent.add(group);
		return group;
	}

	addTau(parent, texture) {
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
		const clear = this.clear = this.getClear(texture);
		const silver = this.silver = this.getSilver(texture);
		const red = this.red = this.getRed(texture);
		const blue = this.blue = this.getBlue();
		const green = this.green = this.getGreen();
		const loader = new THREE.OBJLoader();
		loader.load(
			'models/tau-marin_2.obj',
			// 'models/scalare-33-b/scalare-33-b.obj',
			(object) => {
				let i = 0;
				object.traverse((child) => {
					// console.log(child);
					if (child instanceof THREE.Mesh) {
						/*
						child.castShadow = true;
						child.receiveShadow = true;
						*/
						child.geometry.scale(10, 10, 10);
						// child.geometry.rotateX(-Math.PI / 2);
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
				});
				// this.addLogo(object);
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

	tweenTau() {
		const rotations = [
            [Math.PI / 4, Math.PI / 4, Math.PI / 4],
            [Math.PI / 4, Math.PI - Math.PI / 4, Math.PI / 4],
            [0, 0, Math.PI / 2],
            [Math.PI / 2, 0, 0],
            [Math.PI / 4, Math.PI / 4, 0],
            [0, -Math.PI / 2, Math.PI / 16]
        ];
		const tau = this.tau;
		let ri = tau.ri !== undefined ? tau.ri : -1;
		ri++;
		ri = ri % rotations.length;
		tau.ri = ri;
		console.log(tau, ri);
		const rotation = rotations[ri];
		TweenMax.to(this.tau.rotation, 0.7, {
			x: rotation[0],
			y: rotation[1],
			z: rotation[2],
			delay: 4,
			onComplete: () => {
				this.tweenTau();
			}
		});
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
		if (USE_CUBE_CAMERA) {
			const cubeCamera0 = this.cubeCamera0 = new THREE.CubeCamera(0.01, 1000, 256);
			cubeCamera0.renderTarget.texture.generateMipmaps = true;
			cubeCamera0.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
			this.scene.add(cubeCamera0);
			const cubeCamera1 = this.cubeCamera1 = new THREE.CubeCamera(0.01, 1000, 256);
			cubeCamera1.renderTarget.texture.generateMipmaps = true;
			cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
			this.scene.add(cubeCamera1);
		}
	}

	getEnvMap_(callback) {
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
		const loader = new THREE.CubeTextureLoader().setPath(textures[index]).load(urls, (texture, textureData) => {
			texture.mapping = THREE.CubeRefractionMapping;
			if (typeof callback === 'function') {
				callback(texture, textureData);
			}
		});
		return loader;
	}

	getEnvMap(callback) {
		const loader = new THREE.TextureLoader().load('img/hdr-04.jpg', (source, textureData) => {
			// source.encoding = THREE.sRGBEncoding;
			source.mapping = THREE.UVMapping;
			const options = {
				resolution: 1024,
				generateMipmaps: true,
				minFilter: THREE.LinearMipMapLinearFilter,
				magFilter: THREE.LinearFilter
			};
			// this.scene.background = new THREE.CubemapGenerator(this.renderer).fromEquirectangular(source, options);
			const cubemapGenerator = new THREE.EquirectangularToCubeGenerator(source, options);
			// pngBackground = cubemapGenerator.renderTarget;
			const texture = cubemapGenerator.update(this.renderer);
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
		});
		//
		return loader;
	}

	getHDRMap(callback) {
		const type = THREE.UnsignedByteType;
		// const type = THREE.FloatType;
		const loader = new THREE.RGBELoader().setType(type).load('img/hdr/studio_small_02_1k.hdr', (source, sourceData) => {
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

			const cubemapGenerator = new THREE.EquirectangularToCubeGenerator(source, { resolution: 512 });
			this.renderer.toneMappingExposure = 2.0;
			const texture = cubemapGenerator.update(this.renderer);

			source.dispose();

			if (typeof callback === 'function') {
				callback(texture);
			}
		});
		//
		return loader;
	}

	getBlue(texture) {
		const material = new THREE.MeshStandardMaterial({
			color: 0x0007d8,
			// emissive: 0x000066,
			roughness: 0.3,
			metalness: 0.0,
		});
		return material;
	}

	getGreen(texture) {
		const material = new THREE.MeshStandardMaterial({
			color: 0x00d84d,
			// emissive: 0x006600,
			roughness: 0.3,
			metalness: 0.0,
		});
		return material;
	}

	getRed(texture) {
		const material = new THREE.MeshStandardMaterial({
			color: 0xe11e26,
			emissive: 0x4f0300,
			roughness: 0.2,
			metalness: 0.2,
			envMap: texture,
			envMapIntensity: 0.4,
			// The refractionRatio must have value in the range 0 to 1.
			// The default value, very close to 1, give almost invisible glass.
			refractionRatio: 0,
			side: THREE.DoubleSide,
		});
		return material;
	}

	getClear(texture) {
		const material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			refractionRatio: 0.99,
			// reflectivity: 0.99,
			envMap: texture,
			// envMapIntensity: 2.0,
			transparent: true,
			opacity: 0.3,
			side: THREE.DoubleSide,
			// blending: THREE.AdditiveBlending,
		});
		return material;
	}

	getSilver(texture) {
		const material = new THREE.MeshStandardMaterial({
			color: 0x999999,
			roughness: 0.5,
			metalness: 0.9,
			// envMap: texture,
			// refractionRatio: 0.0,
			// reflectivity: 0.9,
			side: THREE.DoubleSide,
		});
		return material;
	}

	updateCubeCamera() {
		if (USE_CUBE_CAMERA && this.tau && this.tau.body) {
			const renderer = this.renderer;
			const scene = this.scene;
			// pingpong
			const count = this.count,
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
		/*
		try {
			this.view.orientation = this.orbit.getOrientation();
		} catch (error) {
			this.debugInfo.innerHTML = error;
		}
		*/
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
		if (controls) {
			controls.update();
		}
		// this.lights.rotation.set(0, this.lights.rotation.y + 0.003, 0);
		// this.tau.rotation.set(Math.cos(this.count / 100) * Math.PI / 180 * 2, Math.cos(this.count / 100) * Math.PI / 180 * 2, 0);
		const renderer = this.renderer;
		const camera = this.camera;
		const scene = this.scene;
		this.updateCubeCamera();
		renderer.render(scene, camera);
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
