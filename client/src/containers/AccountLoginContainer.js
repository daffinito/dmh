import React, { Component } from "react";
import { Alert, Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./styles/AdminConsoleContainer.module.css";
import PropTypes from "prop-types";
import NavbarContainer from "./NavbarContainer";
import StickyFooter from "../components/StickyFooter";
import LoadingOverlay from "../components/LoadingOverlay";
import LocationContainer from "./LocationContainer";
import LoginForm from "../components/LoginForm";
import { fullLogin } from "../actions";

// route /login
class AccountLoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      passwordValid: true,
      emailValid: true,
      noAccounts: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.userData !== nextProps.userData) {
      const { userData } = nextProps;
      if (userData.fullLogin.success !== null) {
        if (userData.fullLogin.success) {
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
        }
        if (!userData.fullLogin.success) {
          this.setState(() => ({ loading: false, passwordValid: false }));
        }
      }
    }
  }

  onSuccess = (email, password) => {
    this.props.fullLogin(email, password, true);
    this.setState(() => ({ loading: true }));
  };

  setEmailValid = emailValid => {
    this.setState(() => ({ emailValid: emailValid }));
  };

  setPasswordValid = passwordValid => {
    this.setState(() => ({ passwordValid: passwordValid }));
  };

  dismissPasswordAlert = () => {
    this.setState(() => ({ passwordValid: true }));
  };

  dismissNoAccountAlert = () => {
    this.setState(() => ({ noAccounts: false }));
  };

  dismissEmailAlert = () => {
    this.setState(() => ({ emailValid: true }));
  };

  forgotPasswordClick = () => {
    this.props.history.push("/forgotpassword");
  };

  render() {
    const { emailValid, passwordValid, loading, noAccounts } = this.state;
    const wrapperClasses = loading ? "d-flex flex-column wrapper busy-cursor" : "d-flex flex-column wrapper";

    const title = "Dispensary Account Login";
    const subtext = (
      <div>
        <div>Enter your email and password below.</div>
      </div>
    );
    const subsubtext = (
      <div className={styles.linkContainer}>
        <span className={styles.link} onClick={this.forgotPasswordClick}>
          Forgot password?
        </span>
      </div>
    );

    return (
      <div className={wrapperClasses}>
        <NavbarContainer />
        <LocationContainer />
        <LoadingOverlay show={loading} />
        <Container className="flex-fill">
          <Row noGutters className="navbar-top-buffer">
            <Col xs="12" md="12">
              <Alert color="danger" isOpen={!emailValid} toggle={this.dismissEmailAlert}>
                Email is invalid.
              </Alert>
            </Col>
            <Col xs="12" md="12">
              <Alert color="danger" isOpen={!passwordValid} toggle={this.dismissPasswordAlert}>
                Incorrect password or account doesn't exist.
              </Alert>
            </Col>
            <Col xs="12" md="12">
              <Alert color="danger" isOpen={noAccounts} toggle={this.dismissNoAccountAlert}>
                No dispensary accounts associated with this user account.
              </Alert>
            </Col>
            <Col xs="12" md="10">
              <div className={styles.title}>{title}</div>
            </Col>
            <Col xs="12" md="10">
              <div className={styles.text}>{subtext}</div>
            </Col>
            <Col xs="12" md="10">
              <div className={styles.subtext}>{subsubtext}</div>
            </Col>

            <div className={styles.form}>
              <Col xs="12" md="12">
                <LoginForm emailValid={this.setEmailValid} passwordValid={this.setPasswordValid} onSuccess={this.onSuccess} />
              </Col>
            </div>
          </Row>
        </Container>
        <StickyFooter />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userData } = state;
  return { userData };
}

AccountLoginContainer.propTypes = {
  match: PropTypes.object.isRequired, // for Router
  location: PropTypes.object.isRequired, // for Router
  history: PropTypes.object.isRequired // for Router
};

export default withRouter(
  connect(
    mapStateToProps,
    { fullLogin }
  )(AccountLoginContainer)
);
