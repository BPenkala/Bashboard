import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';
import { EVENT_TYPES } from '../../constants/DesignerConstants';

export default function EventForm({ eventData, setEventData, onNext, onBack }: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      {/* Navigation Header */}
      <View className="flex-row items-center px-6 pt-4 pb-2">
        <TouchableOpacity onPress={onBack} className="w-10 h-10 bg-ink/5 rounded-full items-center justify-center">
          <Ionicons name="arrow-back" size={20} color={theme.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingTop: 10, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-3xl font-poppins-bold text-ink">Event Details</Text>
          <Text className="text-sm text-ink/40">Tell us about your celebration</Text>
        </View>

        <View className="gap-y-6">
          <View>
            <Text className="text-[10px] font-poppins-bold text-ink/40 uppercase tracking-widest mb-3">Event Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {EVENT_TYPES.map((type) => (
                <TouchableOpacity 
                  key={type} onPress={() => setEventData({ ...eventData, type })}
                  className={`px-4 py-2 rounded-xl border ${eventData.type === type ? 'bg-ink border-ink' : 'bg-white border-ink/5'}`}
                >
                  <Text className={`text-xs font-poppins-bold ${eventData.type === type ? 'text-white' : 'text-ink'}`}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-[10px] font-poppins-bold text-ink/40 uppercase tracking-widest mb-2">Event Name</Text>
            <TextInput value={eventData.name} onChangeText={(t) => setEventData({ ...eventData, name: t })} placeholder="Sarah's 30th Birthday" placeholderTextColor="#00000030" className="bg-white p-4 rounded-2xl border border-ink/5 text-ink font-poppins-medium" />
          </View>

          <View>
            <Text className="text-[10px] font-poppins-bold text-ink/40 uppercase tracking-widest mb-2">Location</Text>
            <TextInput value={eventData.location} onChangeText={(t) => setEventData({ ...eventData, location: t })} placeholder="The Rooftop Lounge" placeholderTextColor="#00000030" className="bg-white p-4 rounded-2xl border border-ink/5 text-ink font-poppins-medium" />
          </View>

          <View className="flex-row gap-x-4">
            <View className="flex-1">
              <Text className="text-[10px] font-poppins-bold text-ink/40 uppercase tracking-widest mb-2">Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} className="bg-white p-4 rounded-2xl border border-ink/5 items-center">
                <Text className="text-ink font-poppins-medium">{eventData.date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && <DateTimePicker value={eventData.date} mode="date" display="default" onChange={(e, d) => { setShowDatePicker(false); if (d) setEventData({ ...eventData, date: d }); }} />}
            </View>

            <View className="flex-1">
              <Text className="text-[10px] font-poppins-bold text-ink/40 uppercase tracking-widest mb-2">Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(true)} className="bg-white p-4 rounded-2xl border border-ink/5 items-center">
                <Text className="text-ink font-poppins-medium">{eventData.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
              </TouchableOpacity>
              {showTimePicker && <DateTimePicker value={eventData.time} mode="time" display="default" onChange={(e, d) => { setShowTimePicker(false); if (d) setEventData({ ...eventData, time: d }); }} />}
            </View>
          </View>

          <TouchableOpacity onPress={onNext} disabled={!eventData.name || !eventData.location} className={`p-5 rounded-[24px] items-center shadow-lg mt-4 ${!eventData.name || !eventData.location ? 'bg-ink/10' : 'bg-primary shadow-primary/30'}`}>
            <Text className={`font-poppins-bold uppercase tracking-widest ${!eventData.name || !eventData.location ? 'text-ink/20' : 'text-white'}`}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}