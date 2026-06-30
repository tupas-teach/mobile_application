import { Card, SectionHeader } from '@/components/UI';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { useWorkoutStore } from '@/store/workoutStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform, ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'] as const;

const QUICK_EXERCISES: Record<string, string[]> = {
  Chest:     ['Bench Press', 'Incline Dumbbell Press', 'Push-ups', 'Cable Fly'],
  Back:      ['Pull-ups', 'Deadlift', 'Lat Pulldown', 'Barbell Row'],
  Shoulders: ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Face Pull'],
  Arms:      ['Bicep Curl', 'Tricep Dip', 'Hammer Curl', 'Skull Crusher'],
  Legs:      ['Squat', 'Leg Press', 'Lunges', 'Leg Curl'],
  Core:      ['Plank', 'Crunches', 'Russian Twist', 'Hanging Leg Raise'],
  Cardio:    ['Treadmill Run', 'Rowing', 'Jump Rope', 'Cycling'],
};

export default function WorkoutTrackerScreen() {
  const {
    activeWorkout, startWorkout, finishWorkout, discardWorkout,
    addExercise, removeExercise, updateNotes,
    addSet, removeSet, updateSet, toggleSetDone,
  } = useWorkoutStore();

  const [workoutName, setWorkoutName]   = useState('');
  const [pickingGroup, setPickingGroup] = useState<string | null>(null);

  const handleStart = () => {
    const name = workoutName.trim() || 'Workout';
    startWorkout(name);
    setWorkoutName('');
  };

  const handleFinish = () => {
    if (!activeWorkout) return;
    if (activeWorkout.exercises.length === 0) {
      Alert.alert('No exercises logged', 'Add at least one exercise before finishing.');
      return;
    }
    Alert.alert('Finish Workout', 'Save this workout to your history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Finish', onPress: () => finishWorkout() },
    ]);
  };

  const handleDiscard = () => {
    Alert.alert('Discard Workout', 'This will delete the current session. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => discardWorkout() },
    ]);
  };

  // ── No active workout: start screen ────────────────────────────────────────
  if (!activeWorkout) {
    return (
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Workout Tracker</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={s.startContent}>
          <Text style={s.startEmoji}>💪</Text>
          <Text style={s.startTitle}>Ready to train?</Text>
          <Text style={s.startSub}>Start a new workout session and log your exercises as you go.</Text>

          <TextInput
            style={s.nameInput}
            placeholder="Workout name (e.g. Push Day)"
            placeholderTextColor={COLORS.textMuted}
            value={workoutName}
            onChangeText={setWorkoutName}
          />

          <TouchableOpacity style={s.startBtn} onPress={handleStart} activeOpacity={0.85}>
            <Text style={s.startBtnText}>▶  Start Workout</Text>
          </TouchableOpacity>

          {useWorkoutStore.getState().history.length > 0 && (
            <>
              <SectionHeader title="Recent Workouts" />
              {useWorkoutStore.getState().history.slice(0, 5).map((w) => (
                <Card key={w.id} style={s.historyCard}>
                  <Text style={s.historyName}>{w.name}</Text>
                  <Text style={s.historyMeta}>
                    {new Date(w.startedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    {'  ·  '}{w.exercises.length} exercise{w.exercises.length === 1 ? '' : 's'}
                  </Text>
                </Card>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  // ── Active workout: logging screen ──────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.header}>
        <TouchableOpacity onPress={handleDiscard} style={s.backBtn}>
          <Text style={[s.backText, { color: COLORS.error }]}>✕</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{activeWorkout.name}</Text>
        <TouchableOpacity onPress={handleFinish} style={s.finishBtnSmall}>
          <Text style={s.finishBtnSmallText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.startedAt}>
          Started {new Date(activeWorkout.startedAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
        </Text>

        {activeWorkout.exercises.map((ex) => (
          <Card key={ex.id} style={s.exerciseCard}>
            <View style={s.exerciseHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.exerciseName}>{ex.name}</Text>
                <Text style={s.exerciseGroup}>{ex.muscleGroup}</Text>
              </View>
              <TouchableOpacity onPress={() => removeExercise(ex.id)}>
                <Text style={s.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>

            <View style={s.setHeaderRow}>
              <Text style={[s.setHeaderText, { width: 36 }]}>Set</Text>
              <Text style={[s.setHeaderText, { flex: 1 }]}>Weight (kg)</Text>
              <Text style={[s.setHeaderText, { flex: 1 }]}>Reps</Text>
              <Text style={[s.setHeaderText, { width: 36, textAlign: 'center' }]}>✓</Text>
              <Text style={[s.setHeaderText, { width: 28 }]} />
            </View>

            {ex.sets.map((st, idx) => (
              <View key={st.id} style={s.setRow}>
                <Text style={s.setIndex}>{idx + 1}</Text>
                <TextInput
                  style={s.setInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={st.weight}
                  onChangeText={(v) => updateSet(ex.id, st.id, 'weight', v)}
                />
                <TextInput
                  style={s.setInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={st.reps}
                  onChangeText={(v) => updateSet(ex.id, st.id, 'reps', v)}
                />
                <TouchableOpacity
                  style={[s.checkBox, st.done && s.checkBoxDone]}
                  onPress={() => toggleSetDone(ex.id, st.id)}
                >
                  {st.done && <Text style={s.checkMark}>✓</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={s.setRemove} onPress={() => removeSet(ex.id, st.id)}>
                  <Text style={s.setRemoveText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={s.addSetBtn} onPress={() => addSet(ex.id)}>
              <Text style={s.addSetText}>+ Add Set</Text>
            </TouchableOpacity>

            <TextInput
              style={s.notesInput}
              placeholder="Notes (optional)"
              placeholderTextColor={COLORS.textMuted}
              value={ex.notes}
              onChangeText={(v) => updateNotes(ex.id, v)}
              multiline
            />
          </Card>
        ))}

        {/* Add exercise */}
        <SectionHeader title="Add Exercise" />
        <View style={s.groupGrid}>
          {MUSCLE_GROUPS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[s.groupChip, pickingGroup === g && s.groupChipActive]}
              onPress={() => setPickingGroup(pickingGroup === g ? null : g)}
            >
              <Text style={[s.groupChipText, pickingGroup === g && s.groupChipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {pickingGroup && (
          <View style={s.exerciseList}>
            {QUICK_EXERCISES[pickingGroup].map((name) => (
              <TouchableOpacity
                key={name}
                style={s.exercisePickRow}
                onPress={() => {
                  addExercise({ name, muscleGroup: pickingGroup });
                  setPickingGroup(null);
                }}
              >
                <Text style={s.exercisePickText}>{name}</Text>
                <Text style={s.exercisePickArrow}>+</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: COLORS.background },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 54, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  backBtn:         { width: 40 },
  backText:        { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
  headerTitle:     { fontSize: 17, fontWeight: '700', color: COLORS.text, flex: 1, textAlign: 'center' },
  finishBtnSmall:  { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 7 },
  finishBtnSmallText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // Start screen
  startContent:    { padding: SPACING.lg, alignItems: 'center', paddingTop: SPACING.xxl },
  startEmoji:      { fontSize: 48, marginBottom: SPACING.md },
  startTitle:      { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  startSub:        { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl, paddingHorizontal: SPACING.lg },
  nameInput:       { width: '100%', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.md, height: 48, fontSize: 15, color: COLORS.text, marginBottom: SPACING.md },
  startBtn:        { width: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: SPACING.md, alignItems: 'center', marginBottom: SPACING.xl, ...SHADOW.sm },
  startBtnText:    { color: '#fff', fontSize: 16, fontWeight: '700' },
  historyCard:     { width: '100%', marginBottom: SPACING.sm },
  historyName:     { fontSize: 14, fontWeight: '700', color: COLORS.text },
  historyMeta:     { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // Active workout
  content:         { padding: SPACING.lg },
  startedAt:       { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md },
  exerciseCard:    { marginBottom: SPACING.md },
  exerciseHeader:  { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.sm },
  exerciseName:    { fontSize: 15, fontWeight: '700', color: COLORS.text },
  exerciseGroup:   { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  removeText:      { fontSize: 12, color: COLORS.error, fontWeight: '600' },
  setHeaderRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: SPACING.sm },
  setHeaderText:   { fontSize: 11, color: COLORS.textMuted, fontWeight: '700' },
  setRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
  setIndex:        { width: 36, fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  setInput:        { flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, height: 36, paddingHorizontal: SPACING.sm, fontSize: 13, color: COLORS.text },
  checkBox:        { width: 28, height: 28, borderRadius: RADIUS.sm, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  checkBoxDone:    { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkMark:       { color: '#fff', fontSize: 14, fontWeight: '800' },
  setRemove:       { width: 28, alignItems: 'center' },
  setRemoveText:   { fontSize: 14, color: COLORS.textMuted },
  addSetBtn:       { alignSelf: 'flex-start', marginTop: 4, marginBottom: SPACING.sm },
  addSetText:      { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
  notesInput:      { backgroundColor: COLORS.background, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.sm, fontSize: 13, color: COLORS.text, minHeight: 40 },

  groupGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  groupChip:       { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  groupChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  groupChipText:   { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  groupChipTextActive: { color: '#fff' },
  exerciseList:    { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 0.5, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.md },
  exercisePickRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  exercisePickText:{ fontSize: 14, color: COLORS.text, fontWeight: '500' },
  exercisePickArrow:{ fontSize: 18, color: COLORS.primary, fontWeight: '700' },
});
