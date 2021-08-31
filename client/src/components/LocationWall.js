import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
// import PropTypes from "prop-types";
import styles from "./styles/LocationWall.module.css";
import LocationContainer from "../containers/LocationContainer";
import StateDropdown from "../components/StateDropdown";
import DmhButton from "../components/DmhButton";

class LocationWall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      supportsGeoLoc: true,
      point: "",
      accessBlocked: false,
      geolocationError: false,
      requestingAccess: true,
      loadingGeoData: false,
      finishedGatheringGeoData: false,
      isLegal: false,
      stateSelected: "OR"
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.geoLocData.loadingGeoData !== nextProps.geoLocData.loadingGeoData) {
      this.setState(() => ({
        loadingGeoData: nextProps.geoLocData.loadingGeoData
      }));
    }
    if (this.props.geoLocData.finishedGatheringGeoData !== nextProps.geoLocData.finishedGatheringGeoData) {
      this.setState(() => ({
        finishedGatheringGeoData: nextProps.geoLocData.finishedGatheringGeoData
      }));
    }
    if (this.props.geoLocData.accessBlocked !== nextProps.geoLocData.accessBlocked) {
      this.setState(() => ({
        accessBlocked: nextProps.geoLocData.accessBlocked
      }));
    }
    if (this.props.geoLocData.geolocationError !== nextProps.geoLocData.geolocationError) {
      this.setState(() => ({
        geolocationError: nextProps.geoLocData.geolocationError
      }));
    }
    if (this.props.geoLocData.isLegal !== nextProps.geoLocData.isLegal) {
      this.setState(() => ({
        isLegal: nextProps.geoLocData.isLegal
      }));
    }
    if (this.props.geoLocData.requestingAccess !== nextProps.geoLocData.requestingAccess) {
      this.setState(() => ({
        requestingAccess: nextProps.geoLocData.requestingAccess
      }));
    }
    if (this.props.geoLocData.supportsGeoLoc !== nextProps.geoLocData.supportsGeoLoc) {
      this.setState(() => ({
        supportsGeoLoc: nextProps.geoLocData.supportsGeoLoc
      }));
    }
  }

  stateInputChange = state => {
    this.setState(() => ({ stateSelected: state }));
    console.log(state);
  };

  handleNoButtonClick = e => {
    console.log("no");
    window.location = "https://highhelper.com/terms.html";
  };

  handleYesButtonClick = e => {
    console.log("yes");
  };

  render() {
    const { stateSelected } = this.state;
    let text2 = (
      <div className={[styles.locWallText, styles.small].join(" ")}>
        Please review our{" "}
        <a href="https://www.highhelper.com/terms.html" target="_blank" rel="noopener noreferrer">
          Terms of Use
        </a>{" "}
        for more information
      </div>
    );

    return (
      <Row noGutters>
        <LocationContainer />
        <Col xs="12" md="12">
          <div className={[styles.locWallText, styles.small].join(" ")}>
            Before you can use Dial My High, we need to make sure that Marijuana is legal in your state. Dial My High is currently only
            available in Oregon, Washington, California, and Colorado. Please review our{" "}
            <a href="https://www.highhelper.com/terms.html" target="_blank" rel="noopener noreferrer">
              Terms of Use
            </a>{" "}
            for more information
          </div>
        </Col>
        <Col xs="6" md="6">
          <div className={[styles.locWallText, styles.small].join(" ")}>Please select your state:</div>
        </Col>
        <Col xs="6" md="6">
          <StateDropdown defaultValue="OR" id="stateDropdown" label="State" onChange={this.stateInputChange} />
        </Col>
        <Col xs="6" md="6">
          <DmhButton
            size="xl"
            color="green"
            value={"I live in " + stateSelected}
            title={"I live in " + stateSelected}
            clickHandler={e => this.handleYesButtonClick(e)}
          />
        </Col>
        <Col xs="6" md="6">
          <DmhButton
            size="xl"
            color="red"
            value="I live somewhere else"
            title="I live somewhere else"
            clickHandler={e => this.handleNoButtonClick(e)}
          />
        </Col>
      </Row>
    );
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
  {}
)(LocationWall);
