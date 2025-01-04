import { Heading, Text } from "@aws-amplify/ui-react";
import { MapView } from "@aws-amplify/ui-react-geo";
import "@aws-amplify/ui-react-geo/styles.css";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { useEffect, useState } from "react";
import { Marker, Popup } from "react-map-gl";

import awsExports from "../../aws-exports";

Amplify.configure(awsExports);

export function BasicMap({ ref: mapRef, latitude, longitude, data }: any) {
  const [viewport, setViewport] = useState({
    latitude: latitude || 40.258,
    longitude: longitude || -111.66,
    zoom: 15,
  });

  const tournamentTitle = data.item1.tournamentTitle;
  const address = [data.item1.address1, data.item1.city, data.item1.state, data.item1.zipcode].join(", ");
  useEffect(() => {
    // Update the map when latitude or longitude changes
    setViewport((prevViewport) => ({
      ...prevViewport,
      latitude: latitude || 40.258,
      longitude: longitude || -111.66,
    }));
    setMarkerLocation({ latitudeToShow: latitude, longitudetoShow: longitude });
  }, [latitude, longitude]);

  const [{ latitudeToShow, longitudetoShow }, setMarkerLocation] = useState({
    latitudeToShow: latitude || 40.258,
    longitudetoShow: longitude || -111.66,
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleMarkerClick = ({ originalEvent }: any) => {
    originalEvent.stopPropagation();
    setShowPopup(true);
  };

  return (
    <>
      {/* <Button onClick={updateMarker}>Move Marker</Button> */}
      <MapView initialViewState={viewport} style={{ width: "100%" }}>
        <Marker latitude={latitudeToShow} longitude={longitudetoShow} />
        <Popup
          latitude={latitudeToShow}
          longitude={longitudetoShow}
          offset={{ bottom: [0, -40] }}
          onClose={() => setShowPopup(false)}
        >
          <Heading level={6}>{tournamentTitle}</Heading>
          <Text>{address}</Text>
        </Popup>
        {/* <LocationSearch position="top-left" /> */}
      </MapView>
    </>
  );
}

// import React from 'react';

// export function TournamentDetails() {
//     return (
//         <div>
//             <h1>Tournament Details</h1>
//         </div>
//     );
// }

// import './index.css'; // This will be our CSS file for styling

// export function TournamentPage() {
//     return (
//         <div className="tournament-page">
//             <div className="map-container">
//                 <BasicMap />
//             </div>
//             <div className="details-container">
//                 <TournamentDetails />
//             </div>
//         </div>
//     );
// }
