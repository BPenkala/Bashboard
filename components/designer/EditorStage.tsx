import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS, FONT_OPTIONS } from '../../constants/DesignerConstants';
import DraggableText from './DraggableText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EditorStage({ designState, setDesignState }: any) {
  const [editMode, setEditMode] = useState<'style' | 'font' | 'color' | 'layers'>('style');
  const [selectedElement, setSelectedElement] = useState<string>('main');
  const [stageDimensions, setStageDimensions] = useState({ width: 0, height: 0 });
  const [canvasScale, setCanvasScale] = useState(1);

  useEffect(() => {
    if (stageDimensions.width > 0 && stageDimensions.height > 0) {
      const widthScale = (stageDimensions.width - 40) / 375;
      const heightScale = (stageDimensions.height - 40) / (375 * 1.5);
      setCanvasScale(Math.min(widthScale, heightScale));
    }
  }, [stageDimensions]);

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
    <View className="flex-1 bg-brand-cream">
      {/* CANVAS STAGE */}
      <View className="flex-1 items-center justify-center bg-brand-sand/10" onLayout={(e) => setStageDimensions(e.nativeEvent.layout)}>
        {stageDimensions.width > 0 && (
          <View style={{ 
            width: 375 * canvasScale, height: (375 * 1.5) * canvasScale, 
            borderRadius: 24, overflow: 'hidden', backgroundColor: 'white',
            shadowColor: '#000', shadowOffset: {width:0, height:10}, shadowOpacity:0.2, shadowRadius:20
          }}>
            <ImageBackground source={{ uri: designState.background }} style={{ flex: 1 }}>
              <View style={{ flex: 1, backgroundColor: `rgba(0,0,0, ${designState.overlayOpacity})` }}>
                {Object.keys(designState.elements).map(key => (
                  <DraggableText 
                    key={key} id={key} element={designState.elements[key]} 
                    isSelected={selectedElement === key} onSelect={setSelectedElement} onUpdatePosition={updatePosition} 
                    scale={canvasScale} 
                  />
                ))}
              </View>
            </ImageBackground>
          </View>
        )}
      </View>

      {/* TOOL PANEL */}
      <View style={{ height: 350 }} className="bg-brand-midnight rounded-t-[32px] overflow-hidden">
        <View className="flex-row justify-around py-4 border-b border-white/10 px-6">
          {['style', 'font', 'color', 'layers'].map((mode: any) => (
            <TouchableOpacity key={mode} onPress={() => setEditMode(mode)}>
              <Text className={`font-poppins-bold uppercase text-xs ${editMode === mode ? 'text-brand-cinnabar' : 'text-white/40'}`}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-1 px-6 pt-4">
          {editMode === 'style' && (
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              <View className="mb-6">
                <Text className="text-white/50 text-[10px] font-poppins-bold uppercase mb-2">Size</Text>
                <Slider 
                  value={designState.elements[selectedElement].size} 
                  minimumValue={10} maximumValue={100} 
                  onValueChange={v => updateElement(selectedElement, { size: Math.round(v) })} 
                  minimumTrackTintColor="#DC3C22" thumbTintColor="white" 
                />
              </View>
              <View className="flex-row gap-2">
                {['bold', 'italic', 'underline'].map(style => {
                  const styleKey = `is${style.charAt(0).toUpperCase() + style.slice(1)}`;
                  const isActive = designState.elements[selectedElement][styleKey];
                  return (
                    <TouchableOpacity key={style} onPress={() => updateElement(selectedElement, { [styleKey]: !isActive })} className={`flex-1 items-center py-4 rounded-xl border ${isActive ? 'bg-brand-cobalt border-brand-cobalt' : 'border-white/10'}`}>
                      <MaterialCommunityIcons name={`format-${style}` as any} size={20} color="white" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}

          {editMode === 'font' && (
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              {FONT_OPTIONS.map((font) => (
                <TouchableOpacity key={font.value} onPress={() => updateElement(selectedElement, { fontFamily: font.value })} className={`p-3 mb-2 rounded-xl flex-row justify-between items-center ${designState.elements[selectedElement].fontFamily === font.value ? 'bg-brand-cinnabar' : 'bg-white/5'}`}>
                  <Text style={{ fontFamily: font.value, color: 'white', fontSize: 18 }}>{font.label}</Text>
                  {designState.elements[selectedElement].fontFamily === font.value && <Ionicons name="checkmark" size={20} color="white" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {editMode === 'color' && (
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              <View className="flex-row flex-wrap gap-4 justify-center">
                {BRAND_COLORS.map((color) => (
                  <TouchableOpacity key={color} onPress={() => updateElement(selectedElement, { color })} style={{ backgroundColor: color }} className={`w-12 h-12 rounded-full border-2 ${designState.elements[selectedElement].color === color ? 'border-white scale-110' : 'border-white/10'}`} />
                ))}
              </View>
            </ScrollView>
          )}

          {editMode === 'layers' && (
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              {Object.keys(designState.elements).map((key) => (
                <View key={key} className="flex-row items-center justify-between py-3 border-b border-white/10">
                  <Text className="text-white font-poppins-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
                  <Switch 
                    value={designState.elements[key].visible !== false} 
                    onValueChange={(v) => updateElement(key, { visible: v })}
                    trackColor={{ false: '#333', true: '#DC3C22' }}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}