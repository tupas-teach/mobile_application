import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

// --- Fix: Define theme locally ---
const COLORS = {
  primary: '#185FA5',
  primaryDark: '#134c85',
  primaryLight: '#2a7bbd',
  secondary: '#1D9E75',
  amber: '#EF9F27',
  success: '#10B981',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  background: '#0F0F1A',
  card: '#1A1A2E',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: 'rgba(255,255,255,0.08)',
};

const RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// --- Fix: Define PaymentMethod type with all valid options ---
export type PaymentMethod = 'gcash' | 'maya' | 'credit_card' | 'cash';

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  emoji: string;
  description: string;
  color: string;
  bg: string;
  fields?: PaymentField[];
}

interface PaymentField {
  key: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  maxLength?: number;
  secure?: boolean;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'gcash',
    label: 'GCash',
    emoji: '💚',
    description: 'Pay via GCash e-wallet',
    color: '#0066CC',
    bg: '#E6F0FF',
    fields: [
      { key: 'gcash_number', placeholder: '09XX XXX XXXX', keyboardType: 'phone-pad', maxLength: 11 },
    ],
  },
  {
    id: 'maya',
    label: 'Maya',
    emoji: '💜',
    description: 'Pay via Maya (PayMaya)',
    color: '#5E2D91',
    bg: '#F3E8FF',
    fields: [
      { key: 'maya_number', placeholder: '09XX XXX XXXX', keyboardType: 'phone-pad', maxLength: 11 },
    ],
  },
  {
    id: 'credit_card',
    label: 'Credit / Debit Card',
    emoji: '💳',
    description: 'Visa, Mastercard, JCB',
    color: '#1A1A2E',
    bg: '#F3F4F6',
    fields: [
      { key: 'card_number',  placeholder: 'Card number (16 digits)', keyboardType: 'numeric', maxLength: 19 },
      { key: 'card_name',    placeholder: 'Cardholder name' },
      { key: 'card_expiry',  placeholder: 'MM / YY', keyboardType: 'numeric', maxLength: 5 },
      { key: 'card_cvv',     placeholder: 'CVV', keyboardType: 'numeric', maxLength: 4, secure: true },
    ],
  },
  {
    id: 'cash',
    label: 'Cash on-site',
    emoji: '💵',
    description: 'Pay at the FlexZone counter',
    color: '#0F6E56',
    bg: '#E1F5EE',
  },
];

interface PaymentMethodSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  onFieldChange?: (key: string, value: string) => void;
  style?: ViewStyle;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selected,
  onSelect,
  onFieldChange,
  style,
}) => {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const handleFieldChange = (key: string, value: string) => {
    // Auto-format card number with spaces
    if (key === 'card_number') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    // Auto-format expiry
    if (key === 'card_expiry') {
      value = value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1 / $2');
    }
    setFieldValues((prev) => ({ ...prev, [key]: value }));
    onFieldChange?.(key, value);
  };

  const activeOption = PAYMENT_OPTIONS.find((o) => o.id === selected);

  return (
    <View style={[styles.container, style]}>
      {/* Method grid */}
      <View style={styles.grid}>
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onSelect(option.id)}
              activeOpacity={0.85}
              style={[
                styles.optionCard,
                isSelected && [styles.optionCardSelected, { borderColor: option.color }],
              ]}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={[styles.optionLabel, isSelected && { color: option.color }]}>
                {option.label}
              </Text>
              {isSelected && (
                <View style={[styles.checkmark, { backgroundColor: option.color }]}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Description */}
      {activeOption && (
        <View style={[styles.descBox, { backgroundColor: activeOption.bg, borderColor: activeOption.color + '30' }]}>
          <Text style={[styles.descText, { color: activeOption.color }]}>
            {activeOption.emoji} {activeOption.description}
          </Text>
        </View>
      )}

      {/* Input fields for selected method */}
      {activeOption?.fields && (
        <View style={styles.fields}>
          <Text style={styles.fieldsTitle}>Payment details</Text>
          {activeOption.fields.map((field) => (
            <TextInput
              key={field.key}
              style={[styles.field, { borderColor: activeOption.color + '50' }]}
              placeholder={field.placeholder}
              placeholderTextColor={COLORS.textMuted}
              value={fieldValues[field.key] ?? ''}
              onChangeText={(v) => handleFieldChange(field.key, v)}
              keyboardType={field.keyboardType ?? 'default'}
              maxLength={field.maxLength}
              secureTextEntry={field.secure}
              autoCorrect={false}
            />
          ))}
        </View>
      )}

      {/* Security note */}
      <View style={styles.securityNote}>
        <Text style={styles.securityText}>🔒 Secured by PayMongo · Your payment info is encrypted</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
    position: 'relative',
  },
  optionCardSelected: {
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  descBox: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
  },
  descText: {
    fontSize: 13,
    fontWeight: '500',
  },
  fields: {
    gap: SPACING.sm,
  },
  fieldsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  field: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    padding: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
  },
  securityNote: {
    alignItems: 'center',
  },
  securityText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});

export default PaymentMethodSelector;