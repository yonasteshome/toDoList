import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getList,
  reset,
  createToDoList,
  deleteToDoList,
  markAsDone,
} from "../../features/toDoList/toDoListSlice";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth) || {};
  const { lists = [], isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.todo
  ) || {};

  const [view, setView] = useState("all");
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getList(user.token));
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess) {
      setTimeout(() => {
        dispatch(reset());
      }, 500);
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const handleCreateTask = () => {
    if (!newTask.trim()) {
      toast.error("Task cannot be empty");
      return;
    }
    const taskData = { text: newTask.trim(), done: false };
    dispatch(createToDoList({ userData: taskData, token: user.token }));
    setNewTask("");
  };

  const handleMarkAsDone = (taskId) => {
    dispatch(markAsDone({ id: taskId, token: user.token }))
      .then(() => {
        dispatch(getList(user.token)); // Refetch list after marking task as completed
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Task List</h2>

      {/* Task Creation UI (Always visible) */}
      <div className="task-creation">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="task-input"
        />
        <button onClick={handleCreateTask} className="task-create-btn">
          Add Task
        </button>
      </div>

      {/* View Buttons */}
      <div className="view-buttons">
        <button
          onClick={() => handleViewChange("all")}
          className={view === "all" ? "active" : ""}
        >
          All Tasks
        </button>
        <button
          onClick={() => handleViewChange("completed")}
          className={view === "completed" ? "active" : ""}
        >
          Completed Tasks
        </button>
      </div>

      {/* Task Display */}
      {isLoading ? (
        <div className="loading">
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div className="task-list">
          {lists.length > 0 ? (
            lists
              .filter((task) => (view === "completed" ? task.completed : !task.completed)) // Filter tasks based on the view
              .map((task) => (
                <div key={task._id} className="task-item">
                  <div className="task-text">{task.text}</div>
                  {/* Show delete button for all tasks in "All Tasks" view */}
                  {view === "all" && (
                    <button
                      onClick={() =>
                        dispatch(deleteToDoList({ listId: task._id, token: user.token }))
                      }
                      className="delete-task-btn"
                    >
                      Delete
                    </button>
                  )}

                  {/* Show delete button for completed tasks in "Completed Tasks" view */}
                  {view === "completed" && (
                    <button
                      onClick={() =>
                        dispatch(deleteToDoList({ listId: task._id, token: user.token }))
                      }
                      className="delete-task-btn"
                    >
                      Delete
                    </button>
                  )}

                  {/* Show mark as completed button for tasks in "All Tasks" view */}
                  {view !== "completed" && (
                    <button
                      onClick={() => handleMarkAsDone(task._id)}
                      className="mark-completed-btn"
                    >
                      Completed
                    </button>
                  )}
                </div>
              ))
          ) : (
            <p className="no-tasks">
              {view === "completed"
                ? "No completed tasks yet!"
                : "No tasks available!"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
