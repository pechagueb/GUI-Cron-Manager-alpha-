
import React, { useState, useEffect } from 'react';
import { CronTask } from './types';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import { PlusIcon } from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<CronTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CronTask | null>(null);

  useEffect(() => {
    // Load tasks from local storage or use mock data
    try {
      const storedTasks = localStorage.getItem('cronTasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        // Mock data for initial view
        setTasks([
          { id: '1', name: 'Daily Backup', command: '/usr/bin/backup.sh --daily', schedule: '0 2 * * *', isEnabled: true },
          { id: '2', name: 'System Cleanup', command: 'rm -rf /tmp/*', schedule: '0 0 * * 0', isEnabled: true },
          { id: '3', name: 'Check for Updates', command: 'apt-get update', schedule: '*/30 * * * *', isEnabled: false },
        ]);
      }
    } catch (error) {
        console.error("Failed to load tasks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('cronTasks', JSON.stringify(tasks));
    } catch(error) {
        console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks]);

  const handleOpenModal = (task: CronTask | null = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData: Omit<CronTask, 'id'>) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData } : t));
    } else {
      const newTask: CronTask = {
        id: new Date().toISOString(),
        ...taskData,
      };
      setTasks([...tasks, newTask]);
    }
    handleCloseModal();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };
  
  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isEnabled: !t.isEnabled } : t));
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Scheduled Tasks</h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-primary hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <PlusIcon />
            New Task
          </button>
        </div>
        <TaskList
          tasks={tasks}
          onEdit={handleOpenModal}
          onDelete={handleDeleteTask}
          onToggle={handleToggleTask}
        />
      </main>
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
      />
    </div>
  );
};

export default App;
