import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '../constants/Colors';
import { Task, TaskStatus, useData } from '../context/DataContext';

export default function ToDoList() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams(); 
  const { tasks, addTask, removeTask, moveTask } = useData();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const currentTasks = tasks.filter(t => t.eventId === eventId);

  const handleAddTask = () => {
    if (newTaskTitle.trim() && eventId) {
      addTask(eventId as string, newTaskTitle);
      setNewTaskTitle('');
    }
  };

  const renderTaskCard = (task: Task) => (
    <View 
      key={task.id} 
      className="bg-white p-5 rounded-bento mb-5 border border-editorial-muted/5 shadow-sm flex-row justify-between items-center"
    >
      <View className="flex-1 mr-4">
        <Text className="text-editorial-ink font-poppins-bold text-base leading-tight">
          {task.title}
        </Text>
        <Text className={`text-[10px] font-poppins-bold uppercase tracking-widest mt-1 ${task.status === 'Done' ? 'text-editorial-sage' : 'text-editorial-muted'}`}>
          {task.status}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <TouchableOpacity 
          onPress={() => {
            const next: TaskStatus = task.status === 'Todo' ? 'InProgress' : task.status === 'InProgress' ? 'Done' : 'Todo';
            moveTask(task.id, next);
          }}
          style={{ backgroundColor: palette.rose }}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <MaterialCommunityIcons name={task.status === 'Done' ? 'check-circle' : 'circle-outline'} size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeTask(task.id)} className="w-10 h-10 bg-editorial-ink/5 rounded-full items-center justify-center">
          <Ionicons name="trash-outline" size={18} color={palette.muted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-editorial-canvas">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-editorial-muted/5">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-editorial-muted/10 shadow-sm">
            <Ionicons name="chevron-back" size={24} color={palette.ink} />
          </TouchableOpacity>
          <Text className="text-xl font-poppins-bold text-editorial-ink">Task Ledger</Text>
          <TouchableOpacity onPress={() => setViewMode(viewMode === 'board' ? 'list' : 'board')} className="w-10 h-10 bg-editorial-ink/5 rounded-full items-center justify-center">
            <Ionicons name={viewMode === 'board' ? 'list' : 'grid'} size={20} color={palette.ink} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
          <Text className="text-editorial-muted text-[10px] font-poppins-bold uppercase tracking-widest mb-2 px-1">New Task</Text>
          <View className="bg-white p-1 pl-4 rounded-inner flex-row items-center border border-editorial-muted/10 mb-10 shadow-sm">
            <TextInput
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="e.g. Florist deposit..."
              className="flex-1 h-12 font-poppins-reg text-editorial-ink"
            />
            <TouchableOpacity onPress={handleAddTask} className="w-12 h-12 bg-editorial-ink rounded-inner items-center justify-center">
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <View className="pb-20">
            {currentTasks.map(renderTaskCard)}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}