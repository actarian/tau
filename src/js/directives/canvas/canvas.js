/* jshint esversion: 6 */

import * as dat from 'dat.gui';
import { TEST_ENABLED } from './three/const';
import Emittable from './three/emittable';
import InteractiveMesh from './three/interactive.mesh';

const USE_CUBE_CAMERA = true;
const COLORS = [0xFFFFFF, 0xFC4445, 0xFEEE6, 0x55BCC9, 0x97CAEF, 0xCAFAFE];

export default class Canvas extends Emittable {

	get anchor() {
		return this.anchor_;
	}

	set anchor(anchor) {
		if (this.anchor_ !== anchor) {
			this.anchor_ = anchor;
			this.tweenTau(anchor);
		}
	}

	get bristle() {
		return this.bristle_;
	}

	set bristle(bristle) {
		if (this.bristle_ !== bristle) {
			this.bristle_ = bristle;
			this.setBristle(bristle);
		}
	}

	get color() {
		return this.color_;
	}

	set color(color) {
		console.log('set color', color);
		if (this.color_ !== color) {
			this.color_ = color;
			this.setColor(color);
		}
	}

	get zoom() {
		let r;
		if (this.container.offsetWidth > 1024) {
			r = this.container.offsetWidth / 1080;
		} else {
			r = this.container.offsetWidth / 512;
		}
		return (this.zoom_ + r) * 0.6;
	}

	constructor(container, model) {
		super();
		this.container = container;
		this.model = model || 'models/tau-marin_5.obj'; // 'models/scalare-33-b/scalare-33-b.obj',
		this.colorIndex = 0;
		this.count = 0;
		this.mouse = { x: 0, y: 0 };
		this.parallax = { x: 0, y: 0 };
		this.size = { width: 0, height: 0, aspect: 0 };
		this.zoom_ = 0;
		this.cameraDirection = new THREE.Vector3();
		// const debugInfo = this.debugInfo = section.querySelector('.debug__info');
		// const debugSave = this.debugSave = section.querySelector('.debug__save');
		// Dom.detect(body);
		// body.classList.add('ready');
		this.onWindowResize = this.onWindowResize.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseWheel = this.onMouseWheel.bind(this);
		this.onSave = this.onSave.bind(this);
		const scene = this.scene = this.addScene();
		const camera = this.camera = this.addCamera();
		// const addons = this.addons = this.addBoxes(scene);
		const addons = this.addons = this.addSpheres(scene);
		this.getCubeCamera();
		const texture = this.cubeCamera1.renderTarget.texture;
		// const hdr = this.hdr = this.getEnvMap((texture, textureData) => {
		// this.addText('Scalare 33', scene);
		const tau = this.tau = this.addTau(scene, texture);
		const lights = this.lights = this.addLights(scene);
		// this.tweenTau();
		// });
		this.pixelRatio = Math.max(window.devicePixelRatio, 1.0); // !!! 1.5
		const renderer = this.renderer = this.addRenderer();
		const composer = this.composer = this.addComposer();
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
        */
		// this.debugSave.addEventListener('click', this.onSave, false);
		// this.section.classList.add('init');

		this.onWindowResize();

		// this.updateBackgroundColor();

		const gui = this.gui = this.addGUI();
	}

