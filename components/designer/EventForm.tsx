import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { primitives } from '../../constants/Colors';
import { EVENT_TYPES } from '../../constants/DesignerConstants';

export default function EventForm({ eventData, setEventData, onNext }: any) {
  const [showPicker, setShowPicker] = useState<'none' | 'date' | 'time'>('none');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  return (
    <ScrollView className="flex-1 p-6" keyboardShouldPersistTaps="handled">
        <Text className="text-brand-cinnabar text-[10px] font-poppins-bold uppercase tracking-widest mb-6">Step 1: Core Record</Text>
        
        <TouchableOpacity onPress={() => setShowTypeDropdown(true)} className="bg-white p-5 rounded-2xl border border-brand-sand mb-4 flex-row justify-between items-center shadow-sm">
            <View><Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">Type</Text><Text className="text-brand-cobalt font-poppins-black text-lg">{eventData.type}</Text></View>
            <Ionicons name="chevron-down" size={20} color={primitives.cobalt} />
        </TouchableOpacity>

        <View className="bg-white p-4 rounded-2xl border border-brand-sand mb-4 shadow-sm">
            <Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">Event Name</Text>
            <TextInput placeholder="e.g. Wedding" value={eventData.name} onChangeText={(t) => setEventData({ ...eventData, name: t })} className="text-brand-cobalt text-lg font-poppins-black" />
        </View>
        
        {/* Split Selectors */}
        <View className="flex-row gap-2 mb-4">
            <TouchableOpacity onPress={() => setShowPicker('date')} className="flex-1 bg-white p-4 rounded-2xl border border-brand-sand shadow-sm">
                <Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">Date</Text>
                <Text className="text-brand-cobalt font-poppins-black text-md">{eventData.date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowPicker('time')} className="flex-1 bg-white p-4 rounded-2xl border border-brand-sand shadow-sm">
                <Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">Time</Text>
                <Text className="text-brand-cobalt font-poppins-black text-md">{eventData.isTimeTBD ? 'TBD' : eventData.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
            </TouchableOpacity>
        </View>

        {/* Modal-Wrapped Picker for iOS Visibility */}
        {showPicker !== 'none' && (
            <Modal transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-white p-6 rounded-t-3xl h-[400px]">
                        <View className="flex-row justify-between mb-4">
                            <TouchableOpacity onPress={() => setShowPicker('none')}><Text className="text-brand-cobalt/40 font-poppins-bold">Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowPicker('none')}><Text className="text-brand-cinnabar font-poppins-black">Confirm</Text></TouchableOpacity>
                        </View>
                        <DateTimePicker 
                            value={showPicker === 'date' ? eventData.date : eventData.time}
                            mode={showPicker === 'date' ? 'date' : 'time'}
                            display="spinner"
                            textColor={primitives.cobalt}
                            style={{ height: 250 }}
                            onChange={(e, d) => {
                                if (d) {
                                    if (showPicker === 'date') setEventData({ ...eventData, date: d });
                                    else setEventData({ ...eventData, time: d, isTimeTBD: false });
                                }
                            }} 
                        />
                    </View>
                </View>
            </Modal>
        )}

        <View className="bg-white p-4 rounded-2xl border border-brand-sand mb-8 shadow-sm">
            <Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">Location</Text>
            <TextInput placeholder="Celebration, FL" value={eventData.location} onChangeText={(t) => setEventData({ ...eventData, location: t })} className="text-brand-cobalt text-lg font-poppins-black" />
        </View>
        
        <TouchableOpacity onPress={onNext} className="bg-brand-cobalt py-5 rounded-2xl items-center shadow-lg">
            <Text className="text-white font-poppins-black uppercase tracking-widest">Configure Utility</Text>
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