import express from "express";
import { getQuizzesByUser } from "../controllers/quizController";

const router = express.Router();

router.get("/user/:userId", getQuizzesByUser);

export default router; 