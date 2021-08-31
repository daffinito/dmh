import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import {
  setChoice,
  addSelection,
  removeSelection,
  getQuestionById,
  resetChoice,
  setDialPosition,
  setCurMaxAngle,
  clearResult,
  initGeoLocation
} from "../actions";
import PropTypes from "prop-types";
import QuestionText from "../components/QuestionText";
import DialContainer from "./DialContainer";
import NavbarContainer from "./NavbarContainer";
import StickyFooter from "../components/StickyFooter";
import DmhButton from "../components/DmhButton";
import LoadingOverlay from "../components/LoadingOverlay";
import LocationContainer from "./LocationContainer";
import SelectionMenu from "./SelectionMenu";

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gettingQuestion: false
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    this.questionLoaded = this.questionLoaded.bind(this);
    this.replaySelection = this.replaySelection.bind(this);
  }

  // handle route changes here
  componentWillReceiveProps(nextProps) {
    //  console.log("nextProps:", nextProps)
    // location changed and not currenlty fetching the next question
    if (+nextProps.qid !== +nextProps.questionData.questionId && !this.state.gettingQuestion) {
      this.getQuestion(nextProps.qid);
      //console.log("loading: ", nextProps.qid)
    }

    // question loaded
    if (+nextProps.qid === +nextProps.questionData.questionId && this.state.gettingQuestion) {
      this.questionLoaded();
    }
  }

  getQuestion(qid) {
    this.setState(() => ({
      gettingQuestion: true
    }));
    this.props.getQuestionById(qid);
  }

  questionLoaded() {
    this.setState(() => ({
      gettingQuestion: false
    }));
    this.replaySelection();
  }

  // checks to see if there is already a choice for this question, and reloads if there is
  replaySelection() {
    let foundIt = false;
    for (let i = 0; i < this.props.selectionCache.selections.length; i++) {
      const s = this.props.selectionCache.selections[i];
      if (foundIt) {
        //console.log("removing ", s)
        this.props.removeSelection(s.questionId);
        continue;
      }
      if (+s.questionId === +this.props.qid) {
        // console.log("replaying ", s)
        this.props.setChoice(s.choice);
        this.props.setDialPosition(s.dialPosition);
        this.props.setCurMaxAngle(s.dialAngle);
        foundIt = true;
      }
    }

    if (!foundIt) {
      this.props.resetChoice();
      this.props.setDialPosition(0);
    }

    // ensure the result is not cached
    this.props.clearResult();
  }

  componentDidMount() {
    // make sure age and state check is done
    const canEnterSite = this.props.cookies.get("_dmhCanEnterSite") === "true" ? true : false;
    const locationEnabled = this.props.cookies.get("_dmhLocationEnabled") === "false" ? false : true;
    this.props.initGeoLocation(locationEnabled);
    if (!canEnterSite) {
      this.props.history.push("/saacheck");
    } else if (this.props.qid === undefined) {
      // redirect from root to /q/1 to init
      let newLoc = "/q/1";
      this.props.history.push(newLoc);
    } else if (this.props.questionData.questionId === -1) {
      if (this.props.selectionCache.selections.length === 0) {
        // no question answered yet, redirect to first question
        let newLoc = "/q/1";
        this.props.history.push(newLoc);
      } else {
        // else go to the question id in the url
        this.getQuestion(this.props.match.params.id);
      }
    } else if (+this.props.qid !== +this.props.questionData.questionId) {
      this.getQuestion(this.props.qid);
    }
  }

  handleButtonClick(e, gotoResults) {
    e.preventDefault();

    const chosenChoice = this.props.choiceData.choice;
    const { questionId, question, choices } = this.props.questionData;
    const { position, angle } = this.props.dialData;
    this.props.addSelection(questionId, question, chosenChoice, position, angle, choices.length);

    if (this.props.questionData.finalQuestion !== true) {
      // if this isn't the last question
      if (this.props.questionData.followUpQuestions !== null) {
        // if this is a question chain, get next question based on choice
        let nextQuestionId = this.props.questionData.followUpQuestions.find(q => q.choiceId === chosenChoice.id).followUpId;
        let newLoc = "/q/" + nextQuestionId;
        this.props.history.push(newLoc);
      } else {
        // this is not a quesiton chain, get next base question
        let newId = (+this.props.qid >> 0) + 1; // removes decimal to get whole number. same as Math.floor
        let newLoc = "/q/" + +newId;
        this.props.history.push(newLoc);
      }
    } else {
      // if this is the last quesiton, go to results
      this.props.history.push(`/results`);
    }
  }

  render() {
    const { question, choices, finalQuestion } = this.props.questionData;
    const { gettingQuestion } = this.state;
    const buttonText = gettingQuestion ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-arrow-right" />;
    const nextButton = (
      <DmhButton
        value={buttonText}
        title={finalQuestion ? "Get Strain" : "Next"}
        clickHandler={e => this.handleButtonClick(e, finalQuestion)}
      />
    );
    const wrapperClasses = gettingQuestion ? "d-flex flex-column wrapper busy-cursor" : "d-flex flex-column wrapper";

    return (
      <div className={wrapperClasses}>
        <NavbarContainer>
          <SelectionMenu />
        </NavbarContainer>
        <LocationContainer />
        <LoadingOverlay show={gettingQuestion} />
        <Container className="flex-fill">
          <Row noGutters className="navbar-top-buffer">
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <QuestionText question={question} />
            </Col>
          </Row>
          <Row noGutters>
            <Col xs="12" sm="12" md="8" lg="6" xl="6">
              <DialContainer choices={choices} />
            </Col>
          </Row>
          <Row noGutters>
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              {nextButton}
            </Col>
          </Row>
        </Container>
        <StickyFooter />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { questionData, choiceData, selectionCache, dialData } = state;
  return {
    questionData,
    choiceData,
    selectionCache,
    dialData
  };
}

HomeContainer.propTypes = {
  addSelection: PropTypes.func.isRequired,
  removeSelection: PropTypes.func.isRequired,
  getQuestionById: PropTypes.func.isRequired,
  resetChoice: PropTypes.func.isRequired,
  setChoice: PropTypes.func.isRequired,
  setDialPosition: PropTypes.func.isRequired,
  clearResult: PropTypes.func.isRequired,
  setCurMaxAngle: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired, // for Router
  location: PropTypes.object.isRequired, // for Router
  history: PropTypes.object.isRequired, // for Router
  questionData: PropTypes.shape({
    questionId: PropTypes.number | PropTypes.string,
    question: PropTypes.string,
    choices: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number | PropTypes.string,
        description: PropTypes.string
      })
    ),
    followUpQuestions: PropTypes.arrayOf(
      PropTypes.shape({
        choiceId: PropTypes.number | PropTypes.string,
        followUpId: PropTypes.number | PropTypes.string
      })
    ),
    finalChoice: PropTypes.bool
  }),
  choiceData: PropTypes.shape({
    choice: PropTypes.shape({
      id: PropTypes.number | PropTypes.string,
      description: PropTypes.string
    })
  }),
  dialData: PropTypes.shape({
    position: PropTypes.number,
    angle: PropTypes.number
  }),
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
        numberOfChoices: PropTypes.number,
        dialAngle: PropTypes.number
      })
    )
  })
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      setChoice,
      addSelection,
      removeSelection,
      getQuestionById,
      resetChoice,
      setDialPosition,
      clearResult,
      setCurMaxAngle,
      initGeoLocation
    }
  )(HomeContainer)
);
