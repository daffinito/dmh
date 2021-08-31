import { Component } from "react";
import { connect } from "react-redux";
import { getGeoLocation, setGeoLoading, geoBrowserSupported, geoError } from "../actions";

class LocationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enabled: this.props.enabled
    };
  }

  componentDidMount() {
    if (!!this.props.enabled) {
      this.init();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.enabled !== nextProps.enabled) {
      this.setState(() => ({ enabled: nextProps.enabled }));
      if (!!nextProps.enabled) {
        this.init();
      }
    }
  }

  init = () => {
    //console.log("init geoloc")
    if (!this.props.geoLocData.finishedGatheringGeoData && !this.props.geoLocData.loadingGeoData) {
      if (this.checkIfBrowserSupportsGeoLoc()) {
        this.getCoords();
      }
    }
  };

  getCoords = () => {
    this.props.setGeoLoading();
    navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError, {
      enableHighAccuracy: true,
      maximumAge: 300000 // re-use results if they are less than 5 minutes old
    });
  };

  geoSuccess = position => {
    const point = position.coords.latitude.toFixed(4).toString() + "," + position.coords.longitude.toFixed(4).toString();
    this.props.getGeoLocation(point); // this also sets it in the redux state
  };

  geoError = error => {
    console.log("error ", error);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.props.geoError(true);
        break;
      default:
        this.props.geoError(false);
    }
  };

  checkIfBrowserSupportsGeoLoc = () => {
    if ("geolocation" in navigator) {
      this.props.geoBrowserSupported(true);
      return true;
    }
    this.props.geoBrowserSupported(false);
    return false;
  };

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  const { geoLocData } = state;
  return {
    geoLocData
  };
}

export default connect(
  mapStateToProps,
  { getGeoLocation, setGeoLoading, geoBrowserSupported, geoError }
)(LocationContainer);
