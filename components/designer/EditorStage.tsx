import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';
import { COLOR_PALETTE, FONT_OPTIONS, ROTATION_LIMITS } from '../../constants/DesignerConstants';
import DraggableText from './DraggableText';
import ZoomableBackground from './ZoomableBackground'; // New Import

export default function EditorStage({ designState, setDesignState, onBack }: any) {
  const [activeTab, setActiveTab] = useState<'edit' | 'font' | 'color' | 'style'>('edit');
  const [selectedElement, setSelectedElement] = useState<string>('main');

  const updateElement = (key: string, updates: any) => {
    setDesignState((prev: any) => ({
      ...prev,
      elements: { ...prev.elements, [key]: { ...prev.elements[key], ...updates } }
    }));
  };

  const updatePosition = (key: string, x: number, y: number) => {
    setDesignState((prev: any) => ({
      ...prev,
      elements: { ...prev.elements, [key]: { ...prev.elements[key], x, y } }
    }));
  };

  const currentEl = designState.elements[selectedElement] || {};

  return (
    <View className="flex-1 bg-ink">
      {/* [HCI] Navigation Affordance: Header with Back Button */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity 
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onBack(); }}
          className="w-10 h-10 bg-white/10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-poppins-bold uppercase text-[10px] tracking-widest">Designer</Text>
        <TouchableOpacity className="bg-primary px-4 py-2 rounded-full">
           <Text className="text-white font-poppins-bold text-[10px] uppercase">Finish</Text>
        </TouchableOpacity>
      </View>

      {/* 1. FLOATING CANVAS WITH ZOOM CAPABILITIES */}
      <View className="flex-1 items-center justify-center p-4">
          <View style={{ width: 330, height: 495, borderRadius: 24, overflow: 'hidden', shadowOpacity: 0.3, shadowRadius: 30, backgroundColor: theme.canvas }}>
            <ZoomableBackground source={designState.background}>
                <View style={{ flex: 1, backgroundColor: `rgba(0,0,0, ${designState.overlayOpacity || 0.2})` }}>
                    {Object.keys(designState.elements).map(key => (
                        <DraggableText 
                            key={key} id={key} element={designState.elements[key]} 
                            isSelected={selectedElement === key} onSelect={setSelectedElement} 
                            onUpdatePosition={updatePosition} scale={330/375} canvasWidth={330}
                        />
                    ))}
                </View>
            </ZoomableBackground>
          </View>
      </View>

      {/* 2. ADOBE-STYLE CONTEXTUAL BAR */}
      <View style={{ height: 280 }} className="bg-white rounded-t-[40px] px-6 pt-6 shadow-2xl">
        <View className="flex-row justify-between mb-6 px-2">
            {[
                { id: 'edit', icon: 'create-outline', label: 'Edit' },
                { id: 'font', icon: 'text-outline', label: 'Font' },
                { id: 'color', icon: 'color-palette-outline', label: 'Color' },
                { id: 'style', icon: 'options-outline', label: 'Adjust' }
            ].map((tab: any) => (
                <TouchableOpacity 
                    key={tab.id} onPress={() => { setActiveTab(tab.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    className="items-center"
                >
                    <View className={`w-12 h-12 rounded-2xl items-center justify-center ${activeTab === tab.id ? 'bg-primary/10' : ''}`}>
                        <Ionicons name={tab.icon as any} size={22} color={activeTab === tab.id ? theme.primary : theme.ink} />
                    </View>
                    <Text style={{ color: activeTab === tab.id ? theme.primary : theme.ink }} className="text-[9px] font-poppins-bold uppercase mt-1 tracking-tighter">{tab.label}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {activeTab === 'edit' && (
                <View className="gap-y-4">
                    <View className="w-full bg-ink/5 p-4 rounded-2xl">
                        <Text className="text-ink/40 text-[9px] font-poppins-bold uppercase mb-2">Text Scale: {currentEl.size || 20}pt</Text>
                        <Slider 
                            value={currentEl.size || 20} minimumValue={10} maximumValue={120} 
                            onValueChange={v => updateElement(selectedElement, { size: Math.round(v) })} 
                            minimumTrackTintColor={theme.primary} thumbTintColor={theme.ink} 
                        />
                    </View>
                    <View className="w-full bg-ink/5 p-4 rounded-2xl">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-ink/40 text-[9px] font-poppins-bold uppercase">Rotation: {Math.round(currentEl.rotation || 0)}°</Text>
                            <TouchableOpacity onPress={() => updateElement(selectedElement, { rotation: 0 })}>
                                <Text className="text-[9px] font-poppins-bold text-primary uppercase">Reset</Text>
                            </TouchableOpacity>
                        </View>
                        <Slider 
                            value={currentEl.rotation || 0} 
                            minimumValue={ROTATION_LIMITS.MIN} 
                            maximumValue={ROTATION_LIMITS.MAX} 
                            step={ROTATION_LIMITS.STEP}
                            onValueChange={v => updateElement(selectedElement, { rotation: Math.round(v) })} 
                            minimumTrackTintColor={theme.primary} thumbTintColor={theme.ink} 
                        />
                    </View>
                </View>
            )}

            {activeTab === 'font' && (
                <View className="flex-row flex-wrap gap-2">
                    {FONT_OPTIONS.map(f => (
                        <TouchableOpacity 
                            key={f.value} onPress={() => { updateElement(selectedElement, { fontFamily: f.value }); Haptics.selectionAsync(); }}
                            className={`px-4 py-3 rounded-xl border ${currentEl.fontFamily === f.value ? 'bg-ink border-ink' : 'bg-white border-ink/10'}`}
                        >
                            <Text style={{ fontFamily: f.value, color: currentEl.fontFamily === f.value ? 'white' : theme.ink }}>{f.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {activeTab === 'color' && (
                <View className="flex-row flex-wrap gap-3 justify-center">
                    {COLOR_PALETTE.map(c => (
                        <TouchableOpacity 
                            key={c} onPress={() => { updateElement(selectedElement, { color: c }); Haptics.selectionAsync(); }}
                            style={{ backgroundColor: c }}
                            className={`w-10 h-10 rounded-full border-2 ${currentEl.color === c ? 'border-primary' : 'border-black/5'}`}
                        />
                    ))}
                </View>
            )}

            {activeTab === 'style' && (
                <View className="flex-row gap-2">
                    <TouchableOpacity 
                        onPress={() => updateElement(selectedElement, { uppercase: !currentEl.uppercase })}
                        className={`flex-1 p-4 rounded-2xl items-center ${currentEl.uppercase ? 'bg-ink' : 'bg-ink/5'}`}
                    >
                        <Text className={`font-poppins-bold ${currentEl.uppercase ? 'text-white' : 'text-ink'}`}>UPPERCASE</Text>
                    </TouchableOpacity>
                    <View className="flex-1 bg-ink/5 p-4 rounded-2xl flex-row justify-around items-center">
                        {['left', 'center', 'right'].map((a: any) => (
                            <TouchableOpacity key={a} onPress={() => updateElement(selectedElement, { align: a })}>
                                <MaterialIcons name={`format-align-${a}` as any} size={20} color={currentEl.align === a ? theme.primary : theme.ink} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
      </View>
    </View>
  );
}