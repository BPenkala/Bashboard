import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../constants/Colors';
import { EVENT_TYPES } from '../../constants/DesignerConstants';
import NativeInputTray from './NativeInputTray';

interface EditingState {
  field: 'name' | 'location';
  label: string;
}

export default function EventForm({ eventData, setEventData, onNext, onBack }: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeEdit, setActiveEdit] = useState<EditingState | null>(null);

  const closeInteractions = () => {
    setActiveEdit(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={theme.ink} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView 
        bottomOffset={100} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Event Details</Text>
          <Text style={styles.subtitle}>Tell us about your celebration</Text>
        </View>

        <View style={styles.formContent}>
          <View>
            <Text style={styles.label}>Event Type</Text>
            <View style={styles.typesGrid}>
              {EVENT_TYPES.map((type: string) => (
                <TouchableOpacity 
                  key={type} 
                  onPress={() => { closeInteractions(); setEventData({ ...eventData, type }); }}
                  style={[styles.typeBadge, eventData.type === type && styles.typeBadgeActive]}
                >
                  <Text style={[styles.typeText, eventData.type === type && styles.typeTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.label}>Event Name</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => { closeInteractions(); setActiveEdit({ field: 'name', label: 'Event Name' }); }}
              style={[styles.inputBox, activeEdit?.field === 'name' && styles.inputBoxActive]}
            >
              <Text style={[styles.inputValue, !eventData.name && styles.placeholder]}>
                {eventData.name || "Sarah's 30th Birthday"}
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.label}>Location</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => { closeInteractions(); setActiveEdit({ field: 'location', label: 'Location' }); }}
              style={[styles.inputBox, activeEdit?.field === 'location' && styles.inputBoxActive]}
            >
              <Text style={[styles.inputValue, !eventData.location && styles.placeholder]}>
                {eventData.location || "The Rooftop Lounge"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity onPress={() => { closeInteractions(); setShowDatePicker(true); }} style={styles.inputBox}>
                <Text style={styles.inputValue}>{eventData.date.toLocaleDateString()}</Text>
                <Ionicons name="calendar-outline" size={18} color={theme.primary} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity onPress={() => { closeInteractions(); setShowTimePicker(true); }} style={styles.inputBox}>
                <Text style={styles.inputValue}>
                  {eventData.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </Text>
                <Ionicons name="time-outline" size={18} color={theme.primary} />
              </TouchableOpacity>
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

      {/* TEXT INPUT TRAY WITH CRISP TRANSITION */}
      {activeEdit && (
        <Animated.View 
          entering={FadeIn.duration(250)} 
          exiting={FadeOut.duration(200)} 
          style={styles.trayOverlay} 
          pointerEvents="box-none"
        >
          <TouchableOpacity 
            style={styles.overlayDimmer} 
            activeOpacity={1} 
            onPress={closeInteractions} 
          />
          <NativeInputTray
            label={activeEdit.label}
            value={activeEdit.field === 'name' ? eventData.name : eventData.location}
            onChangeText={(text) => setEventData({ ...eventData, [activeEdit.field]: text })}
            onDone={closeInteractions}
            placeholder={activeEdit.field === 'name' ? "Sarah's 30th Birthday" : "The Rooftop Lounge"}
          />
        </Animated.View>
      )}

      {/* Pickers kept as Modals for OS priority */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowDatePicker(false)} />
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerLabel}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.pickerDone}>
                <Text style={styles.pickerDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker value={eventData.date} mode="date" display="spinner" textColor={theme.ink} onChange={(e, d) => { if (d) setEventData({ ...eventData, date: d }); }} />
          </View>
        </View>
      </Modal>

      <Modal visible={showTimePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowTimePicker(false)} />
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerLabel}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.pickerDone}>
                <Text style={styles.pickerDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker value={eventData.time} mode="time" display="spinner" textColor={theme.ink} onChange={(e, d) => { if (d) setEventData({ ...eventData, time: d }); }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F2F2F2' },
  navHeader: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { width: 40, height: 40, backgroundColor: 'rgba(29, 31, 38, 0.05)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 60 },
  header: { marginBottom: 32 },
  title: { fontSize: 30, fontFamily: 'Poppins_700Bold', color: theme.ink },
  subtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: 'rgba(29, 31, 38, 0.4)' },
  formContent: { gap: 24 },
  label: { fontSize: 10, fontFamily: 'Poppins_700Bold', color: 'rgba(29, 31, 38, 0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 },
  typesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBadge: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(29, 31, 38, 0.05)', backgroundColor: '#FFF' },
  typeBadgeActive: { backgroundColor: theme.ink, borderColor: theme.ink },
  typeText: { fontSize: 12, fontFamily: 'Poppins_700Bold', color: theme.ink },
  typeTextActive: { color: '#FFF' },
  inputBox: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(29, 31, 38, 0.05)', minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputBoxActive: { borderColor: theme.primary, borderWidth: 2, backgroundColor: '#F8F9FF' },
  inputValue: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: theme.ink },
  placeholder: { color: 'rgba(29, 31, 38, 0.2)' },
  dateTimeRow: { flexDirection: 'row', gap: 16 },
  nextButton: { padding: 20, borderRadius: 24, alignItems: 'center', backgroundColor: theme.primary, elevation: 5, marginTop: 16 },
  nextButtonDisabled: { backgroundColor: 'rgba(29, 31, 38, 0.1)' },
  nextButtonText: { fontFamily: 'Poppins_700Bold', textTransform: 'uppercase', letterSpacing: 1, color: '#FFF' },
  nextButtonTextDisabled: { color: 'rgba(29, 31, 38, 0.2)' },
  trayOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
  overlayDimmer: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  pickerContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40 },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  pickerLabel: { fontFamily: 'Poppins_700Bold', color: theme.primary, fontSize: 12, textTransform: 'uppercase' },
  pickerDone: { backgroundColor: theme.ink, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  pickerDoneText: { color: '#FFF', fontFamily: 'Poppins_700Bold', fontSize: 12 },
});