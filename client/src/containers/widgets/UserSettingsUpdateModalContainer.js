import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalFooter, ModalBody, Button, Row, Col } from "reactstrap";
import styles from "./styles/UserSettingsUpdateModalContainer.module.css";
import UserSettingsUpdateFormModal from "../../components/widgets/UserSettingsUpdateFormModal";
import { updateUserSettings, checkSession } from "../../actions";

class UserSettingsUpdateModalContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      changingSettings: true,
      loading: false,
      allDone: false,
      successfullyUpdated: true,
      errorMessage: ""
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      this.setState(() => ({ isOpen: nextProps.isOpen }));
    }
    if (this.props.userData.updateUserSettings !== nextProps.userData.updateUserSettings) {
      if (nextProps.userData.updateUserSettings.success) {
        this.props.checkSession();
      }
      this.setState(() => ({
        loading: false,
        allDone: true,
        successfullyUpdated: nextProps.userData.updateUserSettings.success,
        errorMessage: nextProps.userData.updateUserSettings.message
      }));
    }
  }

  toggleModal = () => {
    this.setState(s => ({
      isOpen: !s.isOpen,
      changingSettings: true,
      loading: false,
      allDone: false,
      successfullyUpdated: true,
      errorMessage: ""
    }));
    if (typeof this.props.toggle === "function") {
      this.props.toggle();
    }
  };

  settingsSubmit = settings => {
    this.props.updateUserSettings(settings);
    this.setState(() => ({ changingSettings: false, loading: true }));
  };

  getComponentToDisplay = () => {
    const { changingSettings, loading, allDone, errorMessage, successfullyUpdated } = this.state;
    const { user } = this.props.userData;

    const changingSettingsComponent = (
      <UserSettingsUpdateFormModal user={user} onSubmitSuccess={this.settingsSubmit} cancelClick={this.toggleModal} />
    );

    const loadingComponent = (
      <Row>
        <Col xs="12" md="12">
          <i className="fas fa-spinner fa-spin" />
        </Col>
      </Row>
    );

    const loadingButtons = (
      <div>
        <div className={styles.buttonPadding}>
          <Button color="secondary" onClick={this.toggleModal}>
            Cancel
          </Button>
        </div>
      </div>
    );

    const allDoneSuccessComponent = (
      <Row>
        <Col xs="12" md="12">
          <div>Successfully updated your user settings.</div>
        </Col>
      </Row>
    );

    const allDoneErrorComponent = (
      <Row>
        <Col xs="12" md="12">
          <div>Error updated user settings.</div>
        </Col>
        <Col xs="12" md="12">
          <div>{errorMessage}</div>
        </Col>
      </Row>
    );

    const allDoneButtons = (
      <div>
        <div className={styles.buttonPadding}>
          <Button color="primary" onClick={this.toggleModal}>
            Close
          </Button>
        </div>
      </div>
    );

    if (changingSettings) {
      return changingSettingsComponent;
    }

    if (loading) {
      return (
        <div>
          <ModalBody>
            <div className={styles.wrap}>{loadingComponent}</div>
          </ModalBody>
          <ModalFooter>{loadingButtons}</ModalFooter>
        </div>
      );
    }

    if (allDone) {
      if (successfullyUpdated) {
        return (
          <div>
            <ModalBody>
              <div className={styles.wrap}>{allDoneSuccessComponent}</div>
            </ModalBody>
            <ModalFooter>{allDoneButtons}</ModalFooter>
          </div>
        );
      }
      if (!successfullyUpdated) {
        return (
          <div>
            <ModalBody>
              <div className={styles.wrap}>{allDoneErrorComponent}</div>
            </ModalBody>
            <ModalFooter>{allDoneButtons}</ModalFooter>
          </div>
        );
      }
    }
  };

  render() {
    const { isOpen } = this.state;

    const componentToDisplay = this.getComponentToDisplay();

    return (
      <div>
        <Modal isOpen={isOpen} toggle={this.toggleModal} className={styles.modal} contentClassName={styles.modalContent}>
          <ModalHeader toggle={this.toggleModal}>Update User Settings</ModalHeader>
          {componentToDisplay}
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userData } = state;
  return {
    userData
  };
}

export default connect(
  mapStateToProps,
  { updateUserSettings, checkSession }
)(UserSettingsUpdateModalContainer);
