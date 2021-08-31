import React, { Component } from "react";
import { Row, Col, Collapse } from "reactstrap";
// import PropTypes from "prop-types";
import styles from "./styles/WidgetAccordion.module.css";

class WidgetAccordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWidgetOpen: false
    };
  }

  componentDidMount() {
    if (this.props.startOpen === true) {
      this.setState(() => ({
        isWidgetOpen: true
      }));
    }
  }

  componentWillReceiveProps(nextProps) {}

  toggleCollapse = () => {
    this.setState(s => ({ isWidgetOpen: !s.isWidgetOpen }));
    if (typeof this.props.clickHandler === "function") {
      this.props.clickHandler();
    }
  };

  innerRef = innerRef => {
    if (typeof this.props.innerRef === "function") {
      this.props.innerRef(innerRef);
    }
  };

  onEntering = () => {
    if (typeof this.props.onEntering === "function") {
      this.props.onEntering();
    }
  };

  onEntered = () => {
    if (typeof this.props.onEntered === "function") {
      this.props.onEntered();
    }
  };

  onExiting = () => {
    if (typeof this.props.onExiting === "function") {
      this.props.onExiting();
    }
  };

  onExited = () => {
    if (typeof this.props.onExited === "function") {
      this.props.onExited();
    }
  };

  render() {
    const { title, children } = this.props;
    const { isWidgetOpen } = this.state;
    const arrow = isWidgetOpen ? <i className="fas fa-caret-down" /> : <i className="fas fa-caret-right" />;

    return (
      <Row>
        <Col xs="12" md="12">
          <div className={styles.header} onClick={this.toggleCollapse}>
            <Row>
              <Col xs="1" md="1">
                <div className={styles.arrow}>{arrow}</div>
              </Col>
              <Col xs="11" md="11">
                <div className={styles.title}>{title}</div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs="12" md="12">
          <Collapse
            onEntering={this.onEntering}
            onEntered={this.onEntered}
            onExiting={this.onExiting}
            onExited={this.onExited}
            innerRef={this.innerRef}
            className={styles.content}
            isOpen={isWidgetOpen}
          >
            {children}
          </Collapse>
        </Col>
      </Row>
    );
  }
}

export default WidgetAccordion;
