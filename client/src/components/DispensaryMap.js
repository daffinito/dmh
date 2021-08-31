import React from "react";
import { Row, Col } from "reactstrap";
import DmhButton from "./DmhButton";
import styles from "./styles/DispensaryMap.module.css";

const DispensaryMap = props => {
  const googleMapSearchBase = "https://www.google.com/maps/dir/?api=1&";
  const { dispensary, strainName, locationEnabled, locationError, locationErrorMessage, useLocationClick } = props;
  const dispensaryLocation = `destination=@${dispensary.lat},${dispensary.lng}&destination_place_id=${dispensary.place_id}`;
  const dispensaryMapHref = googleMapSearchBase + dispensaryLocation;
  const dispensaryMapLink = (
    <DmhButton
      title={"Please tap here to get directions to " + dispensary.name}
      value={"Please tap here to get directions to " + dispensary.name}
      clickHandler={() => window.open(dispensaryMapHref, "_blank")}
      size="xl"
      color="solidgreen"
    />
  );

  const locErrorEl = (
    <span className={styles.locationErrorText}>
      <i className="fas fa-exclamation-triangle" />
      {"  "}
      {locationErrorMessage}
    </span>
  );

  const useLocEl = (
    <span className={styles.useLocationLink} onClick={useLocationClick}>
      <i className="fas fa-map-marker-alt" />
      {"  "}Use your location for better results.
    </span>
  );

  const textContainerXSColSize = dispensary.logo ? 8 : 12;
  const textContainerMDColSize = dispensary.logo ? 8 : 12;

  const componentToDisplay = props.loading ? (
    <div className={styles.mapContainer}>
      Loading dispensary... <i className="fas fa-spinner fa-spin" />
    </div>
  ) : (
    <div className={styles.mapContainer}>
      <Row noGutters>
        {dispensary.logo ? (
          <Col xs="4" md="4">
            <div className={styles.imageContainer}>
              <img className={styles.image} src={dispensary.logo} alt="DispensaryLogo" />
            </div>
          </Col>
        ) : null}
        <Col xs={textContainerXSColSize} md={textContainerMDColSize}>
          <div className={styles.textContainer}>
            Your friendly budtender at <span className={styles.dispensaryName}>{dispensary.name}</span> can help you find{" "}
            <span className={styles.strainName}>{strainName}</span> or something similar.
          </div>
        </Col>
        <Col xs="12" md="12">
          <div className={styles.useLocationLinkContainer}>
            {!locationEnabled ? useLocEl : null}
            {locationEnabled && locationError ? locErrorEl : null}
          </div>
        </Col>
        <Col xs="12" md="12">
          <div className={styles.dispensaryLink}>{dispensaryMapLink}</div>
        </Col>
      </Row>
    </div>
  );

  return componentToDisplay;
};

export default DispensaryMap;
