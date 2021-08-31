import React, { Component } from "react";
import { connect } from "react-redux";
import { clearQuestion } from "../actions";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Container, Row, Col } from "reactstrap";
import Selection from "../components/Selection";
import styles from "./styles/SelectionMenu.module.css";

class SelectionMenu extends Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(e, qid) {
    e.preventDefault();
    const newLoc = "/q/" + +qid;
    this.props.clearQuestion(); // clear the question otherwise it'll load the previous question then go to the one that was clicked, causes flickering
    this.props.history.push(newLoc);
  }

  componentDidMount() {}

  render() {
    let selections = this.props.selectionCache.selections.map(s => (
      <Selection
        key={s.questionId}
        onClick={e => this.clickHandler(e, s.questionId, this.props.history)}
        choice={s.choice}
        numberOfChoices={s.numberOfChoices}
        dialPosition={s.dialPosition}
        dialAngle={s.dialAngle}
      />
    ));

    return (
      <div className={styles.selectionMenu}>
        <Container>
          <Row noGutters>
            <Col xs="3" sm="3" md="3" lg="3" xl="3">
              {selections[0]}
            </Col>
            <Col xs="3" sm="3" md="3" lg="3" xl="3">
              {selections[1]}
            </Col>
            <Col xs="3" sm="3" md="3" lg="3" xl="3">
              {selections[2]}
            </Col>
            <Col xs="3" sm="3" md="3" lg="3" xl="3">
              {selections[3]}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { selectionCache } = state;
  return {
    selectionCache
  };
}

SelectionMenu.propTypes = {
  history: PropTypes.object.isRequired, // for Router
  clearQuestion: PropTypes.func.isRequired,
  selectionCache: PropTypes.shape({
    selections: PropTypes.arrayOf(
      PropTypes.shape({
        choice: PropTypes.shape({
          id: PropTypes.number | PropTypes.string,
          description: PropTypes.string
        }),
        questionId: PropTypes.number | PropTypes.string,
        question: PropTypes.string,
        dialPosition: PropTypes.number,
        numberOfChoices: PropTypes.number
      })
    )
  })
};

export default withRouter(
  connect(
    mapStateToProps,
    { clearQuestion }
  )(SelectionMenu)
);
