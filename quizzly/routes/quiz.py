# app/routes/quiz.py
import pytz
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from quizzly.models.quiz import Quiz, QuizCreate, QuizStart
from quizzly.db.mongodb import db
from quizzly.utils.jwt import get_current_user
from quizzly.utils.gemini import generate_questions
from bson import ObjectId
import random
from typing import List
from fastapi import Body
from quizzly.core.config import settings

IST = pytz.timezone("Asia/Kolkata")
router = APIRouter()


@router.post("/quizzes/create", response_model=Quiz)
async def create_quiz(data: QuizCreate, current_user: dict = Depends(get_current_user)):
    frontend_url = settings.FRONTEND_URL
    quiz_id = str(ObjectId())
    password = random.randint(1000, 9999)
    num_questions = data.num_questions
    subject = data.subject
    topic = data.topic
    difficulty_level = data.difficulty_level
    questions = generate_questions(subject, topic, num_questions, difficulty_level)
    breakpoint()
    if not questions:
        raise HTTPException(status_code=500, detail="Failed to generate questions")
    quiz_doc = {
        "_id": quiz_id,
        "name": data.name,
        "subject": data.subject,
        "trigger_link": f"{frontend_url}/take-quiz/{quiz_id}",
        "num_questions": num_questions,
        "questions": questions,
        "user_responses": [],
        "topic": data.topic,
        "difficulty_level": data.difficulty_level,
        "created_by": current_user["id"],
        "created_at": datetime.now(IST).replace(tzinfo=None),
        "start_time": None,
        "end_time": None,
        "exec_time": None,
        "is_started": False,
        "is_executed": False,
        "metadata_fields": {},
        "password": password
    }
    await db.quizzes.insert_one(quiz_doc)
    return quiz_doc


@router.get("/quizzes")
async def get_quizzes():
    return await db.quizzes.find().to_list(100)


@router.get("/quizzes/{quiz_id}")
async def get_quiz(quiz_id: str):
    quiz = await db.quizzes.find_one({"_id": quiz_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


@router.put("/quizzes/{quiz_id}")
async def update_quiz(quiz_id: str, quiz: Quiz):
    await db.quizzes.update_one({"_id": ObjectId(quiz_id)}, {"$set": quiz.dict(by_alias=True)})
    return await db.quizzes.find_one({"_id": ObjectId(quiz_id)})


@router.delete("/quizzes/{quiz_id}")
async def delete_quiz(quiz_id: str):
    await db.quizzes.delete_one({"_id": ObjectId(quiz_id)})
    return {"msg": "Quiz deleted"}


@router.put("/quizzes/{quiz_id}/questions/{index}")
async def update_question(quiz_id: str, index: int, question: dict):
    quiz = await db.quizzes.find_one({"_id": ObjectId(quiz_id)})
    if not quiz or index >= len(quiz["questions"]):
        raise HTTPException(status_code=404, detail="Question not found")
    quiz["questions"][index] = question
    await db.quizzes.update_one({"_id": ObjectId(quiz_id)}, {"$set": {"questions": quiz["questions"]}})
    return quiz


@router.post("/quizzes/start/{quiz_id}")
async def start_quiz(quiz_id: str, request: QuizStart):
    quiz = await db.quizzes.find_one({"_id": quiz_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    if quiz.get("password") != request.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    if quiz.get("is_started", False):
        return {"message": "Quiz already started", "quiz": quiz}

    start_time = datetime.now(pytz.timezone("Asia/Kolkata")).replace(tzinfo=None)
    await db.quizzes.update_one(
        {"_id": quiz_id},
        {"$set": {"is_started": True, "start_time": start_time}}
    )

    quiz["start_time"] = start_time
    quiz["is_started"] = True
    return {"message": "Quiz started", "quiz": quiz}


@router.post("/quizzes/{quiz_id}/submit_answers")
async def submit_answers(
    quiz_id: str,
    answers: List[str] = Body(...),
    current_user: dict = Depends(get_current_user)
):
    quiz = await db.quizzes.find_one({"_id": quiz_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    if not quiz.get("is_started", False):
        raise HTTPException(status_code=400, detail="Quiz not started yet")

    questions = quiz["questions"]
    if len(answers) != len(questions):
        raise HTTPException(status_code=400, detail="Number of answers does not match questions")

    # Compute score and build answer report
    score = 0
    evaluated_answers = []

    for i, user_ans in enumerate(answers):
        correct = questions[i]["answer"] == user_ans
        evaluated_answers.append({
            "question_index": i,
            "answer": user_ans,
            "is_correct": correct
        })
        if correct:
            score += 1

    # Prepare user response
    user_response = {
        "user_id": current_user["id"],
        "answers": evaluated_answers,
        "score": score
    }

    # Update quiz's user_responses list
    await db.quizzes.update_one(
        {"_id": quiz_id},
        {"$push": {"user_responses": user_response}}
    )

    return {
        "message": "Answers submitted",
        "score": score,
        "total": len(questions)
    }


@router.post("/quizzes/{quiz_id}/end")
async def end_quiz(quiz_id: str, current_user: dict = Depends(get_current_user)):
    quiz = await db.quizzes.find_one({"_id": quiz_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    if not quiz.get("is_started", False):
        raise HTTPException(status_code=400, detail="Quiz has not started yet")

    if quiz.get("is_executed", False):
        raise HTTPException(status_code=400, detail="Quiz already ended")

    user_responses_list = quiz.get("user_responses", [])
    user_response_entry = next(
        (resp for resp in user_responses_list if resp["user_id"] == current_user["id"]),
        None
    )

    if not user_response_entry:
        raise HTTPException(status_code=400, detail="No responses found for this user")
    score = sum(1 for resp in user_response_entry["answers"] if resp.get("is_correct"))

    # Optionally update score in DB
    await db.quizzes.update_one(
        {"_id": quiz_id, "user_responses.user_id": current_user["id"]},
        {
            "$set": {
                "is_executed": True,
                "end_time": datetime.utcnow(),
                "user_responses.$.score": score
            }
        }
    )

    return {"message": "Quiz ended", "score": score}
