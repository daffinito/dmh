import React, { Component } from "react";
import { Alert, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WidgetAccordion from "../../../components/widgets/WidgetAccordion";
import InlineInput from "../../../components/InlineInput";
import { changeMasterName, checkSession } from "../../../actions";
import styles from "./styles/MasterAccountInfoWidgetContainer.module.css";

class MasterAccountInfoWidgetContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountDetails: this.props.accountDetails,
      changeNameSuccess: false,
      changeNameFail: false,
      changeNameFailMsg: ""
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.accountData.changeMasterName !== nextProps.accountData.changeMasterName) {
      const { changeMasterName } = nextProps.accountData;
      if (changeMasterName.success) {
        this.setState(() => ({ changeNameSuccess: true, changeNameFail: false, changeNameMsg: "" }));
        this.props.checkSession();
      } else {
        this.setState(() => ({ changeNameSuccess: false, changeNameFail: true, changeNameMsg: changeMasterName.message }));
      }
    }

    if (this.props.accountDetails !== nextProps.accountDetails) {
      this.setState(() => ({ accountDetails: nextProps.accountDetails }));
    }
  }

  submitNameChange = name => {
    this.props.changeMasterName(this.state.accountDetails.id, name);
  };

  validateName = name => {
    return name.length > 0;
  };

  dismissSuccessAlert = () => {
    this.setState(() => ({ changeNameSuccess: false }));
  };

  dismissFailedAlert = () => {
    this.setState(() => ({ changeNameFail: false }));
  };

  render() {
    const { accountDetails, changeNameSuccess, changeNameFail, changeNameFailMsg } = this.state;

    return (
      <WidgetAccordion title={"MASTER ACCOUNT INFORMATION"} startOpen={true}>
        <Row>
          <Col xs="12" md="12">
            <Alert color="success" isOpen={changeNameSuccess} toggle={this.dismissSuccessAlert}>
              Successfully changed account name.
            </Alert>
            <Alert color="danger" isOpen={changeNameFail} toggle={this.dismissFailedAlert}>
              An error occurered while changing account name: {changeNameFailMsg}
            </Alert>
          </Col>
          <Col xs="12" md="12">
            <InlineInput
              defaultValue={accountDetails.name}
              label="name"
              type="text"
              onValidate={this.validateName}
              onSubmit={this.submitNameChange}
            />
            <div className={styles.text}>Owner: {accountDetails.owner}</div>
            <div className={styles.text}>Dispensary Limit: {accountDetails.dispensaryLimit}.</div>
          </Col>
        </Row>
      </WidgetAccordion>
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
    { changeMasterName, checkSession }
  )(MasterAccountInfoWidgetContainer)
);
