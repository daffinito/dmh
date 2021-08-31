import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
// import PropTypes from "prop-types";
import styles from "./styles/TextInput.module.css";

class TextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };
  }

  componentDidMount() {
    if (typeof this.props.defaultValue !== "undefined") {
      this.setState(() => ({ value: this.props.defaultValue }));
    }
  }

  componentWillReceiveProps(nextProps) {}

  handleChange = e => {
    const val = e.target.value;
    if (this.props.wordwrap) {
      if (val.substring(val.length - 1) !== "\n") {
        this.setState(() => ({
          value: val
        }));
      }
    } else {
      this.setState(() => ({
        value: val
      }));
    }
    this.props.onChange(val);
  };

  render() {
    const { value } = this.state;
    const { label, type, id, disabled, valid, autoComplete, multiline, wordwrap, rowsMax } = this.props;
    const inputType = typeof type !== "string" ? "text" : type;
    const isValid = typeof valid !== "boolean" ? true : valid;
    const isDisabled = typeof disabled !== "boolean" ? false : disabled;
    const autoCompleteValue = typeof autoComplete === "string" ? autoComplete : "on";
    const isMultiline = typeof multiline === "boolean" ? multiline : false;
    const isWordWrapped = typeof wordwrap === "boolean" ? wordwrap : false;

    return (
      <div className={styles.wrap}>
        <TextField
          type={inputType}
          autoComplete={autoCompleteValue}
          id={id}
          multiline={isMultiline || isWordWrapped}
          rowsMax={rowsMax}
          disabled={isDisabled}
          error={!isValid}
          label={label}
          value={value}
          fullWidth={true}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default TextInput;
