
import React from 'react';
import { CronTask } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: CronTask[];
  onEdit: (task: CronTask) => void;
  onDelete: (taskId: string) => void;
  onToggle: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggle }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-surface rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold text-on-surface mb-2">No tasks scheduled yet.</h2>
        <p className="text-slate-400">Click "New Task" to get started and automate your workflow!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default TaskList;
