import React, { Component } from "react";
import { Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
//import classnames from "classnames";
import SuppressionList from "../../../components/widgets/admin console/SuppressionList";
import { getSuppressionList, deleteSuppression } from "../../../actions";
import WidgetAccordion from "../../../components/widgets/WidgetAccordion";
// import PropTypes from "prop-types";
//import styles from "./styles/SuppressionListWidgetContainer.module.css";

class SuppressionListWidgetContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suppressionList: [],
      alertFailedOpen: false,
      alertFailedMessage: "",
      alertSuccessOpen: false,
      alertSuccessMessage: ""
    };
  }

  dismissAlert = () => {
    this.setState(() => ({ alertFailedOpen: false, alertSuccessOpen: false }));
  };

  componentDidMount() {
    this.props.getSuppressionList();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.adminData.getSuppressionList !== nextProps.adminData.getSuppressionList) {
      const { getSuppressionList } = nextProps.adminData;
      if (getSuppressionList.success) {
        this.setState(() => ({ suppressionList: getSuppressionList.suppressionList }));
      } else {
        this.setState(() => ({ alertFailedOpen: true, alertFailedMessage: "Failed to get suppression list from server." }));
      }
    }

    if (this.props.adminData.deleteSuppression !== nextProps.adminData.deleteSuppression) {
      const { deleteSuppression } = nextProps.adminData;
      if (!deleteSuppression.success) {
        this.setState(() => ({ alertFailedOpen: true, alertFailedMessage: "Failed to get delete suppression." }));
      } else {
        this.setState(() => ({ alertSuccessOpen: true, alertSuccessMessage: "Successfully deleted suppression." }));
        this.props.getSuppressionList();
      }
    }
  }

  deleteClick = id => {
    this.props.deleteSuppression(id);
  };

  render() {
    const { suppressionList, alertFailedOpen, alertSuccessOpen, alertFailedMessage, alertSuccessMessage } = this.state;

    return (
      <div>
        <WidgetAccordion title={"SUPPRESSION LIST"} startOpen={false}>
          <Alert color="danger" isOpen={alertFailedOpen} toggle={this.dismissAlert}>
            {alertFailedMessage}
          </Alert>
          <Alert color="success" isOpen={alertSuccessOpen} toggle={this.dismissAlert}>
            {alertSuccessMessage}
          </Alert>
          <SuppressionList suppressionList={suppressionList} deleteClick={this.deleteClick} />
        </WidgetAccordion>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { adminData } = state;
  return {
    adminData
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { getSuppressionList, deleteSuppression }
  )(SuppressionListWidgetContainer)
);
