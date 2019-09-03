/* jshint esversion: 6 */

import { MODEL_TYPE } from '../const';

export default class Materials {

	constructor(product, vrenabled, texture) {
		this.product = product;
		this.vrenabled = vrenabled;
		/*
		const texture = new THREE.loader().load('threejs/matcap.jpg');
		const material = new THREE.MeshMatcapMaterial({
			color: 0xffffff,
			matcap: texture,
			transparent: true,
			opacity: 1,
		});
		*/
		// const texture = this.getEnvMap();

		const textures = this.textures = this.addTextures();

		const white = this.white = this.getWhite();
		const bodyPrimaryClear = this.bodyPrimaryClear = this.getBodyPrimaryClear(texture);
		const logoSilver = this.logoSilver = this.getLogoSilver(texture);
		const bodySecondary = this.bodySecondary = this.getBodySecondary(texture);
		const bristlesPrimary = this.bristlesPrimary = this.getBristlesPrimary();
		const bristlesSecondary = this.bristlesSecondary = this.getBristlesSecondary();
	}

	addTextures() {
		const loader = new THREE.TextureLoader();
		const textures = {
			// equirectangular: loader.load('threejs/environment/equirectangular-sm.jpg'),
			matcap00: loader.load('threejs/matcap/matcap-00.jpg'),
			// matcap02: loader.load('threejs/matcap/matcap-02.jpg'),
			// matcap06: loader.load('threejs/matcap/matcap-06.jpg'),
			// matcap11: loader.load('threejs/matcap/matcap-11.jpg'),
			// matcap13: loader.load('threejs/matcap/matcap-13.jpg'),
			matcap14: loader.load('threejs/matcap/matcap-14.jpg'),
			matcap15: loader.load('threejs/matcap/matcap-15.jpg'),
			// matcap16: loader.load('threejs/matcap/matcap-16.jpg'),
			// matcap17: loader.load('threejs/matcap/matcap-17.jpg'),
			bristlesLight: loader.load('threejs/models/toothbrush/bristles-light.jpg'),
			bristlesWhite: loader.load('threejs/models/toothbrush/bristles-white.jpg'),
			toothbrushLogo: loader.load('threejs/models/toothbrush/toothbrush-logo.png'),
		};
		return textures;
	}

	getWhite() {
		let material;
		if (this.vrenabled) {
			material = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				emissive: 0x333333,
				roughness: 0.2,
				metalness: 0.2,
			});
			/*
			material = new THREE.MeshMatcapMaterial({
				color: 0xffffff,
				matcap: this.textures.matcap06,
			});
			*/
		} else {
			material = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				roughness: 0.2,
				metalness: 0.2,
			});
		}
		return material;
	}

	getBodyPrimaryClear(texture) {
		let material;
		if (this.vrenabled) {
			material = new THREE.MeshMatcapMaterial({
				color: this.product.modelType === MODEL_TYPE.PROFESSIONAL_BLACK ? 0x84807f : 0xf8f8f8,
				matcap: this.textures.matcap15,
				transparent: true,
				opacity: this.product.modelType === MODEL_TYPE.PROFESSIONAL_BLACK ? 0.8 : 0.4,
				alphaTest: 0.2,
				side: THREE.DoubleSide,
			});
		} else {
			/*
			material = new THREE.MeshMatcapMaterial({
				color: 0xeeeeee,
				matcap: this.textures.equirectangular,
				transparent: true,
				opacity: 0.4,
				alphaTest: 0.2,
				side: THREE.DoubleSide,
			});
			*/
			material = new THREE.MeshPhongMaterial({
				color: this.product.modelType === MODEL_TYPE.PROFESSIONAL_BLACK ? 0x84807f : 0xf8f8f8,
				envMap: texture,
				transparent: true,
				refractionRatio: 0.6,
				reflectivity: 0.8,
				opacity: this.product.modelType === MODEL_TYPE.PROFESSIONAL_BLACK ? 0.375 : 0.25,
				alphaTest: 0.2,
				// refractionRatio: 0.99,
				// reflectivity: 0.99,
				// opacity: 0.5,
				side: THREE.DoubleSide,
				// blending: THREE.AdditiveBlending,
			});
		}
		// material.vertexTangents = true;
		return material;
	}

	getBodySecondary(texture) {
		let material;
		if (this.vrenabled) {
			material = new THREE.MeshPhongMaterial({
				color: this.product.colors[0].colors[0],
				shininess: 100,
			});
			/*
			material = new THREE.MeshMatcapMaterial({
				color: this.product.colors[0].colors[0],
				matcap: this.textures.matcap13,
			});
			*/
		} else {
			material = new THREE.MeshStandardMaterial({
				color: this.product.colors[0].colors[0],
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
		}
		return material;
	}

	getBristlesPrimary(texture) {
		let material;
		if (this.vrenabled) {
			material = new THREE.MeshMatcapMaterial({
				color: this.product.bristles[0].colors[0],
				matcap: this.textures.matcap14,
			});
		} else {
			material = new THREE.MeshStandardMaterial({
				color: this.product.bristles[0].colors[0], // 0x1f45c0,
				// emissive: 0x333333,
				// map: lightMap,
				// normalMap: lightMap,
				// metalnessMap: lightMap,
				roughness: 0.9,
				metalness: 0.0,
			});
		}
		if (this.product.modelType === MODEL_TYPE.PROFESSIONAL_WHITE) {
			material.map = this.textures.bristlesWhite;
		} else {
			material.map = this.textures.bristlesLight;
		}
		return material;
	}

	getBristlesSecondary(texture) {
		let material;
		if (this.vrenabled) {
			material = new THREE.MeshMatcapMaterial({
				color: this.product.bristles[0].colors[1],
				map: this.textures.bristlesLight,
				matcap: this.textures.matcap14,
			});
		} else {
			material = new THREE.MeshStandardMaterial({
				color: this.product.bristles[0].colors[1], // 0x1aac4e,
				map: this.textures.bristlesLight,
				// emissive: 0x333333,
				// map: lightMap,
				// normalMap: lightMap,
				// metalnessMap: lightMap,
				roughness: 0.9,
				metalness: 0.0,
			});
		}
		return material;
	}

	getLogoSilver() {
		let material;
		if (this.vrenabled) {
			material = new THREE.MeshMatcapMaterial({
				color: 0xffffff,
				map: this.textures.toothbrushLogo,
				matcap: this.textures.matcap00,
				transparent: true,
				alphaTest: 0.1,
			});
		} else {
			if (this.product.modelType === MODEL_TYPE.PROFESSIONAL_BLACK) {
				material = new THREE.MeshMatcapMaterial({
					color: 0xffffff,
					map: this.textures.toothbrushLogo,
					matcap: this.textures.matcap00,
					transparent: true,
					alphaTest: 0.1,
				});
			} else {
				material = new THREE.MeshStandardMaterial({
					color: 0xffffff,
					map: this.textures.toothbrushLogo,
					transparent: true,
					roughness: 0.15,
					metalness: 0.9,
					// envMap: texture,
					// side: THREE.DoubleSide,
					//
					// opacity: 1,
					// alphaTest: 0.1,
				});
			}
		}
		return material;
	}

}
