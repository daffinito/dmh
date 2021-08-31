import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import TextInput from "../../TextInput";
import DmhButton from "../../DmhButton";

class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      name: "",
      emailValid: true,
      nameValid: true
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  emailChange = email => {
    this.setState(() => ({
      email: email
    }));
  };

  nameChange = name => {
    this.setState(() => ({
      name: name
    }));
  };

  submit = e => {
    e.preventDefault();

    const { email, name } = this.state;
    const emailValid = this.validateEmail(email);
    const nameValid = this.validateName(name);
    this.props.emailValid(emailValid);
    this.props.nameValid(nameValid);
    if (emailValid) {
      this.props.onSubmit(email, name);
    }
  };

  validateEmail = e => {
    const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const emailValid = re.test(e);
    this.setState(() => ({ emailValid: emailValid }));
    return emailValid;
  };

  validateName = n => {
    const nameValid = n.length > 0;
    this.setState(() => ({ nameValid: nameValid }));
    return nameValid;
  };

  render() {
    const { emailValid, nameValid } = this.state;
    return (
      <Row>
        <Col xs="6" md="6">
          <TextInput type="text" label="NAME" id="nameInput" onChange={this.nameChange} required valid={nameValid} />
        </Col>
        <Col xs="6" md="6">
          <TextInput type="email" label="EMAIL" id="emailInput" onChange={this.emailChange} required valid={emailValid} />
        </Col>
        <Col xs="12" md="12">
          <DmhButton value="SUBMIT" title="Submit" dark clickHandler={e => this.submit(e)} />
        </Col>
      </Row>
    );
  }
}

export default CreateUser;
