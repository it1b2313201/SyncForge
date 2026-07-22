import { readTasks, taskId, writeTasks } from '../_tasks.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json(await readTasks());
    }

    if (req.method === 'POST') {
      const { title, description = '', status = 'todo' } = req.body ?? {};
      if (!title?.trim()) {
        return res.status(400).json({ error: 'title is required' });
      }

      const task = {
        id: taskId(),
        title: title.trim(),
        description: description.trim(),
        status,
        created_at: new Date().toISOString(),
      };
      const tasks = await readTasks();
      tasks.push(task);
      await writeTasks(tasks);
      return res.status(201).json(task);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to process tasks' });
  }
}
