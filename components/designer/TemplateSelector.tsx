import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, LayoutAnimation, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import InvitationRenderer from '../InvitationRenderer';

const SUPABASE_FUNCTION_URL = 'https://vyixmszlimyynkbvlhxp.supabase.co/functions/v1/get-templates';

const LAYOUT_MAP: any = {
    modern: {
        header: { y: 40, x: 20, width: 335, align: 'left', size: 10, fontFamily: 'Oswald-Regular', tracking: 2, color: '#FFFFFF' },
        main: { y: 60, x: 20, width: 335, align: 'left', size: 42, fontFamily: 'Oswald-Bold', lineHeight: 1.1, color: '#FFFFFF' },
        dateLabel: { y: 220, x: 20, width: 335, align: 'left', size: 14, fontFamily: 'Oswald-Medium', color: '#FFFFFF' },
        location: { y: 260, x: 20, width: 335, align: 'left', size: 12, fontFamily: 'Oswald-Regular', color: '#FFFFFF' }
    },
    elegant: {
        header: { y: 30, x: 0, width: 375, align: 'center', size: 12, fontFamily: 'Montserrat-Regular', tracking: 3, color: '#FFFFFF' },
        main: { y: 60, x: 0, width: 375, align: 'center', size: 32, fontFamily: 'PlayfairDisplay-ExtraBold', lineHeight: 1.2, color: '#FFFFFF' },
        dateLabel: { y: 180, x: 0, width: 375, align: 'center', size: 16, fontFamily: 'Montserrat-Bold', color: '#FFFFFF' },
        location: { y: 230, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'Montserrat-Regular', color: '#FFFFFF' }
    }
};

export default function TemplateSelector({ eventData, setDesignState, onNext }: any) {
  const { bentoUnit, gap } = useResponsiveGrid(12, 16);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true);
      try {
        const response = await fetch(SUPABASE_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: eventData.type }),
        });
        const data = await response.json();
        if (data && data.templates) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setTemplates(data.templates);
        }
      } catch (err) {
        console.error("Backend fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, [eventData.type]);

  const handleOpenPixabay = async () => {
    const url = 'https://pixabay.com';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.warn("Could not open Pixabay URL");
    }
  };

  if (loading) return <View className="flex-1 items-center justify-center bg-canvas"><ActivityIndicator size="large" color={theme.primary} /></View>;

  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row flex-wrap justify-between">
          {templates?.map((style: any) => {
              const cardWidth = (bentoUnit * (style.span || 1)) + (gap * ((style.span || 1) - 1));
              const currentLayout = LAYOUT_MAP[style.layoutType] || LAYOUT_MAP.modern;
              return (
                <TouchableOpacity 
                  key={style.id} 
                  onPress={() => {
                    setDesignState((prev: any) => ({ ...prev, background: style.bg, elements: { ...prev.elements, ...currentLayout } }));
                    onNext();
                  }}
                  style={{ width: cardWidth, height: style.height || 180, marginBottom: 16 }}
                  className="bg-white rounded-bento overflow-hidden border border-ink/5 shadow-sm"
                >
                  <InvitationRenderer elements={currentLayout} backgroundUrl={style.bg} containerWidth={cardWidth} eventData={eventData} />
                </TouchableOpacity>
              );
          })}
      </View>

      <View className="py-10 items-center border-t border-ink/5 mt-4">
          <TouchableOpacity onPress={handleOpenPixabay} className="flex-row items-center opacity-40">
              <Text className="text-ink font-poppins-med text-[10px] uppercase tracking-wider">Powered by Pixabay</Text>
              <Ionicons name="open-outline" size={10} color={theme.primary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
      </View>
    </ScrollView>
  );
}