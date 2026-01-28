import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { theme } from '../../constants/Colors';
import { EVENT_TYPES } from '../../constants/DesignerConstants';
import NativeInputTray from './NativeInputTray';

// Define the shape of the editing state
interface EditingState {
  field: 'name' | 'location';
  label: string;
}

export default function EventForm({ eventData, setEventData, onNext, onBack }: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Instead of inline focus, we track which field is being edited via the Tray
  const [activeEdit, setActiveEdit] = useState<EditingState | null>(null);

  const closeTray = () => setActiveEdit(null);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={theme.ink} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView 
        bottomOffset={100} // Push content up so it's visible behind the tray
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Event Details</Text>
          <Text style={styles.subtitle}>Tell us about your celebration</Text>
        </View>

        <View style={styles.formContent}>
          {/* EVENT TYPE SELECTOR */}
          <View>
            <Text style={styles.label}>Event Type</Text>
            <View style={styles.typesGrid}>
              {EVENT_TYPES.map((type: string) => (
                <TouchableOpacity 
                  key={type} 
                  onPress={() => setEventData({ ...eventData, type })}
                  style={[styles.typeBadge, eventData.type === type && styles.typeBadgeActive]}
                >
                  <Text style={[styles.typeText, eventData.type === type && styles.typeTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* EVENT NAME TRIGGER */}
          <View>
            <Text style={styles.label}>Event Name</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setActiveEdit({ field: 'name', label: 'Event Name' })}
              style={[styles.inputBox, activeEdit?.field === 'name' && styles.inputBoxActive]}
            >
              <Text style={[styles.inputValue, !eventData.name && styles.placeholder]}>
                {eventData.name || "Sarah's 30th Birthday"}
              </Text>
              {activeEdit?.field === 'name' && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          </View>

          {/* LOCATION TRIGGER */}
          <View>
            <Text style={styles.label}>Location</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setActiveEdit({ field: 'location', label: 'Location' })}
              style={[styles.inputBox, activeEdit?.field === 'location' && styles.inputBoxActive]}
            >
              <Text style={[styles.inputValue, !eventData.location && styles.placeholder]}>
                {eventData.location || "The Rooftop Lounge"}
              </Text>
              {activeEdit?.field === 'location' && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          </View>

          {/* DATE & TIME TRIGGERS */}
          <View style={styles.dateTimeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputBox}>
                <Text style={styles.inputValue}>{eventData.date.toLocaleDateString()}</Text>
                <Ionicons name="calendar-outline" size={18} color="rgba(29, 31, 38, 0.4)" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker 
                  value={eventData.date} 
                  mode="date" 
                  display="default" 
                  onChange={(e, d) => { 
                    setShowDatePicker(Platform.OS === 'ios'); 
                    if (d) setEventData({ ...eventData, date: d }); 
                  }} 
                />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.inputBox}>
                <Text style={styles.inputValue}>
                  {eventData.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </Text>
                <Ionicons name="time-outline" size={18} color="rgba(29, 31, 38, 0.4)" />
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker 
                  value={eventData.time} 
                  mode="time" 
                  display="default" 
                  onChange={(e, d) => { 
                    setShowTimePicker(Platform.OS === 'ios'); 
                    if (d) setEventData({ ...eventData, time: d }); 
                  }} 
                />
              )}
            </View>
          </View>

          <TouchableOpacity 
            onPress={onNext} 
            disabled={!eventData.name || !eventData.location} 
            style={[styles.nextButton, (!eventData.name || !eventData.location) && styles.nextButtonDisabled]}
          >
            <Text style={[styles.nextButtonText, (!eventData.name || !eventData.location) && styles.nextButtonTextDisabled]}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* THE NATIVE INPUT TRAY (OVERLAY) */}
      {activeEdit && (
        <View style={styles.trayOverlay} pointerEvents="box-none">
          {/* Invisible dismissal layer */}
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            activeOpacity={1} 
            onPress={closeTray} 
          />
          <NativeInputTray
            label={activeEdit.label}
            value={activeEdit.field === 'name' ? eventData.name : eventData.location}
            onChangeText={(text) => setEventData({ ...eventData, [activeEdit.field]: text })}
            onDone={closeTray}
            placeholder={activeEdit.field === 'name' ? "Sarah's 30th Birthday" : "The Rooftop Lounge"}
            textContentType={activeEdit.field === 'location' ? 'fullStreetAddress' : 'none'}
            autoCapitalize="sentences"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  navHeader: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { width: 40, height: 40, backgroundColor: 'rgba(29, 31, 38, 0.05)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 60 },
  header: { marginBottom: 32 },
  title: { fontSize: 30, fontFamily: 'Poppins_700Bold', color: theme.ink },
  subtitle: { fontSize: 14, color: 'rgba(29, 31, 38, 0.4)' },
  formContent: { gap: 24 },
  label: { fontSize: 10, fontFamily: 'Poppins_700Bold', color: 'rgba(29, 31, 38, 0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  typesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(29, 31, 38, 0.05)', backgroundColor: '#FFF' },
  typeBadgeActive: { backgroundColor: theme.ink, borderColor: theme.ink },
  typeText: { fontSize: 12, fontFamily: 'Poppins_700Bold', color: theme.ink },
  typeTextActive: { color: '#FFF' },
  
  // Display Boxes (Triggers)
  inputBox: { 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(29, 31, 38, 0.05)', 
    minHeight: 56, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inputBoxActive: { 
    borderColor: theme.primary, 
    borderWidth: 2,
    backgroundColor: '#F8F9FF' // Subtle highlight when active
  },
  inputValue: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: theme.ink },
  placeholder: { color: 'rgba(29, 31, 38, 0.2)' },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primary,
  },
  
  dateTimeRow: { flexDirection: 'row', gap: 16 },
  nextButton: { padding: 20, borderRadius: 24, alignItems: 'center', backgroundColor: theme.primary, elevation: 5, marginTop: 16 },
  nextButtonDisabled: { backgroundColor: 'rgba(29, 31, 38, 0.1)' },
  nextButtonText: { fontFamily: 'Poppins_700Bold', textTransform: 'uppercase', letterSpacing: 1, color: '#FFF' },
  nextButtonTextDisabled: { color: 'rgba(29, 31, 38, 0.2)' },
  
  // Tray Overlay Container
  trayOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999, // Sit above everything
  }
});