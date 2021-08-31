import React, { Component } from "react";
import { Row, Col } from "reactstrap";
// import PropTypes from "prop-types";
import TextInput from "../components/TextInput";
//import styles from "./styles/DispensarySignupSetMasterAccount.module.css";
import DmhButton from "../components/DmhButton";

class DispensarySignupSetMasterAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  nameInputChange = n => {
    this.setState(() => ({
      name: n
    }));
  };

  submit = e => {
    e.preventDefault();

    const { name } = this.state;
    this.props.onSuccess(name);
  };

  render() {
    const buttonText = <i className="fas fa-arrow-right" />;

    return (
      <Row noGutters>
        <Col xs="12" md="12">
          <TextInput type="text" id="nameInput" label="name" onChange={this.nameInputChange} required />
        </Col>
        <Col xs="12" md="12">
          <DmhButton value={buttonText} title="Submit" dark clickHandler={e => this.submit(e)} />
        </Col>
      </Row>
    );
  }
}

export default DispensarySignupSetMasterAccount;
