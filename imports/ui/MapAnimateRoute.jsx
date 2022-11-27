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
pivot = 0;
vehicles = {excavator: null, cat797f: null};
tbmodels = {};
path = [];
// Mapboxgl.accessToken = 'sk.eyJ1IjoiYWQzbGZyOSIsImEiOiJjbDV3aTJqMnAwZHhqM2NuejdmNG5vOXViIn0.pPr5bIwwGub8wEojYEU8Nw'
mapboxgl.accessToken = 'pk.eyJ1IjoiYWQzbGZyOSIsImEiOiJjbDVnaWc1anAxbGluM2tsMWlvYXlsdXZuIn0.Rgg5v9gdsihBtNGB0Lh26Q';
const MapAnimateRoute = ({mapProbs, pinRouteGeojson}) => {
	// Const [modelTransform, setModelTransform] = useState()
	const [lngLat, setLngLat] = useState({lng: 6.58968, lat: 45.39701});
	const [renderer, setRenderer] = useState(null);
	const mapContainerRef = useRef(null);
	const tooltipRef = useRef(new mapboxgl.Popup({offset: 15}));
	const [lastCheckin, setLastCheckin] = useState(null);

	// Console.log({mapboxgl});

	const locatables = useTracker(() => Documents.find({type: 'locatable'}).fetch());

	const [pathPivot, setPathPivot] = useState(0);

	// Initialize map when component mounts
	useEffect(async () => {
		// If (path && path.length == 0) {
		// 	return;
		// }

		const origin = [11.959637, 57.720266];
		let line;
		tbmodels = {};
		const minZoom = 12;
		const mapConfig = {
			map: {center: origin, zoom: 20, pitch: 60, bearing: 38},
			truck: {origin, type: 'glb', model: './models/vehicles/car', rotation: {x: 90, y: -90, z: 0}, scale: 5, startRotation: {x: 0, y: 0, z: -38}, date: new Date(2020, 6, 19, 23)},
			names: {
				compositeSource: 'composite',
				compositeSourceLayer: 'building',
				compositeLayer: '3d-buildings',
			},
		};
		map = new mapboxgl.Map({
			container: mapContainerRef.current,
			zoom: 13,
			center: [6.58968, 45.39701],
			pitch: 76,
			bearing: 150,
			// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
			style: 'mapbox://styles/mapbox/satellite-streets-v11',
			interactive: false,
			hash: false,
		});

		// Start downloading the route data, and wait for map load to occur in parallel
		const pinRouteGeojson = {
			type: 'FeatureCollection',
			features:
					[
						{
							type: 'Feature',
							properties: {},
							geometry: {
								type: 'LineString',
								coordinates:
								[
									[6.56674, 45.39288],
									[6.57313, 45.39999],
								],
							},
						},
					],
		};

		// Start downloading the route data, and wait for map load to occur in parallel
		const [pinRouteGeojsona] = await Promise.all([
			map.once('load'),
		]);

		const pinRoute = pinRouteGeojson.features[0].geometry.coordinates;
		// Create the marker and popup that will display the elevation queries
		const popup = new mapboxgl.Popup({closeButton: false});
		const marker = new mapboxgl.Marker({
			color: 'red',
			scale: 0.8,
			draggable: false,
			pitchAlignment: 'auto',
			rotationAlignment: 'auto',
		})
			.setLngLat(pinRoute[0])
			.setPopup(popup)
			.addTo(map)
			.togglePopup();

		// Add a line feature and layer. This feature will get updated as we progress the animation
		map.addSource('line', {
			type: 'geojson',
			// Line metrics is required to use the 'line-progress' property
			lineMetrics: true,
			data: pinRouteGeojson,
		});
		map.addLayer({
			type: 'line',
			source: 'line',
			id: 'line',
			paint: {
				'line-color': 'rgba(0,0,0,0)',
				'line-width': 5,
			},
			layout: {
				'line-cap': 'round',
				'line-join': 'round',
			},
		});

		// Add some fog in the background
		map.setFog({
			range: [-0.5, 2],
			color: 'white',
			'horizon-blend': 0.2,
		});

		// Add a sky layer over the horizon
		map.addLayer({
			id: 'sky',
			type: 'sky',
			paint: {
				'sky-type': 'atmosphere',
				'sky-atmosphere-color': 'rgba(85, 151, 210, 0.5)',
			},
		});

		// Add terrain source, with slight exaggeration
		map.addSource('mapbox-dem', {
			type: 'raster-dem',
			url: 'mapbox://mapbox.terrain-rgb',
			tileSize: 512,
			maxzoom: 14,
		});
		map.setTerrain({source: 'mapbox-dem', exaggeration: 1.5});

		await map.once('idle');
		// The total animation duration, in milliseconds
		const animationDuration = 20000;
		// Use the https://turfjs.org/ library to calculate line distances and
		// sample the line at a given percentage with the turf.along function.
		const path = turf.lineString(pinRoute);
		// Get the total line distance
		const pathDistance = turf.lineDistance(path);
		let start;
		function frame(time) {
			if (!start) {
				start = time;
			}

			const animationPhase = (time - start) / animationDuration;
			console.log(time, animationPhase, path);

			if (animationPhase > 1) {
				return;
			}

			// Get the new latitude and longitude by sampling along the path
			const alongPath = turf.along(path, pathDistance * animationPhase)
				.geometry.coordinates;
			const lngLat = {
				lng: alongPath[0],
				lat: alongPath[1],
			};

			// Sample the terrain elevation. We round to an integer value to
			// prevent showing a lot of digits during the animation
			const elevation = Math.floor(
				// Do not use terrain exaggeration to get actual meter values
				map.queryTerrainElevation(lngLat, {exaggerated: false}),
			);

			// Update the popup altitude value and marker location
			popup.setHTML('Altitude: ' + elevation + 'm<br/>');
			marker.setLngLat(lngLat);

			// Reduce the visible length of the line by using a line-gradient to cutoff the line
			// animationPhase is a value between 0 and 1 that reprents the progress of the animation
			map.setPaintProperty('line', 'line-gradient', [
				'step',
				['line-progress'],
				'red',
				animationPhase,
				'rgba(255, 0, 0, 0)',
			]);

			// Rotate the camera at a slightly lower speed to give some parallax effect in the background
			const rotation = 150 - animationPhase * 40.0;
			map.setBearing(rotation % 360);

			requestAnimationFrame(frame);
		}

		requestAnimationFrame(frame);
		// Clean up on unmount
		return () => map.remove();
	}, [path, pathPivot]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<div className="map-container" ref={mapContainerRef} />
		</div>
	);
};

export {MapAnimateRoute};

