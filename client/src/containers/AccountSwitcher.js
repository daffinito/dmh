import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "../actions";
import { withRouter } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, Col } from "reactstrap";
import styles from "./styles/AccountSwitcher.module.css";
import UserSettingsUpdateModalContainer from "./widgets/UserSettingsUpdateModalContainer";

class AccountSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      includeMaster: false,
      includeSubs: false,
      masterAccount: null,
      subAccounts: [],
      currentAccount: this.props.currentAccount,
      currentUserEmail: null,
      settingsUpdateOpen: false
    };
  }

  componentDidMount() {
    this.init(this.props.userData, this.props.currentAccount);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userData !== nextProps.userData || this.props.currentAccount !== nextProps.currentAccount) {
      this.init(nextProps.userData, nextProps.currentAccount);
    }
  }

  init = (userData, currentAccount) => {
    if (typeof userData.user !== "undefined") {
      this.setState(() => ({
        currentUserEmail: userData.user.email
      }));
    }

    this.setState(() => ({
      currentAccount: currentAccount,
      includeMaster: false,
      masterAccount: null
    }));
    if (typeof userData.masterAccount !== "undefined" && userData.masterAccount !== null) {
      if (currentAccount.type !== "master") {
        this.setState(() => ({
          includeMaster: true,
          masterAccount: userData.masterAccount
        }));
      } else if (currentAccount.type === "master" && +currentAccount.id !== +userData.masterAccount.id) {
        this.setState(() => ({
          includeMaster: true,
          masterAccount: userData.masterAccount
        }));
      }
    }

    if (typeof userData.subAccounts !== "undefined" && userData.subAccounts !== null && userData.subAccounts.length > 0) {
      let subs = [];
      for (let subAcct of userData.subAccounts) {
        if (+currentAccount.id !== +subAcct.id || currentAccount.type !== "sub") {
          subs.push(subAcct);
        }
      }
      if (subs.length > 0) {
        this.setState(() => ({
          includeSubs: true,
          subAccounts: subs
        }));
      }
    }
  };

  toggle = () => {
    this.setState(s => ({
      dropdownOpen: !s.dropdownOpen
    }));
  };

  goToMasterAccount = id => {
    this.props.history.push(`/account/${id}/masterconsole`);
  };

  goToDispensaryAccount = id => {
    this.props.history.push(`/account/${id}/console`);
  };

  toggleUserSettingsModal = () => {
    this.setState(s => ({ settingsUpdateOpen: !s.settingsUpdateOpen }));
  };

  signOut = () => {
    this.props.logout();
    this.props.history.push("/login");
  };

  render() {
    const { dropdownOpen, includeSubs, includeMaster, masterAccount, subAccounts, currentUserEmail, settingsUpdateOpen } = this.state;

    let masterAccountDDItem = null,
      subAccountDDItem = null,
      noAccountFoundDDItem = null;
    if (includeMaster) {
      masterAccountDDItem = (
        <div>
          <DropdownItem header>Master Account</DropdownItem>
          <DropdownItem onClick={() => this.goToMasterAccount(masterAccount.id)}>{masterAccount.name}</DropdownItem>
          <DropdownItem divider />
        </div>
      );
    }

    if (includeSubs) {
      const saMappedItems = subAccounts.map(subAcct => (
        <DropdownItem onClick={() => this.goToDispensaryAccount(subAcct.id)} key={subAcct.id}>
          {subAcct.name}
        </DropdownItem>
      ));
      subAccountDDItem = (
        <div>
          <DropdownItem header>Dispensary Accounts</DropdownItem>
          {saMappedItems}
          <DropdownItem divider />
        </div>
      );
    }

    if (!includeMaster && !includeSubs) {
      noAccountFoundDDItem = (
        <div>
          <DropdownItem disabled>No Accounts Found!</DropdownItem>
          <DropdownItem divider />
        </div>
      );
    }

    const signOutDDItem = (
      <div>
        <DropdownItem onClick={() => this.signOut()}>Sign Out</DropdownItem>
      </div>
    );

    return (
      <div className={styles.selectionMenu}>
        <Container>
          <Row noGutters>
            <Col xs="3" sm="3" md="3" lg="3" xl="3" />
            <Col xs="3" sm="3" md="3" lg="3" xl="3" />
            <Col xs="3" sm="3" md="3" lg="3" xl="3" />
            <Col xs="3" sm="3" md="3" lg="3" xl="3">
              <Dropdown className={styles.dropdown} isOpen={dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>Switch Account</DropdownToggle>
                <DropdownMenu>
                  <div className={styles.dropdownItems}>
                    <DropdownItem onClick={this.toggleUserSettingsModal}>{currentUserEmail}</DropdownItem>
                    <DropdownItem divider />
                    {masterAccountDDItem}
                    {subAccountDDItem}
                    {noAccountFoundDDItem}
                    {signOutDDItem}
                  </div>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
          <UserSettingsUpdateModalContainer toggle={this.toggleUserSettingsModal} isOpen={settingsUpdateOpen} />
        </Container>
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

export default withRouter(
  connect(
    mapStateToProps,
    { logout }
  )(AccountSwitcher)
);
