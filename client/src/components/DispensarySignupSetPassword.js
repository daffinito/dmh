import React, { Component } from "react";
import { Row, Col } from "reactstrap";
// import PropTypes from "prop-types";
import TextInput from "../components/TextInput";
//import styles from "./styles/DispensarySignupSetPassword.module.css";
import DmhButton from "../components/DmhButton";

class DispensarySignupSetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      passwordValid: true
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  submit = e => {
    e.preventDefault();

    const { password } = this.state;
    const passwordValid = this.validatePassword(password);
    this.props.passwordValid(passwordValid);
    if (passwordValid) {
      this.props.onSuccess(password);
    }
  };

  passwordInputChange = p => {
    this.setState(() => ({
      password: p
    }));
  };

  validatePassword = p => {
    const passwordValid = p.length > 7;
    this.setState(() => ({ passwordValid: passwordValid }));
    return passwordValid;
  };

  render() {
    const { passwordValid } = this.state;
    const buttonText = <i className="fas fa-arrow-right" />;

    return (
      <Row noGutters>
        <Col xs="12" md="12">
          <TextInput
            id="passwordInput"
            label="Password"
            onChange={this.passwordInputChange}
            type="password"
            required
            valid={passwordValid}
          />
        </Col>
        <Col xs="12" md="12">
          <DmhButton value={buttonText} title="Submit" dark clickHandler={e => this.submit(e)} />
        </Col>
      </Row>
    );
  }
}

export default DispensarySignupSetPassword;
