import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

class StateDropdown extends Component {
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
    const { id, disabled } = this.props;
    const isDisabled = typeof disabled === "boolean" ? disabled : false;

    return (
      <TextField margin="normal" fullWidth id={id} select label="State" value={value} onChange={this.handleChange} disabled={isDisabled}>
        <MenuItem key="CA" value="CA">
          CA
        </MenuItem>
        <MenuItem key="CO" value="CO">
          CO
        </MenuItem>
        <MenuItem key="OR" value="OR">
          OR
        </MenuItem>
        <MenuItem key="WA" value="WA">
          WA
        </MenuItem>
      </TextField>
    );
  }
}

export default StateDropdown;
