import React, { Component } from "react";
import { Row, Col, Table } from "reactstrap";
import { withRouter } from "react-router-dom";
import styles from "./styles/MasterAccounts.module.css";

class MasterAccounts extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  accountClick = id => {
    this.props.history.push(`/account/${id}/masterconsole`);
  };

  render() {
    const { accounts } = this.props;
    const list = accounts.map(account => {
      return (
        <tr key={account.id}>
          <td>{account.id}</td>
          <td>
            <span className={styles.link} onClick={() => this.accountClick(account.id)}>
              {account.name}
            </span>
          </td>
          <td>{account.dispensaryLimit}</td>
        </tr>
      );
    });

    return (
      <Row>
        <Col xs="12" md="12">
          <Table striped borderless hover size="sm">
            <thead>
              <tr>
                <th>ACCOUNT ID</th>
                <th>NAME</th>
                <th>DISPENSARY LIMIT</th>
              </tr>
            </thead>
            <tbody>{list}</tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}

export default withRouter(MasterAccounts);
