import { readTasks, writeTasks } from '../_tasks.js';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tasks = await readTasks();
    const task = tasks.find((item) => item.id === req.query.id);
    if (!task) return res.status(404).json({ error: 'task not found' });

    const { title, description, status } = req.body ?? {};
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;

    await writeTasks(tasks);
    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to update task' });
  }
}
