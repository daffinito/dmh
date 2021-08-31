class QuestionService {
  constructor(_db, _cache) {
    this.cache = _cache;
    this.db = _db;
  }

  getQuestion(id) {
    const qCacheKey = `question_${id}`;
    const cCacheKey = `choicesByQuestionId_${id}`;

    return this.cache.get(qCacheKey, () =>
      Promise.resolve(this.db.getQuestion(id)).then(question => {
        return this.cache.get(cCacheKey, () =>
          Promise.resolve(this.db.getChoices(id)).then(choices => {
            const followUpQuestions = [];
            for (let choice of choices) {
              followUpQuestions.push({
                choiceId: choice.id,
                followUpId: choice.followUpQuestionId
              });
            }
            const response = {
              questionId: question.id,
              question: question.question,
              choices: choices,
              followUpQuestions: followUpQuestions,
              finalQuestion: question.finalQuestion
            };

            return response;
          })
        );
      })
    );
  }
}

export default QuestionService;
