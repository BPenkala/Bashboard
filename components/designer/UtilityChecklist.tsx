import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { palette } from '../../constants/Colors';

export default function UtilityChecklist({ eventData, setEventData, onNext }: any) {
  return (
    <View className="p-6">
      <Text className="text-editorial-rose text-[10px] font-poppins-bold uppercase tracking-widest mb-6">Step 2: Utility Tools</Text>
      <View className="bg-white p-6 rounded-bento border border-editorial-muted/5 mb-8 shadow-sm">
        <View className="flex-row items-center justify-between w-full p-4 rounded-inner border border-editorial-muted/10 mb-5 bg-editorial-canvas/50">
          <View>
            <Text className="text-editorial-ink font-poppins-bold text-lg leading-tight">Task Ledger</Text>
            <Text className="text-editorial-muted text-xs">Track your to-do list</Text>
          </View>
          <Switch 
            value={eventData.useChecklist} 
            onValueChange={v => setEventData({ ...eventData, useChecklist: v })} 
            trackColor={{ false: palette.muted, true: palette.rose }} 
          />
        </View>
        <View className="flex-row items-center justify-between w-full p-4 rounded-inner border border-editorial-muted/10 bg-editorial-canvas/50">
          <View>
            <Text className="text-editorial-ink font-poppins-bold text-lg leading-tight">Guest Polling</Text>
            <Text className="text-editorial-muted text-xs">Let guests vote on time</Text>
          </View>
          <Switch 
            value={eventData.useTimePoll} 
            onValueChange={v => setEventData({ ...eventData, useTimePoll: v })} 
            trackColor={{ false: palette.muted, true: palette.rose }} 
          />
        </View>
      </View>
      <TouchableOpacity onPress={onNext} style={{ backgroundColor: palette.rose }} className="py-5 rounded-inner items-center shadow-lg shadow-rose-500/10">
        <Text className="text-white font-poppins-bold uppercase tracking-widest text-xs">Choose Template</Text>
      </TouchableOpacity>
    </View>
  );
}