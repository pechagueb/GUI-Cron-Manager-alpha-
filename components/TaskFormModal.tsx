
import React, { useState, useEffect } from 'react';
import { CronTask } from '../types';
import { getCrontabFromNaturalLanguage } from '../services/geminiService';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<CronTask, 'id'>) => void;
  taskToEdit: CronTask | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [schedule, setSchedule] = useState('0 0 * * *');
  const [isEnabled, setIsEnabled] = useState(true);
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name);
      setCommand(taskToEdit.command);
      setSchedule(taskToEdit.schedule);
      setIsEnabled(taskToEdit.isEnabled);
    } else {
      // Reset form for new task
      setName('');
      setCommand('');
      setSchedule('0 0 * * *');
      setIsEnabled(true);
    }
    // Reset AI fields
    setNaturalLanguagePrompt('');
    setError(null);
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !command || !schedule) return;
    onSave({ name, command, schedule, isEnabled });
  };

  const handleGenerateSchedule = async () => {
    if (!naturalLanguagePrompt) {
      setError("Please enter a description of the schedule.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const generatedSchedule = await getCrontabFromNaturalLanguage(naturalLanguagePrompt);
      setSchedule(generatedSchedule);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Task Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-background border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g., Daily Database Backup" />
            </div>
            <div>
              <label htmlFor="command" className="block text-sm font-medium text-slate-300 mb-2">Command</label>
              <input type="text" id="command" value={command} onChange={e => setCommand(e.target.value)} required className="w-full bg-background border border-slate-600 rounded-md p-2 font-mono focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g., /usr/local/bin/backup.sh" />
            </div>
            
            <div className="border border-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Generate Schedule with AI</h3>
               <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={naturalLanguagePrompt}
                  onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
                  className="w-full bg-background border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="e.g., 'Every Monday at 3 AM'"
                />
                <button
                  type="button"
                  onClick={handleGenerateSchedule}
                  disabled={isLoading}
                  className="flex justify-center items-center gap-2 bg-primary hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-500 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    Generating...
                    </>
                  ) : (
                    <>
                    <MagicWandIcon/>
                     Generate
                    </>
                  )}
                </button>
              </div>
              {error && <p className="text-danger text-sm mt-2">{error}</p>}
            </div>

            <div>
              <label htmlFor="schedule" className="block text-sm font-medium text-slate-300 mb-2">Cron Schedule</label>
              <input type="text" id="schedule" value={schedule} onChange={e => setSchedule(e.target.value)} required className="w-full bg-background border border-slate-600 rounded-md p-2 font-mono focus:ring-2 focus:ring-primary focus:outline-none" />
              <p className="text-xs text-slate-400 mt-1">Format: minute hour day(month) month day(week)</p>
            </div>

             <div>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} className="h-5 w-5 rounded bg-background border-slate-600 text-primary focus:ring-primary"/>
                    <span className="text-sm font-medium text-slate-300">Enable Task</span>
                </label>
            </div>
          </div>
          <div className="p-6 bg-slate-800 flex justify-end gap-4 rounded-b-lg">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-secondary hover:bg-slate-600 text-white font-semibold rounded-md transition-colors">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-primary hover:bg-sky-600 text-white font-bold rounded-md transition-colors">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
