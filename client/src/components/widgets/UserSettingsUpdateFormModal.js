import React, { Component } from "react";
import { connect } from "react-redux";
import { Alert, ModalFooter, ModalBody, Button, Row, Col } from "reactstrap";
import styles from "./styles/UserSettingsUpdateFormModal.module.css";
import TextInput from "../TextInput";

class UserSettingsUpdateFormModal extends Component {
  constructor(props) {
    super(props);

    const initialState = {
      emailValid: true,
      newPasswordValid: true,
      oldPasswordValid: true,
      newPasswordsMatch: true,
      nameValid: true,
      changesMade: false,
      buttonDisabled: true,
      inputInfo: {
        name: this.props.user.name,
        email: this.props.user.email,
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: ""
      }
    };

    this.state = initialState;
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  checkForChanges = (inputName, inputEmail, inputOldPassword, inputNewPassword, inputNewPasswordConfirm) => {
    const { name, email } = this.props.user;
    if (inputNewPassword.length > 0 || inputNewPasswordConfirm.length > 0 || inputName !== name || inputEmail !== email) {
      this.setState(() => ({
        changesMade: true
      }));
      if (inputOldPassword.length > 7) {
        this.setState(() => ({
          buttonDisabled: false
        }));
      } else {
        this.setState(() => ({
          buttonDisabled: true
        }));
      }
    } else {
      this.setState(() => ({
        changesMade: false,
        buttonDisabled: true
      }));
    }
  };

  nameInputChange = name => {
    const { inputInfo } = this.state;
    this.setState(s => ({ inputInfo: { ...s.inputInfo, name: name } }));
    this.checkForChanges(name, inputInfo.email, inputInfo.oldPassword, inputInfo.newPassword, inputInfo.newPasswordConfirm);
  };

  emailInputChange = email => {
    const { inputInfo } = this.state;
    this.setState(s => ({ inputInfo: { ...s.inputInfo, email: email } }));
    this.checkForChanges(inputInfo.name, email, inputInfo.oldPassword, inputInfo.newPassword, inputInfo.newPasswordConfirm);
  };

  oldPasswordInputChange = password => {
    const { inputInfo } = this.state;
    this.setState(s => ({ inputInfo: { ...s.inputInfo, oldPassword: password } }));
    this.checkForChanges(inputInfo.name, inputInfo.email, password, inputInfo.newPassword, inputInfo.newPasswordConfirm);
  };

  newPasswordInputChange = password => {
    const { inputInfo } = this.state;
    this.setState(s => ({ inputInfo: { ...s.inputInfo, newPassword: password } }));
    this.checkForChanges(inputInfo.name, inputInfo.email, inputInfo.oldPassword, password, inputInfo.newPasswordConfirm);
  };

  newPasswordConfirmInputChange = password => {
    const { inputInfo } = this.state;
    this.setState(s => ({ inputInfo: { ...s.inputInfo, newPasswordConfirm: password } }));
    this.checkForChanges(inputInfo.name, inputInfo.email, inputInfo.oldPassword, inputInfo.newPassword, password);
  };

  dismissEmailAlert = () => {
    this.setState(() => ({ emailValid: true }));
  };

  dismissNameAlert = () => {
    this.setState(() => ({ nameValid: true }));
  };

  dismissOldPasswordAlert = () => {
    this.setState(() => ({ oldPasswordValid: true }));
  };

  dismissNewPasswordAlert = () => {
    this.setState(() => ({ newPasswordValid: true }));
  };

  dismissPasswordMatchAlert = () => {
    this.setState(() => ({ newPasswordsMatch: true }));
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

  validateOldPassword = password => {
    const passwordValid = password.length > 7;
    this.setState(() => ({ oldPasswordValid: passwordValid }));
    return passwordValid;
  };

  validateNewPassword = password => {
    const passwordValid = typeof password === "undefined" || password.length > 7 || password.length === 0;
    this.setState(() => ({ newPasswordValid: passwordValid }));
    return passwordValid;
  };

  validateNewPasswordsMatch = (password, confirmPassword) => {
    const passwordsMatch = password === confirmPassword;
    this.setState(() => ({ newPasswordsMatch: passwordsMatch }));
    return passwordsMatch;
  };

  cancelClick = e => {
    e.preventDefault();
    this.setState(() => this.initialState);
    this.props.cancelClick();
  };

  submitClick = e => {
    e.preventDefault();

    const { inputInfo, changesMade } = this.state;
    const emailValid = this.validateEmail(inputInfo.email);
    const nameValid = this.validateName(inputInfo.name);
    const oldPasswordValid = this.validateOldPassword(inputInfo.oldPassword);
    const newPasswordValid = this.validateNewPassword(inputInfo.newPassword);
    const newPasswordsMatch = this.validateNewPasswordsMatch(inputInfo.newPassword, inputInfo.newPasswordConfirm);
    if (oldPasswordValid && newPasswordValid && newPasswordsMatch && emailValid && nameValid && changesMade) {
      this.props.onSubmitSuccess({
        name: inputInfo.name,
        email: inputInfo.email,
        oldPassword: inputInfo.oldPassword,
        newPassword: inputInfo.newPassword
      });
    }
  };

  render() {
    const { user } = this.props;
    const { emailValid, oldPasswordValid, newPasswordValid, newPasswordsMatch, nameValid, buttonDisabled } = this.state;

    return (
      <div>
        <ModalBody>
          <div className={styles.wrap}>
            <Row>
              <Col xs="12" md="12">
                <div>Update your user settings below. </div>
                <div>Your current password is required in order to make any changes.</div>
              </Col>
              <Col xs="12" md="12">
                <Alert color="danger" isOpen={!emailValid} toggle={this.dismissEmailAlert}>
                  Email is invalid.
                </Alert>
              </Col>
              <Col xs="12" md="12">
                <Alert color="danger" isOpen={!oldPasswordValid} toggle={this.dismissOldPasswordAlert}>
                  Please enter current password to make changes.
                </Alert>
              </Col>
              <Col xs="12" md="12">
                <Alert color="danger" isOpen={!newPasswordValid} toggle={this.dismissNewPasswordAlert}>
                  New password is not at least 8 characters.
                </Alert>
              </Col>
              <Col xs="12" md="12">
                <Alert color="danger" isOpen={!newPasswordsMatch} toggle={this.dismissPasswordMatchAlert}>
                  Passwords do not match.
                </Alert>
              </Col>
              <Col xs="12" md="12">
                <Alert color="danger" isOpen={!nameValid} toggle={this.dismissNameAlert}>
                  Name cannot be blank.
                </Alert>
              </Col>
              <Col xs="12" md="12">
                <TextInput
                  id="updateSettingsNameInput"
                  type="text"
                  label="Name"
                  defaultValue={user.name}
                  onChange={this.nameInputChange}
                  valid={nameValid}
                />
              </Col>
              <Col xs="12" md="12">
                <TextInput
                  id="updateSettingsEmailInput"
                  label="Email"
                  defaultValue={user.email}
                  type="email"
                  required
                  onChange={this.emailInputChange}
                  valid={emailValid}
                />
              </Col>
              <Col xs="12" md="12">
                <TextInput
                  id="updateSettingsOldPasswordInput"
                  label="Current Password"
                  type="password"
                  autoComplete="new-password"
                  onChange={this.oldPasswordInputChange}
                  valid={oldPasswordValid}
                />
              </Col>
              <Col xs="12" md="12">
                <TextInput
                  id="updateSettingsNewPasswordInput"
                  label="New Password"
                  type="password"
                  autoComplete="new-password"
                  onChange={this.newPasswordInputChange}
                  valid={newPasswordValid}
                />
              </Col>
              <Col xs="12" md="12">
                <TextInput
                  id="updateSettingsNewPasswordConfirmInput"
                  label="Confirm New Password"
                  type="password"
                  autoComplete="new-password"
                  onChange={this.newPasswordConfirmInputChange}
                  valid={newPasswordsMatch}
                />
              </Col>
            </Row>
          </div>
        </ModalBody>
        <ModalFooter>
          <div>
            <div className={styles.buttonPadding}>
              <Button color="primary" disabled={buttonDisabled} onClick={this.submitClick}>
                Submit Changes
              </Button>
            </div>
            <div className={styles.buttonPadding}>
              <Button color="secondary" onClick={this.cancelClick}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalFooter>
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
)(UserSettingsUpdateFormModal);
