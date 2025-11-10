
import React from 'react';
import { CronTask } from '../types';
import { cronToString } from '../utils/cronUtils';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TaskItemProps {
  task: CronTask;
  onEdit: (task: CronTask) => void;
  onDelete: (taskId: string) => void;
  onToggle: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggle }) => {
  const statusColor = task.isEnabled ? 'bg-success' : 'bg-secondary';
  const humanReadableSchedule = cronToString(task.schedule);

  return (
    <div className="bg-surface rounded-lg shadow-lg p-4 transition-all hover:shadow-primary/20 hover:ring-1 hover:ring-primary/50 flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-2">
            <span className={`w-3 h-3 rounded-full ${statusColor}`}></span>
            <h3 className="text-lg font-bold text-on-surface">{task.name}</h3>
        </div>
        <p className="text-slate-400 text-sm font-mono bg-background p-2 rounded-md my-2">{task.command}</p>
        <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-primary">{humanReadableSchedule}</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-sm">{task.schedule}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
        {/* Toggle Switch */}
        <label htmlFor={`toggle-${task.id}`} className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              id={`toggle-${task.id}`}
              className="sr-only"
              checked={task.isEnabled}
              onChange={() => onToggle(task.id)}
            />
            <div className={`block ${task.isEnabled ? 'bg-primary' : 'bg-slate-600'} w-14 h-8 rounded-full`}></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform peer-checked:translate-x-full"></div>
          </div>
        </label>

        <button onClick={() => onEdit(task)} className="p-2 text-slate-400 hover:text-warning transition-colors">
          <EditIcon />
        </button>
        <button onClick={() => onDelete(task.id)} className="p-2 text-slate-400 hover:text-danger transition-colors">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
