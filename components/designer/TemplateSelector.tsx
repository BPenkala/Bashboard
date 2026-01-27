import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';
import { LAYOUT_MANIFESTS } from '../../constants/DesignerConstants';
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import InvitationRenderer from '../InvitationRenderer';

const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_FUNCTION_URL = 'https://vyixmszlimyynkbvlhxp.supabase.co/functions/v1/get-templates';

let GLOBAL_TEMPLATE_CACHE: Record<string, any[]> = {};

export default function TemplateSelector({ eventData, setDesignState, onNext, onBack }: any) {
  const { bentoUnit, gap } = useResponsiveGrid(2, 16);
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const isFetching = useRef(false);
  const seenIds = useRef(new Set<string>());
  const layouts = Object.values(LAYOUT_MANIFESTS);

  const buildRows = (itemList: any[]) => {
    const rows: any[] = [];
    let i = 0;
    while (i < itemList.length) {
        if (i % 3 === 0) {
            rows.push({ type: 'full', id: `row-f-${i}-${itemList[i].id}`, item1: itemList[i] });
            i += 1;
        } else {
            rows.push({ type: 'split', id: `row-s-${i}-${itemList[i].id}`, item1: itemList[i], item2: itemList[i+1] || null });
            i += 2;
        }
    }
    return rows;
  };

  const fetchTemplates = useCallback(async (pageNum: number) => {
    if (isFetching.current || isEnd || items.length >= 100) return;
    isFetching.current = true;
    setLoading(true);
    try {
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'apikey': SUPABASE_ANON_KEY || '' },
        body: JSON.stringify({ category: eventData.type, page: pageNum }),
      });
      const data = await response.json();
      const raw = data.templates || [];
      if (raw.length === 0) { setIsEnd(true); return; }
      const newItems = raw.filter((b: any) => !seenIds.current.has(b.id)).map((bg: any, idx: number) => {
            seenIds.current.add(bg.id);
            const globalIdx = items.length + idx;
            const layout = layouts[globalIdx % layouts.length];
            const isFull = globalIdx % 3 === 0;
            return { ...bg, layout, span: isFull ? 2 : 1, height: isFull ? 240 : 180 };
        });
      setItems(prev => {
          const updated = [...prev, ...newItems];
          GLOBAL_TEMPLATE_CACHE[eventData.type] = updated;
          return updated;
      });
      if (pageNum > 1) Haptics.selectionAsync();
    } catch (err) { console.error("Gallery Fetch Failed:", err); } finally { setLoading(false); isFetching.current = false; }
  }, [eventData.type, isEnd, items.length, layouts]);

  useEffect(() => {
    if (GLOBAL_TEMPLATE_CACHE[eventData.type]) {
        const cached = GLOBAL_TEMPLATE_CACHE[eventData.type];
        seenIds.current = new Set(cached.map(i => i.id));
        setItems(cached);
        return;
    }
    seenIds.current.clear();
    setItems([]); setPage(1); setIsEnd(false); fetchTemplates(1);
  }, [eventData.type]);

  const handleSelect = (template: any) => {
    const hydrated = JSON.parse(JSON.stringify(template.layout.elements));
    Object.keys(hydrated).forEach(k => {
        const el = hydrated[k];
        if (k === 'main' && eventData.name) el.text = eventData.name;
        if (k === 'location' && eventData.location) el.text = eventData.location;
        if (k === 'dateLabel') {
            const d = new Date(eventData.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const t = new Date(eventData.time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
            el.text = `${d} • ${t}`;
        }
    });
    setDesignState((prev: any) => ({ ...prev, background: template.bg, elements: hydrated }));
    onNext();
  };

  const renderRow = ({ item }: any) => {
    const wFull = (bentoUnit * 2) + gap;
    const wHalf = bentoUnit;
    return (
        <View className="flex-row justify-between mb-4">
            <TouchableOpacity onPress={() => handleSelect(item.item1)} style={{ width: item.type === 'full' ? wFull : wHalf, height: item.item1.height }} className="bg-white rounded-bento overflow-hidden border border-ink/5 shadow-sm relative">
                <InvitationRenderer elements={item.item1.layout.elements} backgroundUrl={item.item1.bg} containerWidth={item.type === 'full' ? wFull : wHalf} eventData={eventData} />
                <View className="absolute bottom-2 right-2 bg-ink/80 px-2 py-1 rounded-md"><Text className="text-[8px] text-white font-poppins-bold uppercase">{item.item1.layout.label}</Text></View>
            </TouchableOpacity>
            {item.type === 'split' && item.item2 && (
                <TouchableOpacity onPress={() => handleSelect(item.item2)} style={{ width: wHalf, height: item.item2.height }} className="bg-white rounded-bento overflow-hidden border border-ink/5 shadow-sm relative">
                    <InvitationRenderer elements={item.item2.layout.elements} backgroundUrl={item.item2.bg} containerWidth={wHalf} eventData={eventData} />
                    <View className="absolute bottom-2 right-2 bg-ink/80 px-2 py-1 rounded-md"><Text className="text-[8px] text-white font-poppins-bold uppercase">{item.item2.layout.label}</Text></View>
                </TouchableOpacity>
            )}
        </View>
    );
  };

  return (
    <View className="flex-1">
      {/* Navigation Header */}
      <View className="flex-row items-center px-6 pt-4 pb-2">
        <TouchableOpacity onPress={onBack} className="w-10 h-10 bg-ink/5 rounded-full items-center justify-center">
          <Ionicons name="arrow-back" size={20} color={theme.ink} />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-poppins-bold text-ink">Choose a Design</Text>
      </View>

      <FlatList
        data={buildRows(items)} renderItem={renderRow} keyExtractor={r => r.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        onEndReached={() => { if (!loading && !isEnd) { const nextPage = page + 1; setPage(nextPage); fetchTemplates(nextPage); } }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loading ? <View className="py-6"><ActivityIndicator color={theme.primary} /></View> : <View className="py-10 items-center opacity-40"><Text className="text-[10px] font-poppins-bold text-ink uppercase tracking-widest">End of Gallery</Text></View>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}