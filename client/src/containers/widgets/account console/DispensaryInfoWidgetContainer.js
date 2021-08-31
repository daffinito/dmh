import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getDispensaryByAccount } from "../../../actions";
import DispensaryLogoWidgetContainer from "./DispensaryLogoWidgetContainer";
import WidgetAccordion from "../../../components/widgets/WidgetAccordion";
import DispensaryAddress from "../../../components/widgets/account console/DispensaryAddress";
// import PropTypes from "prop-types";
import styles from "./styles/DispensaryInfoWidgetContainer.module.css";

class DispensaryInfoWidgetContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      newDispensary: false,
      accountDetails: null,
      dispensaryData: null,
      dispensaryAddress: {
        street: null,
        city: null,
        state: null,
        zip: null
      },
      error: false,
      errorMessage: ""
    };
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userData !== nextProps.userData) {
      this.init(nextProps);
    }
    if (this.props.accountDetails !== nextProps.accountDetails) {
      this.init(nextProps);
    }
  }

  init = props => {
    const { accountDetails } = props;
    const accountId = accountDetails.id;
    if (accountId < 1 || typeof accountId === "undefined" || accountId === null) {
      this.setState(() => ({
        loading: false,
        error: true,
        errorMessage: "No accounts found!"
      }));
    } else {
      this.setState(() => ({
        accountDetails: accountDetails
      }));
      if (!!accountDetails.Dispensary.address) {
        const dispensaryData = accountDetails.Dispensary;
        const address = dispensaryData.address.split(",");
        const streetAddress = address.shift();
        address.pop(); // getting rid of the USA part of the address
        const city = address.shift();
        const splitStateZip = address.pop().split(" ");
        const zip = splitStateZip.pop();
        const state = splitStateZip.pop();
        this.setState(() => ({
          loading: false,
          dispensaryData: dispensaryData,
          dispensaryAddress: {
            street: streetAddress,
            city: city,
            state: state,
            zip: zip
          }
        }));
      } else {
        this.setState(() => ({
          loading: false,
          newDispensary: true
        }));
      }
    }
  };

  render() {
    const { accountDetails, errorMessage, error, loading, dispensaryData, newDispensary, dispensaryAddress } = this.state;
    let componentToDisplay;

    if (loading) {
      componentToDisplay = null;
    } else if (error) {
      componentToDisplay = (
        <div>
          <Row>
            <Col xs="12" md="12">
              <div className={styles.headerText}>ERROR OCCURRED</div>
            </Col>
          </Row>
          <Row>
            <Col xs="12" md="12">
              <div className={styles.headerText}>{errorMessage}</div>
            </Col>
          </Row>
        </div>
      );
    } else if (newDispensary) {
      componentToDisplay = (
        <div>
          <Row>
            <Col xs="6" md="6">
              <div className={styles.headerText}>YOUR CURRENT ADDRESS</div>
              <DispensaryAddress newDispensary accountId={accountDetails.id} />
            </Col>
            <Col xs="6" md="6">
              <div className={styles.headerText}>YOUR CURRENT LOGO</div>
              <div className={styles.helperText}>Drag and drop or click to change logo.</div>
              <DispensaryLogoWidgetContainer accountDetails={accountDetails} />
            </Col>
          </Row>
        </div>
      );
    } else {
      componentToDisplay = (
        <div>
          <Row>
            <Col xs="6" md="6">
              <div className={styles.headerText}>YOUR CURRENT ADDRESS</div>
              <DispensaryAddress
                name={dispensaryData.name}
                street={dispensaryAddress.street}
                city={dispensaryAddress.city}
                state={dispensaryAddress.state}
                zip={dispensaryAddress.zip}
                accountId={accountDetails.id}
              />
            </Col>
            <Col xs="6" md="6">
              <div className={styles.headerText}>YOUR CURRENT LOGO</div>
              <div className={styles.helperText}>Drag and drop or click to change logo.</div>
              <DispensaryLogoWidgetContainer accountDetails={accountDetails} />
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <WidgetAccordion title="YOUR DISPENSARY INFO" startOpen={true}>
        {componentToDisplay}
      </WidgetAccordion>
    );
  }
}

function mapStateToProps(state) {
  const { userData, accountData } = state;
  return {
    userData,
    accountData
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { getDispensaryByAccount }
  )(DispensaryInfoWidgetContainer)
);