	addGUI() {
		const gui = new dat.GUI();
		const keys = ['green', 'blue', 'red', 'silver', 'clear'];
		const properties = {};
		const onChange = (...rest) => {
			// console.log(rest);
			keys.forEach(key => {
				const m = properties[key];
				const material = this[key];
				material.color.setHex(m.color);
				if (key === 'clear') {
					material.refractionRatio = m.refractionRatio;
					material.reflectivity = m.reflectivity;
					material.opacity = m.opacity;
				} else {
					material.roughness = m.roughness;
					material.metalness = m.metalness;
				}
			});
			this.camera.zoom = properties.zoom;
			this.camera.updateProjectionMatrix();
		};
		properties.zoom = this.camera.zoom;
		const folders = keys.map(key => {
			const m = properties[key] = {};
			const material = this[key];
			m.color = material.color.getHex();
			const folder = gui.addFolder(key);
			folder.addColor(m, 'color').onFinishChange(onChange);
			if (key === 'clear') {
				m.refractionRatio = material.refractionRatio;
				m.reflectivity = material.reflectivity;
				m.opacity = material.opacity;
				folder.add(m, 'refractionRatio', 0.0, 1.0, 0.01).onFinishChange(onChange);
				folder.add(m, 'reflectivity', 0.0, 1.0, 0.01).onFinishChange(onChange);
				folder.add(m, 'opacity', 0.0, 1.0, 0.01).onFinishChange(onChange);
			} else {
				m.roughness = material.roughness;
				m.metalness = material.metalness;
				folder.add(m, 'roughness', 0.0, 1.0, 0.01).onFinishChange(onChange);
				folder.add(m, 'metalness', 0.0, 1.0, 0.01).onFinishChange(onChange);
			}
			return folder;
		});
		gui.add(properties, 'zoom', 0.1, 1.0, 0.01).onFinishChange(onChange);
		const callback = {
			snapshot: this.onSave,
		};
		gui.add(callback, 'snapshot');
		gui.close();
		// dat.GUI.toggleHide();
		return gui;
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
			// preserveDrawingBuffer: true, // !!! REMOVE IN PRODUCTION
			alpha: true,
		});
		this.renderer = renderer;
		renderer.setClearColor(0xffffff, 0);
		// renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setPixelRatio(this.pixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
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
		camera.position.set(0, 0, 40);
		camera.target = new THREE.Vector3();
		camera.zoom = this.zoom;
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
		return camera;
	}

	addComposer_() {
		const renderer = this.renderer;
		const scene = this.scene;
		const camera = this.camera;
		const composer = new THREE.EffectComposer(renderer);
		const renderPass = new THREE.RenderPass(scene, camera);
		composer.addPass(renderPass);
		const saoPass = new THREE.SAOPass(scene, camera, false, true);
		saoPass.output = THREE.SAOPass.OUTPUT.Default;
		saoPass.saoBias = 0.5;
		saoPass.saoIntensity = 0.18;
		saoPass.saoScale = 1;
		saoPass.saoKernelRadius = 100;
		saoPass.saoMinResolution = 0;
		saoPass.saoBlur = true;
		saoPass.saoBlurRadius = 8;
		saoPass.saoBlurStdDev = 4;
		saoPass.saoBlurDepthCutoff = 0.01;
		composer.addPass(saoPass);
		return composer;
	}

	addComposer__() {
		const renderer = this.renderer;
		const scene = this.scene;
		const camera = this.camera;
		const composer = new THREE.EffectComposer(renderer);
		const ssaoPass = new THREE.SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
		ssaoPass.kernelRadius = 16;
		composer.addPass(ssaoPass);
		return composer;
	}

	addComposer() {
		const renderer = this.renderer;
		const scene = this.scene;
		const camera = this.camera;
		const composer = new THREE.EffectComposer(renderer);
		// const renderPass = new THREE.RenderPass(scene, camera);
		// composer.addPass(renderPass);
		const taaRenderPass = new THREE.TAARenderPass(scene, camera);
		taaRenderPass.sampleLevel = 2;
		taaRenderPass.unbiased = true;
		composer.addPass(taaRenderPass);
		const shaderPass = new THREE.ShaderPass(THREE.ShadowShader);
		composer.addPass(shaderPass);
		return composer;
	}

	addLights(parent) {
		const lights = new THREE.Group();

		const light0 = new THREE.HemisphereLight(0xf4fbfb, 0x91978a, 0.8);
		light0.position.set(0, 10, 0);
		lights.add(light0);
		/*
		const helper0 = new THREE.HemisphereLightHelper(light0, 10, 0x888888);
		lights.add(helper0);
		*/

		const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
		light1.position.set(0, 0, 50);
		/*
		light1.castShadow = true;
		light1.shadow.camera.near = 0.5; // default
		light1.shadow.camera.far = 500; // default
		light1.shadow.mapSize.width = 1024;
		light1.shadow.mapSize.height = 1024;
		*/
		lights.add(light1);

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

	addText(message, parent) {
		const loader = new THREE.FontLoader();
		loader.load('fonts/helvetiker_regular.typeface.json', (font) => {
			this.font = font;
			const material = new THREE.MeshBasicMaterial({
				color: 0xe11e26,
				// transparent: true,
				// opacity: 1,
				// side: THREE.DoubleSide
			});
			this.fontMaterial = material;
			const text = this.setText(message, parent);
		});
	}

	setText(message, parent) {
		message = message || 'Scalare 33';
		if (this.text) {
			this.text.parent.remove(this.text);
			this.text.geometry.dispose();
		}
		const shapes = this.font.generateShapes(message, 0.5);
		const geometry = new THREE.ShapeBufferGeometry(shapes);
		geometry.computeBoundingBox();
		const x = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
		geometry.translate(x, 0, 0);
		const text = new THREE.Mesh(geometry, this.fontMaterial);
		text.position.set(0, 0, -10);
		this.text = text;
		parent.add(text);
		return text;
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
		loader.load(this.model, (object) => {
				let i = 0;
				object.traverse((child) => {

					if (child instanceof THREE.Mesh) {
						// child.geometry.scale(10, 10, 10);
						// THREE.BufferGeometryUtils.mergeVertices(child.geometry);
						// THREE.BufferGeometryUtils.computeTangents(child.geometry);
						// child.geometry.computeFaceNormals();
						// child.geometry.computeVertexNormals(true);
						// child.geometry.computeTangents();
						if (i === 0) {
							child.geometry.computeFaceNormals();
							child.geometry.computeVertexNormals(true);
							child.material = red;
							tau.color = child;
						} else if (i === 1) {
							child.material = clear;
							tau.body = child;
						} else if (i === 2) {
							child.material = silver;
							tau.logo = child;
						} else if (i === 3) {
							child.material = green;
						} else if (i === 4) {
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
				tau.add(object);
				this.setBristle(this.bristle);
				this.setColor(this.color);
				this.emit('load');
			},
			(xhr) => {
				// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			(error) => {
				console.log('An error happened');
			}
		);
		tau.rotation.set(Math.PI / 4, Math.PI - Math.PI / 4, Math.PI / 4);
		parent.add(tau);
		return tau;
	}

	tweenTau(anchor) {
		// [0, 0, Math.PI / 2]; // 										vertical left
		// [0, 0, 0]; // 												horizontal right
		// [Math.PI / 4, Math.PI / 4, Math.PI / 4]; // 					tre quarti destra
		// [Math.PI / 2, 0, 0]; // 										top right
		// [0, Math.PI, Math.PI / 2]; // 								vertical right;
		const sm = window.innerWidth < 1024;
		let rotation, position;
		switch (anchor) {
			case 'hero':
				position = [0, 0, 0];
				rotation = [Math.PI / 4, Math.PI - Math.PI / 4, Math.PI / 4]; // 		tre quarti sinistra
				this.zoom_ = 0;
				this.container.classList.remove('lefted');
				break;
			case 'manico':
				position = [0, 0, 0];
				rotation = [0, Math.PI, Math.PI / 2]; // 								vertical right;
				this.zoom_ = 0;
				if (sm) {
					this.container.classList.add('lefted');
				} else {
					this.container.classList.remove('lefted');
				}
				break;
			case 'testina':
				position = [0, 0, 0];
				rotation = [0, -Math.PI / 2, Math.PI / 32]; // 							testina vista dietro
				this.zoom_ = 0.2;
				if (sm) {
					this.container.classList.add('lefted');
				} else {
					this.container.classList.remove('lefted');
				}
				break;
			case 'setole':
				position = [0, -3, 0];
				rotation = [0, Math.PI - Math.PI / 4, Math.PI / 2]; // 					vertical right;
				this.zoom_ = 0.4;
				if (sm) {
					this.container.classList.add('lefted');
				} else {
					this.container.classList.remove('lefted');
				}
				break;
			case 'scalare':
				position = [0, -3, 0];
				rotation = [0, Math.PI, Math.PI / 2]; // 								vertical right;
				this.zoom_ = 0.4;
				if (sm) {
					this.container.classList.add('lefted');
				} else {
					this.container.classList.remove('lefted');
				}
				break;
			case 'italy':
				position = [0, 0, 0];
				rotation = [Math.PI / 4, Math.PI - Math.PI / 4, Math.PI / 4]; // 		tre quarti sinistra
				this.zoom_ = 0;
				if (sm) {
					this.container.classList.add('lefted');
				} else {
					this.container.classList.remove('lefted');
				}
				break;
			case 'setole-tynex':
				position = [0, -2, 0];
				rotation = [0, 0, Math.PI / 2]; // 										vertical left;
				this.zoom_ = 0.2;
				if (sm) {
					this.container.classList.add('lefted');
				} else {
					this.container.classList.remove('lefted');
				}
				break;
			case 'colors':
				position = [0, 0, 0];
				rotation = [0, Math.PI, 0]; // 											horizontal left
				this.zoom_ = 0;
				this.container.classList.remove('lefted');
				break;
			default:
				position = [0, 0, 0];
				rotation = [Math.PI / 4, Math.PI - Math.PI / 4, Math.PI / 4]; // 		tre quarti sinistra
				this.zoom_ = 0;
				this.container.classList.remove('lefted');
		}
		const tau = this.tau;
		TweenMax.to(this.tau.position, 0.8, {
			x: position[0],
			y: position[1],
			z: position[2],
			ease: Power2.easeInOut,
		});
		TweenMax.to(this.tau.rotation, 1.2, {
			x: rotation[0],
			y: rotation[1],
			z: rotation[2],
			ease: Power2.easeInOut,
		});
		TweenMax.to(this.camera, 0.6, {
			zoom: this.zoom,
			ease: Power2.easeInOut,
			onUpdate: () => {
				this.camera.updateProjectionMatrix();
			}
		});
	}

	tweenColor(material, colorValue) {
		const from = new THREE.Color(material.color.getHex());
		const to = new THREE.Color(colorValue);
		TweenLite.to(from, 0.4, {
			r: to.r,
			g: to.g,
			b: to.b,
			ease: Power2.easeInOut,
			onUpdate: function() {
				material.color = from;
			}
		});
	}

	setBristle(bristle) {
		if (bristle) {
			// console.log('setBristle', bristle);
			const tau = this.tau;
			if (tau.children.length) {
				const object = tau.children[0];
				object.traverse((child) => {
					// console.log(child);
					switch (child.name) {
						case 'corpo_spazzolino_rosso':
						case 'corpo_spazzolino':
						case 'logo':
							break;
						case 'verde':
							// child.material = green;
							this.tweenColor(child.material, bristle.colors[1]);
							break;
						case 'blu':
							// child.material = blue;
							this.tweenColor(child.material, bristle.colors[0]);
							break;
					}
				});
			}
		}
	}

	setColor(color) {
		if (color) {
			// console.log('setColor', color);
			const tau = this.tau;
			if (tau.children.length) {
				const object = tau.children[0];
				object.traverse((child) => {
					// console.log(child);
					switch (child.name) {
						case 'corpo_spazzolino_rosso':
							this.tweenColor(child.material, color.colors[0]);
							// console.log(child.material, color.colors[0]);
							break;
						case 'corpo_spazzolino':
						case 'logo':
						case 'verde':
						case 'blu':
					}
				});
			}
		}
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
			const cubeCamera0 = this.cubeCamera0 = new THREE.CubeCamera(0.01, 1000, 512);
			cubeCamera0.renderTarget.texture.mapping = THREE.CubeRefractionMapping;
			// cubeCamera0.renderTarget.texture.mapping = THREE.CubeUVRefractionMapping;
			// cubeCamera0.renderTarget.texture.mapping = THREE.EquirectangularRefractionMapping;
			cubeCamera0.renderTarget.texture.generateMipmaps = true;
			cubeCamera0.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
			this.scene.add(cubeCamera0);
			const cubeCamera1 = this.cubeCamera1 = new THREE.CubeCamera(0.01, 1000, 512);
			cubeCamera1.renderTarget.texture.mapping = THREE.CubeRefractionMapping;
			// cubeCamera1.renderTarget.texture.mapping = THREE.CubeUVRefractionMapping;
			// cubeCamera1.renderTarget.texture.mapping = THREE.EquirectangularRefractionMapping;
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
		// const lightMap = new THREE.TextureLoader().load('img/scalare-33-blue-lightmap.jpg');
		const material = new THREE.MeshStandardMaterial({
			color: 0x024c99, // 0x1f45c0,
			// emissive: 0x333333,
			// map: lightMap,
			// normalMap: lightMap,
			// metalnessMap: lightMap,
			roughness: 0.9,
			metalness: 0.0,
		});
		return material;
	}

	getGreen(texture) {
		// const lightMap = new THREE.TextureLoader().load('img/scalare-33-green-lightmap.jpg');
		const material = new THREE.MeshStandardMaterial({
			color: 0x15b29a, // 0x1aac4e,
			// emissive: 0x333333,
			// map: lightMap,
			// normalMap: lightMap,
			// metalnessMap: lightMap,
			roughness: 0.9,
			metalness: 0.0,
		});
		return material;
	}

	getRed(texture) {
		const material = new THREE.MeshStandardMaterial({
			color: 0xe11e26,
			// emissive: 0x4f0300,
			roughness: 0.2,
			metalness: 0.2,
			// envMap: texture,
			// envMapIntensity: 0.4,
			// The refractionRatio must have value in the range 0 to 1.
			// The default value, very close to 1, give almost invisible glass.
			// refractionRatio: 0,
			// side: THREE.DoubleSide,
		});
		return material;
	}

	getSilver(texture) {
		const material = new THREE.MeshStandardMaterial({
			color: 0xdddddd,
			roughness: 0.15,
			metalness: 1.0,
			envMap: texture,
			side: THREE.DoubleSide,
		});
		return material;
	}

	getClear(texture) {
		const material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			envMap: texture,
			transparent: true,
			refractionRatio: 0.6,
			reflectivity: 0.8,
			opacity: 0.25,
			/*
			refractionRatio: 0.99,
			reflectivity: 0.99,
			opacity: 0.5,
			*/
			side: THREE.DoubleSide,
			// blending: THREE.AdditiveBlending,
		});
		// material.vertexTangents = true;
		return material;
	}

	addSpheres(parent) {
		const group = new THREE.Group();
		group.visible = false;
		const icosahedron = new THREE.IcosahedronGeometry(200, 1);
		const geometry = new THREE.Geometry();
		icosahedron.vertices.forEach((v, i) => {
			const sphereGeometry = new THREE.IcosahedronGeometry(50, 1);
			sphereGeometry.translate(v.x, v.y, v.z);
			geometry.merge(sphereGeometry);
			sphereGeometry.dispose();
		});
		icosahedron.dispose();
		const material = new THREE.MeshBasicMaterial({ color: 0x111111 });
		const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
		geometry.dispose();
		const spheres_ = new THREE.Mesh(bufferGeometry, material);
		group.add(spheres_);
		group.rotation.set(0.3, 0, 0);
		parent.add(group);
		return group;
	}

	updateCubeCamera() {
		if (USE_CUBE_CAMERA && this.tau && this.tau.body) {
			const renderer = this.renderer;
			const scene = this.scene;
			// pingpong
			const count = this.count,
				cubeCamera0 = this.cubeCamera0,
				cubeCamera1 = this.cubeCamera1;
			renderer.setClearColor(0xfefefe, 1);
			this.tau.body.visible = false;
			this.tau.logo.visible = false;
			this.tau.color.visible = false;
			this.addons.visible = true;
			// renderer.shadowMap.enabled = false;
			if (count % 2 === 0) {
				this.clear.envMap = cubeCamera0.renderTarget.texture;
				this.silver.envMap = cubeCamera0.renderTarget.texture;
				// this.red.envMap = cubeCamera0.renderTarget.texture;
				cubeCamera1.update(renderer, scene);
			} else {
				this.clear.envMap = cubeCamera1.renderTarget.texture;
				this.silver.envMap = cubeCamera1.renderTarget.texture;
				// this.red.envMap = cubeCamera1.renderTarget.texture;
				cubeCamera0.update(renderer, scene);
			}
			this.count = count + 1;
			this.tau.body.visible = true;
			this.tau.logo.visible = true;
			this.tau.color.visible = true;
			this.addons.visible = false;
			/*
			this.addons.rotation.set(
				this.addons.rotation.x + 0.01,
				this.addons.rotation.y + 0.02,
				this.addons.rotation.z + 0.03
			);
			*/
			// renderer.shadowMap.enabled = true;
			renderer.setClearColor(0xffffff, 0);
		}
	}

	// events

	onWindowResize() {
		try {
			const container = this.container,
				renderer = this.renderer,
				camera = this.camera,
				composer = this.composer;
			const size = this.size;
			size.width = container.offsetWidth;
			size.height = container.offsetHeight;
			console.log(container, size);
			const w = size.width;
			const h = size.height;
			size.aspect = w / h;
			if (renderer) {
				renderer.setSize(w, h);
			}
			if (camera) {
				camera.aspect = w / h;
				camera.updateProjectionMatrix();
			}
			if (composer) {
				composer.setSize(w * this.pixelRatio, h * this.pixelRatio);
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
		this.save = true;
	}

	// animation

	render(delta) {
		const controls = this.controls;
		const renderer = this.renderer;
		const camera = this.camera;
		const scene = this.scene;
		if (!this.saving) {
			if (controls) {
				controls.update();
			}
			// this.lights.rotation.set(0, this.lights.rotation.y + 0.003, 0);
			// this.tau.rotation.set(Math.cos(this.count / 100) * Math.PI / 180 * 2, Math.cos(this.count / 100) * Math.PI / 180 * 2, 0);
			this.updateCubeCamera();
			renderer.render(scene, camera);
			const composer = this.composer;
			if (composer) {
				composer.render();
			}
		}
		this.checkForScreenshot(renderer);
	}

	animate() {
		const renderer = this.renderer;
		renderer.setAnimationLoop(() => {
			this.render();
		});
	}

	// utils

	checkForScreenshot(renderer) {
		if (this.save) {
			this.save = false;
			this.saving = true;
			// renderer.preserveDrawingBuffer = true;
			const dataUrl = renderer.domElement.toDataURL('image/png', 0.92);
			// console.log('dataUrl', dataUrl);
			this.saveImage(dataUrl);
			// renderer.preserveDrawingBuffer = false;
			this.saving = false;
			/*
			this.dataUrlToImage(dataUrl).then((image) => {
				this.saveImage(image);
				// renderer.preserveDrawingBuffer = false;
				this.saving = false;
			}, (error) => {
				console.log(error);
				// renderer.preserveDrawingBuffer = false;
				this.saving = false;
            });
            */
		}
	}

	dataUrlToImage(URL) {
		return new Promise(function(resolve, reject) {
			if (!URL) {
				return reject();
			}
			const image = new Image();
			image.onload = () => {
				resolve(image);
			};
			image.onerror = (error) => {
				reject(error);
			};
			image.src = URL;
		});
	}

	saveImage(image, filename = 'snapshot.png') {
		// console.log('saveImage', image);
		if (!image) {
			console.error('Console.save: No picture');
			return;
		}
		// const blob = image; // new Blob(image, { type: 'image/png' });
		const event = document.createEvent('MouseEvents');
		const anchor = document.createElement('a');
		anchor.download = filename;
		anchor.href = image; // window.URL.createObjectURL(blob);
		// anchor.dataset.downloadurl = ['image/png', anchor.download, anchor.href].join(':');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		anchor.dispatchEvent(event);
	}

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

THREE.ShadowShader = {
	uniforms: {
		tDiffuse: {
			value: null
		},
		amount: {
			value: 1.0
		}
	},
	vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,
	fragmentShader: `
		uniform float amount;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		const int blurSize = 5;
		const int horizontalPass = 1;	// 0 or 1 to indicate vertical or horizontal pass
		const float sigma = 5.0;		// The sigma value for the gaussian function: higher value means more blur
										// A good value for 9x9 is around 3 to 5
										// A good value for 7x7 is around 2.5 to 4
										// A good value for 5x5 is around 2 to 3.5
										// ... play around with this based on what you need :)
		const vec2 texOffset = vec2(0.001, 0.001);
		const float PI = 3.14159265;

		const float MAX_ITERATIONS = 100.0;

		vec4 gaussian(sampler2D texture, vec2 p) {
  			float numBlurPixelsPerSide = float(blurSize / 2);
  			// Incremental Gaussian Coefficent Calculation (See GPU Gems 3 pp. 877 - 889)
  			vec3 incrementalGaussian;
  			incrementalGaussian.x = 1.0 / (sqrt(2.0 * PI) * sigma);
  			incrementalGaussian.y = exp(-0.5 / (sigma * sigma));
  			incrementalGaussian.z = incrementalGaussian.y * incrementalGaussian.y;

  			vec4 avgValue = vec4(0.0, 0.0, 0.0, 0.0);
  			float coefficientSum = 0.0;

  			// Take the central sample first...
  			avgValue += texture2D(texture, p) * incrementalGaussian.x;
  			coefficientSum += incrementalGaussian.x;
  			incrementalGaussian.xy *= incrementalGaussian.yz;

			// Go through the remaining 8 vertical samples (4 on each side of the center)
  			for (float i = 1.0; i <= MAX_ITERATIONS; i+= 1.0) {
				if (i >= numBlurPixelsPerSide) {
					break;
				}
    			avgValue += texture2D(texture, p - i * texOffset) * incrementalGaussian.x;
    			avgValue += texture2D(texture, p + i * texOffset) * incrementalGaussian.x;
    			coefficientSum += 2.0 * incrementalGaussian.x;
    			incrementalGaussian.xy *= incrementalGaussian.yz;
  			}

			return avgValue / coefficientSum;
		}

		void main() {
			vec4 color = texture2D(tDiffuse, vUv);

			vec4 shadow = gaussian(tDiffuse, vec2(vUv.x - 0.005, vUv.y + 0.01));
			// vec4 shadow = texture2D(tDiffuse, vec2(vUv.x - 0.005, vUv.y + 0.01));
			shadow.r = shadow.g = shadow.b = 0.0;
			shadow.a *= 0.15;

			vec3 rgb = color.rgb + shadow.rgb;
			float alpha = min(1.0, max(color.a, shadow.a));
			gl_FragColor = vec4(rgb, alpha);
		}
	`
};
