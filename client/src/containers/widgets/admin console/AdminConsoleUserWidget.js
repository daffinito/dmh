import React, { Component } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import MasterAccounts from "../../../components/widgets/admin console/MasterAccounts";
import PendingUsers from "../../../components/widgets/admin console/PendingUsers";
import CreateUser from "../../../components/widgets/admin console/CreateUser";
import { getMasterAccounts, getPendingUsers, createUser, resendPendingEmail } from "../../../actions";
import WidgetAccordion from "../../../components/widgets/WidgetAccordion";
// import PropTypes from "prop-types";
//import styles from "./styles/AdminConsoleUserWidget.module.css";

class AdminConsoleUserWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWidgetOpen: false,
      activeTab: "MasterAccounts",
      createEmailValid: true,
      createNameValid: true,
      createFailedAlertOpen: false,
      createFailedMessage: "",
      createSuccessAlertOpen: false,
      resendPendingSuccess: false,
      resendPendingFailed: false
    };
  }

  componentDidMount() {
    this.props.getPendingUsers();
    this.props.getMasterAccounts();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.adminData.createUser !== nextProps.adminData.createUser) {
      const { adminData } = nextProps;
      if (!adminData.createUser.success && adminData.createUser.email !== "") {
        this.setState(() => ({
          createFailedAlertOpen: true,
          createFailedMessage: adminData.createUser.message,
          createSuccessAlertOpen: false
        }));
      }
      if (adminData.createUser.success && adminData.createUser.email !== "") {
        this.setState(() => ({
          createFailedAlertOpen: false,
          createFailedMessage: "",
          createSuccessAlertOpen: true
        }));
        this.props.getPendingUsers();
      }
    }

    if (this.props.userData.resendPendingEmail !== nextProps.userData.resendPendingEmail) {
      const { resendPendingEmail } = nextProps.userData;
      if (resendPendingEmail.success) {
        this.setState(() => ({ resendPendingSuccess: true, resendPendingFailed: false }));
      } else {
        this.setState(() => ({ resendPendingFailed: true, resendPendingSuccess: false }));
      }
    }
  }

  createSubmit = (email, name) => {
    this.props.createUser(email, name);
  };

  toggleCollapse = () => {
    this.setState(s => ({ isWidgetOpen: !s.isWidgetOpen }));
  };

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  setCreateEmailValid = emailValid => {
    this.setState(() => ({
      createEmailValid: emailValid
    }));
  };

  setCreateNameValid = nameValid => {
    this.setState(() => ({
      createNameValid: nameValid
    }));
  };

  dismissCreateEmailAlert = () => {
    this.setState(s => ({ createEmailValid: !s.createEmailValid }));
  };

  dismissCreateNameAlert = () => {
    this.setState(s => ({ createNameValid: !s.createNameValid }));
  };

  dismissCreateFailedAlert = () => {
    this.setState(s => ({ createFailedAlertOpen: !s.createFailedAlertOpen }));
  };

  dismissCreateSuccessAlert = () => {
    this.setState(s => ({ createSuccessAlertOpen: !s.createSuccessAlertOpen }));
  };

  dismissResendPendingFailedAlert = () => {
    this.setState(s => ({ resendPendingFailed: !s.resendPendingFailed }));
  };

  dismissResendPendingSuccessAlert = () => {
    this.setState(s => ({ resendPendingSuccess: !s.resendPendingSuccess }));
  };

  resendPending = id => {
    //resend pending
    this.props.resendPendingEmail(id);
  };

  render() {
    const {
      resendPendingFailed,
      resendPendingSuccess,
      activeTab,
      createEmailValid,
      createNameValid,
      createFailedAlertOpen,
      createFailedMessage,
      createSuccessAlertOpen
    } = this.state;
    const { adminData } = this.props;

    return (
      <div>
        <WidgetAccordion title={"ADMIN"} startOpen={true}>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "MasterAccounts" })}
                onClick={() => {
                  this.toggleTab("MasterAccounts");
                }}
              >
                Master Accounts
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "Pending" })}
                onClick={() => {
                  this.toggleTab("Pending");
                }}
              >
                Pending Users
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "Create" })}
                onClick={() => {
                  this.toggleTab("Create");
                }}
              >
                Create User
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="MasterAccounts">
              <MasterAccounts accounts={adminData.getMasterAccounts.accounts} />
            </TabPane>

            <TabPane tabId="Pending">
              <Alert color="danger" isOpen={resendPendingFailed} toggle={this.dismissResendPendingFailedAlert}>
                Failed to resend invitation email, contact <a href="mailto: support@dialmyhigh.com">support@dialmyhigh.com</a>
              </Alert>
              <Alert color="success" isOpen={resendPendingSuccess} toggle={this.dismissResendPendingSuccessAlert}>
                Successfully resent the invitation email!
              </Alert>
              <PendingUsers users={adminData.getPendingUsers.users} resendClick={this.resendPending} />
            </TabPane>

            <TabPane tabId="Create">
              <Row>
                <Col xs="12" md="12">
                  <Alert color="danger" isOpen={!createEmailValid} toggle={this.dismissCreateEmailAlert}>
                    Email is invalid.
                  </Alert>
                  <Alert color="danger" isOpen={!createNameValid} toggle={this.dismissCreateNameAlert}>
                    Name is blank.
                  </Alert>
                  <Alert color="danger" isOpen={createFailedAlertOpen} toggle={this.dismissCreateFailedAlert}>
                    Create failed: {createFailedMessage}
                  </Alert>
                  <Alert color="success" isOpen={createSuccessAlertOpen} toggle={this.dismissCreateSuccessAlert}>
                    Create successful!
                  </Alert>
                </Col>
              </Row>
              <CreateUser nameValid={this.setCreateNameValid} emailValid={this.setCreateEmailValid} onSubmit={this.createSubmit} />
            </TabPane>
          </TabContent>
        </WidgetAccordion>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { adminData, userData } = state;
  return {
    adminData,
    userData
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { getMasterAccounts, getPendingUsers, createUser, resendPendingEmail }
  )(AdminConsoleUserWidget)
);
