# CS-3980-Mid-term-Project
## Calendar Planner Created by Alan Chen
### 1. Python Virtual Enviroment, Pip & Uvicorn Setup

#### Setup my virtual environment and unvicorn using the following commands in my terminal:
```powershell
python -m venv venv
.\venv\Scripts\activate
```
```powershell
pip freeze > requirements.txt
pip install -r requirements.txt
```
```powershell
source venv\bin\activate
pip install fastapi uvicorn
uvicorn main:app --port 8000 --reload          
uvicorn main:app --
```
### 2.Calendar Planner App Description and Images
#### Calendar Planner App Overview
##### Description
The Calendar Planner App is a tool designed to help users efficiently manage their events. With a sleek and user-friendly interface, the app offers several key features, including: <br>
**Event Creation**: Users can easily add new events, specifying details such as title, description, and priority, and also have the ability to do recurring events<br>
**Recurring Events**: For events that occur regularly, the app provides an option to set them as recurring. This feature ensures that users don't have to manually enter the same event multiple times.<br>
**Dynamic Calendar Display**: The app's calendar automatically defaults to the current month, allowing users to navigate through past and future months with the pervious and next month buttons.<br>
**Accurate Date Calculations**: With the use of thetime module, the app accurately calculates the number of days in each month and the corresponding day of the week. This precision ensures that events are always associated with the correct date on the calendar.<br>

#### Visuals
##### Calendar with no events:
![Calendar](ExamplePic/Calendar.png)

##### Empty todo form:
![todo](ExamplePic/Todo.png)

##### Calendar and todo form with example events:
![TodoExample](ExamplePic/ExampleTodo.png)
![CalendarEvent](ExamplePic/CalendarEvent.png)

##### Calendar with example recurring event:
![CalendarRe](ExamplePic/ExampleRe.png)


