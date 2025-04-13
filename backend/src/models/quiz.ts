import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  schoolBoard: {
    type: String,
    required: true,
  },
  numberOfQuestions: {
    type: String,
    required: true,
  },
  timeInMinutes: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  shareLink: {
    type: String,
    required: true,
  },
  questions: [{
    text: String,
    options: [String],
    correctAnswer: Number,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Quiz", quizSchema); 