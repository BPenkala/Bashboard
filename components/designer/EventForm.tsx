import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { palette } from '../../constants/Colors';
import { EVENT_TYPES } from '../../constants/DesignerConstants';

export default function EventForm({ eventData, setEventData, onNext }: any) {
  const [showPicker, setShowPicker] = useState<'none' | 'date' | 'time'>('none');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  return (
    <ScrollView className="flex-1 p-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text className="text-editorial-rose text-[10px] font-poppins-bold uppercase tracking-widest mb-6">Step 1: Core Details</Text>
        
        <TouchableOpacity onPress={() => setShowTypeDropdown(true)} className="bg-white p-5 rounded-inner border border-editorial-muted/10 mb-5 flex-row justify-between items-center shadow-sm">
            <View><Text className="text-editorial-muted text-[10px] uppercase font-poppins-bold mb-1">Occasion</Text><Text className="text-editorial-ink font-poppins-bold text-lg">{eventData.type}</Text></View>
            <Ionicons name="chevron-down" size={20} color={palette.ink} />
        </TouchableOpacity>

        <View className="bg-white p-5 rounded-inner border border-editorial-muted/10 mb-5 shadow-sm">
            <Text className="text-editorial-muted text-[10px] uppercase font-poppins-bold mb-1">Event Name</Text>
            <TextInput placeholder="e.g. Birthday Party" value={eventData.name} onChangeText={(t) => setEventData({ ...eventData, name: t })} className="text-editorial-ink text-lg font-poppins-bold" />
        </View>
        
        <View className="flex-row gap-3 mb-5">
            <TouchableOpacity onPress={() => setShowPicker('date')} className="flex-1 bg-white p-5 rounded-inner border border-editorial-muted/10 shadow-sm">
                <Text className="text-editorial-muted text-[10px] uppercase font-poppins-bold mb-1">Date</Text>
                <Text className="text-editorial-ink font-poppins-bold text-md">{eventData.date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowPicker('time')} className="flex-1 bg-white p-5 rounded-inner border border-editorial-muted/10 shadow-sm">
                <Text className="text-editorial-muted text-[10px] uppercase font-poppins-bold mb-1">Time</Text>
                <Text className="text-editorial-ink font-poppins-bold text-md">{eventData.isTimeTBD ? 'TBD' : eventData.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
            </TouchableOpacity>
        </View>

        <View className="bg-white p-5 rounded-inner border border-editorial-muted/10 mb-10 shadow-sm">
            <Text className="text-editorial-muted text-[10px] uppercase font-poppins-bold mb-1">Location</Text>
            <TextInput placeholder="Celebration, FL" value={eventData.location} onChangeText={(t) => setEventData({ ...eventData, location: t })} className="text-editorial-ink text-lg font-poppins-bold" />
        </View>
        
        <TouchableOpacity onPress={onNext} style={{ backgroundColor: palette.ink }} className="py-5 rounded-inner items-center shadow-lg mb-20">
            <Text className="text-white font-poppins-bold uppercase tracking-widest text-xs">Configure Options</Text>
        </TouchableOpacity>

        <Modal visible={showTypeDropdown} transparent animationType="fade">
            <TouchableOpacity activeOpacity={1} onPress={() => setShowTypeDropdown(false)} className="flex-1 bg-editorial-ink/60 justify-center p-6">
                <View className="bg-white rounded-bento p-4 max-h-[70%] shadow-2xl">
                    <FlatList data={EVENT_TYPES} showsVerticalScrollIndicator={false} renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => { setEventData({ ...eventData, type: item }); setShowTypeDropdown(false); }} className="py-4 border-b border-editorial-muted/5">
                            <Text className="text-center text-editorial-ink text-lg font-poppins-bold">{item}</Text>
                        </TouchableOpacity>
                    )} />
                </View>
            </TouchableOpacity>
        </Modal>

        {showPicker !== 'none' && (
            <Modal transparent animationType="slide">
                <View className="flex-1 justify-end bg-editorial-ink/40">
                    <View className="bg-white p-6 rounded-t-bento h-[380px] shadow-2xl">
                        <View className="flex-row justify-between mb-4 px-2">
                            <TouchableOpacity onPress={() => setShowPicker('none')}><Text className="text-editorial-muted font-poppins-bold">Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowPicker('none')}><Text className="text-editorial-rose font-poppins-black">Done</Text></TouchableOpacity>
                        </View>
                        <DateTimePicker 
                            value={showPicker === 'date' ? eventData.date : eventData.time}
                            mode={showPicker === 'date' ? 'date' : 'time'}
                            display="spinner"
                            textColor={palette.ink}
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
    </ScrollView>
  );
}