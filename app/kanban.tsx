import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  StatusBar, 
  LayoutAnimation, 
  Platform, 
  UIManager, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router'; // <--- FIXED: Restored missing hooks
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useData, Task, TaskStatus } from '../context/DataContext';
import { PALETTE, primitives } from '../constants/Colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ToDoList() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams(); // Access the event context from navigation
  const { tasks, addTask, removeTask, moveTask } = useData();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Filter tasks to only show milestones for this specific event
  const currentTasks = tasks.filter(t => t.eventId === eventId);

  const toggleView = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setViewMode(viewMode === 'board' ? 'list' : 'board');
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() && eventId) {
      addTask(eventId as string, newTaskTitle);
      setNewTaskTitle('');
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'Todo': return 'circle-outline';
      case 'InProgress': return 'clock-outline';
      case 'Done': return 'check-circle-outline';
    }
  };

  const renderTaskCard = (task: Task) => (
    <View 
      key={task.id} 
      className="bg-brand-sand/40 p-5 rounded-squircle mb-3 border border-brand-sand flex-row justify-between items-center"
    >
      <View className="flex-1 mr-4">
        <Text className="text-brand-midnight font-poppins-bold text-base leading-tight">
          {task.title}
        </Text>
        <Text className="text-brand-cobalt/60 text-[10px] font-poppins-bold uppercase tracking-widest mt-1">
          {task.status}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <TouchableOpacity 
          onPress={() => {
            const next: TaskStatus = task.status === 'Todo' ? 'InProgress' : task.status === 'InProgress' ? 'Done' : 'Todo';
            moveTask(task.id, next);
          }}
          className="w-10 h-10 bg-brand-cobalt rounded-full items-center justify-center"
        >
          <MaterialCommunityIcons name={getStatusIcon(task.status)} size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => removeTask(task.id)}
          className="w-10 h-10 bg-brand-cinnabar/10 rounded-full items-center justify-center"
        >
          <Ionicons name="trash-outline" size={18} color={primitives.cinnabar} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const BoardColumn = ({ title, status, color }: { title: string, status: TaskStatus, color: string }) => {
    const columnTasks = currentTasks.filter(t => t.status === status);
    return (
      <View className="mb-8">
        <View className="flex-row items-center mb-4 px-1">
          <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }} />
          <Text className="text-brand-cobalt text-[10px] font-poppins-bold uppercase tracking-widest">
            {title} ({columnTasks.length})
          </Text>
        </View>
        {columnTasks.map(renderTaskCard)}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-brand-cream">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        
        {/* Header - Heritage Tech Aesthetic */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-brand-sand/30">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-white rounded-full items-center justify-center border border-brand-sand shadow-sm"
          >
            <Ionicons name="chevron-back" size={24} color={primitives.cobalt} />
          </TouchableOpacity>
          <Text className="text-xl font-poppins-bold text-brand-cobalt">To-Do List</Text>
          <TouchableOpacity 
            onPress={toggleView}
            className="w-10 h-10 bg-brand-cobalt/10 rounded-full items-center justify-center"
          >
            <Ionicons name={viewMode === 'board' ? 'list' : 'grid'} size={20} color={primitives.cobalt} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          
          <Text className="text-brand-cobalt/60 text-[10px] font-poppins-bold uppercase tracking-widest mb-2 px-1">Add Milestone</Text>
          <View className="bg-white p-2 rounded-2xl flex-row items-center border border-brand-sand mb-10 shadow-sm">
            <TextInput
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="e.g., Confirm Catering..."
              placeholderTextColor="#3D74B666"
              className="flex-1 h-12 px-4 font-poppins-med text-brand-cobalt"
            />
            <TouchableOpacity 
              onPress={handleAddTask}
              className="w-12 h-12 bg-brand-cinnabar rounded-xl items-center justify-center"
            >
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {viewMode === 'board' ? (
            <View>
              <BoardColumn title="To Do" status="Todo" color={primitives.cinnabar} />
              <BoardColumn title="In Progress" status="InProgress" color={primitives.sand} />
              <BoardColumn title="Complete" status="Done" color={primitives.cobalt} />
            </View>
          ) : (
            <View className="pb-10">
              <Text className="text-brand-cobalt/60 text-[10px] font-poppins-bold uppercase tracking-widest mb-4 px-1">All Tasks</Text>
              {currentTasks.map(renderTaskCard)}
            </View>
          )}

          <View className="h-20" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}