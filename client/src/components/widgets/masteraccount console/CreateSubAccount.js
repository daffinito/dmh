import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import TextInput from "../../TextInput";
import DmhButton from "../../DmhButton";
import styles from "./styles/CreateSubAccount.module.css";

class CreateSubAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      nameValid: true
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  nameChange = name => {
    this.setState(() => ({
      name: name
    }));
  };

  submit = e => {
    e.preventDefault();

    const { name } = this.state;
    const nameValid = this.validateName(name);
    this.props.nameValid(nameValid);
    if (nameValid) {
      this.props.onSubmit(name);
    }
  };

  validateName = n => {
    const nameValid = n.length > 0;
    this.setState(() => ({ nameValid: nameValid }));
    return nameValid;
  };

  render() {
    const { nameValid } = this.state;
    const { enabled } = this.props;

    return (
      <div className={styles.background}>
        <Row>
          <Col xs="6" md="6">
            <TextInput type="text" label="Name" id="nameInput" onChange={this.nameChange} required valid={nameValid} />
          </Col>
          <Col xs="6" md="6">
            <DmhButton disabled={!enabled} value="Add Account" title="Submit" dark clickHandler={e => this.submit(e)} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateSubAccount;
