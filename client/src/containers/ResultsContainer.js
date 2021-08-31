import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { getResult } from "../actions";
import Strain from "../components/Strain";
import StrainLabel from "../components/StrainLabel";
import Description from "../components/Description";
import DispensaryMap from "../components/DispensaryMap";
import NavbarContainer from "./NavbarContainer";
import StickyFooter from "../components/StickyFooter";
import LoadingOverlay from "../components/LoadingOverlay";
import LocationContainer from "./LocationContainer";
import SelectionMenu from "./SelectionMenu";

// route /results
class ResultsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingResults: false,
      locEnabled: true,
      loadingMessage: "Loading Results...",
      locError: false,
      locErrorMessage: "",
      results: {
        success: null,
        message: null,
        strain: {},
        dispensary: {}
      }
    };
  }

  componentDidMount() {
    if (this.props.selectionCache.selections.length === 0 && !this.props.isDev) {
      // no question answered yet, redirect to first question, if not dev (add `?dev` to the url)
      let newLoc = "/q/1";
      this.props.history.push(newLoc);
    }

    this.setState(() => ({
      loadingResults: true
    }));
    if (this.props.geoLocData.enabled) {
      this.setState(() => ({ loadingMessage: "Loading Results...", locEnabled: true }));
    } else {
      this.getResults();
    }

    if (this.props.geoLocData.finishedGatheringGeoData && !this.props.geoLocData.accessBlocked && !this.props.geoLocData.geolocationError) {
      this.getResults(this.props.geoLocData);
    }

    if (this.props.geoLocData.accessBlocked || this.props.geoLocData.geolocationError) {
      this.setState(() => ({
        locError: true,
        locErrorMessage: this.props.geoLocData.accessBlocked
          ? "Access to location has been blocked!"
          : "An unknown error occurred while determining location."
      }));
      this.getResults();
    }

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.results !== nextProps.results) {
      if (nextProps.results.success) {
        this.setState(() => ({
          loadingResults: false,
          results: nextProps.results
        }));
      }
    }

    if (this.props.geoLocData !== nextProps.geoLocData) {
      const { geoLocData } = nextProps;
      //console.log("CWRP: ", geoLocData);

      if (geoLocData.finishedGatheringGeoData && this.state.locEnabled && !geoLocData.accessBlocked && !geoLocData.geolocationError) {
        this.getResults(geoLocData);
      }

      if (geoLocData.accessBlocked || geoLocData.geolocationError) {
        this.setState(() => ({
          locError: true,
          locErrorMessage: geoLocData.accessBlocked
          ? "Access to location has been blocked!"
            : "An unknown error occurred while determining location."
        }));
        this.getResults();
      }
    }
  }

  getResults = geoLocData => {
    this.setState(() => ({
      loadingResults: true
    }));
    const geoObj = { zip: null, point: null };
    if (typeof geoLocData !== "undefined") {
      geoObj.zip = geoLocData.zip;
      geoObj.point = geoLocData.point;
    }
    //console.log("geoObj: ", geoObj);
    const { selections } = this.props.selectionCache;
    this.props.getResult(selections, geoObj.point, geoObj.zip);
  };

  enableLocation = e => {
    e.preventDefault();

    const current = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(current.getFullYear() + 1);
    this.props.cookies.set("_dmhLocationEnabled", "true", {
      path: "/",
      expires: nextYear
    });

    this.setState(() => ({ loadingResults: true, locEnabled: true, loadingMessage: "Determing location..." }));
  };

  render() {
    const { strain, dispensary } = this.state.results;
    const { loadingResults, locEnabled, loadingMessage, locError, locErrorMessage } = this.state;
    const wrapperClasses = loadingResults ? "d-flex flex-column wrapper busy-cursor" : "d-flex flex-column wrapper";

    const componentToDisplay = loadingResults ? null : (
      <Row noGutters className="navbar-top-buffer">
        <Col xs="10" md="7" className="order-1 order-md-1">
          <Strain img={strain.imgSrc} alt={strain.name} />
        </Col>
        <Col xs="10" md="12" className="order-2 order-md-4">
          <StrainLabel name={strain.name} type={strain.type} />
        </Col>
        <Col xs="12" md="12" className="order-3 order-md-5">
          <Description desc={strain.description} />
        </Col>
        <Col xs="12" md="5" className="order-4 order-md-2">
          <DispensaryMap
            useLocationClick={this.enableLocation}
            locationEnabled={locEnabled}
            locationError={locError}
            locationErrorMessage={locErrorMessage}
            loading={loadingResults}
            strainName={strain.name}
            dispensary={dispensary}
          />
        </Col>
      </Row>
    );

    return (
      <div className={wrapperClasses}>
        <NavbarContainer>
          <SelectionMenu />
        </NavbarContainer>
        <LocationContainer enabled={locEnabled} />
        <LoadingOverlay message={loadingMessage} show={loadingResults} />
        <Container className="flex-fill">{componentToDisplay}</Container>
        <StickyFooter />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { selectionCache, results, geoLocData } = state;
  return {
    selectionCache,
    results,
    geoLocData
  };
}

ResultsContainer.propTypes = {
  getResult: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired, // for Router
  location: PropTypes.object.isRequired, // for Router
  history: PropTypes.object.isRequired, // for Router
  isDev: PropTypes.bool.isRequired,
  results: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    imgSrc: PropTypes.string
  }),
  selectionCache: PropTypes.shape({
    selections: PropTypes.arrayOf(
      PropTypes.shape({
        choice: PropTypes.shape({
          id: PropTypes.number | PropTypes.string,
          description: PropTypes.string
        }),
        questionId: PropTypes.number | PropTypes.string,
        question: PropTypes.string,
        dialPosition: PropTypes.number
      })
    )
  })
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      getResult
    }
  )(ResultsContainer)
);
