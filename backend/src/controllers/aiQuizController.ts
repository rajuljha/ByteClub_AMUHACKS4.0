import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateQuestion = async (req: Request, res: Response) => {
  try {
    const { topic, difficulty, context } = req.body;

    const prompt = `Generate a multiple choice question about ${topic} with difficulty level ${difficulty}.
    Context from previous questions: ${context}
    Return the question and 4 options (A, B, C, D) in JSON format with the following structure:
    {
      "question": "the question text",
      "choice_A": "option A",
      "choice_B": "option B",
      "choice_C": "option C",
      "choice_D": "option D",
      "answer": "the correct option (A, B, C, or D)"
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    res.json(response);
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
};

export const validateQuestion = async (req: Request, res: Response) => {
  try {
    const { question, options, correctAnswer } = req.body;

    const prompt = `Validate this multiple choice question:
    Question: ${question}
    Options: ${options.join(', ')}
    Correct Answer: ${correctAnswer}
    
    Return a JSON response with:
    {
      "isValid": boolean,
      "feedback": "feedback message if invalid, empty string if valid"
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    res.json(response);
  } catch (error) {
    console.error('Error validating question:', error);
    res.status(500).json({ error: 'Failed to validate question' });
  }
};

export const enhanceQuestion = async (req: Request, res: Response) => {
  try {
    const { question, options, correctAnswer } = req.body;

    const prompt = `Enhance this multiple choice question to make it clearer and more effective:
    Question: ${question}
    Options: ${options.join(', ')}
    Correct Answer: ${correctAnswer}
    
    Return a JSON response with the enhanced question in the same format:
    {
      "question": "enhanced question text",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": "correct option"
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    res.json(response);
  } catch (error) {
    console.error('Error enhancing question:', error);
    res.status(500).json({ error: 'Failed to enhance question' });
  }
}; 