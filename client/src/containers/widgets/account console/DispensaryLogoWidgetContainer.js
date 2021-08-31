import React, { Component } from "react";
import { Row, Col, Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LogoPicker from "../../../components/widgets/LogoPicker";
import { changeDispensaryLogo, checkSession } from "../../../actions";
// import PropTypes from "prop-types";
//import styles from "./styles/DispensaryLogoWidgetContainer.module.css";

class DispensaryLogoWidgetContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountData: this.props.accountDetails,
      logo: this.props.accountDetails.logo,
      uploadError: false,
      errorMessage: ""
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.accountData.changeDispensaryLogo !== nextProps.accountData.changeDispensaryLogo) {
      const { changeDispensaryLogo } = nextProps.accountData;
      if (changeDispensaryLogo.success) {
        this.props.checkSession(); // updates the userData store
        this.setState(() => ({ logo: changeDispensaryLogo.logo }));
      } else if (!changeDispensaryLogo.success) {
        this.setState(() => ({ uploadError: true, errorMessage: changeDispensaryLogo.message }));
      }
    }
  }

  imageSelected = image => {
    this.props.changeDispensaryLogo(image, this.state.accountData.id);
  };

  dismissUploadErrorAlert = () => {
    this.setState(() => ({ uploadError: false }));
  };

  render() {
    const { logo, uploadError, errorMessage } = this.state;
    let componentToDisplay = (
      <Row>
        <Col xs="12" md="12">
          <Alert color="danger" isOpen={uploadError} toggle={this.dismissUploadErrorAlert}>
            {errorMessage}
          </Alert>
          <LogoPicker onImageSelected={this.imageSelected} img={logo} />
        </Col>
      </Row>
    );

    return componentToDisplay;
  }
}

function mapStateToProps(state) {
  const { accountData } = state;
  return { accountData };
}

export default withRouter(
  connect(
    mapStateToProps,
    { changeDispensaryLogo, checkSession }
  )(DispensaryLogoWidgetContainer)
);
