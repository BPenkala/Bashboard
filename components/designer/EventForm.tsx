import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';
import { EVENT_TYPES } from '../../constants/DesignerConstants';
import BentoKeyboard from './BentoKeyboard';

export default function EventForm({ eventData, setEventData, onNext, onBack }: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeField, setActiveField] = useState<'name' | 'location' | null>(null);

  const handleKeyPress = (char: string) => {
    if (!activeField) return;
    const currentVal = eventData[activeField] || '';
    setEventData({ ...eventData, [activeField]: currentVal + char });
  };

  const handleDelete = () => {
    if (!activeField) return;
    const currentVal = eventData[activeField] || '';
    setEventData({ ...eventData, [activeField]: currentVal.slice(0, -1) });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={theme.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                  onPress={() => setEventData({ ...eventData, type })}
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
              onPress={() => setActiveField('name')}
              style={[styles.inputBox, activeField === 'name' && styles.inputBoxActive]}
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
              onPress={() => setActiveField('location')}
              style={[styles.inputBox, activeField === 'location' && styles.inputBoxActive]}
            >
              <Text style={[styles.inputValue, !eventData.location && styles.placeholder]}>
                {eventData.location || "The Rooftop Lounge"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputBox}>
                <Text style={styles.inputValue}>{eventData.date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && <DateTimePicker value={eventData.date} mode="date" display="default" onChange={(e, d) => { setShowDatePicker(false); if (d) setEventData({ ...eventData, date: d }); }} />}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.inputBox}>
                <Text style={styles.inputValue}>{eventData.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
              </TouchableOpacity>
              {showTimePicker && <DateTimePicker value={eventData.time} mode="time" display="default" onChange={(e, d) => { setShowTimePicker(false); if (d) setEventData({ ...eventData, time: d }); }} />}
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
      </ScrollView>

      {/* CUSTOM BENTO KEYBOARD MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={activeField !== null}
        onRequestClose={() => setActiveField(null)}
      >
        <View style={styles.modalOverlay}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setActiveField(null)} />
            <BentoKeyboard 
              onKeyPress={handleKeyPress} 
              onDelete={handleDelete}
              onClose={() => setActiveField(null)}
            />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  navHeader: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { width: 40, height: 40, backgroundColor: 'rgba(29, 31, 38, 0.05)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { paddingTop: 10, paddingBottom: 60 },
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
  inputBox: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(29, 31, 38, 0.05)', minHeight: 56, justifyContent: 'center' },
  inputBoxActive: { borderColor: theme.primary, borderWidth: 2 },
  inputValue: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: theme.ink },
  placeholder: { color: 'rgba(29, 31, 38, 0.2)' },
  dateTimeRow: { flexDirection: 'row', gap: 16 },
  nextButton: { padding: 20, borderRadius: 24, alignItems: 'center', backgroundColor: theme.primary, shadowColor: theme.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, marginTop: 16 },
  nextButtonDisabled: { backgroundColor: 'rgba(29, 31, 38, 0.1)', shadowOpacity: 0 },
  nextButtonText: { fontFamily: 'Poppins_700Bold', textTransform: 'uppercase', letterSpacing: 1, color: '#FFF' },
  nextButtonTextDisabled: { color: 'rgba(29, 31, 38, 0.2)' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' }
});