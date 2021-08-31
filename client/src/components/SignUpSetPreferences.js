import React, { Component } from "react";
import { Row, Col } from "reactstrap";
// import PropTypes from "prop-types";
import TextInput from "../components/TextInput";
//import styles from "./styles/SignUpSetPreferences.module.css";
import DmhButton from "../components/DmhButton";

class SignUpSetPreferences extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      name: this.props.name,
      email: this.props.email,
      passwordValid: true,
      nameValid: true
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  submit = e => {
    e.preventDefault();

    const { password, name } = this.state;
    const passwordValid = this.validatePassword(password);
    const nameValid = this.validateName(name);
    this.props.passwordValid(passwordValid);
    this.props.nameValid(nameValid);
    if (passwordValid && nameValid) {
      this.props.onSuccess({ name: name, password: password });
    }
  };

  passwordInputChange = p => {
    this.setState(() => ({
      password: p
    }));
  };

  nameInputChange = n => {
    this.setState(() => ({
      name: n
    }));
  };

  validatePassword = p => {
    const passwordValid = p.length > 7;
    this.setState(() => ({ passwordValid: passwordValid }));
    return passwordValid;
  };

  validateName = n => {
    const nameValid = n.length > 0;
    this.setState(() => ({ nameValid: nameValid }));
    return nameValid;
  };

  render() {
    const { passwordValid, nameValid, name, email } = this.state;
    const buttonText = <i className="fas fa-arrow-right" />;

    return (
      <Row noGutters>
        <Col xs="12" md="12">
          <TextInput defaultValue={email} autoComplete="off" id="emailInput" disabled label="Email" type="text" />
        </Col>
        <Col xs="12" md="12">
          <TextInput
            defaultValue={name}
            autoComplete="off"
            id="nameInput"
            label="Name"
            onChange={this.nameInputChange}
            type="text"
            required
            valid={nameValid}
          />
        </Col>
        <Col xs="12" md="12">
          <TextInput
            id="passwordInput"
            label="Password"
            onChange={this.passwordInputChange}
            type="password"
            required
            autoComplete="off"
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

export default SignUpSetPreferences;
