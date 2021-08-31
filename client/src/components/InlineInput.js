import React, { Component } from "react";
// import PropTypes from "prop-types";
import TextInput from "./TextInput";
import styles from "./styles/InlineInput.module.css";
import { Row, Col } from "reactstrap";

class InlineInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultValue: "",
      value: "",
      editting: false,
      valid: true
    };
  }

  componentDidMount() {
    if (typeof this.props.defaultValue !== "undefined") {
      this.setState(() => ({ value: this.props.defaultValue, defaultValue: this.props.defaultValue }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState(() => ({ defaultValue: nextProps.defaultValue }));
    }
  }

  handleChange = val => {
    this.setState(() => ({
      value: val
    }));
  };

  getComponent = () => {
    const { editting, value, valid } = this.state;
    if (!editting) {
      return (
        <div className={styles.text}>
          <span>{value}</span>
          <span onClick={this.toggle} className={styles.editIcon}>
            <i className="fas fa-edit" />
          </span>
        </div>
      );
    } else {
      const { label, type, id, disabled, autoComplete } = this.props;

      return (
        <Row>
          <Col xs="4" md="4">
            <TextInput
              defaultValue={value}
              id={id}
              label={label}
              type={type}
              valid={valid}
              disabled={disabled}
              autoComplete={autoComplete}
              onChange={this.handleChange}
            />
          </Col>
          <Col xs="3" md="3">
            <span onClick={this.saveClick} className={styles.inputIcons}>
              <i className="fas fa-check" />
            </span>
            <span onClick={this.cancel} className={styles.inputIcons}>
              <i className="fas fa-times" />
            </span>
          </Col>
          <Col xs="5" md="5" />
        </Row>
      );
    }
  };

  saveClick = () => {
    const { value } = this.state;
    let valid = true;
    if (typeof this.props.onValidate === "function") {
      valid = this.props.onValidate(value);
    }

    if (typeof valid !== "boolean") {
      valid = false;
    }

    this.setState(() => ({ valid: valid }));
    if (valid) {
      if (typeof this.props.onSubmit === "function") {
        this.props.onSubmit(value);
        this.setState(() => ({ editting: false }));
      }
    }
  };

  cancel = () => {
    this.setState(() => ({
      editting: false,
      value: this.state.defaultValue
    }));
  };

  toggle = () => {
    this.setState(s => ({ editting: !s.editting }));
  };

  render() {
    const component = this.getComponent();

    return <div className={styles.wrap}>{component}</div>;
  }
}

export default InlineInput;
