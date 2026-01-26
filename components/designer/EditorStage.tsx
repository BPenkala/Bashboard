import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';
import { BRAND_COLORS, FONT_OPTIONS } from '../../constants/DesignerConstants';
import DraggableText from './DraggableText';

export default function EditorStage({ designState, setDesignState }: any) {
  const [editMode, setEditMode] = useState<'style' | 'font' | 'color' | 'layers'>('style');
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

  return (
    <View className="flex-1 bg-canvas">
      <View className="flex-1 items-center justify-center p-6">
          <View style={{ width: 300, height: 450, borderRadius: 28, overflow: 'hidden', backgroundColor: theme.surface, shadowOpacity: 0.1 }}>
            <ImageBackground source={{ uri: designState.background }} style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: `rgba(0,0,0, ${designState.overlayOpacity})` }}>
                    {Object.keys(designState.elements).map(key => (
                        <DraggableText 
                            key={key} id={key} element={designState.elements[key]} 
                            isSelected={selectedElement === key} onSelect={setSelectedElement} 
                            onUpdatePosition={updatePosition} scale={300/375} 
                        />
                    ))}
                </View>
            </ImageBackground>
          </View>
      </View>

      <View style={{ height: 320 }} className="bg-ink rounded-t-bento p-6 shadow-2xl">
        <View className="flex-row justify-around mb-6">
          {['style', 'font', 'color', 'layers'].map((mode: any) => (
            <TouchableOpacity key={mode} onPress={() => setEditMode(mode)}>
              <Text className={`font-poppins-bold uppercase text-[10px] tracking-widest ${editMode === mode ? 'text-primary' : 'text-white/40'}`}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {editMode === 'style' && (
            <View>
              <Text className="text-white/40 text-[10px] font-poppins-bold uppercase mb-4">Size Scaling</Text>
              <Slider 
                value={designState.elements[selectedElement].size} 
                minimumValue={10} maximumValue={100} 
                onValueChange={v => updateElement(selectedElement, { size: Math.round(v) })} 
                minimumTrackTintColor={theme.primary} thumbTintColor="white" 
              />
            </View>
          )}

          {editMode === 'font' && FONT_OPTIONS.map(f => (
            <TouchableOpacity 
              key={f.value} onPress={() => updateElement(selectedElement, { fontFamily: f.value })} 
              className={`p-4 mb-2 rounded-inner ${designState.elements[selectedElement].fontFamily === f.value ? 'bg-primary' : 'bg-white/5'}`}
            >
              <Text style={{ fontFamily: f.value, color: 'white', fontSize: 18 }}>{f.label}</Text>
              {designState.elements[selectedElement].fontFamily === f.value && <Ionicons name="checkmark" size={20} color="white" />}
            </TouchableOpacity>
          ))}

          {editMode === 'color' && (
            <View className="flex-row flex-wrap gap-4 justify-center">
              {BRAND_COLORS.map((c) => (
                <TouchableOpacity 
                  key={c} onPress={() => updateElement(selectedElement, { color: c })} 
                  style={{ backgroundColor: c }} 
                  className={`w-12 h-12 rounded-full border-2 ${designState.elements[selectedElement].color === c ? 'border-white scale-110' : 'border-white/10'}`} 
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}