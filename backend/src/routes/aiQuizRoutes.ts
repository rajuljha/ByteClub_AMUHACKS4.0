import express from "express";
import { generateQuestion, validateQuestion, enhanceQuestion } from "../controllers/aiQuizController";

const router = express.Router();

router.post("/generate-question", generateQuestion);
router.post("/validate-question", validateQuestion);
router.post("/enhance-question", enhanceQuestion);

export default router; 