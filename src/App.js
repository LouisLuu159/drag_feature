import React, { useState } from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import { geoJson, latLngBounds } from "leaflet";
import { GeoJsonContainer } from "./GeoJsonContainer";
import "leaflet-path-drag";
import "./styles.css";
import "leaflet/dist/leaflet.css";
import Feature from "./Feature";

const objects = [
  {
    polygon: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-104.98569488525392, 39.63431579014969],
                [-104.98569488525392, 39.64165260123419],
                [-104.97161865234376, 39.64165260123419],
                [-104.97161865234376, 39.63431579014969],
              ],
            ],
          },
        },
      ],
    },
  },
  {
    polygon: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-105.02964019775392, 39.6206315500488],
                [-105.02964019775392, 39.65685252543906],
                [-104.99067306518556, 39.65685252543906],
                [-104.99067306518556, 39.6206315500488],
              ],
            ],
          },
        },
      ],
    },
  },
];

const getPolygonPointFromBounds = (latLngBounds) => {
  const center = latLngBounds.getCenter();
  const latlngs = [];

  latlngs.push(latLngBounds.getSouthWest()); //bottom left
  latlngs.push({ lat: latLngBounds.getSouth(), lng: center.lng }); //bottom center
  latlngs.push(latLngBounds.getSouthEast()); //bottom right
  latlngs.push({ lat: center.lat, lng: latLngBounds.getEast() }); // center right
  latlngs.push(latLngBounds.getNorthEast()); //top right
  latlngs.push({
    lat: latLngBounds.getNorth(),
    lng: latLngBounds.getCenter().lng,
  }); //top center
  latlngs.push(latLngBounds.getNorthWest()); //top left
  latlngs.push({
    lat: latLngBounds.getCenter().lat,
    lng: latLngBounds.getWest(),
  }); //center left

  return latlngs;
};

export default function App() {
  const [transform, setTransform] = React.useState(null);

  let newBounds = [];
  let selectBoundingBox = [];

  objects.forEach((building) => {
    const polygonBounds = geoJson(building.polygon).getBounds();
    newBounds = [...newBounds, polygonBounds];
  });

  const polygonPoints = getPolygonPointFromBounds(latLngBounds(newBounds));
  const convertedData = polygonPoints.map((point) => [point.lng, point.lat]);
  convertedData.push([polygonPoints[0].lng, polygonPoints[0].lat]);
  selectBoundingBox = convertedData;

  let selectBoxData = null;

  if (selectBoundingBox) {
    selectBoxData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [selectBoundingBox],
          },
        },
      ],
    };
  }

  const handleFeature = (layer) => {
    layer.makeDraggable();
    layer.dragging.enable();

    layer.on("drag", function (e) {
      setTransform({ matrix: layer.dragging._matrix, end: false });
    });

    layer.on("dragend", function (e) {
      setTransform({ matrix: layer.dragging._matrix, end: true });
      const map = layer._map;
      map.setView(map.getCenter());
    });
  };

  const [draggable, setDraggable] = useState(false);

  return (
    <>
      <MapContainer
        center={[39.63563779557324, -104.99234676361085]}
        zoom={12}
        preferCanvas
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        {/* {objects.map((object, i) => (
        <GeoJsonContainer data={object} key={i} transform={transform} />
      ))}
      <GeoJSON
        data={selectBoxData}
        style={() => ({
          color: "green",
          weight: 3,
          opacity: 0.5
        })}
        draggable={true}
        onEachFeature={(feature, layer) => handleFeature(layer)}
      /> */}
        <Feature draggable={draggable} />
      </MapContainer>
      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        <button onClick={() => setDraggable(true)}>Enable Drag</button>
        <button onClick={() => setDraggable(false)}>Disable Drag</button>
      </div>
    </>
  );
}
