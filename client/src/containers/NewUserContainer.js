import React, { Component } from "react";
import { Container, Row, Col, Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./styles/NewUserContainer.module.css";
import PropTypes from "prop-types";
import NavbarContainer from "./NavbarContainer";
import StickyFooter from "../components/StickyFooter";
import LoadingOverlay from "../components/LoadingOverlay";
import LocationContainer from "./LocationContainer";
import SignUpSetPreferences from "../components/SignUpSetPreferences";
import { getUserByToken, setNewUserPrefs } from "../actions";
import DmhButton from "../components/DmhButton";

// route /signup
class NewUserContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      loading: true,
      passwordValid: true,
      nameValid: true,
      setPrefsSuccess: false,
      error: false,
      errorMessage: "",
      noAccounts: false
    };
  }

  componentDidMount() {
    const { token } = this.props;
    this.props.getUserByToken(token);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userData !== nextProps.userData) {
      const { userData } = nextProps;
      // get user
      if (userData.getUser.success !== null) {
        this.processGetUser(userData);
      }
      if (userData.setNewUserPrefs.success !== null) {
        this.processResponse(userData);
      }
    }
  }

  processGetUser = userData => {
    if (userData.getUser.success) {
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
    }
  };

  processResponse = userData => {
    if (userData.setNewUserPrefs.success) {
      this.setState(() => ({ setPrefsSuccess: true }));
    } else {
      this.setState(() => ({ error: true, errorMessage: userData.setNewUserPrefs.message }));
    }
  };

  goToAccount = e => {
    e.preventDefault();

    const { userData } = this.props;
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

  onSetPreferencesSuccess = settings => {
    const { email } = this.state;
    const { token } = this.props;
    this.setState(() => ({
      loading: true
    }));

    this.props.setNewUserPrefs({ email: email, password: settings.password, token: token, name: settings.name });
  };

  setPasswordValid = passwordValid => {
    this.setState(() => ({ passwordValid: passwordValid }));
  };

  setNameValid = nameValid => {
    this.setState(() => ({ nameValid: nameValid }));
  };

  dismissPasswordAlert = () => {
    this.setState(() => ({ passwordValid: true }));
  };

  dismissNameAlert = () => {
    this.setState(() => ({ nameValid: true }));
  };

  dismissErrorAlert = () => {
    this.setState(() => ({ error: false }));
  };

  render() {
    const { email, loading, error, setPrefsSuccess, errorMessage, passwordValid, nameValid, name, noAccounts } = this.state;
    const wrapperClasses = loading ? "d-flex flex-column wrapper busy-cursor" : "d-flex flex-column wrapper";

    let title = <div>Loading, please wait.</div>;
    let subtext = <div />;
    let smalltext = <div />;
    let componentToDisplay = <div />;

    if (!loading && error) {
      title = <div>ERROR OCCURRED</div>;
      subtext = <div>{errorMessage}</div>; // TODO: NEED TO IMPLEMENT SENDING A NEW TOKEN
      smalltext = (
        <div>Please contact <a href="mailto: support@dialmyhigh.com">support@dialmyhigh.com</a> for assistance.</div>
      );
      componentToDisplay = <div> </div>;
    }

    if (!loading && !error && setPrefsSuccess && !noAccounts) {
      title = <div>Successfully updated settings!</div>;
      subtext = <div />;
      smalltext = <div />;
      componentToDisplay = (
        <Col xs="12" md="12">
          <DmhButton value="Go to default account" title="Go to account" dark clickHandler={e => this.goToAccount(e)} />
        </Col>
      );
    }

    if (!loading && !error && !setPrefsSuccess && !noAccounts) {
      title = <div>Hi {name}!</div>;
      subtext = (
        <div>
          <div>Please provide a name and password for your new User Profile.</div>
        </div>
      );
      smalltext = <div>The password should be a minimum of 8 characters long, and the name cannot be blank.</div>;
      componentToDisplay = (
        <div className={styles.background}>
          <Col xs="12" md="12">
            <SignUpSetPreferences
              name={name}
              email={email}
              nameValid={this.setNameValid}
              passwordValid={this.setPasswordValid}
              onSuccess={this.onSetPreferencesSuccess}
            />
          </Col>
        </div>
      );
    }

    if (!loading && !error && setPrefsSuccess && noAccounts) {
      title = <div>You are not associated with any dispensary accounts!</div>;
      subtext = <div>Contact your admin or <a href="mailto: support@dialmyhigh.com">support@dialmyhigh.com</a> for help.</div>;
      smalltext = <div />;
      componentToDisplay = <div />;
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
              <Alert color="danger" isOpen={!nameValid} toggle={this.dismissNameAlert}>
                Name cannot be blank.
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

NewUserContainer.propTypes = {
  match: PropTypes.object.isRequired, // for Router
  location: PropTypes.object.isRequired, // for Router
  history: PropTypes.object.isRequired // for Router
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      getUserByToken,
      setNewUserPrefs
    }
  )(NewUserContainer)
);
