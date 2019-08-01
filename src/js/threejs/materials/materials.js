/* jshint esversion: 6 */

import { MODEL_TYPE } from '../const';

export default class Materials {

	constructor(product) {
		this.product = product;
		const textures = this.textures = this.addTextures();
		const white = this.white = this.getWhite();
		const bodyPrimaryClear = this.bodyPrimaryClear = this.getBodyPrimaryClear();
		const logoSilver = this.logoSilver = this.getLogoSilver();
		const bodySecondary = this.bodySecondary = this.getBodySecondary();
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
		return material;
	}

	getBodyPrimaryClear() {
		let material;
		material = new THREE.MeshMatcapMaterial({
			color: this.product.modelType === MODEL_TYPE.PROFESSIONAL_BLACK ? 0x84807f : 0xf8f8f8,
			matcap: this.textures.matcap15,
			transparent: true,
			opacity: this.product.modelType === MODEL_TYPE.PROFESSIONAL_BLACK ? 0.8 : 0.4,
			alphaTest: 0.2,
			side: THREE.DoubleSide,
		});
		// material.vertexTangents = true;
		return material;
	}

	getBodySecondary() {
		let material;
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
		return material;
	}

	getBristlesPrimary() {
		let material;
		material = new THREE.MeshMatcapMaterial({
			color: this.product.bristles[0].colors[0],
			matcap: this.textures.matcap14,
		});
		if (this.product.modelType === MODEL_TYPE.PROFESSIONAL_WHITE) {
			material.map = this.textures.bristlesWhite;
		} else {
			material.map = this.textures.bristlesLight;
		}
		return material;
	}

	getBristlesSecondary() {
		let material;
		material = new THREE.MeshMatcapMaterial({
			color: this.product.bristles[0].colors[1],
			map: this.textures.bristlesLight,
			matcap: this.textures.matcap14,
		});
		return material;
	}

	getLogoSilver() {
		let material;
		material = new THREE.MeshMatcapMaterial({
			color: 0xffffff,
			map: this.textures.toothbrushLogo,
			matcap: this.textures.matcap00,
			transparent: true,
			alphaTest: 0.1,
		});
		return material;
	}

}
