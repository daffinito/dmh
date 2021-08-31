import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import DmhButton from "../components/DmhButton";
import styles from "./styles/AgeWallContainer.module.css";
import { record_ageverification } from "../actions";

// route /results
class AgeWallContainer extends Component {
  constructor(props) {
    super();
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  handleYesButtonClick = e => {
    const current = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(current.getFullYear() + 1);

    this.props.cookies.set("_dmhOver21", "true", {
      path: "/",
      expires: nextYear
    });
    this.props.record_ageverification(true);
  };

  handleNoButtonClick = e => {
    this.props.record_ageverification(false);
    window.location = "https://highhelper.com/terms.html";
  };

  render() {
    return (
      <Row noGutters>
        <Col xs="12" md="12">
          <div className={[styles.ageWallText, styles.small].join(" ")}>
            Thank you for visiting us from {this.props.state}! Next, we need to
            confirm you are over 21.
          </div>
        </Col>
        <Col xs="12" md="12">
          <div className={[styles.ageWallText, styles.small].join(" ")}>
            Please click one of the buttons below.
          </div>
        </Col>
        <Col xs="6" md="6">
          <DmhButton
            size="xl"
            color="green"
            value="Yes, I'm over 21"
            title="Yes, I'm over 21"
            clickHandler={e => this.handleYesButtonClick(e)}
          />
        </Col>
        <Col xs="6" md="6">
          <DmhButton
            size="xl"
            color="red"
            value="No, I'm under 21"
            title="No, I'm under 21"
            clickHandler={e => this.handleNoButtonClick(e)}
          />
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  const { ageVerificationData } = state;
  return {
    ageVerificationData
  };
}

AgeWallContainer.propTypes = {
  match: PropTypes.object.isRequired, // for Router
  location: PropTypes.object.isRequired, // for Router
  history: PropTypes.object.isRequired // for Router
};

export default withRouter(
  connect(
    mapStateToProps,
    { record_ageverification }
  )(AgeWallContainer)
);
