import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

const COLORS = {
  primary:       '#1D9E75',
  primaryLight:  '#E1F5EE',
  text:          '#111827',
  textSecondary: '#6B7280',
  textMuted:     '#9CA3AF',
  border:        '#E5E7EB',
  card:          '#FFFFFF',
  background:    '#F8F9FA',
};

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16 };
const RADIUS  = { full: 999 };

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  darkMode?: boolean;
  style?: ViewStyle;
  autoFocus?: boolean;
  filters?: string[];
  selectedFilter?: string;
  onFilterSelect?: (filter: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSearch,
  onClear,
  darkMode = false,
  style,
  autoFocus = false,
  filters,
  selectedFilter,
  onFilterSelect,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const text = value ?? internalValue;
  const hasText = text.length > 0;

  const bg        = darkMode ? '#1A1A2E'               : COLORS.card;
  const txt       = darkMode ? '#fff'                  : COLORS.text;
  const ph        = darkMode ? 'rgba(255,255,255,0.3)' : COLORS.textMuted;
  const bdr       = darkMode ? 'rgba(255,255,255,0.12)': COLORS.border;
  const focusBdr  = COLORS.primary;

  const handleChange = (t: string) => {
    if (!value) setInternalValue(t);
    onChangeText?.(t);
  };

  const handleSubmit = () => {
    onSearch?.(text);
  };

  const handleClear = () => {
    if (!value) setInternalValue('');
    onChangeText?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <View style={style}>
      {/* Search input */}
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: bg,
            borderColor: focused ? focusBdr : bdr,
          },
        ]}
      >
        <Text style={[styles.searchIcon, { color: focused ? COLORS.primary : ph }]}>🔍</Text>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: txt }]}
          placeholder={placeholder}
          placeholderTextColor={ph}
          value={text}
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          returnKeyType="search"
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {hasText && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <View style={[styles.clearCircle, { backgroundColor: ph }]}>
              <Text style={styles.clearX}>✕</Text>
            </View>
          </TouchableOpacity>
        )}
        {onSearch && (
          <TouchableOpacity
            style={[styles.searchBtn, { backgroundColor: COLORS.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.searchBtnText}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      {filters && filters.length > 0 && (
        <View style={styles.filtersRow}>
          {filters.map((f) => {
            const active = selectedFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? COLORS.primary : (darkMode ? '#1A1A2E' : COLORS.card),
                    borderColor: active ? COLORS.primary : bdr,
                  },
                ]}
                onPress={() => onFilterSelect?.(f)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: active ? '#fff' : (darkMode ? 'rgba(255,255,255,0.6)' : COLORS.textSecondary) },
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearX: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  searchBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default SearchBar;

