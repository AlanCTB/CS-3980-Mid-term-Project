from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel, Field
from datetime import date
from enum import Enum
import uuid

app = FastAPI()

# CORS setup for development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Priority Class with three levels
class Priority(str, Enum):
    high = "High" # Red
    medium = "Medium" # Yellow
    low = "Low" # Green

# BaseModel for TodoItems
class TodoItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    priority: Priority
    is_recurring: bool
    due_date: date
todo_items = []

@app.get("/items/", response_model=List[TodoItem])
async def read_todo_items():
    return todo_items

@app.post("/items/", response_model=TodoItem)
async def create_todo_item(item: TodoItem):
    todo_items.append()
    return item

@app.delete("/items/{item_id}", response_model=TodoItem)
async def delete_todo_item(item_id: str):
    for index, existing_item in enumerate(todo_items):
        if existing_item['id'] == item_id:
            return todo_items.pop(index)
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/items/")
async def delete_all_todo_items():
    todo_items.clear()
    return {"detail": "All items have been deleted"}
