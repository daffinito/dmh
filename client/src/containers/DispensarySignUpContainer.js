import React, { Component } from "react";
import { Container, Row, Col, Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./styles/DispensarySignUpContainer.module.css";
import PropTypes from "prop-types";
import NavbarContainer from "./NavbarContainer";
import StickyFooter from "../components/StickyFooter";
import LoadingOverlay from "../components/LoadingOverlay";
import LocationContainer from "./LocationContainer";
import DispensarySignUpSetPassword from "../components/DispensarySignupSetPassword";
import DispensarySignupSetMasterAccount from "../components/DispensarySignupSetMasterAccount";
import { getUserByToken, setPassword, createMasterAccount, checkSession } from "../actions";
import DmhButton from "../components/DmhButton";

// route /signup/dispensary
class DispensarySignUpContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      loading: true,
      passwordValid: true,
      error: false,
      errorMessage: "",
      settingMaster: false,
      masterName: "",
      step: 1,
      allDone: false
    };
  }

  componentDidMount() {
    const { token } = this.props;
    this.props.getUserByToken(token);
  }

  componentWillReceiveProps(nextProps) {
    const { step } = this.state;
    if (this.props.userData !== nextProps.userData) {
      const { userData } = nextProps;
      // get user
      if (userData.getUser.success !== null && step === 1) {
        this.processGetUser(userData);
      }
      // set password
      if (userData.setPassword.success !== null && step === 2) {
        this.processSetPassword(userData);
      }
    }

    if (this.props.adminData !== nextProps.adminData) {
      const adminData = nextProps.adminData;
      if (adminData.createMasterAccount.success !== null && step === 3) {
        this.processCreateMasterAccount(adminData);
      }
    }
  }

  processCreateMasterAccount = adminData => {
    if (!adminData.createMasterAccount.success) {
      this.setState(() => ({
        loading: false,
        error: true,
        errorMessage: "There was an error while creating the account."
      }));
    } else if (adminData.createMasterAccount.success) {
      this.setState(() => ({
        allDone: true
      }));
    }
  };

  processSetPassword = userData => {
    if (userData.setPassword.success) {
      this.setState(() => ({
        loading: false,
        error: false,
        settingMaster: true,
        step: 3
      }));
    } else if (!userData.setPassword.success) {
      this.setState(() => ({
        loading: false,
        error: true,
        errorMessage: userData.setPassword.message
      }));
    }
  };

  processGetUser = userData => {
    if (userData.getUser.success && userData.user.newOwner) {
      this.setState(() => ({
        loading: false,
        error: false,
        email: userData.user.email,
        name: userData.user.name
      }));
    } else if (!userData.getUser.success) {
      this.setState(() => ({
        loading: false,
        error: true,
        errorMessage: userData.getUser.message
      }));
    } else if (!userData.user.newOwner) {
      this.setState(() => ({
        loading: false,
        error: true,
        errorMessage: "You do not appear to be a new dispensary account owner. Please contact your sales rep or support@dialmyhigh.com."
      }));
    }
  };

  onSetPasswordSuccess = password => {
    const { email } = this.state;
    const { token } = this.props;
    this.setState(() => ({
      loading: true,
      step: 2
    }));
    this.props.setPassword(email, password, token);
  };

  onSetMasterNameSuccess = masterName => {
    this.setState(() => ({
      masterName: masterName
    }));
    this.props.createMasterAccount(masterName);
  };

  setPasswordValid = passwordValid => {
    this.setState(() => ({ passwordValid: passwordValid }));
  };

  dismissPasswordAlert = () => {
    this.setState(() => ({ passwordValid: true }));
  };

  dismissErrorAlert = () => {
    this.setState(() => ({ error: false }));
  };

  handleGotoConsoleClick = e => {
    const url = `/account/${this.props.adminData.createMasterAccount.masterAccount.id}/masterconsole`;
    this.props.history.push(url);
  };

  render() {
    const { email, loading, error, errorMessage, passwordValid, name, settingMaster, allDone } = this.state;
    const wrapperClasses = loading ? "d-flex flex-column wrapper busy-cursor" : "d-flex flex-column wrapper";

    let title = <div>Loading, please wait.</div>;
    let subtext = <div />;
    let smalltext = <div />;
    let componentToDisplay = <div />;

    if (!loading && error) {
      title = <div>ERROR OCCURRED</div>;
      subtext = <div>{errorMessage}</div>;
      smalltext = <div>Please contact <a href="mailto: support@dialmyhigh.com">support@dialmyhigh.com</a>.</div>;
      componentToDisplay = <div> </div>;
    }

    if (!loading && !error) {
      if (!settingMaster) {
        title = <div>Hi {name}!</div>;
        subtext = (
          <div>
            <div>Please provide a password for your new User Profile.</div>
            <div>This will be used along with your email address {email} to sign in and manage your dispensaries.</div>
          </div>
        );
        smalltext = <div>The password should be a minimum of 8 characters long.</div>;
        componentToDisplay = (
          <div className={styles.background}>
            <Col xs="12" md="12">
              <DispensarySignUpSetPassword passwordValid={this.setPasswordValid} onSuccess={this.onSetPasswordSuccess} />
            </Col>
          </div>
        );
      }
      if (settingMaster) {
        title = <div>Set Master Account Name</div>;
        subtext = <div>Please provide a name for your Master Account.</div>;
        smalltext = <div />;
        componentToDisplay = (
          <div className={styles.background}>
            <Col xs="12" md="12">
              <DispensarySignupSetMasterAccount onSuccess={this.onSetMasterNameSuccess} />
            </Col>
          </div>
        );
      }
      if (allDone) {
        title = <div>Congratulations!</div>;
        subtext = <div>Your master account has been created!</div>;
        smalltext = <div>Click the button below to go to the Master Account Console.</div>;
        componentToDisplay = (
          <div className={styles.background}>
            <Col xs="12" md="12">
              <DmhButton dark value="Go to console" title="Go to console" clickHandler={e => this.handleGotoConsoleClick(e)} />
            </Col>
          </div>
        );
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
  const { userData, adminData } = state;
  return {
    userData,
    adminData
  };
}

DispensarySignUpContainer.propTypes = {
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
      createMasterAccount,
      checkSession
    }
  )(DispensarySignUpContainer)
);
