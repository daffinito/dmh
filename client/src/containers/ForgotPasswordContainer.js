import React, { Component } from "react";
import { Container, Row, Col, Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./styles/ForgotPasswordContainer.module.css";
import PropTypes from "prop-types";
import NavbarContainer from "./NavbarContainer";
import StickyFooter from "../components/StickyFooter";
import LoadingOverlay from "../components/LoadingOverlay";
import LocationContainer from "./LocationContainer";
import { getUserByToken, setPassword, forgotPassword } from "../actions";
import DmhButton from "../components/DmhButton";
import TextInput from "../components/TextInput";

// route /forgotpassword
class ForgotPasswordContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: true,
      settingPassword: false,
      waitingForEmail: false,
      passwordValid: true,
      emailValid: true,
      setPasswordSuccess: false,
      error: false,
      errorMessage: "",
      noAccounts: false
    };
  }

  componentDidMount() {
    const { token } = this.props;
    if (token) {
      this.props.getUserByToken(token);
    } else {
      this.setState(() => ({ loading: false }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userData !== nextProps.userData) {
      const { userData } = nextProps;
      // get user
      if (userData.getUser.success !== null) {
        this.processGetUser(userData);
      }
      if (userData.setPassword.success !== null) {
        this.processResponse(userData);
      }
    }
  }

  processGetUser = userData => {
    if (userData.getUser.success) {
      this.setState(() => ({
        loading: false,
        settingPassword: true,
        error: false,
        email: userData.user.email
      }));
    } else if (!userData.getUser.success) {
      this.setState(() => ({
        loading: false,
        error: true,
        errorMessage: userData.getUser.message
      }));
    }
  };

  processResponse = userData => {
    if (userData.setPassword.success) {
      this.setState(() => ({ setPasswordSuccess: true }));
    } else {
      this.setState(() => ({ error: true, errorMessage: userData.setPassword.message }));
    }
  };

  goToAccount = e => {
    e.preventDefault();

    const { userData } = this.props;
    if (userData.user.type === "ADMIN") {
      this.props.history.push(`/admin/console`);
    }
    if (userData.user.type === "DISPENSARY") {
      let accountId;
      if (typeof userData.masterAccount !== "undefined" && userData.masterAccount !== null) {
        accountId = userData.masterAccount.id;
        this.props.history.push(`/account/${accountId}/masterconsole`);
      } else if (typeof userData.subAccounts !== "undefined" && userData.subAccounts !== null && userData.subAccounts.length > 0) {
        accountId = userData.subAccounts[0].id;
        this.props.history.push(`/account/${accountId}/console`);
      }

      if (typeof accountId === "undefined") {
        this.setState(() => ({ loading: false, noAccounts: true }));
      }
    }
  };

  submitEmail = e => {
    e.preventDefault();

    const { email } = this.state;
    const emailValid = this.validateEmail(email);
    if (emailValid) {
      this.props.forgotPassword(email);
    }
    this.setState(() => ({
      waitingForEmail: true
    }));
  };

  submitPassword = e => {
    e.preventDefault();

    const { password, email, token } = this.state;
    const passwordValid = this.validatePassword(password);
    if (passwordValid) {
      this.props.setPassword(email, password, token);
      this.setState(() => ({
        loading: true
      }));
    }
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

  validatePassword = p => {
    const passwordValid = p.length > 7;
    this.setState(() => ({ passwordValid: passwordValid }));
    return passwordValid;
  };

  dismissPasswordAlert = () => {
    this.setState(() => ({ passwordValid: true }));
  };

  dismissEmailAlert = () => {
    this.setState(() => ({ emailValid: true }));
  };

  dismissErrorAlert = () => {
    this.setState(() => ({ error: false }));
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

  render() {
    const {
      loading,
      error,
      settingPassword,
      setPasswordSuccess,
      waitingForEmail,
      errorMessage,
      passwordValid,
      emailValid,
      noAccounts
    } = this.state;
    const wrapperClasses = loading ? "d-flex flex-column wrapper busy-cursor" : "d-flex flex-column wrapper";

    let title = <div>Loading, please wait.</div>;
    let subtext = <div />;
    let smalltext = <div />;
    let componentToDisplay = <div />;

    if (!loading) {
      if (!settingPassword) {
        if (!waitingForEmail) {
          title = <div>Forgot Password</div>;
          subtext = <div>Please enter your email and we'll send you a link to change your password.</div>;
          smalltext = <div />;
          componentToDisplay = (
            <div className={styles.background}>
              <Col xs="12" md="12">
                <TextInput id="emailInput" label="Email" onChange={this.emailInputChange} type="text" valid={emailValid} />
              </Col>
              <Col xs="12" md="12">
                <DmhButton value="Submit" title="Submit" dark clickHandler={e => this.submitEmail(e)} />
              </Col>
            </div>
          );
        } else {
          title = <div>Forgot Password</div>;
          subtext = <div>Thank you! Please check your email for a link to set a new password.</div>;
          smalltext = <div>Contact <a href="mailto: support@dialmyhigh.com">support@dialmyhigh.com</a> for help.</div>;
          componentToDisplay = <div />;
        }
      } else {
        if (error) {
          title = <div>ERROR OCCURRED</div>;
          subtext = <div>{errorMessage}</div>; // TODO: NEED TO IMPLEMENT SENDING A NEW TOKEN
          smalltext = (
            <div>
              Please contact <a href="mailto: support@dialmyhigh.com">support@dialmyhigh.com</a>.
            </div>
          );
          componentToDisplay = <div />;
        }

        if (!error && setPasswordSuccess && !noAccounts) {
          title = <div>Successfully updated password!</div>;
          subtext = <div />;
          smalltext = <div />;
          componentToDisplay = (
            <Col xs="12" md="12">
              <DmhButton value="Go to default account" title="Go to account" dark clickHandler={e => this.goToAccount(e)} />
            </Col>
          );
        }

        if (!error && !setPasswordSuccess && !noAccounts) {
          title = <div>Forgot Password</div>;
          subtext = <div>Please provide a new password for your User Profile.</div>;
          smalltext = <div>The password should be a minimum of 8 characters long.</div>;
          componentToDisplay = (
            <div className={styles.background}>
              <Col xs="12" md="12">
                <TextInput
                  id="passwordInput"
                  label="Password"
                  onChange={this.passwordInputChange}
                  type="password"
                  autoComplete="off"
                  valid={passwordValid}
                />
              </Col>
              <Col xs="12" md="12">
                <DmhButton value="Submit" title="Submit" dark clickHandler={e => this.submitPassword(e)} />
              </Col>
            </div>
          );
        }

        if (!error && setPasswordSuccess && noAccounts) {
          title = <div>You are not associated with any dispensary accounts!</div>;
          subtext = <div>Contact your admin or <a href="mailto: support@dialmyhigh.com">support@dialmyhigh.com</a> for help.</div>;
          smalltext = <div />;
          componentToDisplay = <div />;
        }
      }
    }
    return (
      <div className={wrapperClasses}>
        <NavbarContainer />
        <LocationContainer />
        <LoadingOverlay show={loading} />
        <Container className="flex-fill">
          <Row noGutters className="navbar-top-buffer">
            <Col xs="12" md="12">
              <Alert color="danger" isOpen={!passwordValid} toggle={this.dismissPasswordAlert}>
                Password is not at least 8 characters.
              </Alert>
              <Alert color="danger" isOpen={!emailValid} toggle={this.dismissEmailAlert}>
                Email is not valid.
              </Alert>
            </Col>
            <Col xs="12" md="10">
              <div className={styles.signupTitle}>{title}</div>
            </Col>
            <Col xs="12" md="10">
              <div className={styles.signupText}>{subtext}</div>
            </Col>
            <Col xs="12" md="10">
              <div className={styles.smallText}>{smalltext}</div>
            </Col>
            {componentToDisplay}
          </Row>
        </Container>
        <StickyFooter />
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

ForgotPasswordContainer.propTypes = {
  match: PropTypes.object.isRequired, // for Router
  location: PropTypes.object.isRequired, // for Router
  history: PropTypes.object.isRequired // for Router
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      getUserByToken,
      setPassword,
      forgotPassword
    }
  )(ForgotPasswordContainer)
);
