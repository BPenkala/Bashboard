import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';
import { LAYOUT_MANIFESTS } from '../../constants/DesignerConstants';
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import InvitationRenderer from '../InvitationRenderer';

const SUPABASE_FUNCTION_URL = 'https://vyixmszlimyynkbvlhxp.supabase.co/functions/v1/get-templates';
let GLOBAL_TEMPLATE_CACHE: Record<string, any[]> = {};

export default function TemplateSelector({ eventData, setDesignState, onNext }: any) {
  const { bentoUnit, gap } = useResponsiveGrid(12, 16);
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
            rows.push({ type: 'full', id: `row-${i}-${itemList[i].id}`, item1: itemList[i] });
            i += 1;
        } else {
            rows.push({ type: 'split', id: `row-${i}-${itemList[i].id}`, item1: itemList[i], item2: itemList[i+1] });
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: eventData.type, page: pageNum }),
      });
      const data = await response.json();
      const raw = data.templates || [];

      if (raw.length === 0) {
          setIsEnd(true);
          return;
      }

      const newItems = raw
        .filter((b: any) => !seenIds.current.has(b.id))
        .map((bg: any, idx: number) => {
            seenIds.current.add(bg.id);
            const globalIdx = items.length + idx;
            const layout = layouts[globalIdx % layouts.length];
            const isFull = globalIdx % 3 === 0;
            return { ...bg, layout, span: isFull ? 2 : 1, height: isFull ? 220 : 180 };
        });

      setItems(prev => {
          const updated = [...prev, ...newItems];
          GLOBAL_TEMPLATE_CACHE[eventData.type] = updated;
          return updated;
      });

      if (pageNum > 1) Haptics.selectionAsync();
      if (newItems.length === 0) setIsEnd(true);

    } catch (err) {
      console.error("Gallery Engine Error:", err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [eventData.type, isEnd, items.length, layouts]);

  useEffect(() => {
    if (GLOBAL_TEMPLATE_CACHE[eventData.type]) {
        const cached = GLOBAL_TEMPLATE_CACHE[eventData.type];
        seenIds.current = new Set(cached.map(i => i.id));
        setItems(cached);
        return;
    }
    seenIds.current.clear();
    setItems([]);
    setPage(1);
    setIsEnd(false);
    fetchTemplates(1);
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
    const w1 = (bentoUnit * item.item1.span) + (gap * (item.item1.span - 1));
    return (
        <View className="flex-row justify-between mb-4">
            <TouchableOpacity onPress={() => handleSelect(item.item1)} style={{ width: w1, height: item.item1.height }} className="bg-white rounded-bento overflow-hidden border border-ink/5 shadow-sm relative">
                <InvitationRenderer elements={item.item1.layout.elements} backgroundUrl={item.item1.bg} containerWidth={w1} eventData={eventData} />
                <View className="absolute bottom-2 right-2 bg-ink/80 px-2 py-1 rounded-md"><Text className="text-[8px] text-white font-poppins-bold uppercase">{item.item1.layout.label}</Text></View>
            </TouchableOpacity>
            {item.type === 'split' && item.item2 && (
                <TouchableOpacity onPress={() => handleSelect(item.item2)} style={{ width: w1, height: item.item2.height }} className="bg-white rounded-bento overflow-hidden border border-ink/5 shadow-sm relative">
                    <InvitationRenderer elements={item.item2.layout.elements} backgroundUrl={item.item2.bg} containerWidth={w1} eventData={eventData} />
                    <View className="absolute bottom-2 right-2 bg-ink/80 px-2 py-1 rounded-md"><Text className="text-[8px] text-white font-poppins-bold uppercase">{item.item2.layout.label}</Text></View>
                </TouchableOpacity>
            )}
        </View>
    );
  };

  return (
    <View className="flex-1 px-4 pt-4">
      <FlatList
        data={buildRows(items)}
        renderItem={renderRow}
        keyExtractor={r => r.id}
        onEndReached={() => { if (!loading && !isEnd) { setPage(p => p + 1); fetchTemplates(page + 1); } }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loading ? <View className="py-6"><ActivityIndicator color={theme.primary} /></View> : <View className="py-10 items-center opacity-40"><Text className="text-[10px] font-poppins-bold text-ink uppercase tracking-widest">End of Gallery</Text></View>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}