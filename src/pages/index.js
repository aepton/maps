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


    const map = new maplibregl.Map({
      container: mapNode.current,
      style: 'https://demotiles.maplibre.org/style.json', // style URL
      center: mapCenter,
      zoom: mapZoom,
      minZoom,
      maxZoom,
    })
    mapRef.current = map
    // window.map = map // todo for easier debugging and querying via console

    map.on("load", () => {})

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
  center: [0, 0],
  zoom: 0,
  minZoom: 0,
}

const IndexPage = () => {
  return (
    <main style={pageStyles}>
      <Map></Map>
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
