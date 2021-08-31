import React, { Component } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import WidgetAccordion from "../../../components/widgets/WidgetAccordion";
import CreateSubAccount from "../../../components/widgets/masteraccount console/CreateSubAccount";
import ListSubAccounts from "../../../components/widgets/masteraccount console/ListSubAccounts";
import { createDispensaryAccount, deleteDispensaryAccount, checkSession } from "../../../actions";
import DeleteAccountModal from "../../../components/widgets/masteraccount console/DeleteAccountModal";

class SubAccountWidgetContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "ListSubAccounts",
      createNameValid: true,
      createFailedAlertOpen: false,
      createFailedMessage: "",
      createSuccessAlertOpen: false,
      createEnabled: false,
      deleteModalOpen: false,
      deleteAccount: null,
      deleteSuccess: false,
      deleteFailed: false,
      deleteFailedMessage: ""
    };
  }

  componentDidMount() {
    const { accountDetails } = this.props;
    const numberOfSubs = accountDetails.SubAccounts.length;
    const createEnabled = numberOfSubs < accountDetails.dispensaryLimit;
    this.setState(() => ({
      createEnabled: createEnabled
    }));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.accountDetails !== nextProps.accountDetails) {
      const { accountDetails } = nextProps;
      const numberOfSubs = accountDetails.SubAccounts.length;
      const createEnabled = numberOfSubs < accountDetails.dispensaryLimit;
      this.setState(() => ({
        createEnabled: createEnabled
      }));
    }
    if (this.props.accountData.createDispensaryAccount !== nextProps.accountData.createDispensaryAccount) {
      const { createDispensaryAccount } = nextProps.accountData;
      if (createDispensaryAccount.success) {
        this.setState(() => ({
          createSuccessAlertOpen: true
        }));
        this.props.checkSession();
      } else {
        this.setState(() => ({
          createSuccessAlertOpen: false,
          createFailedAlertOpen: true,
          createFailedMessage: createDispensaryAccount.message
        }));
      }
    }

    if (this.props.accountData.deleteDispensaryAccount !== nextProps.accountData.deleteDispensaryAccount) {
      const { deleteDispensaryAccount } = nextProps.accountData;
      if (deleteDispensaryAccount.success) {
        this.setState(() => ({ deleteSuccess: true, deleteFailed: false }));
        this.props.checkSession();
      } else {
        this.setState(() => ({ deleteFailed: true, deleteSuccess: false, deleteFailedMessage: deleteDispensaryAccount.message }));
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

  createSubmit = name => {
    this.props.createDispensaryAccount(this.props.accountDetails.id, name);
  };

  setCreateNameValid = nameValid => {
    this.setState(() => ({
      createNameValid: nameValid
    }));
  };

  dismissDeleteSuccessAlert = () => {
    this.setState(s => ({ deleteSuccess: !s.deleteSuccess }));
  };

  dismissDeleteFailedAlert = () => {
    this.setState(s => ({ deleteFailed: !s.deleteFailed }));
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

  dismissCreateEnabledAlert = () => {
    // don't want this to be dismissable.
  };

  openDeleteConfirmModal = account => {
    this.setState(() => ({ deleteModalOpen: true, deleteAccount: account }));
  };

  deleteConfirmClick = account => {
    this.props.deleteDispensaryAccount(account.id);
    this.setState(() => ({ deleteModalOpen: false }));
  };

  toggleDeleteModal = () => {
    this.setState(s => ({ deleteModalOpen: !s.deleteModalOpen }));
  };

  render() {
    const {
      activeTab,
      createNameValid,
      createFailedAlertOpen,
      createFailedMessage,
      createSuccessAlertOpen,
      createEnabled,
      deleteModalOpen,
      deleteAccount,
      deleteSuccess,
      deleteFailed,
      deleteFailedMessage
    } = this.state;
    const { accountDetails } = this.props;

    return (
      <div>
        <WidgetAccordion title={"YOUR SUBACCOUNTS"} startOpen={false}>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "ListSubAccounts" })}
                onClick={() => {
                  this.toggleTab("ListSubAccounts");
                }}
              >
                LIST
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "CreateSubAccount" })}
                onClick={() => {
                  this.toggleTab("CreateSubAccount");
                }}
              >
                CREATE
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="ListSubAccounts">
              <Row>
                <Col xs="12" md="12">
                  <Alert color="success" isOpen={deleteSuccess} toggle={this.dismissDeleteSuccessAlert}>
                    Deleted account successfully.
                  </Alert>
                  <Alert color="danger" isOpen={deleteFailed} toggle={this.dismissDeleteFailedAlert}>
                    An error occurred while deleting account.
                    {deleteFailedMessage}
                  </Alert>
                </Col>
              </Row>
              <ListSubAccounts deleteClick={this.openDeleteConfirmModal} accounts={accountDetails.SubAccounts} />
            </TabPane>

            <TabPane tabId="CreateSubAccount">
              <Row>
                <Col xs="12" md="12">
                  <Alert color="danger" isOpen={!createNameValid} toggle={this.dismissCreateNameAlert}>
                    Name is blank.
                  </Alert>
                  <Alert color="danger" isOpen={createFailedAlertOpen} toggle={this.dismissCreateFailedAlert}>
                    Create failed: {createFailedMessage}
                  </Alert>
                  <Alert color="success" isOpen={createSuccessAlertOpen} toggle={this.dismissCreateSuccessAlert}>
                    Create successful!
                  </Alert>
                  <Alert color="warning" isOpen={!createEnabled}>
                    You have reached your dispensary limit. Contact <a href="support@dialmyhigh.com">support@dialmyhigh.com</a> to request
                    an increase to the limit.
                  </Alert>
                </Col>
              </Row>
              <CreateSubAccount enabled={createEnabled} nameValid={this.setCreateNameValid} onSubmit={this.createSubmit} />
            </TabPane>
          </TabContent>
          <DeleteAccountModal
            deleteConfirmClick={this.deleteConfirmClick}
            isOpen={deleteModalOpen}
            toggle={this.toggleDeleteModal}
            account={deleteAccount}
          />
        </WidgetAccordion>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { accountData, userData } = state;
  return { accountData, userData };
}

export default withRouter(
  connect(
    mapStateToProps,
    { createDispensaryAccount, deleteDispensaryAccount, checkSession }
  )(SubAccountWidgetContainer)
);
