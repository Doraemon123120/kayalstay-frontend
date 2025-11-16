import { useState, useCallback } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '10px'
};

const MapPicker = ({ lat, lng, onLocationChange }: MapPickerProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const [center] = useState({ lat, lng });
  const [markerPosition, setMarkerPosition] = useState({ lat, lng });

  const onMapClick = useCallback((e: any) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setMarkerPosition(newPosition);
      onLocationChange(newPosition.lat, newPosition.lng);
    }
  }, [onLocationChange]);

  if (!isLoaded) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        background: 'rgba(6, 182, 212, 0.05)',
        borderRadius: '10px',
        marginTop: '10px'
      }}>
        Loading map... (Please ensure you have added your Google Maps API key to .env file)
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onClick={onMapClick}
    >
      <Marker position={markerPosition} />
    </GoogleMap>
  );
};

export default MapPicker;