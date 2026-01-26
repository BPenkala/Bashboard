import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, LayoutAnimation, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';
import { LAYOUT_MANIFESTS } from '../../constants/DesignerConstants';
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import InvitationRenderer from '../InvitationRenderer';

const SUPABASE_FUNCTION_URL = 'https://vyixmszlimyynkbvlhxp.supabase.co/functions/v1/get-templates';

// [LDEV] PERFORMANCE CACHE
// Stores results so we don't re-fetch when moving between steps
let TEMPLATE_CACHE: { category: string; data: any[] } | null = null;

export default function TemplateSelector({ eventData, setDesignState, onNext }: any) {
  const { bentoUnit, gap } = useResponsiveGrid(12, 16);
  const [generatedTemplates, setGeneratedTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateSmartFlyers() {
      // 1. Check Cache First
      if (TEMPLATE_CACHE && TEMPLATE_CACHE.category === eventData.type) {
        setGeneratedTemplates(TEMPLATE_CACHE.data);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(SUPABASE_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: eventData.type }),
        });
        const data = await response.json();
        const rawBackgrounds = data.templates || [];

        const layouts = Object.values(LAYOUT_MANIFESTS);
        
        const smartFlyers = rawBackgrounds.map((bgItem: any, index: number) => {
            const layoutStyle = layouts[index % layouts.length];
            const calculatedSpan = index % 3 === 0 ? 2 : 1;
            
            return {
                id: `${bgItem.id}-${layoutStyle.id}`,
                bg: bgItem.bg,
                layout: layoutStyle, 
                span: calculatedSpan,
                height: calculatedSpan === 2 ? 220 : 180 
            };
        });

        // 2. Write to Cache
        TEMPLATE_CACHE = { category: eventData.type, data: smartFlyers };

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setGeneratedTemplates(smartFlyers);

      } catch (err) {
        console.error("Engine failed:", err);
      } finally {
        setLoading(false);
      }
    }
    generateSmartFlyers();
  }, [eventData.type]);

  const handleOpenPixabay = async () => {
    try { await Linking.openURL('https://pixabay.com'); } catch (e) {}
  };

  // [LDEV] DATA HYDRATION LOGIC
  // This injects the user's form data into the template elements BEFORE they reach the editor.
  const handleSelectTemplate = (template: any) => {
    // Deep copy to avoid mutating the manifest
    const hydratedElements = JSON.parse(JSON.stringify(template.layout.elements));

    Object.keys(hydratedElements).forEach((key) => {
        const el = hydratedElements[key];
        
        // Injection Rules
        if (key === 'main' && eventData.name) el.text = eventData.name;
        if (key === 'location' && eventData.location) el.text = eventData.location;
        if (key === 'dateLabel') {
             const dateStr = new Date(eventData.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
             const timeStr = new Date(eventData.time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
             el.text = `${dateStr} • ${timeStr}`;
        }
    });

    setDesignState((prev: any) => ({ 
        ...prev, 
        background: template.bg, 
        elements: hydratedElements // Save the hydrated elements
    }));
    
    onNext();
  };

  if (loading) return <View className="flex-1 items-center justify-center bg-canvas"><ActivityIndicator size="large" color={theme.primary} /></View>;

  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row flex-wrap justify-between">
          {generatedTemplates.map((template: any) => {
              const cardWidth = (bentoUnit * (template.span || 1)) + (gap * ((template.span || 1) - 1));
              
              return (
                <TouchableOpacity 
                  key={template.id} 
                  onPress={() => handleSelectTemplate(template)}
                  style={{ width: cardWidth, height: template.height, marginBottom: 16 }}
                  className="bg-white rounded-bento overflow-hidden border border-ink/5 shadow-sm relative"
                >
                  <InvitationRenderer 
                    elements={template.layout.elements} 
                    backgroundUrl={template.bg} 
                    containerWidth={cardWidth} 
                    eventData={eventData} 
                  />
                  
                  <View className="absolute bottom-2 right-2 bg-ink/80 px-2 py-1 rounded-md">
                    <Text className="text-[8px] text-white font-poppins-bold uppercase">{template.layout.label}</Text>
                  </View>
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