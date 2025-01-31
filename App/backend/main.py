from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import patients, collections, collectionlist
from .database import Base, engine

# Initialize database tables
Base.metadata.create_all(bind=engine)

# FastAPI App
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pharma-co.onrender.com"],  # Change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(patients.router)
app.include_router(collections.router)
app.include_router(collectionlist.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI App!"}
