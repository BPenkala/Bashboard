import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getTemplatesForType } from '../../constants/DesignerConstants';
import InvitationRenderer from '../InvitationRenderer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPACING = 12;
const BENTO_UNIT = (SCREEN_WIDTH - (SPACING * 4)) / 3;

export default function TemplateSelector({ eventData, setDesignState, onNext }: any) {
  const dynamicTemplates = useMemo(() => getTemplatesForType(eventData.type), [eventData.type]);

  const pickCustomImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setDesignState((prev: any) => ({
        ...prev,
        background: result.assets[0].uri,
        overlayOpacity: 0,
      }));
      onNext();
    }
  };

  return (
    <ScrollView className="flex-1 p-3">
      <View className="flex-row justify-between items-center mb-4 px-3">
        <Text className="text-brand-cinnabar text-[10px] font-poppins-bold uppercase tracking-widest">Step 3: Theme - {eventData.type}</Text>
        <TouchableOpacity onPress={pickCustomImage} className="flex-row items-center bg-brand-midnight px-3 py-1 rounded-full">
          <Ionicons name="cloud-upload-outline" size={14} color="white" />
          <Text className="text-white text-[10px] font-poppins-bold uppercase ml-1">Upload Own</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap justify-between">
        {dynamicTemplates.map((style: any) => {
          const cardWidth = style.span === 3 ? SCREEN_WIDTH - (SPACING * 2) : (BENTO_UNIT * style.span) + (style.span > 1 ? SPACING : 0);
          
          return (
            <TouchableOpacity 
              key={style.id} 
              onPress={() => {
                setDesignState((prev: any) => {
                    const mergedElements = { ...prev.elements };
                    Object.keys(style.layout).forEach(key => {
                        mergedElements[key] = { ...mergedElements[key], ...style.layout[key] };
                    });
                    return {
                        ...prev,
                        background: style.bg,
                        overlayOpacity: style.overlayOpacity,
                        elements: mergedElements
                    };
                });
                onNext();
              }} 
              style={{ width: cardWidth, height: style.height, marginBottom: SPACING }} 
              className="bg-white rounded-2xl overflow-hidden border border-brand-sand shadow-sm"
            >
              {/* [HCI] Passing eventData here triggers the Magic Dynamic Preview */}
              <InvitationRenderer 
                elements={style.layout} 
                backgroundUrl={style.bg} 
                overlayOpacity={style.overlayOpacity} 
                containerWidth={cardWidth} 
                aspectRatio={style.height / cardWidth} 
                eventData={eventData} // <--- Added this line
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}