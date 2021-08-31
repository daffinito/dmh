import React, { Component } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import WidgetAccordion from "../../components/widgets/WidgetAccordion";
import ListUsers from "../../components/widgets/ListUsers";
import AddUser from "../../components/widgets/AddUser";
import {
  getUsersByAccount,
  getPendingUsersByAccount,
  addUserToMaster,
  checkSession,
  addUserToDispensary,
  deleteUserFromMaster,
  deleteUserFromDispensary
} from "../../actions";
// import PropTypes from "prop-types";
//import styles from "./styles/UserAdminWidgetContainer.module.css";

class UserAdminWidgetContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "ActiveUsers",
      addFailedAlertOpen: false,
      addFailedMessage: "",
      addSuccessAlertOpen: false,
      deleteFailedAlertOpen: false,
      deleteFailedMessage: "",
      deleteSuccessAlertOpen: false,
      addUserEmailValid: true,
      activeUsers: [],
      pendingUsers: [],
      isMaster: true,
      accountId: null
    };
  }

  componentDidMount() {
    const { accountDetails, master } = this.props;
    const isMaster = typeof master === "boolean" ? master : false;
    this.setState(() => ({ accountId: accountDetails.id, isMaster: isMaster }));
    this.props.getUsersByAccount(accountDetails.id, isMaster);
    this.props.getPendingUsersByAccount(accountDetails.id, isMaster);
  }

  componentWillReceiveProps(nextProps) {
    const { accountDetails, master } = this.props;
    const isMaster = typeof master === "boolean" ? master : false;
    if (this.props.accountData.getUsersByAccount !== nextProps.accountData.getUsersByAccount) {
      const { getUsersByAccount } = nextProps.accountData;
      if (getUsersByAccount.success) {
        this.setState(() => ({ activeUsers: getUsersByAccount.users }));
      }
    }

    if (this.props.accountData.getPendingUsersByAccount !== nextProps.accountData.getPendingUsersByAccount) {
      const { getPendingUsersByAccount } = nextProps.accountData;
      if (getPendingUsersByAccount.success) {
        this.setState(() => ({ pendingUsers: getPendingUsersByAccount.users }));
      }
    }

    if (this.props.accountData.addUserToMaster !== nextProps.accountData.addUserToMaster) {
      const { addUserToMaster } = nextProps.accountData;
      if (addUserToMaster.success) {
        this.setState(() => ({ addSuccessAlertOpen: true, addFailedAlertOpen: false }));
        this.props.getUsersByAccount(accountDetails.id, isMaster);
        this.props.getPendingUsersByAccount(accountDetails.id, isMaster);
      } else {
        this.setState(() => ({ addSuccessAlertOpen: false, addFailedAlertOpen: true, addFailedMessage: addUserToMaster.message }));
      }
    }

    if (this.props.accountData.addUserToDispensary !== nextProps.accountData.addUserToDispensary) {
      const { addUserToDispensary } = nextProps.accountData;
      if (addUserToDispensary.success) {
        this.setState(() => ({ addSuccessAlertOpen: true, addFailedAlertOpen: false }));
        this.props.getUsersByAccount(accountDetails.id, isMaster);
        this.props.getPendingUsersByAccount(accountDetails.id, isMaster);
      } else {
        this.setState(() => ({ addSuccessAlertOpen: false, addFailedAlertOpen: true, addFailedMessage: addUserToDispensary.message }));
      }
    }

    if (this.props.accountData.deleteUserFromMaster !== nextProps.accountData.deleteUserFromMaster) {
      const { deleteUserFromMaster } = nextProps.accountData;
      if (deleteUserFromMaster.success) {
        this.setState(() => ({ deleteSuccessAlertOpen: true, deleteFailedAlertOpen: false }));
        this.props.getUsersByAccount(accountDetails.id, isMaster);
        this.props.getPendingUsersByAccount(accountDetails.id, isMaster);
      } else {
        this.setState(() => ({
          deleteSuccessAlertOpen: false,
          deleteFailedAlertOpen: true,
          deleteFailedMessage: deleteUserFromMaster.message
        }));
      }
    }

    if (this.props.accountData.deleteUserFromDispensary !== nextProps.accountData.deleteUserFromDispensary) {
      const { deleteUserFromDispensary } = nextProps.accountData;
      if (deleteUserFromDispensary.success) {
        this.setState(() => ({ deleteSuccessAlertOpen: true, deleteFailedAlertOpen: false }));
        this.props.getUsersByAccount(accountDetails.id, isMaster);
        this.props.getPendingUsersByAccount(accountDetails.id, isMaster);
      } else {
        this.setState(() => ({
          deleteSuccessAlertOpen: false,
          deleteFailedAlertOpen: true,
          deleteFailedMessage: deleteUserFromDispensary.message
        }));
      }
    }
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  dismissAddFailedAlert = () => {
    this.setState(s => ({ addFailedAlertOpen: !s.addFailedAlertOpen }));
  };

  dismissAddSuccessAlert = () => {
    this.setState(s => ({ addSuccessAlertOpen: !s.addSuccessAlertOpen }));
  };

  dismissDeleteFailedAlert = () => {
    this.setState(s => ({ deleteFailedAlertOpen: !s.deleteFailedAlertOpen }));
  };

  dismissDeleteSuccessAlert = () => {
    this.setState(s => ({ deleteSuccessAlertOpen: !s.deleteSuccessAlertOpen }));
  };

  addUserSubmit = email => {
    const { isMaster, accountId } = this.state;
    if (isMaster) {
      this.props.addUserToMaster(accountId, email);
    } else {
      this.props.addUserToDispensary(accountId, email);
    }
  };

  addUserEmailValid = valid => {
    this.setState(() => ({ addUserEmailValid: valid }));
  };

  activeUserDeleteClick = email => {
    const { isMaster, accountId } = this.state;
    if (isMaster) {
      this.props.deleteUserFromMaster(accountId, email);
    } else {
      this.props.deleteUserFromDispensary(accountId, email);
    }
  };

  render() {
    const {
      activeTab,
      addFailedAlertOpen,
      addFailedMessage,
      addSuccessAlertOpen,
      deleteFailedAlertOpen,
      deleteFailedMessage,
      deleteSuccessAlertOpen,
      activeUsers,
      pendingUsers
    } = this.state;
    const { currentUser } = this.props;

    return (
      <div>
        <WidgetAccordion title={"USER ADMINISTRATION"} startOpen={false}>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "ActiveUsers" })}
                onClick={() => {
                  this.toggleTab("ActiveUsers");
                }}
              >
                ACTIVE USERS
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "PendingUsers" })}
                onClick={() => {
                  this.toggleTab("PendingUsers");
                }}
              >
                PENDING USERS
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "AddUser" })}
                onClick={() => {
                  this.toggleTab("AddUser");
                }}
              >
                ADD USER
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="ActiveUsers">
              <Alert color="danger" isOpen={deleteFailedAlertOpen} toggle={this.dismissDeleteFailedAlert}>
                An error occurered while removing user from account: {deleteFailedMessage}
              </Alert>
              <Alert color="success" isOpen={deleteSuccessAlertOpen} toggle={this.dismissDeleteSuccessAlert}>
                Removed user from account successfully!
              </Alert>
              <ListUsers users={activeUsers} currentUser={currentUser} deleteClick={this.activeUserDeleteClick} />
            </TabPane>

            <TabPane tabId="PendingUsers">
              <ListUsers users={pendingUsers} />
            </TabPane>

            <TabPane tabId="AddUser">
              <Row>
                <Col xs="12" md="12">
                  <Alert color="danger" isOpen={addFailedAlertOpen} toggle={this.dismissAddFailedAlert}>
                    An error occurered while adding user to account: {addFailedMessage}
                  </Alert>
                  <Alert color="success" isOpen={addSuccessAlertOpen} toggle={this.dismissAddSuccessAlert}>
                    Added user to account successfully!
                  </Alert>
                </Col>
              </Row>
              <AddUser emailValid={this.addUserEmailValid} onSubmit={this.addUserSubmit} />
            </TabPane>
          </TabContent>
        </WidgetAccordion>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { accountData } = state;
  return { accountData };
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      getUsersByAccount,
      getPendingUsersByAccount,
      addUserToMaster,
      checkSession,
      addUserToDispensary,
      deleteUserFromMaster,
      deleteUserFromDispensary
    }
  )(UserAdminWidgetContainer)
);
