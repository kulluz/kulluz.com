import React, {useRef, useEffect, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import Tooltip from './components/Tooltip';
import ReactDOM from 'react-dom';
import turf from 'turf';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from '/imports/vendor/stats';
import {Threebox} from 'threebox-plugin';
import GUI from 'lil-gui';
import {Documents} from '../api/documents';

import {useTracker} from 'meteor/react-meteor-data';

excavator = null;
tb = null;
truck = null;
map = null;
// Mapboxgl.accessToken = 'sk.eyJ1IjoiYWQzbGZyOSIsImEiOiJjbDV3aTJqMnAwZHhqM2NuejdmNG5vOXViIn0.pPr5bIwwGub8wEojYEU8Nw'
mapboxgl.accessToken = 'pk.eyJ1IjoiYWQzbGZyOSIsImEiOiJjbDVnaWc1anAxbGluM2tsMWlvYXlsdXZuIn0.Rgg5v9gdsihBtNGB0Lh26Q';
const MapRemoteControl = ({mapProbs, pinRouteGeojson}) => {
	// Const [modelTransform, setModelTransform] = useState()
	const [lngLat, setLngLat] = useState({lng: 6.58968, lat: 45.39701});
	const [origin, setOrigin] = useState([ 11.959637, 57.720266]);
	const [renderer, setRenderer] = useState(null);
	const mapContainerRef = useRef(null);
	const tooltipRef = useRef(new mapboxgl.Popup({offset: 15}));
	const [lastCheckin, setLastCheckin] = useState(null);
	const [selected, setSelected] = useState(false);
	console.log({mapboxgl});

	const [locatables, setLocatables] = useState([]);

	const features = useTracker(() => Documents.find({type: 'Feature'}, {limit: 10}).fetch());

	console.log(features.length);

	navigator.geolocation.getCurrentPosition(
		(position) => {
	  console.log({position});
		},
		(error) => {
	  console.error('Error Code = ' + error.code + ' - ' + error.message);
		},
	);
 11.959637, 57.720266
	// Initialize map when component mounts
	useEffect(async () => {
		let line;

		const minZoom = 12;
		const mapConfig = {
			map: {center: [-122.4301905, 37.7298202], zoom: 22, pitch: 60, bearing: 38},
			truck: {origin: [-122.4301905, 37.7298202, 0], type: 'glb', model: './models/vehicles/car', rotation: {x: 90, y: -90, z: 0}, scale: 5, startRotation: {x: 0, y: 0, z: -38}, date: new Date(2020, 6, 19, 23)},
			names: {
				compositeSource: 'composite',
				compositeSourceLayer: 'building',
				compositeLayer: '3d-buildings',
			},
		};

	    map = new mapboxgl.Map({
			style: 'mapbox://styles/mapbox/satellite-streets-v11',
			container: mapContainerRef.current,
			zoom: 16,
			center: origin,
			pitch: 40,
			bearing: 70,
			attributionControl: false,
			interactive: true,
			hash: false,
			antialias: true, // Create the gl context with MSAA antialiasing, so custom layers are antialiased
		});

		tb = new Threebox(
			map,
			map.getCanvas().getContext('webgl'),
			{
				realSunlight: true,
				enableSelectingObjects: true,
				enableDraggingObjects: true,
				enableRotatingObjects: true,
				enableTooltips: true,
			},
		);

		tb.setSunlight(new Date(2020, 6, 19, 23), map.getCenter());

		function createCustomLayer(layerName) {
			let model;
			// Create the layer
			const customLayer3D = {
				id: layerName,
				type: 'custom',
				renderingMode: '3d',
				onAdd(map, gl) {
					tb.loadObj({
						type: 'gltf',
						obj: 'https://raw.githubusercontent.com/kulluz/kulluz.com/main/public/taxi/scene.gltf',
						scale: 1,
						units: 'meters',
						anchor: 'bottom',
						tooltip: true,
						rotation: {x: 90, y: 0, z: 0}, // Rotation to postiion the truck and heading properly
					}, (model) => {
						truck = model.setCoords(origin);
						// Truck.setRotation(); //turn it to the initial street way
						// truck.addTooltip("Drive with WASD keys", true, truck.anchor, true, 2);
						truck.castShadow = true;
						truck.selected = true;
						truck.addEventListener('ObjectChanged', onObjectChanged, false);
						tb.add(truck);
						init();
					});

					if (features.length) {
						features.forEach((feature) => {
							console.log({feature});
							tb.loadObj({
								type: 'gltf',
								obj: 'https://raw.githubusercontent.com/kulluz/kulluz.com/main/public/taxi/scene.gltf',
								scale: 10,
								units: 'meters',
								anchor: 'bottom',
								tooltip: true,
								rotation: {x: 90, y: 0, z: 0}, // Rotation to postiion the truck and heading properly
							}, (model) => {
								const truck = model.setCoords(feature.geometry.coordinates);
								// Truck.setRotation(); //turn it to the initial street way
								// truck.addTooltip("Drive with WASD keys", true, truck.anchor, true, 2);
								truck.castShadow = true;
								truck.selected = true;
								truck.addEventListener('ObjectChanged', onObjectChanged, false);
								tb.add(truck);
								init();
							});
						});
					}
				},
				render(gl, matrix) {
					tb.update();
				},
			};
			return customLayer3D;
		}

		function easing(t) {
			return t * (2 - t);
		}

		let velocity = 0.0; let speed = 0.0; const
			ds = 0.01;
		let keys;

		map.on('style.load', () => {
			map.addLayer(createCustomLayer('3d-model'));

			const l = mapConfig.names.compositeLayer;
			if (api.buildings) {
				if (!map.getLayer(l)) {
					map.addLayer(createCompositeLayer(l));
				}
			}

			map.getCanvas().focus();
		});

		function createCompositeLayer(layerId) {
			const layer = {
				id: layerId,
				source: mapConfig.names.compositeSource,
				'source-layer': mapConfig.names.compositeSourceLayer,
				filter: ['==', 'extrude', 'true'],
				type: 'fill-extrusion',
				minzoom: minZoom,
				paint: {
					'fill-extrusion-color':
					[
						'case',
						['boolean', ['feature-state', 'select'], false],
						'red',
						['boolean', ['feature-state', 'hover'], false],
						'lightblue',
						'#aaa',
					],
					// Use an 'interpolate' expression to add a smooth transition effect to the
					// buildings as the user zooms in
					'fill-extrusion-height': [
						'interpolate',
						['linear'],
						['zoom'],
						minZoom,
						0,
						minZoom + 0.05,
						['get', 'height'],
					],
					'fill-extrusion-base': [
						'interpolate',
						['linear'],
						['zoom'],
						minZoom,
						0,
						minZoom + 0.05,
						['get', 'min_height'],
					],
					'fill-extrusion-opacity': 0.9,
				},
			};
			return layer;
		}

		let stats;
		let gui;
		let fHover;

		const api = {
			buildings: true,
			acceleration: 1,
			inertia: 1,
		};

		function init() {
		// Stats
			stats = new Stats();
			map.getContainer().appendChild(stats.dom);

			keys = {
				a: false,
				s: false,
				d: false,
				w: false,
			};

			document.body.addEventListener('keydown', (e) => {
				const key = e.code.replace('Key', '').toLowerCase();
				if (keys[key] !== undefined) {
					keys[key] = true;
				}
			});
			document.body.addEventListener('keyup', (e) => {
				const key = e.code.replace('Key', '').toLowerCase();
				if (keys[key] !== undefined) {
					keys[key] = false;
				}
			});

			animate();

			// Gui
			gui = new GUI();
			console.log({gui});
			// This will define if there's a fixed zoom level for the model
			gui.add(api, 'buildings').name('buildings').onChange(changeGui);
			gui.add(api, 'acceleration', 1, 10).step(0.5);
			gui.add(api, 'inertia', 1, 5).step(0.5);
		}

		function changeGui() {
			const l = mapConfig.names.compositeLayer;
			if (api.buildings) {
				if (!map.getLayer(l)) {
					map.addLayer(createCompositeLayer(l));
				}
			} else if (map.getLayer(l)) {
				map.removeLayer(l);
			}

			tb.map.repaint = true;
		}

		function animate() {
			requestAnimationFrame(animate);
			stats.update();
			speed = 0.0;

			if (!(keys.w || keys.s)) {
				if (velocity > 0) {
					speed = -api.inertia * ds;
				} else if (velocity < 0) {
					speed = api.inertia * ds;
				}

				if (velocity > -0.0008 && velocity < 0.0008) {
					// eslint-disable-next-line no-multi-assign
					speed = velocity = 0.0;
					return;
				}
			}

			if (keys.w) {
				speed = api.acceleration * ds;
			} else if (keys.s) {
				speed = -api.acceleration * ds;
			}

			velocity += (speed - velocity) * api.acceleration * ds;
			if (speed < 0.005) {
				velocity = 0;
				return;
			}

			const translate = new THREE.Vector3(0, -velocity, 0);
			truck.set({worldTranslate: translate});

			const options = {
				center: truck.coordinates,
				bearing: map.getBearing(),
				easing,
			};

			function toDeg(rad) {
				return rad / Math.PI * 180;
			}

			function toRad(deg) {
				return deg * Math.PI / 180;
			}

			const deg = 1;
			let rad = toRad(deg);
			const zAxis = new THREE.Vector3(0, 0, 1);

			const checkin = {
				type: 'checkin',
				timestamp: new Date(),
				uid: 'excavator',
				coordinates: truck.coordinates,
				translate,
			};
			if (keys.a || keys.d) {
				rad *= (keys.d ? -0.3 : 0.3);
				checkin.rad = rad;
				quaternion = [zAxis, truck.rotation.z + rad];
				truck.set({quaternion});
				options.bearing = -toDeg(truck.rotation.z);
			}

			if (true) {
				Documents.insert(checkin);
			}

			map.jumpTo(options);
			tb.map.update = true;
		}

		function onObjectChanged(e) {
			const model = e.detail.object; // Here's the object already modified
			if (api.buildings) {
				const c = model.coordinates;
				const point = map.project(c);
				const features = map.queryRenderedFeatures(point, {layers: [mapConfig.names.compositeLayer]});
				if (features.length > 0) {
					light(features[0]); // Crash!
				}
			}
		}

		function light(feature) {
			fHover = feature;
			map.setFeatureState({
				source: fHover.source,
				sourceLayer: fHover.sourceLayer,
				id: fHover.id,
			}, {select: true});
		}

		// Clean up on unmount
		return () => map.remove();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<div className="map-container" ref={mapContainerRef} />
		</div>
	);
};

export {MapRemoteControl};

