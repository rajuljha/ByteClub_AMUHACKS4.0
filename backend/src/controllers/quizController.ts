import { Request, Response } from "express";
import Quiz from "../models/quiz";

export const getQuizzesByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const quizzes = await Quiz.find({ createdBy: userId });
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
}; 