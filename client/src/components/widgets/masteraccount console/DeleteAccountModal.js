import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalFooter, ModalBody, Button, Row, Col } from "reactstrap";
import styles from "./styles/DeleteAccountModal.module.css";

class DeleteAccountModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      deleteAccount: null
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      this.setState(() => ({ isOpen: nextProps.isOpen }));
    }
    if (this.props.account !== nextProps.account) {
      this.setState(() => ({ deleteAccount: nextProps.account }));
    }
  }

  cancelClick = e => {
    e.preventDefault();
    this.toggleModal();
  };

  deleteConfirmClick = e => {
    e.preventDefault();

    this.props.deleteConfirmClick(this.state.deleteAccount);
  };

  toggleModal = () => {
    //this.setState(s => ({ isOpen: !s.isOpen }));
    this.props.toggle();
  };

  render() {
    const { deleteAccount, isOpen } = this.state;

    const componentToDisplay =
      deleteAccount === null ? (
        <Row>
          <Col xs="12" md="12">
            <i className="fas fa-spinner fa-spin" />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xs="12" md="12">
            <div>Are you sure you wish to PERMINANTLY delete {deleteAccount.name}? It will be gone forever.</div>
          </Col>
        </Row>
      );

    const buttonToDisplay =
      deleteAccount === null ? (
        <div>
          <div className={styles.buttonPadding}>
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.buttonPadding}>
            <Button color="primary" onClick={this.deleteConfirmClick}>
              Delete
            </Button>
          </div>
          <div className={styles.buttonPadding}>
            <Button color="secondary" onClick={this.cancelClick}>
              Cancel
            </Button>
          </div>
        </div>
      );

    return (
      <div>
        <Modal isOpen={isOpen} toggle={this.toggleModal} className={styles.modal} contentClassName={styles.modalContent}>
          <ModalHeader toggle={this.toggleModal}>Delete Dispensary Account</ModalHeader>

          <ModalBody>
            <div className={styles.wrap}>{componentToDisplay}</div>
          </ModalBody>
          <ModalFooter>{buttonToDisplay}</ModalFooter>
        </Modal>
      </div>
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
)(DeleteAccountModal);
