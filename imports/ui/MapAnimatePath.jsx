import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import Tooltip from './components/Tooltip';
import ReactDOM from 'react-dom';
import turf from 'turf';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Stats from '/imports/vendor/stats';
import { Threebox } from 'threebox-plugin';
import GUI from 'lil-gui'; 
import { Documents } from '../api/documents';
import { useTracker } from 'meteor/react-meteor-data';

excavator = null;
tb = null;
truck = null;
map = null;
pivot = 0;
vehicles = {"excavator": null, "cat797f": null}
tbmodels = {}
// mapboxgl.accessToken = 'sk.eyJ1IjoiYWQzbGZyOSIsImEiOiJjbDV3aTJqMnAwZHhqM2NuejdmNG5vOXViIn0.pPr5bIwwGub8wEojYEU8Nw'
mapboxgl.accessToken = 'pk.eyJ1IjoiYWQzbGZyOSIsImEiOiJjbDVnaWc1anAxbGluM2tsMWlvYXlsdXZuIn0.Rgg5v9gdsihBtNGB0Lh26Q';
const MapAnimatePath = ({ mapProbs, pinRouteGeojson }) => {
  // const [modelTransform, setModelTransform] = useState()
  const [lngLat, setLngLat] = useState({ lng: 6.58968, lat: 45.39701 })
  const [renderer, setRenderer] = useState(null);
  const mapContainerRef = useRef(null);
  const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const [lastCheckin, setLastCheckin] = useState(null);

  //console.log({mapboxgl});


  const locatables = useTracker(() => {
	return Documents.find({type: "locatable"}).fetch();
  });
  const path = useTracker(() => {
	return Documents.find({type: "checkin"}).fetch();
  });
  const [pathPivot, setPathPivot] = useState(0);
  


  // Initialize map when component mounts
  useEffect(async () => {

	if(path.length == 0)
	return 
    var origin = [ 11.959637, 57.720266];
    var line;
	tbmodels = {}
	let minZoom = 12;
	let mapConfig = {
		map: { center: origin, zoom: 20, pitch: 60, bearing: 38 }, 
		truck: { origin: origin, type: 'glb', model: './models/vehicles/car', rotation: { x: 90, y: -90, z: 0 }, scale: 5, startRotation: { x: 0, y: 0, z: -38 }, date: new Date(2020, 6, 19, 23) },
		names: {
			compositeSource: "composite",
			compositeSourceLayer: "building",
			compositeLayer: "3d-buildings"
		}
	}

	 map = new mapboxgl.Map({
		style: 'mapbox://styles/mapbox/satellite-streets-v11',
		container: mapContainerRef.current,
		zoom: 18,
		center: origin,
		pitch: 40,
		bearing: 70,
		attributionControl: false,
		interactive: true,
		hash: false,
		antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
	});

	tb = new Threebox(
		map,
		map.getCanvas().getContext('webgl'),
		{
			realSunlight: true,
			enableSelectingObjects: true,
			enableDraggingObjects: true,
			enableRotatingObjects: true,
			enableTooltips: true
		}
	);

	tb.setSunlight(new Date(2020, 6, 19, 23), map.getCenter());

	function createCustomLayer(layerName) {
		let model;
		//create the layer
		let customLayer3D = {
			id: layerName,
			type: 'custom',
			renderingMode: '3d',
			onAdd: function (map, gl) {

	
				const rows = 1;
				const step = 0.00100;
				let locatabls = Array.from(Array(rows*rows).keys()).map((n,i)=>{
					console.log("loool", i);
					return {
						uid: `excavator${i}`,
						type: 'gltf',
						obj: '/taxi/scene.gltf',
						scale: 1,
						units: 'meters',
						anchor: "bottom",
						tooltip: true,
						rotation: { x: 90, y: 90, z: 00 }, //rotation to postiion the truck and heading properly
						origin : origin
					}
				}) 

				locatabls.forEach((locatable) => {
					console.log("itemloaded")
					tb.loadObj(locatable, function (model) {
						tbmodel = model.setCoords(locatable.origin);
						//truck.setRotation(); //turn it to the initial street way
						//truck.addTooltip("Drive with WASD keys", true, truck.anchor, true, 2);
						tbmodel.castShadow = true;
						tbmodel.selected = true;
						tbmodel.addEventListener('ObjectChanged', onObjectChanged, false);
						tbmodels[locatable.uid] = tbmodel;
						tb.add(tbmodel);
						init();
	
					});
				})
			},
			render: function (gl, matrix) {
				if(tb)
				tb.update();
			}
		};
		return customLayer3D;

	};

	function easing(t) {
		return t * (2 - t);
	}

	let velocity = 0.0, speed = 0.0, ds = 0.01;
	let keys;

	map.on('style.load', function () {

		map.addLayer(createCustomLayer('3d-model'));

		let l = mapConfig.names.compositeLayer;
		if (api.buildings) {
			if (!map.getLayer(l)) { map.addLayer(createCompositeLayer(l)); }
		}
		map.getCanvas().focus();

	});

	function createCompositeLayer(layerId) {
		let layer = {
			'id': layerId,
			'source': mapConfig.names.compositeSource,
			'source-layer': mapConfig.names.compositeSourceLayer,
			'filter': ['==', 'extrude', 'true'],
			'type': 'fill-extrusion',
			'minzoom': minZoom,
			'paint': {
				'fill-extrusion-color':
					[
						'case',
						['boolean', ['feature-state', 'select'], false],
						"red",
						['boolean', ['feature-state', 'hover'], false],
						"lightblue",
						'#aaa'
					],
				// use an 'interpolate' expression to add a smooth transition effect to the
				// buildings as the user zooms in
				'fill-extrusion-height': [
					'interpolate',
					['linear'],
					['zoom'],
					minZoom,
					0,
					minZoom + 0.05,
					['get', 'height']
				],
				'fill-extrusion-base': [
					'interpolate',
					['linear'],
					['zoom'],
					minZoom,
					0,
					minZoom + 0.05,
					['get', 'min_height']
				],
				'fill-extrusion-opacity': 0.9
			}
		};
		return layer;
	}

	let stats, gui;
	let fHover;

	let api = {
		buildings: true,
		acceleration: 1, 
		inertia: 1
	};

	function init() {
		stats
		stats = new Stats();
		map.getContainer().appendChild(stats.dom);

		keys = {
			a: false,
			s: false,
			d: false,
			w: false
		};

		document.body.addEventListener('keydown', function (e) {

			const key = e.code.replace('Key', '').toLowerCase();
			if (keys[key] !== undefined)
				keys[key] = true;
		});
		document.body.addEventListener('keyup', function (e) {

			const key = e.code.replace('Key', '').toLowerCase();
			if (keys[key] !== undefined)
				keys[key] = false;
		});

		animate();

		// gui
		gui = new GUI();
		//console.log({gui})
		// this will define if there's a fixed zoom level for the model
		gui.add(api, 'buildings').name('buildings').onChange(changeGui);
		gui.add(api, 'acceleration', 1, 10).step(0.5);
		gui.add(api, 'inertia', 1, 5).step(0.5);
	}

	function changeGui() {
		let l = mapConfig.names.compositeLayer;
		if (api.buildings) {
			if (!map.getLayer(l)) { map.addLayer(createCompositeLayer(l)); }
		}
		else {
			if (map.getLayer(l)) { map.removeLayer(l)}

		}

		tb.map.repaint = true;
	}

	function animate() {
		console.log("hi", tbmodels);
		requestAnimationFrame(animate);
		stats.update();
		speed = 0.0;


	
		if(pivot >= path.length){
			// path ended
			pivot = 0
		}
		const checkin = path[pivot];
		//console.log(checkin);
		if(!checkin)
		return 

		//const model = tbmodels[checkin.uid];

		Object.keys(tbmodels).map((uid)=>{
			const model = tbmodels[uid]

	
		if(!model)
			return
		//console.log({model})
		model.set({ worldTranslate: checkin.translate});

		pivot = (pivot + 1);

		let options = {
			center: checkin.coordinates,
			bearing: map.getBearing(),
			easing: easing
		};

		function toDeg(rad) {
			return rad / Math.PI * 180* (Math.random() < 0.5 ? - Math.random() : Math.random() );

		}

		function toRad(deg) {
			return deg * Math.PI / 180 * (Math.random() < 0.5 ? -Math.random()  : 1);
		}

		let deg = 1;
		let rad = toRad(deg);
		
		let zAxis = new THREE.Vector3(0, 0, 1);

		if (checkin.rad) {
			rad = checkin.rad;
			model.set({ quaternion: [zAxis, model.rotation.z + rad] });
			options.bearing = -toDeg(model.rotation.z);
		}

		//map.jumpTo(options);
		tb.map.update = true;
	})
	}

	function onObjectChanged(e) {
		let model = e.detail.object; //here's the object already modified
		if (api.buildings) {
			let c = model.coordinates;
			let point = map.project(c);
			let features = map.queryRenderedFeatures(point, { layers: [mapConfig.names.compositeLayer] });
			if (features.length > 0) {
				light(features[0]); // crash!
			}
		}
	}

	function light(feature) {
		fHover = feature;
		map.setFeatureState({
			source: fHover.source,
			sourceLayer: fHover.sourceLayer,
			id: fHover.id
		}, { select: true });
	}


    // Clean up on unmount
    return () => map.remove();
  }, [path, pathPivot]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export { MapAnimatePath };



