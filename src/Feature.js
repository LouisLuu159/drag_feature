import { MapContainer, GeoJSON, TileLayer, Polygon } from "react-leaflet";
import React, { useEffect, useState } from "react";

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

const reverseCoordinates = (coordinates) => {
  const positions = coordinates.map((arr) => [arr[1], arr[0]]);
  return positions;
};

const Feature = ({ draggable }) => {
  console.log(draggable);

  const [layer, setLayer] = useState();
  const [color, setColor] = useState("#1976d2");
  const [dragCoordinates, setDragCoordinates] = useState([]);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    console.log("Render");

    if (coordinates.length === 0) {
      const coordinates =
        objects[1].polygon.features[0].geometry.coordinates[0];
      setCoordinates(reverseCoordinates(coordinates));
    }

    if (draggable) {
      layer.makeDraggable();
      layer.dragging.enable();
      setColor("#ec407a");
    } else {
      if (layer?.dragging) {
        layer.dragging.disable();
      }
      setColor("#1976d2");
    }
  }, [draggable]);

  return (
    <Polygon
      positions={coordinates}
      eventHandlers={{
        add: (e) => {
          console.log("add");
          console.log(e.target);
          //   const layer = e.target;
          //   layer.makeDraggable();
          //   layer.dragging.enable();
          setLayer(e.target);
        },
        dragstart: (e) => {
          console.log("drag start");
          console.log(e.target);
        },
        dragend: (e) => {
          console.log("drag end");
          console.log(e.target);
          const layer = e.target;
          console.log(layer._latlngs);
          const coordinates = layer._latlngs[0].map((coordinate) => [
            coordinate.lng,
            coordinate.lat,
          ]);

          setCoordinates(reverseCoordinates(coordinates));
          //   layer.dragging.disable();
        },
      }}
      pathOptions={{ color: color }}
    ></Polygon>
  );
};

export default Feature;
