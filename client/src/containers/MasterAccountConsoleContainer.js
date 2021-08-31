import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./styles/MasterAccountConsoleContainer.module.css";
import PropTypes from "prop-types";
import DmhButton from "../components/DmhButton";
import NavbarContainer from "./NavbarContainer";
import StickyFooter from "../components/StickyFooter";
import LoadingOverlay from "../components/LoadingOverlay";
import SubAccountWidgetContainer from "./widgets/masteraccount console/SubAccountWidgetContainer";
import AccountSwitcher from "./AccountSwitcher";
import MasterAccountInfoWidgetContainer from "./widgets/masteraccount console/MasterAccountInfoWidgetContainer";
import UserAdminWidgetContainer from "./widgets/UserAdminWidgetContainer";
import SessionTracker from "./SessionTracker";
import { getMasterAccountById } from "../actions";

// route /account/:id/masterconsole
class MasterAccountConsoleContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      accountId: this.props.accountId,
      accountDetails: null,
      noAccessError: false,
      currentUserEmail: "",
      isDMHAdmin: false
    };
  }

  componentDidMount() {
    const { userData, accountId } = this.props;
    if (typeof userData.user !== "undefined" && userData.user !== null) {
      if (userData.user.id > 0) {
        this.init(userData, accountId);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userData !== nextProps.userData) {
      const { userData, accountId } = nextProps;
      if (typeof userData.user !== "undefined" && userData.user !== null) {
        if (userData.user.id > 0) {
          this.init(userData, accountId);
        }
      }
    }
    if (this.props.accountId !== nextProps.accountId) {
      const { userData, accountId } = nextProps;
      this.setState(() => ({
        accountId: accountId,
        loading: true,
        noAccessError: false
      }));
      this.init(userData, accountId);
    }
    if (this.props.accountData.getMasterAccountById !== nextProps.accountData.getMasterAccountById) {
      const { getMasterAccountById } = nextProps.accountData;
      if (getMasterAccountById.success) {
        this.setState(() => ({
          loading: false,
          accountDetails: getMasterAccountById.account,
          noAccessError: false,
          currentUserEmail: nextProps.userData.user.email
        }));
      }
    }
  }

  init = (userData, accountId) => {
    if (userData.user.type === "ADMIN") {
      console.log("admin");
      this.setState(() => ({ isDMHAdmin: true }));
      this.props.getMasterAccountById(accountId);
    } else {
      const { masterAccount } = userData;
      if (typeof masterAccount === "undefined" || masterAccount === null || +accountId !== +masterAccount.id) {
        this.setState(() => ({
          loading: false,
          noAccessError: true
        }));
      } else {
        this.setState(() => ({
          loading: false,
          accountDetails: masterAccount,
          noAccessError: false,
          currentUserEmail: userData.user.email
        }));
      }
    }
  };

  noAccessButtonClick = e => {
    e.preventDefault();

    this.props.history.push("/login");
  };

  render() {
    const { loading, accountDetails, noAccessError, accountId, currentUserEmail } = this.state;
    const { cookies } = this.props;
    const wrapperClasses = loading ? "d-flex flex-column wrapper busy-cursor" : "d-flex flex-column wrapper";
    let componentsToDisplay = loading ? null : (
      <Row noGutters className="navbar-top-buffer">
        <Col xs="12" md="12">
          <MasterAccountInfoWidgetContainer accountDetails={accountDetails} />
        </Col>
        <Col xs="12" md="12">
          <SubAccountWidgetContainer accountDetails={accountDetails} />
        </Col>
        <Col xs="12" md="12">
          <UserAdminWidgetContainer master accountDetails={accountDetails} currentUser={currentUserEmail} />
        </Col>
      </Row>
    );

    if (noAccessError) {
      componentsToDisplay = (
        <Row noGutters className="navbar-top-buffer">
          <Col xs="12" md="12">
            <div className={styles.title}>You do not have access to this account.</div>
          </Col>
          <Col xs="12" md="12">
            <DmhButton size="xl" clickHandler={this.noAccessButtonClick} value="GO BACK TO LOGIN" title="GO BACK TO LOGIN" />
          </Col>
        </Row>
      );
    }

    return (
      <div className={wrapperClasses}>
        <NavbarContainer>
          <AccountSwitcher currentAccount={{ type: "master", id: accountId }} />
        </NavbarContainer>
        <SessionTracker cookies={cookies} />
        <LoadingOverlay show={loading} />
        <Container className="flex-fill">{componentsToDisplay}</Container>
        <StickyFooter />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userData, accountData } = state;
  return {
    userData,
    accountData
  };
}

MasterAccountConsoleContainer.propTypes = {
  match: PropTypes.object.isRequired, // for Router
  location: PropTypes.object.isRequired, // for Router
  history: PropTypes.object.isRequired // for Router
};

export default withRouter(
  connect(
    mapStateToProps,
    { getMasterAccountById }
  )(MasterAccountConsoleContainer)
);
