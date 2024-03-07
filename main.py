from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel, Field
from datetime import date
import uuid

app = FastAPI()

# CORS setup for development. Adjust origins for production use.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TodoItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    priority: int
    is_recurring: bool
    due_date: date  # New field

todo_items = []

@app.get("/items/", response_model=List[TodoItem])
async def read_todo_items():
    return todo_items

@app.post("/items/", response_model=TodoItem)
async def create_todo_item(item: TodoItem):
    todo_items.append(item.dict())
    return item

@app.put("/items/{item_id}", response_model=TodoItem)
async def update_todo_item(item_id: str, item: TodoItem):
    for index, existing_item in enumerate(todo_items):
        if existing_item['id'] == item_id:
            todo_items[index] = item.dict()
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/items/{item_id}", response_model=TodoItem)
async def delete_todo_item(item_id: str):
    for index, existing_item in enumerate(todo_items):
        if existing_item['id'] == item_id:
            return todo_items.pop(index)
    raise HTTPException(status_code=404, detail="Item not found")
