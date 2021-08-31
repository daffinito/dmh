import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import TextInput from "../TextInput";
import DmhButton from "../DmhButton";
import styles from "./styles/AddUser.module.css";

class AddUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      emailValid: true
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  emailChange = email => {
    this.setState(() => ({
      email: email
    }));
  };

  submit = e => {
    e.preventDefault();

    const { email } = this.state;
    const emailValid = this.validateEmail(email);
    this.props.emailValid(emailValid);
    if (emailValid) {
      this.props.onSubmit(email);
    }
  };

  validateEmail = e => {
    const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const emailValid = re.test(e);
    this.setState(() => ({ emailValid: emailValid }));
    return emailValid;
  };

  render() {
    const { emailValid } = this.state;
    return (
      <div className={styles.background}>
        <Row>
          <Col xs="6" md="6">
            <TextInput type="email" label="Email" id="emailInput" onChange={this.emailChange} required valid={emailValid} />
          </Col>
          <Col xs="6" md="6">
            <DmhButton value="Add User" title="Submit" dark clickHandler={e => this.submit(e)} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddUser;
