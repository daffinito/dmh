import { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import PropTypes from "prop-types";
import { checkSession } from "../actions";

class SessionTracker extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { userData } = this.props;
    if (userData.id === 0 || userData.fullLogin.success === null) {
      this.props.checkSession();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userData !== nextProps.userData) {
      const { userData } = nextProps;
      if (userData.fullLogin.success !== null) {
        if (!userData.fullLogin.success) {
          this.props.history.push("/login");
        }
      }
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  const { userData } = state;
  return {
    userData
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { checkSession }
  )(SessionTracker)
);
