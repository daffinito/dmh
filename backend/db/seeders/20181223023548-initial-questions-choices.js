"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // first insert questions
    await queryInterface.bulkInsert(
      "Questions",
      [
        {
          // id:  1,
          question: "Get High or Get Relief?",
          finalQuestion: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  2,
          question: "How do you want to feel?",
          finalQuestion: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  3,
          question: "How do you want your body to feel?",
          finalQuestion: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  4,
          question: "What do you want to accomplish?",
          finalQuestion: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  5,
          question: "What kind of relief?",
          finalQuestion: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  6,
          question: "What ails you mentally?",
          finalQuestion: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  7,
          question: "What ails you physically?",
          finalQuestion: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  8,
          question: "What ails you neurologically?",
          finalQuestion: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  9,
          question: "Daytime or Nighttime use?",
          finalQuestion: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );

    return await queryInterface.bulkInsert(
      "Choices",
      [
        {
          // id:  1,
          description: "Get High",
          followUpQuestionId: 2,
          questionId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  2,
          description: "Get Relief",
          followUpQuestionId: 5,
          questionId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  3,
          description: "Euphoric",
          followUpQuestionId: 3,
          questionId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  4,
          description: "Relaxed",
          followUpQuestionId: 3,
          questionId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  5,
          description: "Uplifted",
          followUpQuestionId: 3,
          questionId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  6,
          description: "Mental",
          followUpQuestionId: 6,
          questionId: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  7,
          description: "Physical",
          followUpQuestionId: 7,
          questionId: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  8,
          description: "Neurological",
          followUpQuestionId: 8,
          questionId: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  9,
          description: "Depression",
          followUpQuestionId: 9,
          questionId: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  10,
          description: "Anxiety/Stress",
          followUpQuestionId: 9,
          questionId: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  11,
          description: "Insomnia",
          followUpQuestionId: 9,
          questionId: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  12,
          description: "Daytime",
          followUpQuestionId: null,
          questionId: 9,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  13,
          description: "¯\\_(ツ)_/¯",
          followUpQuestionId: null,
          questionId: 9,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  14,
          description: "Nighttime",
          followUpQuestionId: null,
          questionId: 9,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  15,
          description: "Energetic",
          followUpQuestionId: 4,
          questionId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  16,
          description: "Sleepy",
          followUpQuestionId: 4,
          questionId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  17,
          description: "Hungry",
          followUpQuestionId: 4,
          questionId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  18,
          description: "Get Creative",
          followUpQuestionId: null,
          questionId: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  19,
          description: "Get Focused",
          followUpQuestionId: null,
          questionId: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  20,
          description: "Be Social",
          followUpQuestionId: null,
          questionId: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  21,
          description: "Inflamation",
          followUpQuestionId: 9,
          questionId: 7,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  22,
          description: "Loss of Appetite",
          followUpQuestionId: 9,
          questionId: 7,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  23,
          description: "Nausia",
          followUpQuestionId: 9,
          questionId: 7,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  24,
          description: "Pain",
          followUpQuestionId: 9,
          questionId: 7,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  25,
          description: "Migraines",
          followUpQuestionId: 9,
          questionId: 8,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  26,
          description: "Muscle Spasms",
          followUpQuestionId: 9,
          questionId: 8,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id:  27,
          description: "Seizures",
          followUpQuestionId: 9,
          questionId: 8,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Choices", null, {});
    return await queryInterface.bulkDelete("Questions", null, {});
  }
};
