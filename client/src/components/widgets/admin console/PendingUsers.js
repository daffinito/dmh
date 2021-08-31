import React, { Component } from "react";
import { Row, Col, Table } from "reactstrap";
import { withRouter } from "react-router-dom";
//import styles from "./styles/MasterAccounts.module.css";
import ReloadIconButton from "../../ReloadIconButton";

class PendingUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  onClick = id => {
    this.props.resendClick(id);
  };

  render() {
    const { users } = this.props;
    const newOwnerUrl = `${window.location.protocol}//${window.location.host}/signup/dispensary/`;
    const newUserUrl = `${window.location.protocol}//${window.location.host}/signup/`;
    const list = users.map(user => (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.newOwner ? newOwnerUrl + user.token : newUserUrl + user.token}</td>
        <td>
          <ReloadIconButton onClick={() => this.onClick(user.id)} />
        </td>
      </tr>
    ));

    return (
      <Row>
        <Col xs="12" md="12">
           <Table striped borderless hover size="sm">
            <thead>
              <tr>
                <th>USER ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>SIGN UP ADDRESS</th>
                <th>RESEND</th>
              </tr>
            </thead>
            <tbody>{list}</tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}

export default withRouter(PendingUsers);
