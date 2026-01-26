import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { LayoutAnimation, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/Colors';
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
      className="bg-surface p-5 rounded-bento mb-4 border border-ink/5 flex-row justify-between items-center shadow-sm"
    >
      <View className="flex-1 mr-4">
        <Text className="text-ink font-poppins-bold text-base leading-tight">
          {task.title}
        </Text>
        <Text className="text-ink/40 text-[10px] font-poppins-bold uppercase tracking-widest mt-1">
          {task.status}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <TouchableOpacity 
          onPress={() => {
            const next: TaskStatus = task.status === 'Todo' ? 'InProgress' : task.status === 'InProgress' ? 'Done' : 'Todo';
            moveTask(task.id, next);
          }}
          className="w-10 h-10 bg-primary rounded-full items-center justify-center"
        >
          <MaterialCommunityIcons name={getStatusIcon(task.status)} size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => removeTask(task.id)}
          className="w-10 h-10 bg-ink/5 rounded-full items-center justify-center"
        >
          <Ionicons name="trash-outline" size={18} color={theme.ink} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-ink/5">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-surface rounded-full items-center justify-center border border-ink/10 shadow-sm"
          >
            <Ionicons name="chevron-back" size={24} color={theme.ink} />
          </TouchableOpacity>
          <Text className="text-xl font-poppins-bold text-ink">To-Do List</Text>
          <TouchableOpacity 
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setViewMode(viewMode === 'board' ? 'list' : 'board');
            }}
            className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center"
          >
            <Ionicons name={viewMode === 'board' ? 'list' : 'grid'} size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          <View className="bg-surface p-1 pr-1 rounded-inner flex-row items-center border border-ink/10 mb-10 shadow-sm">
            <TextInput
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="e.g., Confirm Catering..."
              placeholderTextColor="#1D1F2666"
              className="flex-1 h-12 px-4 font-poppins-med text-ink"
            />
            <TouchableOpacity 
              onPress={handleAddTask}
              className="w-12 h-12 bg-primary rounded-inner items-center justify-center"
            >
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