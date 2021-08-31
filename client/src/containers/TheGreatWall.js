import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import StickyFooter from "../components/StickyFooter";
import styles from "./styles/TheGreatWall.module.css";
import { initTermsResponse, recordTermsResponse } from "../actions";
import DmhButton from "../components/DmhButton";

// age and geofencing hard wall
class TheGreatWall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canEnterSite: false
    };
  }

  componentDidMount() {
    const canEnterSite = this.props.cookies.get("_dmhCanEnterSite") === "true" ? true : false;

    this.props.initTermsResponse(canEnterSite);

    this.setState(() => ({
      canEnterSite: canEnterSite
    }));

    if (canEnterSite) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveState(nextState) {}

  componentWillReceiveProps(nextProps) {
    const { canEnterSite } = this.props.termsOfUseData;
    const npCanEnterSite = nextProps.termsOfUseData.canEnterSite;
    const current = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(current.getFullYear() + 1);

    if (canEnterSite !== npCanEnterSite) {
      this.setState(() => ({
        canEnterSite: npCanEnterSite
      }));
      this.props.cookies.set("_dmhCanEnterSite", npCanEnterSite.toString(), {
        path: "/",
        expires: nextYear
      });
    }

    if (npCanEnterSite) {
      this.props.history.push("/");
    }
  }
  handleNoButtonClick = e => {
    this.props.recordTermsResponse(false);
    window.location = "https://highhelper.com/terms.html";
  };

  handleYesButtonClick = e => {
    this.props.recordTermsResponse(true);
  };

  render() {
    let className = "d-flex flex-column wrapper";

    return (
      <div className={className}>
        <Container className="flex-fill d-flex">
          <div className="my-auto">
            <Row noGutters>
              <Col xs="12" md="12">
                <div className={[styles.text, styles.big].join(" ")}>Thank you for your interest in</div>
              </Col>
              <Col xs="12" md="12">
                <div className={[styles.dmhLogoContainer]}>
                  <div className={[styles.dmhLogo, "dmh-logo-orange"].join(" ")} />
                </div>
              </Col>
              <Col xs="12" md="12">
                <div className={[styles.text, styles.small].join(" ")}>Are you over 21 or a valid medical cannabis patient?</div>
              </Col>
              <Col xs="6" md="6">
                <DmhButton size="xl" color="green" value="Yes" title="Yes" clickHandler={e => this.handleYesButtonClick(e)} />
              </Col>
              <Col xs="6" md="6">
                <DmhButton size="xl" color="red" value="No" title="No" clickHandler={e => this.handleNoButtonClick(e)} />
              </Col>
              <Col xs="12" md="12">
                <div className={[styles.text, styles.verySmall].join(" ")}>
                  Dial My High uses your location to find the dispensary closest to you. For the best results, please click Allow when your
                  browser prompts you for permission to <i className="fas fa-map-marker-alt" /> Know your location.
                </div>
                <div className={[styles.text, styles.verySmall].join(" ")}>
                  By using Dial My High, you accept the{" "}
                  <a href="https://www.highhelper.com/terms.html" target="_blank" rel="noopener noreferrer">
                    Terms of Use
                  </a>
                  .{" "}
                </div>
              </Col>
            </Row>
          </div>
        </Container>
        <StickyFooter />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { termsOfUseData } = state;
  return { termsOfUseData };
}

TheGreatWall.propTypes = {
  match: PropTypes.object.isRequired, // for Router
  location: PropTypes.object.isRequired, // for Router
  history: PropTypes.object.isRequired // for Router
};

export default withRouter(
  connect(
    mapStateToProps,
    { initTermsResponse, recordTermsResponse }
  )(TheGreatWall)
);
