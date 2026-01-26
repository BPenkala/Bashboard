import React, { useEffect, useState } from 'react';
import { ActivityIndicator, LayoutAnimation, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import InvitationRenderer from '../InvitationRenderer';

// [BEDEV] Your specific Supabase Endpoint
const SUPABASE_FUNCTION_URL = 'https://vyixmszlimyynkbvlhxp.supabase.co/functions/v1/get-templates';

// [LDEV] Layout Fallbacks to ensure text is visible on dynamic backgrounds
const LAYOUT_MAP: any = {
    modern: {
        header: { y: 40, x: 20, width: 335, align: 'left', size: 10, fontFamily: 'Oswald-Regular', tracking: 2, color: '#FFFFFF' },
        main: { y: 60, x: 20, width: 335, align: 'left', size: 42, fontFamily: 'Oswald-Bold', lineHeight: 1.1, color: '#FFFFFF' },
        dateLabel: { y: 220, x: 20, width: 335, align: 'left', size: 14, fontFamily: 'Oswald-Medium', color: '#FFFFFF' },
        timeLabel: { y: 240, x: 20, width: 335, align: 'left', size: 14, fontFamily: 'Oswald-Regular', color: '#FFFFFF' },
        location: { y: 260, x: 20, width: 335, align: 'left', size: 12, fontFamily: 'Oswald-Regular', color: '#FFFFFF' }
    },
    elegant: {
        header: { y: 30, x: 0, width: 375, align: 'center', size: 12, fontFamily: 'Montserrat-Regular', tracking: 3, color: '#FFFFFF' },
        main: { y: 60, x: 0, width: 375, align: 'center', size: 32, fontFamily: 'PlayfairDisplay-ExtraBold', lineHeight: 1.2, color: '#FFFFFF' },
        dateLabel: { y: 180, x: 0, width: 375, align: 'center', size: 16, fontFamily: 'Montserrat-Bold', color: '#FFFFFF' },
        timeLabel: { y: 205, x: 0, width: 375, align: 'center', size: 16, fontFamily: 'Montserrat-Regular', color: '#FFFFFF' },
        location: { y: 230, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'Montserrat-Regular', color: '#FFFFFF' }
    },
    script: {
        header: { y: 40, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'GreatVibes-Regular', color: '#FFFFFF' },
        main: { y: 80, x: 0, width: 375, align: 'center', size: 48, fontFamily: 'GreatVibes-Regular', color: '#FFFFFF' },
        dateLabel: { y: 190, x: 0, width: 375, align: 'center', size: 18, fontFamily: 'GreatVibes-Regular', color: '#FFFFFF' },
        timeLabel: { y: 215, x: 0, width: 375, align: 'center', size: 18, fontFamily: 'GreatVibes-Regular', color: '#FFFFFF' },
        location: { y: 240, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'GreatVibes-Regular', color: '#FFFFFF' }
    }
};

export default function TemplateSelector({ eventData, setDesignState, onNext }: any) {
  const { bentoUnit, gap } = useResponsiveGrid(12, 16);
  
  // [QA] Initialize as empty array to prevent .map() from hitting 'undefined'
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(SUPABASE_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: eventData.type }),
        });

        if (!response.ok) throw new Error('Backend failed');

        const data = await response.json();
        
        // Safety check: ensure data.templates exists
        if (data && data.templates) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setTemplates(data.templates);
        } else {
            setTemplates([]);
        }
      } catch (err) {
        console.error("Backend fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, [eventData.type]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-cream">
        <ActivityIndicator size="large" color="#DC3C22" />
        <Text className="mt-4 font-poppins-bold text-brand-cobalt/40 uppercase text-[10px] tracking-widest">
          Fetching variety...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row justify-between items-center mb-4 px-1">
        <Text className="text-brand-cinnabar text-[10px] font-poppins-bold uppercase tracking-widest">
          Personalized Designs: {eventData.type}
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between pb-20">
          {/* [QA] Optional chaining ensures we never crash if templates is null */}
          {templates?.map((style: any) => {
              const cardWidth = (bentoUnit * (style.span || 1)) + (gap * ((style.span || 1) - 1));
              
              // Resolve layout from our local map based on what backend suggested
              const currentLayout = LAYOUT_MAP[style.layoutType] || LAYOUT_MAP.modern;

              return (
                <TouchableOpacity 
                  key={style.id} 
                  activeOpacity={0.9}
                  onPress={() => {
                    setDesignState((prev: any) => ({ 
                        ...prev, 
                        background: style.bg,
                        overlayOpacity: 0.3,
                        elements: { ...prev.elements, ...currentLayout }
                    }));
                    onNext();
                  }}
                  style={{ width: cardWidth, height: style.height || 180, marginBottom: 16 }}
                  className="bg-white rounded-[24px] overflow-hidden border border-brand-sand/50 shadow-sm"
                >
                  <InvitationRenderer 
                    elements={currentLayout} 
                    backgroundUrl={style.bg} 
                    containerWidth={cardWidth} 
                    aspectRatio={(style.height || 180) / cardWidth}
                    eventData={eventData} 
                  />
                </TouchableOpacity>
              );
          })}
      </View>
    </ScrollView>
  );
}