import React, { Component } from "react";
import { connect } from "react-redux";
import {  Modal, ModalHeader, ModalFooter, ModalBody, Button, Row, Col } from "reactstrap";
import styles from "./styles/CustomStrainModal.module.css";
import Strain from "../Strain";
import StrainLabel from "../StrainLabel";
import Description from "../Description";

class CustomStrainModal extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      strain: null,
      isOpen: false
    };

    this.state = this.initialState;
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.strain !== nextProps.strain) {
      this.setState(() => ({ strain: nextProps.strain }));
    }

    if (this.props.isOpen !== nextProps.isOpen) {
      this.setState(() => ({ isOpen: nextProps.isOpen }));
    }
  }

  toggleModal = () => {
    this.props.toggle();
  };

  cancelClick = e => {
    e.preventDefault();
    this.setState(() => ({ strain: null }));
    this.props.toggle();
  };

  render() {
    const { strain, isOpen } = this.state;
    const componentToDisplay =
      strain === null ? null : (
        <div className={styles.wrap}>
          <Row noGutters>
            <Col xs="10" md="7">
              <Strain img={strain.imgSrc} alt={strain.name} />
            </Col>
            <Col xs="10" md="12">
              <StrainLabel name={strain.name} type={strain.type} />
            </Col>
            <Col xs="12" md="12">
              <div className={styles.choices}>{strain.choices.map(c => c.description).join(', ')}</div>
            </Col>
            <Col xs="12" md="12">
              <Description desc={strain.description} />
            </Col>
          </Row>
        </div>
      );

    return (
      <Modal isOpen={isOpen} toggle={this.toggleModal} className={styles.modal} contentClassName={styles.modalContent}>
        <ModalHeader toggle={this.toggleModal}>Strain Details</ModalHeader>
        <ModalBody>{componentToDisplay}</ModalBody>
        <ModalFooter>
          <div>
            <div className={styles.buttonPadding}>
              <Button color="primary" onClick={this.cancelClick}>
                Close
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  //  const {} = state;
  return {};
}

export default connect(
  mapStateToProps,
  {}
)(CustomStrainModal);
