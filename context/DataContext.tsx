import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import React, { createContext, ReactNode, useContext, useState } from 'react';
// HOLISTIC FIX: Root utils path
import { supabase } from '../utils/supabase';

interface DesignerState { backgroundUri: string | null; textElements: any[]; }
interface EventDetails { name: string; location: string; date: Date; time: Date; type: string; }

const DataContext = createContext<any>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails>({ 
    name: '', location: '', date: new Date(), time: new Date(), type: 'Party' 
  });
  const [designerState, setDesignerState] = useState<DesignerState>({ 
    backgroundUri: null, textElements: [] 
  });

  const saveInvitation = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in to save your invitation.");

      let finalUrl = designerState.backgroundUri;
      if (designerState.backgroundUri?.startsWith('file')) {
        const fileExt = designerState.backgroundUri.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const base64 = await FileSystem.readAsStringAsync(designerState.backgroundUri, { encoding: FileSystem.EncodingType.Base64 });
        await supabase.storage.from('invitations').upload(fileName, decode(base64), { contentType: `image/${fileExt}` });
        finalUrl = supabase.storage.from('invitations').getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase.from('events').insert({
        user_id: user.id, name: eventDetails.name, location: eventDetails.location,
        date: eventDetails.date.toISOString(), event_type: eventDetails.type,
        background_url: finalUrl, design_state: designerState.textElements,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) { return { success: false, error: error.message }; } finally { setIsSaving(false); }
  };

  return <DataContext.Provider value={{ eventDetails, setEventDetails, designerState, setDesignerState, saveInvitation, isSaving }}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);