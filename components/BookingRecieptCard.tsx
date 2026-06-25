// === ReceiptCard.tsx ===
import React from 'react';
import {
    StyleSheet,
    Text,
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

// --- Fix: Define types locally ---
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  product: Product;
  qty: number;
}

interface Booking {
  id: string;
  courtName: string;
  date: string;
  timeSlots: string[];
  duration: number;
  category: string;
  paymentMethod?: string;
  paymentStatus: string;
  status: string;
  totalAmount: number;
  guestCount?: number;
  notes?: string;
}

interface PaymentTransaction {
  id: string;
  description: string;
  reference: string;
  createdAt: string;
  amount: number;
  method: string;
  status: string;
  items?: CartItem[];
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function StatusPill({ status, type }: { status: string; type: 'booking' | 'payment' }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    confirmed: { label: 'Confirmed', color: COLORS.primaryDark, bg: COLORS.primaryLight },
    pending:   { label: 'Pending',   color: '#854F0B',          bg: '#FAEEDA' },
    cancelled: { label: 'Cancelled', color: '#9B1C1C',          bg: '#FCEBEB' },
    completed: { label: 'Completed', color: '#185FA5',          bg: '#E6F1FB' },
    paid:      { label: 'Paid ✓',    color: COLORS.primaryDark, bg: COLORS.primaryLight },
    success:   { label: 'Paid ✓',    color: COLORS.primaryDark, bg: COLORS.primaryLight },
    unpaid:    { label: 'Unpaid',    color: '#9B1C1C',          bg: '#FCEBEB' },
    failed:    { label: 'Failed',    color: '#9B1C1C',          bg: '#FCEBEB' },
    refunded:  { label: 'Refunded',  color: '#374151',          bg: '#F3F4F6' },
  };
  const s = map[status] ?? map.pending;
  return (
    <View style={[pill.base, { backgroundColor: s.bg }]}>
      <Text style={[pill.text, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

const pill = StyleSheet.create({
  base: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '700' },
});

function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={row.container}>
      <Text style={row.label}>{label}</Text>
      <Text style={[row.value, bold && row.valueBold]}>{value}</Text>
    </View>
  );
}

const row = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  label:     { fontSize: 13, color: COLORS.textSecondary, flex: 1 },
  value:     { fontSize: 13, color: COLORS.text, fontWeight: '500', flex: 1, textAlign: 'right' },
  valueBold: { fontWeight: '700', color: COLORS.text },
});

// ─── Booking Receipt Card ──────────────────────────────────────────────────────

interface BookingReceiptCardProps {
  booking: Booking;
  onDownload?: () => void;
  onCancel?: () => void;
  style?: ViewStyle;
}

export const BookingReceiptCard: React.FC<BookingReceiptCardProps> = ({
  booking,
  onDownload,
  onCancel,
  style,
}) => (
  <View style={[styles.card, style]}>
    {/* Header */}
    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.cardTitle}>{booking.courtName}</Text>
        <Text style={styles.cardRef}>Ref: {booking.id.toUpperCase()}</Text>
      </View>
      <StatusPill status={booking.status} type="booking" />
    </View>

    {/* Perforated divider */}
    <View style={styles.perforated}>
      <View style={[styles.perfCircle, styles.perfLeft]} />
      <View style={styles.perfLine} />
      <View style={[styles.perfCircle, styles.perfRight]} />
    </View>

    {/* Details */}
    <View style={styles.details}>
      <InfoRow label="📅 Date"        value={booking.date} />
      <InfoRow label="⏰ Time"        value={booking.timeSlots.join(', ')} />
      <InfoRow label="⏱️ Duration"    value={`${booking.duration} hour(s)`} />
      <InfoRow label="🏷️ Category"    value={booking.category} />
      <InfoRow label="💳 Payment"     value={booking.paymentMethod?.toUpperCase() ?? '—'} />
      <InfoRow label="📊 Pay Status"  value={booking.paymentStatus} />
      {booking.guestCount && <InfoRow label="👥 Guests"    value={`${booking.guestCount} pax`} />}
      {booking.notes      && <InfoRow label="📝 Notes"     value={booking.notes} />}
    </View>

    {/* Total */}
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Total Amount</Text>
      <Text style={styles.totalValue}>₱{booking.totalAmount.toLocaleString()}</Text>
    </View>

    {/* Actions */}
    <View style={styles.actions}>
      {onDownload && (
        <TouchableOpacity style={styles.actionBtn} onPress={onDownload}>
          <Text style={styles.actionBtnText}>📄 Download Receipt</Text>
        </TouchableOpacity>
      )}
      {onCancel && booking.status !== 'cancelled' && (
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={onCancel}>
          <Text style={[styles.actionBtnText, { color: COLORS.error }]}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// ─── Transaction Receipt Card ─────────────────────────────────────────────────

interface TransactionReceiptCardProps {
  transaction: PaymentTransaction;
  onDownload?: () => void;
  style?: ViewStyle;
}

export const TransactionReceiptCard: React.FC<TransactionReceiptCardProps> = ({
  transaction,
  onDownload,
  style,
}) => (
  <View style={[styles.card, style]}>
    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.cardTitle}>{transaction.description}</Text>
        <Text style={styles.cardRef}>{transaction.reference}</Text>
      </View>
      <StatusPill status={transaction.status} type="payment" />
    </View>

    <View style={styles.perforated}>
      <View style={[styles.perfCircle, styles.perfLeft]} />
      <View style={styles.perfLine} />
      <View style={[styles.perfCircle, styles.perfRight]} />
    </View>

    <View style={styles.details}>
      <InfoRow label="📅 Date"   value={new Date(transaction.createdAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })} />
      <InfoRow label="⏰ Time"   value={new Date(transaction.createdAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })} />
      <InfoRow label="💳 Method" value={transaction.method.replace('_', ' ').toUpperCase()} />
      {transaction.items?.map((item) => (
        <InfoRow key={item.product.id} label={`  ${item.product.name} ×${item.qty}`} value={`₱${(item.product.price * item.qty).toLocaleString()}`} />
      ))}
    </View>

    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Total Paid</Text>
      <Text style={styles.totalValue}>₱{transaction.amount.toLocaleString()}</Text>
    </View>

    {onDownload && (
      <TouchableOpacity style={styles.actionBtn} onPress={onDownload}>
        <Text style={styles.actionBtnText}>📄 Download Receipt</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 2,
  },
  cardRef: {
    fontSize: 11,
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
  perforated: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -1,
  },
  perfCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  perfLeft:  { marginLeft: -10 },
  perfRight: { marginRight: -10 },
  perfLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  details: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actions: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  actionBtn: {
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  actionBtnDanger: {
    borderColor: COLORS.error,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default BookingReceiptCard;