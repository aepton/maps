import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

const pageStyles = {
  color: "#232129",
  padding: 0,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}

const Map = ({ zoom, center, minZoom, maxZoom }) => {
  // this ref holds the map DOM node so that we can pass it into MapLibre GL
  const mapNode = useRef(null)

  // this ref holds the map object once we have instantiated it, so that we
  // can use it in other hooks
  const mapRef = useRef(null)

  useEffect(() => {
    let mapCenter = center
    let mapZoom = zoom

    const tileOptions = {
        dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
    };

    const map = new maplibregl.Map({
      container: mapNode.current,
      style: tileOptions['dark'], // style URL
      center: mapCenter,
      zoom: mapZoom,
      minZoom,
      maxZoom,
    })
    mapRef.current = map
    // window.map = map // todo for easier debugging and querying via console

    map.on("load", async () => {
        const response = await fetch('/static/bike_routes_heights.geojson');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        console.log(json.features);
        console.log(            {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: json.features
            }
        });
        map.addSource(
            'seattle-bike-routes',
            {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: json.features
                }
            }
        );

        map.addLayer({
            'id': 'route-line',
            'type': 'line',
            'source': 'seattle-bike-routes',
            'paint': {
                // 'line-color': '#00ff00',
                'line-opacity': 0.4,
                'line-width': 3
            }
        });
    })

    return () => {
      map.remove()
    }
  }, [])
  return <div ref={mapNode} style={{ width: "100vw", height: "100vh" }} />
}

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
}

Map.defaultProps = {
  center: [-122.332069, 47.606209],
  zoom: 14,
  minZoom: 2,
}

const IndexPage = () => {
  return (
    <main style={pageStyles}>
      <Map></Map>
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Bike Routes in Seattle</title>
