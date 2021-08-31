import React, { Component } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WidgetAccordion from "../../../components/widgets/WidgetAccordion";
import ListCustomStrains from "../../../components/widgets/account console/ListCustomStrains";
import AddCustomStrain from "../../../components/widgets/account console/AddCustomStrain";
import { getCustomStrains, addCustomStrain, deleteCustomStrain } from "../../../actions";
import classnames from "classnames";

class CustomStrainWidgetContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "CurrentStrains",
      accountDetails: this.props.accountDetails,
      deleteFailedAlertOpen: false,
      deleteSuccessAlertOpen: false,
      deleteFailedMessage: "Failed to delete custom strain. Contact support@dialmyhighi.com if this keeps happening.",
      addFailedMessage: "Failed to add custom strain. Contact support@dialmyhigh.com if this keeps happening.",
      addFailedAlertOpen: false,
      addSuccessAlertOpen: false,
      strains: []
    };
  }

  componentDidMount() {
    if (this.props.accountDetails) {
      this.props.getCustomStrains(this.props.accountDetails.id);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.accountDetails !== nextProps.accountDetails) {
      this.setState(() => ({ accountDetails: nextProps.accountDetails }));
      this.props.getCustomStrains(nextProps.accountDetails.id);
    }

    if (this.props.accountData.getCustomStrains !== nextProps.accountData.getCustomStrains) {
      this.setState(() => ({ strains: nextProps.accountData.getCustomStrains.strains }));
    }

    if (this.props.accountData.addCustomStrain !== nextProps.accountData.addCustomStrain) {
      const { addCustomStrain } = nextProps.accountData;
      if (addCustomStrain.success) {
        this.setState(() => ({ addFailedAlertOpen: false, addSuccessAlertOpen: true }));
        this.props.getCustomStrains(nextProps.accountDetails.id);
      } else {
        this.setState(() => ({ addFailedAlertOpen: true, addSuccessAlertOpen: false }));
      }
    }

    if (this.props.accountData.deleteCustomStrain !== nextProps.accountData.deleteCustomStrain) {
      const { deleteCustomStrain } = nextProps.accountData;
      if (deleteCustomStrain.success) {
        this.setState(() => ({ deleteFailedAlertOpen: false, deleteSuccessAlertOpen: true }));
        this.props.getCustomStrains(nextProps.accountDetails.id);
      } else {
        this.setState(() => ({ deleteFailedAlertOpen: true, deleteSuccessAlertOpen: false }));
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

  strainValid = () => {
    return false;
  };

  addStrainSubmit = strain => {
    const { accountDetails } = this.state;
    this.props.addCustomStrain(accountDetails.id, strain);
  };

  deleteClick = strain => {
    const { accountDetails } = this.state;
    this.props.deleteCustomStrain(accountDetails.id, strain.id);
  };

  getComponent = () => {
    const {
      activeTab,
      deleteFailedAlertOpen,
      deleteSuccessAlertOpen,
      strains,
      addFailedAlertOpen,
      addSuccessAlertOpen,
      deleteFailedMessage,
      addFailedMessage
    } = this.state;

    const component = (
      <WidgetAccordion title="CUSTOM STRAINS" startOpen={false}>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "CurrentStrains" })}
              onClick={() => {
                this.toggleTab("CurrentStrains");
              }}
            >
              CURRENT STRAINS
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "AddStrain" })}
              onClick={() => {
                this.toggleTab("AddStrain");
              }}
            >
              ADD STRAIN
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="CurrentStrains">
            <Alert color="danger" isOpen={deleteFailedAlertOpen} toggle={this.dismissDeleteFailedAlert}>
              An error occurered while removing strain: {deleteFailedMessage}
            </Alert>
            <Alert color="success" isOpen={deleteSuccessAlertOpen} toggle={this.dismissDeleteSuccessAlert}>
              Removed strain successfully!
            </Alert>
            <ListCustomStrains strains={strains} deleteClick={this.deleteClick} />
          </TabPane>

          <TabPane tabId="AddStrain">
            <Row>
              <Col xs="12" md="12">
                <Alert color="danger" isOpen={addFailedAlertOpen} toggle={this.dismissAddFailedAlert}>
                  An error occurered while adding custom strain: {addFailedMessage}
                </Alert>
                <Alert color="success" isOpen={addSuccessAlertOpen} toggle={this.dismissAddSuccessAlert}>
                  Added strain successfully!
                </Alert>
              </Col>
            </Row>
            <AddCustomStrain strains={strains} strainValid={this.strainValid} onSubmit={this.addStrainSubmit} />
          </TabPane>
        </TabContent>
      </WidgetAccordion>
    );

    return component;
  };

  render() {
    const component = this.getComponent();
    return component;
  }
}

function mapStateToProps(state) {
  const { accountData } = state;
  return {
    accountData
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { getCustomStrains, addCustomStrain, deleteCustomStrain }
  )(CustomStrainWidgetContainer)
);
