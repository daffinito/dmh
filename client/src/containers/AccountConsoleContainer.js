import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./styles/AccountConsoleContainer.module.css";
import PropTypes from "prop-types";
import DmhButton from "../components/DmhButton";
import NavbarContainer from "./NavbarContainer";
import StickyFooter from "../components/StickyFooter";
import LoadingOverlay from "../components/LoadingOverlay";
import DispensaryInfoWidgetContainer from "./widgets/account console/DispensaryInfoWidgetContainer";
import DispensaryChartsWidgetContainer from "./widgets/account console/DispensaryChartsWidgetContainer";
import UserAdminWidgetContainer from "./widgets/UserAdminWidgetContainer";
import CustomStrainWidgetContainer from "./widgets/account console/CustomStrainWidgetContainer";
import AccountSwitcher from "./AccountSwitcher";
import SessionTracker from "./SessionTracker";
import {  getDispensaryAccountById } from "../actions";

// route /account/:id/console
class AccountConsoleContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      accountDetails: null,
      noAccessError: false,
      currentUserEmail: "",
      isDMHAdmin: false
    };
  }

  componentDidMount() {
    const { userData } = this.props;
    if (typeof userData.user !== "undefined" && userData.user !== null) {
      if (userData.user.id > 0) {
        this.init(userData, this.props.accountId);
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
      if (typeof userData.user !== "undefined" && userData.user !== null) {
        if (userData.user.id > 0) {
          this.init(userData, accountId);
        }
      }
    }
    if (this.props.accountData.getDispensaryAccountById !== nextProps.accountData.getDispensaryAccountById) {
      const { getDispensaryAccountById } = nextProps.accountData;
      if (getDispensaryAccountById.success) {
        this.setState(() => ({
          loading: false,
          accountDetails: getDispensaryAccountById.account,
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
      this.props.getDispensaryAccountById(accountId);
    } else {
      const { subAccounts } = userData;
      const accountDetails = subAccounts.find(account => {
        return +account.id === +accountId;
      });
      if (typeof accountDetails === "undefined") {
        this.setState(() => ({
          loading: false,
          noAccessError: true
        }));
      } else {
        this.setState(() => ({
          loading: false,
          accountDetails: accountDetails,
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
    const { loading, noAccessError, accountDetails, currentUserEmail } = this.state;
    const { accountId, cookies } = this.props;
    const wrapperClasses = loading ? "d-flex flex-column wrapper busy-cursor" : "d-flex flex-column wrapper";
    let componentsToDisplay = loading ? null : (
      <Row noGutters className="navbar-top-buffer">
        <Col xs="12" md="12">
          <DispensaryInfoWidgetContainer accountDetails={accountDetails} />
        </Col>
        <Col xs="12" md="12">
          <UserAdminWidgetContainer accountDetails={accountDetails} currentUser={currentUserEmail} />
        </Col>
        <Col xs="12" md="12">
          <CustomStrainWidgetContainer accountDetails={accountDetails} />
        </Col>
        <Col xs="12" md="12">
          <DispensaryChartsWidgetContainer accountDetails={accountDetails} />
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
          <AccountSwitcher currentAccount={{ type: "sub", id: accountId }} />
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
    userData, accountData
  };
}

AccountConsoleContainer.propTypes = {
  match: PropTypes.object.isRequired, // for Router
  location: PropTypes.object.isRequired, // for Router
  history: PropTypes.object.isRequired // for Router
};

export default withRouter(
  connect(
    mapStateToProps,
    {getDispensaryAccountById}
  )(AccountConsoleContainer)
);
