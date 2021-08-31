import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalFooter, ModalBody, Button, Row, Col } from "reactstrap";
import styles from "./styles/DispensaryAddressUpdateModal.module.css";
import TextInput from "../../TextInput";
import StateDropdown from "../../StateDropdown";
import { checkDispensaryAddress, changeDispensaryAddress, checkSession } from "../../../actions";

// this is in components but uses redux. That's a no-no. But I need to get it done quick so..
// TODO - refactor all of this. this component is pretty out of control
class DispensaryAddressUpdateModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      settingAddress: true,
      loading: false,
      finalizingAddress: false,
      allDone: false,
      successfullyUpdated: true,
      errorMessage: "",
      originalInfo: {
        name: this.props.name,
        street: this.props.street,
        city: this.props.city,
        state: this.props.state,
        zip: this.props.zip
      },
      inputInfo: {
        name: this.props.name,
        street: this.props.street,
        city: this.props.city,
        state: this.props.state,
        zip: this.props.zip
      },
      suggestedInfo: {
        name: null,
        street: null,
        city: null,
        state: null,
        zip: null
      }
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      this.setState(() => ({ isOpen: nextProps.isOpen }));
    }
    if (this.props.accountData.checkDispensaryAddress !== nextProps.accountData.checkDispensaryAddress) {
      const { checkDispensaryAddress } = nextProps.accountData;

      if (checkDispensaryAddress.success) {
        const address = checkDispensaryAddress.dispensaryInfo.address.split(",");
        const street = address.shift();
        address.pop(); // getting rid of the USA part of the address
        const city = address.shift();
        const splitStateZip = address.pop().split(" ");
        const zip = splitStateZip.pop();
        const state = splitStateZip.pop();

        this.setState(() => ({
          loading: false,
          finalizingAddress: true,
          suggestedInfo: {
            name: checkDispensaryAddress.dispensaryInfo.name,
            street: street,
            city: city,
            state: state,
            zip: zip
          },
          inputInfo: {
            name: checkDispensaryAddress.dispensaryInfo.name,
            street: street,
            city: city,
            state: state,
            zip: zip
          }
        }));
      }
    }
    if (this.props.accountData.changeDispensaryAddress !== nextProps.accountData.changeDispensaryAddress) {
      const { changeDispensaryAddress } = nextProps.accountData;
      this.props.checkSession();
      this.setState(() => ({
        loading: false,
        allDone: true,
        successfullyUpdated: changeDispensaryAddress.success,
        errorMessage: changeDispensaryAddress.message
      }));
    }
  }

  dispNameInputChange = dispName => {
    this.setState(s => ({ inputInfo: { ...s.inputInfo, name: dispName } }));
  };

  addressInputChange = street => {
    this.setState(s => ({ inputInfo: { ...s.inputInfo, street: street } }));
  };

  zipcodeInputChange = zip => {
    this.setState(s => ({ inputInfo: { ...s.inputInfo, zip: zip } }));
  };

  stateInputChange = state => {
    this.setState(s => ({ inputInfo: { ...s.inputInfo, state: state } }));
  };

  cityInputChange = city => {
    this.setState(s => ({ inputInfo: { ...s.inputInfo, city: city } }));
  };

  checkAddressClick = e => {
    e.preventDefault();

    this.setState(() => ({ loading: true, settingAddress: false }));

    const { inputInfo } = this.state;

    this.props.checkDispensaryAddress(inputInfo.name, inputInfo.street, inputInfo.city, inputInfo.state, inputInfo.zip);
  };

  tryAgainClick = e => {
    e.preventDefault();

    this.setState(() => ({ loading: false, settingAddress: true }));
  };

  finalizeAddressClick = e => {
    e.preventDefault();

    //const { inputInfo } = this.state;
    const { checkDispensaryAddress } = this.props.accountData;

    this.setState(() => ({
      loading: true,
      settingAddress: false,
      finalizingAddress: false
    }));
    this.props.changeDispensaryAddress(this.props.accountId, checkDispensaryAddress.dispensaryInfo);
  };

  toggleModal = () => {
    this.setState(s => ({
      isOpen: !s.isOpen,
      settingAddress: true,
      loading: false,
      finalizingAddress: false,
      allDone: false
    }));
    if (typeof this.props.toggle === "function") {
      this.props.toggle();
    }
  };

  getComponentToDisplay = () => {
    const {
      settingAddress,
      loading,
      finalizingAddress,
      allDone,
      originalInfo,
      suggestedInfo,
      errorMessage,
      successfullyUpdated
    } = this.state;

    const setAddressComponent = (
      <Row>
        <Col xs="12" md="12">
          <div>Please enter the dispensary's address below, and we will double check it against google maps.</div>
        </Col>
        <Col xs="12" md="12">
          <TextInput
            key="settingName"
            type="text"
            id="sdispnameInput"
            label="Dispensary Name"
            defaultValue={originalInfo.name}
            onChange={this.dispNameInputChange}
          />
        </Col>
        <Col xs="12" md="12">
          <TextInput
            key="settingAddress"
            type="text"
            id="saddressInput"
            label="Street Address"
            defaultValue={originalInfo.street}
            onChange={this.addressInputChange}
          />
        </Col>
        <Col xs="4" md="4">
          <StateDropdown id="sstateDropdown" label="State" defaultValue={originalInfo.state} onChange={this.stateInputChange} />
        </Col>
        <Col xs="4" md="4">
          <TextInput
            key="settingCity"
            type="text"
            id="scityInput"
            label="City"
            defaultValue={originalInfo.city}
            onChange={this.cityInputChange}
          />
        </Col>
        <Col xs="4" md="4">
          <TextInput
            key="zip"
            type="text"
            id="szipcodeInput"
            label="Zip Code"
            defaultValue={originalInfo.zip}
            onChange={this.zipcodeInputChange}
          />
        </Col>
      </Row>
    );

    const setAddressButtons = (
      <div>
        <div className={styles.buttonPadding}>
          <Button color="primary" onClick={this.checkAddressClick}>
            Check Address
          </Button>
        </div>
        <div className={styles.buttonPadding}>
          <Button color="secondary" onClick={this.toggleModal}>
            Cancel
          </Button>
        </div>
      </div>
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

    const finalAddressComponent = (
      <Row>
        <Col xs="12" md="12">
          <div>Here is what Google returned. How's it look?</div>
        </Col>
        <Col xs="12" md="12">
          <TextInput
            key="finalName"
            id="dispnameInput"
            type="text"
            label="Dispensary Name"
            disabled
            defaultValue={suggestedInfo.name}
            onChange={this.dispNameInputChange}
          />
        </Col>
        <Col xs="12" md="12">
          <TextInput
            key="finalAddress"
            id="addressInput"
            type="text"
            label="Street Address"
            disabled
            defaultValue={suggestedInfo.street}
            onChange={this.addressInputChange}
          />
        </Col>
        <Col xs="4" md="4">
          <TextInput
            key="finalState"
            type="text"
            id="stateInput"
            label="State"
            disabled
            defaultValue={suggestedInfo.state}
            onChange={this.stateInputChange}
          />
        </Col>
        <Col xs="4" md="4">
          <TextInput
            key="finalCity"
            type="text"
            id="cityInput"
            label="City"
            disabled
            defaultValue={suggestedInfo.city}
            onChange={this.cityInputChange}
          />
        </Col>
        <Col xs="4" md="4">
          <TextInput
            key="finalZip"
            type="text"
            id="zipcodeInput"
            label="Zip Code"
            disabled
            defaultValue={suggestedInfo.zip}
            onChange={this.zipcodeInputChange}
          />
        </Col>
      </Row>
    );

    const finalAddressButtons = (
      <div>
        <div className={styles.buttonPadding}>
          <Button color="success" onClick={this.finalizeAddressClick}>
            Looks Good
          </Button>
        </div>
        <div className={styles.buttonPadding}>
          <Button color="primary" onClick={this.tryAgainClick}>
            Try Again
          </Button>
        </div>
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
          <div>Successfully updated your dispensary address.</div>
        </Col>
      </Row>
    );

    const allDoneErrorComponent = (
      <Row>
        <Col xs="12" md="12">
          <div>Error updated dispensary address.</div>
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

    if (settingAddress) {
      return (
        <div>
          <ModalBody>
            <div className={styles.wrap}>{setAddressComponent}</div>
          </ModalBody>
          <ModalFooter>{setAddressButtons}</ModalFooter>
        </div>
      );
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

    if (finalizingAddress) {
      return (
        <div>
          <ModalBody>
            <div className={styles.wrap}>{finalAddressComponent}</div>
          </ModalBody>
          <ModalFooter>{finalAddressButtons}</ModalFooter>
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
          <ModalHeader toggle={this.toggleModal}>Update Dispensary Address</ModalHeader>
          {componentToDisplay}
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { accountData } = state;
  return {
    accountData
  };
}

export default connect(
  mapStateToProps,
  { checkDispensaryAddress, changeDispensaryAddress, checkSession }
)(DispensaryAddressUpdateModal);
