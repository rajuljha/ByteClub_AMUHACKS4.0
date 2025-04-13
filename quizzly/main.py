# app/main.py
from fastapi import FastAPI
from quizzly.routes import parent, quiz

app = FastAPI()
app.include_router(parent.router, prefix="/parent", tags=["Parent"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])
