import React, { Component } from "react";
import { Row, Col } from "reactstrap";
// import PropTypes from "prop-types";
import TextInput from "../components/TextInput";
//import styles from "./styles/LoginForm.module.css";
import DmhButton from "../components/DmhButton";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      passwordValid: true,
      emailValid: true
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  submit = e => {
    e.preventDefault();

    const { password, passwordValid, email } = this.state;
    const emailValid = this.validateEmail(email);
    this.props.emailValid(emailValid);
    this.props.passwordValid(passwordValid);

    if (passwordValid && emailValid) {
      this.props.onSuccess(email, password);
    }
    //console.log("Submit!");
  };

  emailInputChange = e => {
    this.setState(() => ({
      email: e
    }));
  };

  passwordInputChange = p => {
    this.setState(() => ({
      password: p
    }));
  };

  validateEmail = e => {
    const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const emailValid = re.test(e);
    if (emailValid) {
      this.setState(() => ({ emailValid: true }));
    } else {
      this.setState(() => ({ emailValid: false }));
    }
    return emailValid;
  };

  render() {
    const { passwordValid, emailValid } = this.state;
    const buttonText = <i className="fas fa-arrow-right" />;

    return (
      <Row noGutters>
        <Col xs="12" md="12">
          <TextInput id="emailInput" label="Email" autoFocus onChange={this.emailInputChange} type="email" required valid={emailValid} />
        </Col>
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

export default LoginForm;
