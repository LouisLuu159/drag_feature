import React from "react";
import { GeoJSON } from "react-leaflet";
import "leaflet-path-drag";

export const GeoJsonContainer = (props) => {
  const geoJSONRef = React.useRef(null);

  React.useEffect(() => {
    function __dragTransform(layer) {
      layer._transform(props.transform.matrix);
    }

    function dragDropTransform(layer) {
      layer.dragging._transformPoints(props.transform.matrix);
      layer._updatePath();
      layer._project();
      layer._transform(null);
    }

    if (props.transform) {
      geoJSONRef.current.eachLayer((layer) => {
        if (props.transform.end) dragDropTransform(layer);
        else __dragTransform(layer);
      });
    }
  }, [props.transform]);

  const handleFeature = (layer) => {
    layer.makeDraggable();
    layer.dragging.enable();
  };

  return (
    <GeoJSON
      ref={geoJSONRef}
      data={props.data.polygon}
      style={() => ({
        color: "#3388ff",
        weight: 3,
        opacity: 1
      })}
      dragging={true}
      onEachFeature={(feature, layer) => handleFeature(layer)}
    ></GeoJSON>
  );
};
