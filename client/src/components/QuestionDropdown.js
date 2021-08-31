import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

class QuestionDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      this.setState(() => ({ value: this.props.defaultValue }));
    }
  }

  handleChange = e => {
    const val = e.target.value;
    this.setState(() => ({
      value: val
    }));
    this.props.onChange(val);
  };

  render() {
    const { value } = this.state;
    const { valid, id, disabled, question } = this.props;
    const isDisabled = typeof disabled === "boolean" ? disabled : false;
    const isValid = typeof valid !== "boolean" ? true : valid;

    const mItems = question.choices.map(c => (
      <MenuItem key={c.description} value={c}>
        {c.description}
      </MenuItem>
    ));

    return (
      <TextField
        margin="normal"
        error={!isValid}
        fullWidth
        id={id}
        select
        label={question.question}
        value={value}
        onChange={this.handleChange}
        disabled={isDisabled}
      >
        {mItems}
      </TextField>
    );
  }
}

export default QuestionDropdown;
