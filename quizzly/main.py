# app/main.py
from fastapi import FastAPI
from quizzly.routes import parent, quiz
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(parent.router, prefix="/parent", tags=["Parent"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])
