import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
//import styles from "./styles/AdminConsoleContainer.module.css";
import PropTypes from "prop-types";
import NavbarContainer from "./NavbarContainer";
import StickyFooter from "../components/StickyFooter";
import LoadingOverlay from "../components/LoadingOverlay";
import AdminConsoleUserWidget from "./widgets/admin console/AdminConsoleUserWidget";
import SuppressionListWidgetContainer from "./widgets/admin console/SuppressionListWidgetContainer";
import UserAdminWidgetContainer from "./widgets/admin console/UserAdminWidgetContainer";
import SessionTracker from "./SessionTracker";
import AccountSwitcher from "./AccountSwitcher";
import { getUserByEmail } from "../actions";

// route /admin/console
class AdminConsoleContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: {}
    };
  }

  componentDidMount() {
    const { userData } = this.props;
    if (typeof userData.user !== "undefined" && userData.user !== null) {
      if (userData.user.id > 0 && userData.user.type !== "ADMIN") {
        this.props.history.push("/login");
      }
      if (userData.user.id > 0 && userData.user.type === "ADMIN") {
        this.setState(() => ({
          loading: false,
          user: userData.user
        }));
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userData !== nextProps.userData) {
      const { userData } = nextProps;
      if (typeof userData.user !== "undefined" && userData.user !== null) {
        if (userData.user.id > 0 && userData.user.type !== "ADMIN") {
          this.props.history.push("/login");
        }
        if (userData.user.id > 0 && userData.user.type === "ADMIN") {
          this.setState(() => ({
            loading: false,
            user: userData.user
          }));
        }
      }
    }
  }

  render() {
    const { loading } = this.state;
    const { cookies } = this.props;
    const wrapperClasses = loading ? "d-flex flex-column wrapper busy-cursor" : "d-flex flex-column wrapper";

    const componentToDisplay = loading ? null : (
      <Row noGutters className="navbar-top-buffer">
        <Col xs="12" md="12">
          <AdminConsoleUserWidget />
        </Col>
        <Col xs="12" md="12">
          <SuppressionListWidgetContainer />
        </Col>
        <Col xs="12" md="12">
          <UserAdminWidgetContainer />
        </Col>
      </Row>
    );

    return (
      <div className={wrapperClasses}>
        <NavbarContainer>
          <AccountSwitcher currentAccount={{ type: "admin" }} />
        </NavbarContainer>
        <SessionTracker cookies={cookies} />
        <LoadingOverlay show={loading} />
        <Container className="flex-fill">{componentToDisplay}</Container>
        <StickyFooter />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userData } = state;
  return {
    userData
  };
}

AdminConsoleContainer.propTypes = {
  match: PropTypes.object.isRequired, // for Router
  location: PropTypes.object.isRequired, // for Router
  history: PropTypes.object.isRequired // for Router
};

export default withRouter(
  connect(
    mapStateToProps,
    { getUserByEmail }
  )(AdminConsoleContainer)
);
