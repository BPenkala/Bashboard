import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { primitives } from '../../constants/Colors';

export default function UtilityChecklist({ eventData, setEventData, onNext }: any) {
  return (
    <View className="p-6">
      <Text className="text-brand-cinnabar text-[10px] font-poppins-bold uppercase tracking-widest mb-6">Step 2: Utility</Text>
      <View className="bg-brand-sand/20 p-8 rounded-squircle border border-brand-sand mb-8">
        <View className="flex-row items-center justify-between w-full bg-white p-4 rounded-xl mb-4 border border-brand-sand">
          <View>
            <Text className="text-brand-cobalt font-poppins-bold text-lg">Task Ledger</Text>
            <Text className="text-brand-cobalt/50 text-xs">Track to-dos and items</Text>
          </View>
          <Switch 
            value={eventData.useChecklist} 
            onValueChange={v => setEventData({ ...eventData, useChecklist: v })} 
            trackColor={{ false: primitives.sand, true: primitives.cinnabar }} 
          />
        </View>
        <View className="flex-row items-center justify-between w-full bg-white p-4 rounded-xl border border-brand-sand">
          <View>
            <Text className="text-brand-cobalt font-poppins-bold text-lg">Time Poll</Text>
            <Text className="text-brand-cobalt/50 text-xs">Let guests vote on time</Text>
          </View>
          <Switch 
            value={eventData.useTimePoll} 
            onValueChange={v => setEventData({ ...eventData, useTimePoll: v })} 
            trackColor={{ false: primitives.sand, true: primitives.cinnabar }} 
          />
        </View>
      </View>
      <TouchableOpacity onPress={onNext} className="bg-brand-cinnabar py-5 rounded-2xl items-center shadow-lg">
        <Text className="text-white font-poppins-black uppercase tracking-widest">Next: Select Template</Text>
      </TouchableOpacity>
    </View>
  );
}