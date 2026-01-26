import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { FlatList, Keyboard, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { primitives } from '../../constants/Colors';
import { EVENT_TYPES } from '../../constants/DesignerConstants';

const InputWithConfirm = ({ value, onChangeText, placeholder, label }: any) => (
    <View className="bg-white p-4 rounded-squircle border border-brand-sand mb-4 shadow-sm relative">
        {label && <Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">{label}</Text>}
        <View className="flex-row items-center justify-between">
            <TextInput placeholder={placeholder} placeholderTextColor={`${primitives.cobalt}55`} value={value} onChangeText={onChangeText} className="text-brand-cobalt text-lg font-poppins-black flex-1 mr-2" />
            {value.length > 0 && <TouchableOpacity onPress={() => Keyboard.dismiss()}><Ionicons name="checkmark-circle" size={24} color={primitives.cobalt} /></TouchableOpacity>}
        </View>
    </View>
);

export default function EventForm({ eventData, setEventData, onNext }: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  return (
    <ScrollView className="flex-1 p-6" keyboardShouldPersistTaps="handled">
        <Text className="text-brand-cinnabar text-[10px] font-poppins-bold uppercase tracking-widest mb-6">Step 1: Core Record</Text>
        
        <TouchableOpacity onPress={() => setShowTypeDropdown(true)} className="bg-white p-5 rounded-squircle border border-brand-sand mb-4 flex-row justify-between items-center shadow-sm">
            <View><Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">Type</Text><Text className="text-brand-cobalt font-poppins-black text-lg">{eventData.type}</Text></View>
            <Ionicons name="chevron-down" size={20} color={primitives.cobalt} />
        </TouchableOpacity>

        <InputWithConfirm label="Event Name" placeholder="e.g. Sarah's Wedding" value={eventData.name} onChangeText={(t: string) => setEventData({ ...eventData, name: t })} />
        
        <TouchableOpacity onPress={() => setShowDatePicker(true)} className="bg-white p-5 rounded-squircle border border-brand-sand mb-4 flex-row justify-between items-center shadow-sm">
            <View><Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">Date & Time</Text><Text className="text-brand-cobalt font-poppins-black text-lg">{eventData.date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</Text></View>
            <Ionicons name="calendar" size={24} color={primitives.cobalt} />
        </TouchableOpacity>

        {showDatePicker && (
            <View className="bg-white rounded-squircle mb-4 p-4 border-2 border-brand-sand shadow-xl">
                <DateTimePicker value={eventData.date} mode="datetime" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { if (Platform.OS === 'android') setShowDatePicker(false); if (d) setEventData({ ...eventData, date: d }); }} />
                <TouchableOpacity onPress={() => setShowDatePicker(false)} className="items-end mt-2"><Text className="text-brand-cinnabar font-poppins-black text-xs uppercase">Done</Text></TouchableOpacity>
            </View>
        )}

        <InputWithConfirm label="Location" placeholder="The Grand Estate" value={eventData.location} onChangeText={(t: string) => setEventData({ ...eventData, location: t })} />
        
        <TouchableOpacity onPress={onNext} className="bg-brand-cobalt py-5 rounded-2xl items-center shadow-lg mt-4">
            <Text className="text-white font-poppins-black uppercase tracking-widest">Next Step</Text>
        </TouchableOpacity>

        <Modal visible={showTypeDropdown} transparent animationType="fade">
            <TouchableOpacity activeOpacity={1} onPress={() => setShowTypeDropdown(false)} className="flex-1 bg-black/60 justify-center p-6">
                <View className="bg-white rounded-3xl p-4 max-h-[70%]">
                    <FlatList data={EVENT_TYPES} renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => { setEventData({ ...eventData, type: item }); setShowTypeDropdown(false); }} className="py-4 border-b border-brand-sand/30">
                            <Text className="text-center text-brand-cobalt text-lg font-poppins-bold">{item}</Text>
                        </TouchableOpacity>
                    )} />
                </View>
            </TouchableOpacity>
        </Modal>
    </ScrollView>
  );
}