import React, { Component } from "react";
import { Row, Col, Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
//import classnames from "classnames";
import UserInfo from "../../../components/widgets/admin console/UserInfo";
import { adminGetUser, adminDeleteUser } from "../../../actions";
import SearchUser from "../../../components/widgets/admin console/SearchUser";
import WidgetAccordion from "../../../components/widgets/WidgetAccordion";
// import PropTypes from "prop-types";
//import styles from "./styles/UserAdminWidgetContainer.module.css";

class UserAdminWidgetContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      alertFailedOpen: false,
      alertFailedMessage: "",
      alertSuccessOpen: false,
      alertSuccessMessage: ""
    };
  }

  dismissAlert = () => {
    this.setState(() => ({ alertFailedOpen: false, alertSuccessOpen: false }));
  };

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.adminData.adminGetUser !== nextProps.adminData.adminGetUser) {
      const { adminGetUser } = nextProps.adminData;
      if (adminGetUser.success) {
        this.setState(() => ({ user: adminGetUser.user }));
      } else {
        this.setState(() => ({ alertFailedOpen: true, alertFailedMessage: "No user found." }));
      }
    }

    if (this.props.adminData.adminDeleteUser !== nextProps.adminData.adminDeleteUser) {
      const { adminDeleteUser } = nextProps.adminData;
      if (adminDeleteUser.success) {
        this.setState(() => ({ alertSuccessOpen: true, alertSuccessMessage: "User successfully deleted.", user: null }));
      } else {
        this.setState(() => ({ alertFailedOpen: true, alertFailedMessage: "An error occurred." }));
      }
    }
  }

  deleteUserClick = id => {
    this.props.adminDeleteUser(id);
  };

  searchSubmit = email => {
    this.props.adminGetUser(email);
  };

  render() {
    const { user, alertFailedOpen, alertSuccessOpen, alertFailedMessage, alertSuccessMessage } = this.state;

    return (
      <div>
        <WidgetAccordion title={"USER ADMIN"} startOpen={false}>
          <Alert color="danger" isOpen={alertFailedOpen} toggle={this.dismissAlert}>
            {alertFailedMessage}
          </Alert>
          <Alert color="success" isOpen={alertSuccessOpen} toggle={this.dismissAlert}>
            {alertSuccessMessage}
          </Alert>
          <Row>
            <Col xs="12" md="12">
              <SearchUser onSubmit={this.searchSubmit} />
            </Col>
            <Col xs="12" md="12">
              <UserInfo user={user} deleteClick={this.deleteUserClick} />
            </Col>
          </Row>
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
    { adminGetUser, adminDeleteUser }
  )(UserAdminWidgetContainer)
);
