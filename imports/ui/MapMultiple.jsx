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
excavator = null;
tb = null;
truck = null;
// mapboxgl.accessToken = 'sk.eyJ1IjoiYWQzbGZyOSIsImEiOiJjbDV3aTJqMnAwZHhqM2NuejdmNG5vOXViIn0.pPr5bIwwGub8wEojYEU8Nw'
mapboxgl.accessToken = 'pk.eyJ1IjoiYWQzbGZyOSIsImEiOiJjbDVnaWc1anAxbGluM2tsMWlvYXlsdXZuIn0.Rgg5v9gdsihBtNGB0Lh26Q';
const MapMultiple = ({ mapProbs, pinRouteGeojson }) => {
  // const [modelTransform, setModelTransform] = useState()
  const [lngLat, setLngLat] = useState({ lng: 6.58968, lat: 45.39701 })
  const [renderer, setRenderer] = useState(null);
  const mapContainerRef = useRef(null);
  const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  const [locatables, setMovablesas] = setState
  // Initialize map when component mounts
  useEffect(async () => {

    var origin = [ 11.952637, 57.724266];
    var line;


    var map = new mapboxgl.Map({
      container: mapContainerRef.current,
      zoom: 16,
      center: origin,
      pitch: 40,
      bearing: 70,
      attributionControl: false,
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      interactive: true,
      hash: false
    });


    const loader = new GLTFLoader();
    let stats;

    function animate() {
      requestAnimationFrame(animate);
      stats.update();
    }

function onSelectedChange(e) {
	console.log("lol");
	let selected = e.detail.selected; //we get if the object is selected after the event
	//if selected
	if (selected) {
		console.log({selected});
		selectedObject = e.detail; 
		//do whatever
	}
	
}

    map.on('style.load', function () {
      // stats
      stats = new Stats();
      map.getContainer().appendChild(stats.dom);
      animate();


      // // Add some fog in the background
      // map.setFog({
      //   'range': [-0.5, 2],
      //   'color': 'white',
      //   'horizon-blend': 0.2
      // });

      // Add a sky layer over the horizon
      map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
          'sky-type': 'atmosphere',
          'sky-atmosphere-color': 'rgba(85, 151, 210, 0.5)'
        }
      });
      
            // Add terrain source, with slight exaggeration
      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.terrain-rgb',
        'tileSize': 128,
        });
        // map.setTerrain({ 'source': 'mapbox-dem' });

      map
        .addLayer({
          id: 'custom_layer',
          type: 'custom',
          renderingMode: '3d',
          onAdd: function (map, mbxContext) {
            
            tb = new Threebox(
              map,
              mbxContext,
              {
                defaultLights: true,
                enableSelectingFeatures: true, //omit or change this to false to disable fill-extrusion features selection
                enableSelectingObjects: true, //omit or change this to false to disable 3D objects selection
                enableDraggingObjects: true, //omit or change this to false to disable 3D objects drag & move once selected
                enableRotatingObjects: true, //omit or change this to false to disable 3D objects rotation once selected
                enableTooltips: true, //omit or change this to false to disable default tooltips on fill-extrusion and 3D models
	          });

          var excavator_options = {
              type: 'gltf',
              obj: '/excavator/scene.gltf',
              scale: 1,
              units: 'meters',
              anchor: "bottom",
              tooltip: true,
		          rotation: { x: 90, y: 270, z: 0 }, //rotation to postiion the truck and heading properly
          }

          tb.loadObj(excavator_options, function (model) {
              const elevation = Math.floor(
                // Do not use terrain exaggeration to get actual meter values
                map.queryTerrainElevation({
                  lng: origin[0],
                  lat: origin[1] 
            }, { exaggerated: true }));

            excavator = model.setCoords([...origin, elevation]);
		        tb.tooltip({text: "excavator"});
		        excavator.addTooltip("<a href='http://google.com'>lol</a>", true, excavator.anchor, true, 1);
	          excavator.addEventListener('SelectedChange', onSelectedChange, false);
            tb.add(excavator);

          })
          // Royalty Free License: Vehicles by https://www.cgtrader.com/antonmoek
          // Royalty Free License: Vehicles by https://www.cgtrader.com/antonmoek
          // Royalty Free License: Vehicles by https://www.cgtrader.com/antonmoek
          // from https://www.cgtrader.com/free-3d-models/car/concept/cartoon-low-poly-city-cars-pack
          
          var options = {
              type: 'gltf',
              obj: '/truck/scene.gltf',
              scale: 0.05,
              units: 'meters',
              anchor: "bottom",
              rotation: { x: 90, y: 180, z: 0 }, //rotation to postiion the truck and heading properly

            }

            tb.loadObj(options, function (model) {
              const truck_origin = [origin[0] + 0.0003, origin[1] + 0.0003]
              const elevation = Math.floor(
                // Do not use terrain exaggeration to get actual meter values
                map.queryTerrainElevation({
                  lng: truck_origin[0],
                  lat: truck_origin[1]
                }, { exaggerated: true}));

              truck = model.setCoords([...truck_origin, elevation]);
              //truck.addEventListener('ObjectChanged', onObjectChanged, false);
              tb.add(truck);
            })





          },

          render: function (gl, matrix) {
            if (tb)
              tb.update();
          }
        });
    })
      .on('click', function (e) {
        var pt = [e.lngLat.lng, e.lngLat.lat];
       // travelPath(pt);
      })

    function onObjectChanged(e) {
      let model = e.detail.object; //here's the object already modified
      let action = e.detail.action; //here's the action that changed the object
    }

    function travelPath(object, destination) {

      // request directions. See https://docs.mapbox.com/api/navigation/#directions for details

      var url = "https://api.mapbox.com/directions/v5/mapbox/driving/" + [origin, destination].join(';') + "?geometries=geojson&access_token=" + mapboxgl.accessToken


      fetchFunction(url, function (data) {

        console.log("data", data)
        let coordinates = data.routes[0].geometry.coordinates;
        // extract path geometry from callback geojson, and set duration of travel
        var options = {
          path: coordinates.map((c)=> c.concat([Math.floor(
            // Do not use terrain exaggeration to get actual meter values
            map.queryTerrainElevation({
              lng: c[0],
              lat: c[1]
            }, { exaggerated: true })
          )])),
          duration: 9000
        }

        // // start the truck animation with above options, and remove the line when animation ends
        // if (excavator)
        //   excavator.followPath(
        //     options,
        //     function () {
        //       tb.remove(line);
        //     }
        //   );


        // start the truck animation with above options, and remove the line when animation ends
        if (object)
        object.followPath(
            options,
            function () {
              //tb.remove(line);
            }
          );


        // set up geometry for a line to be added to map, lofting it up a bit for *style*
        var lineGeometry = options.path.map(function (coordinate) {
            return coordinate.concat([15])
          })

        // // create and add line object
        // if (tb)
        //   line = tb.line({
        //     geometry: lineGeometry,
        //     width: 3,
        //     color: 'steelblue'
        //   })

        // if (tb)
        //   tb.add(line);

        // set destination as the new origin, for the next trip
        origin = destination;

      })
    }

    //convenience function for fetch

    function fetchFunction(url, cb) {
      fetch(url)
        .then(
          function (response) {
            if (response.status === 200) {
              response.json()
                .then(function (data) {
                  cb(data)
                })
            }
          }
        )
    }


    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export { MapMultiple };
