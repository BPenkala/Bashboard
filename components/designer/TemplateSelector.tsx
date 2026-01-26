import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, LayoutAnimation, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';
import { LAYOUT_MANIFESTS } from '../../constants/DesignerConstants';
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import InvitationRenderer from '../InvitationRenderer';

const SUPABASE_FUNCTION_URL = 'https://vyixmszlimyynkbvlhxp.supabase.co/functions/v1/get-templates';

export default function TemplateSelector({ eventData, setDesignState, onNext }: any) {
  const { bentoUnit, gap } = useResponsiveGrid(12, 16);
  const [generatedTemplates, setGeneratedTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // [LDEV] THE COMBINATORIAL ENGINE
  // Fetches raw backgrounds and multiplies them by our Design Manifests
  useEffect(() => {
    async function generateSmartFlyers() {
      setLoading(true);
      try {
        const response = await fetch(SUPABASE_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: eventData.type }),
        });
        const data = await response.json();
        const rawBackgrounds = data.templates || [];

        // MIXING ALGORITHM:
        // We take the raw backgrounds and apply a cycle of our 5 Layout Manifests to them.
        // This ensures maximum variety (Background A + Modern, Background B + Elegant, etc.)
        const layouts = Object.values(LAYOUT_MANIFESTS);
        
        const smartFlyers = rawBackgrounds.map((bgItem: any, index: number) => {
            // Cycle through layouts based on index
            const layoutStyle = layouts[index % layouts.length];
            
            return {
                id: `${bgItem.id}-${layoutStyle.id}`,
                bg: bgItem.bg,
                layout: layoutStyle, // Embed the full manifest
                span: bgItem.span,
                height: bgItem.height
            };
        });

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
    const url = 'https://pixabay.com';
    try {
        await Linking.openURL(url);
    } catch (e) {}
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
                  onPress={() => {
                    // Hydrate the Editor with this specific combination
                    setDesignState((prev: any) => ({ 
                        ...prev, 
                        background: template.bg, 
                        elements: { ...template.layout.elements } 
                    }));
                    onNext();
                  }}
                  style={{ width: cardWidth, height: template.height || 180, marginBottom: 16 }}
                  className="bg-white rounded-bento overflow-hidden border border-ink/5 shadow-sm relative"
                >
                   {/* [LDEV] REAL-TIME COMPOSITING: Pass user data to the renderer */}
                  <InvitationRenderer 
                    elements={template.layout.elements} 
                    backgroundUrl={template.bg} 
                    containerWidth={cardWidth} 
                    eventData={eventData} 
                  />
                  
                  {/* Style Badge */}
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