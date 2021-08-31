import React, { Component } from "react";
import { Row, Col, Table } from "reactstrap";
import { withRouter } from "react-router-dom";
import DeleteIconButton from "../../DeleteIconButton";
import styles from "./styles/ListSubAccounts.module.css";

class ListSubAccounts extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  deleteClick = account => {
    this.props.deleteClick(account);
  };

  accountClick = id => {
    this.props.history.push(`/account/${id}/console`);
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
          <td>{account.Dispensary === null ? "" : account.Dispensary.name}</td>
          <td>
            <DeleteIconButton onClick={() => this.deleteClick(account)} />
          </td>
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
                <th>ACCOUNT NAME</th>
                <th>DISPENSARY NAME</th>
                <th />
              </tr>
            </thead>
            <tbody>{list}</tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}

export default withRouter(ListSubAccounts);
