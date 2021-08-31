import React, { Component, createRef } from "react";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WidgetAccordion from "../../../components/widgets/WidgetAccordion";
import DispensaryChart from "../../../components/widgets/account console/DispensaryChart";
import Dial from "../../../components/Dial";
// import PropTypes from "prop-types";
import styles from "./styles/DispensaryChartsWidgetContainer.module.css";

class DispensaryChartsWidgetContainer extends Component {
  constructor(props) {
    super(props);

    this.dialContainerRef = createRef();

    this.state = {
      dialSize: 450,
      containerWidth: 500,
      dialPosition: 0,
      chartSelected: 0,
      mouseDown: false
    };
  }

  handleResize = width => {
    const dialSize = width;
    this.setState(() => ({
      containerWidth: width,
      dialSize: dialSize
    }));
  };

  handleDialChange = pos => {
    this.setState(() => ({
      dialPosition: pos
    }));
  };

  handleMouseDown = e => {
    this.setState(() => ({
      mouseDown: true
    }));
  };

  handleMouseUp = e => {
    this.setState(s => ({
      mouseDown: false,
      chartSelected: s.dialPosition
    }));
  };

  componentDidMount() {
    this.handleResize(this.dialContainerRef.current.clientWidth);
  }

  componentWillUpdate(nextProps, nextState) {
    if (+this.state.containerWidth !== +this.dialContainerRef.current.clientWidth) {
      this.handleResize(this.dialContainerRef.current.clientWidth);
    }
  }

  widgetOpen = () => {
    this.handleResize(this.dialContainerRef.current.clientWidth);
  };

  render() {
    const { dialSize, dialPosition, chartSelected } = this.state;
    const { accountDetails } = this.props;
    console.log(accountDetails)
    
    return (
      <WidgetAccordion onEntered={this.widgetOpen} title="PLEASE USE THE DIAL TO SELECT A GRAPH" startOpen={false}>
        <Row>
          <Col xs="5" md="5" />
          <Col xs="2" md="2">
            <div className={styles.chartContainer}>
              <div className={styles.imageContainer}>
                <img className={styles.image} alt="Most Popular Outcome Combinations" src="/images/widgets/charts/combinations.png" />
              </div>
            </div>
          </Col>
          <Col xs="5" md="5" />
        </Row>
        <Row>
          <Col xs="2" md="2">
            <div className={styles.chartContainer}>
              <div className={styles.imageContainer}>
                <img className={styles.image} alt="Get High vs Get Relief" src="/images/widgets/charts/gethighorgetrelief.png" />
              </div>
            </div>
          </Col>
          <Col xs="6" md="6">
            <div
              ref={this.dialContainerRef}
              className={styles.dialContainer}
              onMouseDown={this.handleMouseDown}
              onTouchStart={this.handleMouseDown}
              onMouseUp={this.handleMouseUp}
              onTouchEnd={this.handleMouseUp}
            >
              <Dial
                // choices={[{ description: "High vs Relief" }, { description: "Combinations" }, { description: "Strains" }]}
                className={styles.dial}
                width={dialSize}
                startAngle={-90}
                maxAngle={110}
                numberOfPositions={3}
                currentPosition={dialPosition}
                onChange={this.handleDialChange}
              />
            </div>
          </Col>
          <Col xs="2" md="2">
            <div className={styles.chartContainer}>
              <div className={styles.imageContainer}>
                <img className={styles.image} alt="Most Popular Strains" src="/images/widgets/charts/strains.png" />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            <DispensaryChart src={accountDetails.charts[chartSelected]} />
          </Col>
        </Row>
      </WidgetAccordion>
    );
  }
}

function mapStateToProps(state) {
  const { ui, userData } = state;
  return {
    ui,
    userData
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(DispensaryChartsWidgetContainer)
);
