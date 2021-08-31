import React, { Component } from "react";
import { Row, Col } from "reactstrap";
// import PropTypes from "prop-types";
import TextInput from "../components/TextInput";
//import styles from "./styles/DispensarySignupSetAddress.module.css";
import DmhButton from "../components/DmhButton";
import StateDropdown from "../components/StateDropdown";

class DispensarySignupSetAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: "",
      suggestedAddress: ""
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  submit = e => {
    e.preventDefault();
  };

  dispNameInputChange = dispName => {
    console.log(dispName);
  };

  addressInputChange = address => {
    console.log(address);
  };

  zipcodeInputChange = zip => {
    console.log(zip);
  };

  stateInputChange = state => {
    console.log(state);
  };

  render() {
    const buttonText = <i className="fas fa-arrow-right" />;

    return (
      <Row noGutters>
        <Col xs="12" md="12">
          <TextInput type="text" id="dispnameInput" label="Dispensary Name" onChange={this.dispNameInputChange} />
        </Col>
        <Col xs="12" md="12">
          <TextInput type="text" id="addressInput" label="Address" onChange={this.addressInputChange} />
        </Col>
        <Col xs="7" md="7">
          <StateDropdown id="stateDropdown" label="State" onChange={this.stateInputChange} />
        </Col>
        <Col xs="5" md="5">
          <TextInput type="text" id="zipcodeInput" label="Zip Code" onChange={this.zipcodeInputChange} />
        </Col>
        <Col xs="12" md="12">
          <DmhButton value={buttonText} title="Submit" dark clickHandler={e => this.submit(e)} />
        </Col>
      </Row>
    );
  }
}

export default DispensarySignupSetAddress;
