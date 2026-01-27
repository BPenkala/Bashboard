import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import React, { createContext, ReactNode, useContext, useState } from 'react';
// Ensure this path matches your project structure: utils/supabase.ts
import { supabase } from '../utils/supabase';

interface DesignerState {
  backgroundUri: string | null;
  textElements: any[];
}

interface EventDetails {
  name: string;
  location: string;
  date: Date;
  type: string;
}

interface DataContextType {
  eventDetails: EventDetails;
  setEventDetails: (details: EventDetails) => void;
  designerState: DesignerState;
  setDesignerState: (state: DesignerState) => void;
  saveInvitation: () => Promise<{ success: boolean; error?: string }>;
  isSaving: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    name: '',
    location: '',
    date: new Date(),
    type: 'Party',
  });

  const [designerState, setDesignerState] = useState<DesignerState>({
    backgroundUri: null,
    textElements: [],
  });

  const saveInvitation = async () => {
    setIsSaving(true);
    try {
      // 1. Auth Check
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Please log in to save your invitation.");

      let finalBackgroundUrl = designerState.backgroundUri;

      // 2. Image Upload Logic (Internal to context for atomicity)
      if (designerState.backgroundUri && (designerState.backgroundUri.startsWith('file') || designerState.backgroundUri.startsWith('content'))) {
        const fileExt = designerState.backgroundUri.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const base64 = await FileSystem.readAsStringAsync(designerState.backgroundUri, { 
          encoding: FileSystem.EncodingType.Base64 
        });
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('invitations')
          .upload(fileName, decode(base64), { 
            contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
            upsert: true 
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('invitations')
          .getPublicUrl(fileName);
        
        finalBackgroundUrl = urlData.publicUrl;
      }

      // 3. Database Insertion
      const { error: dbError } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          name: eventDetails.name,
          location: eventDetails.location,
          date: eventDetails.date.toISOString(),
          event_type: eventDetails.type,
          background_url: finalBackgroundUrl,
          design_state: designerState.textElements,
        });

      if (dbError) throw dbError;

      return { success: true };
    } catch (error: any) {
      console.error("Save Error:", error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DataContext.Provider value={{ 
      eventDetails, 
      setEventDetails, 
      designerState, 
      setDesignerState, 
      saveInvitation,
      isSaving 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};