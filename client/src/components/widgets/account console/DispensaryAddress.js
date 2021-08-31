import React, { Component } from "react";
import DmhButton from "../../DmhButton";
import DispensaryAddressUpdateModal from "./DispensaryAddressUpdateModal";
import styles from "./styles/DispensaryAddress.module.css";

class DispensaryAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  editAddressClick = e => {
    e.preventDefault();

    this.setState(() => ({ modalOpen: true }));
  };

  toggleModal = () => {
    this.setState(s => ({
      modalOpen: !s.modalOpen
    }));
  };

  render() {
    const { name, street, city, state, zip, accountId, newDispensary } = this.props;
    const { modalOpen } = this.state;

    const isNewDispensary = typeof newDispensary === "boolean" ? newDispensary : false;

    let componentToDisplay = isNewDispensary ? (
      <div className={styles.addressBlock}>
        <DispensaryAddressUpdateModal
          toggle={this.toggleModal}
          isOpen={modalOpen}
          name={name}
          street={street}
          city={city}
          state={state}
          zip={zip}
          accountId={accountId}
        />
        <div className={styles.text}>Click Add to add an address.</div>
        <DmhButton value="ADD" title="Add Address" dark clickHandler={e => this.editAddressClick(e)} />
      </div>
    ) : (
      <div className={styles.addressBlock}>
        <DispensaryAddressUpdateModal
          toggle={this.toggleModal}
          isOpen={modalOpen}
          name={name}
          street={street}
          city={city}
          state={state}
          zip={zip}
          accountId={accountId}
        />
        <div className={styles.text}>{name}</div>
        <div className={styles.text}>{street}</div>
        <div className={styles.text}>
          {city},&nbsp;{state},&nbsp;{zip}
        </div>
        <DmhButton value="EDIT" title="Edit Address" dark clickHandler={e => this.editAddressClick(e)} />
      </div>
    );

    return componentToDisplay;
  }
}

export default DispensaryAddress;
