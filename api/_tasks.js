import { get, put } from '@vercel/blob';

const pathname = 'syncforge/tasks.json';

const initialTasks = [
  {
    id: 'task_1',
    title: 'Create board schema',
    description: 'Design columns and card structure for the Kanban board.',
    status: 'todo',
    created_at: '2026-07-22T00:00:00+00:00',
  },
  {
    id: 'task_2',
    title: 'Build React UI',
    description: 'Add task cards, column layout and move actions.',
    status: 'in-progress',
    created_at: '2026-07-22T00:10:00+00:00',
  },
  {
    id: 'task_3',
    title: 'Deploy public app',
    description: 'Wire the frontend and backend for a live demo.',
    status: 'done',
    created_at: '2026-07-22T00:20:00+00:00',
  },
];

export async function readTasks() {
  const blob = await get(pathname, { access: 'private' });
  if (!blob) return initialTasks;

  const payload = await new Response(blob.stream).text();
  return JSON.parse(payload);
}

export async function writeTasks(tasks) {
  await put(pathname, JSON.stringify(tasks), {
    access: 'private',
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export function taskId() {
  return `task_${crypto.randomUUID()}`;
}
