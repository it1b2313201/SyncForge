import { useEffect, useState } from 'react';

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const statusMap = {
  todo: 'todo',
  'in-progress': 'in-progress',
  done: 'done',
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then(setTasks)
      .catch(() => setError('Unable to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    const payload = { title: title.trim(), description: description.trim(), status: 'todo' };
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const newTask = await response.json();
    setTasks((prev) => [...prev, newTask]);
    setTitle('');
    setDescription('');
  };

  const moveTask = async (task, nextStatus) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    const updated = await response.json();
    setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  return (
    <div className="app-shell">
      <header>
        <h1>SyncForge Kanban</h1>
        <p>Small live board with Laravel-style API backend and React frontend.</p>
      </header>

      <section className="task-form">
        <form onSubmit={addTask}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task description" />
          <button type="submit">Add task</button>
        </form>
      </section>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="board">
          {columns.map((column) => (
            <div className="column" key={column.id}>
              <h2>{column.title}</h2>
              <div className="cards">
                {tasks.filter((task) => task.status === column.id).map((task) => (
                  <div key={task.id} className="card">
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                    <small>{new Date(task.created_at).toLocaleString()}</small>
                    <div className="actions">
                      {column.id !== 'todo' && (
                        <button onClick={() => moveTask(task, 'todo')}>Move to To Do</button>
                      )}
                      {column.id !== 'in-progress' && (
                        <button onClick={() => moveTask(task, 'in-progress')}>Move to In Progress</button>
                      )}
                      {column.id !== 'done' && (
                        <button onClick={() => moveTask(task, 'done')}>Move to Done</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
