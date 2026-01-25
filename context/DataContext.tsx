import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

// --- Types ---
export type TaskStatus = 'Todo' | 'InProgress' | 'Done';

export interface Task {
  id: string;
  eventId: string; // Dedicated to an event
  title: string;
  status: TaskStatus;
}

export interface Guest {
  id: string;
  eventId: string; // Dedicated to an event
  name: string;
  status: 'Attending' | 'Not Attending' | 'Maybe';
  dietary: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  profileImage: string | null;
}

interface DataContextType {
  tasks: Task[];
  guests: Guest[];
  userProfile: UserProfile;
  addTask: (eventId: string, title: string) => void;
  removeTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  addGuest: (eventId: string, name: string) => void;
  toggleGuestStatus: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Mock Data linked to Event IDs '1' (Summer Gala) and '2' (Harrison's B-Day)
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', eventId: '1', title: 'Book Venue', status: 'Done' },
    { id: '2', eventId: '1', title: 'Send Invites', status: 'InProgress' },
    { id: '3', eventId: '2', title: 'Order Superhero Cake', status: 'Todo' },
  ]);

  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', eventId: '1', name: 'Alice Johnson', status: 'Attending', dietary: 'Vegan' },
    { id: '2', eventId: '2', name: 'Bob Smith', status: 'Maybe', dietary: 'None' },
  ]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Bryan',
    bio: 'Event Planning Extraordinaire',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
  });

  // --- Optimized Actions (Functional Updates) ---
  
  const addTask = (eventId: string, title: string) => {
    const newTask: Task = { id: Date.now().toString(), eventId, title, status: 'Todo' };
    setTasks(prev => [...prev, newTask]);
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = (id: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const addGuest = (eventId: string, name: string) => {
    const newGuest: Guest = { id: Date.now().toString(), eventId, name, status: 'Maybe', dietary: 'None' };
    setGuests(prev => [...prev, newGuest]);
  };

  const toggleGuestStatus = (id: string) => {
    setGuests(prev => prev.map(g => {
      if (g.id !== id) return g;
      const nextStatus = g.status === 'Attending' ? 'Not Attending' : g.status === 'Not Attending' ? 'Maybe' : 'Attending';
      return { ...g, status: nextStatus };
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  // --- MEMOIZATION FIX ---
  // This object is now stable. It will not be re-created unless 
  // tasks, guests, or userProfile actually change.
  const contextValue = useMemo(() => ({
    tasks,
    guests,
    userProfile,
    addTask,
    removeTask,
    moveTask,
    addGuest,
    toggleGuestStatus,
    updateProfile
  }), [tasks, guests, userProfile]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};