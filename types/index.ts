// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts  —  SINGLE SOURCE OF TRUTH
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums & Literals ────────────────────────────────────────────────────────

export type MembershipTier     = 'basic' | 'premium' | 'vip';
export type BookingStatus      = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus      = 'pending' | 'paid' | 'unpaid' | 'refunded' | 'failed' | 'success';
export type PaymentMethod      = 'gcash' | 'maya' | 'credit_card' | 'cash';
export type ApplicationStatus  = 'pending' | 'approved' | 'rejected';
export type SportCategory      = 'Basketball' | 'Volleyball' | 'Badminton' | 'Pickleball' | 'TableTennis';
export type EventCategory      =
  | 'Birthday Party'
  | 'Reunion'
  | 'Christmas Party'
  | 'Corporate Event'
  | 'Wedding Reception'
  | 'Other Event';

// ─── Muscle Group ─────────────────────────────────────────────────────────────
// Replaces the old 'HIIT' | 'Yoga' | 'Boxing' | 'Strength' | 'Cardio' union

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Arms'
  | 'Legs'
  | 'Core'
  | 'Cardio';

// ─── User / Auth ─────────────────────────────────────────────────────────────

export interface User {
  id:                string;
  name:              string;
  email:             string;
  phone?:            string;
  avatar?:           string;
  membership:        MembershipTier;
  membershipExpiry?: string;
  joinedAt:          string;
  points:            number;
  location?:         { lat: number; lng: number };
}

// ─── Coach ───────────────────────────────────────────────────────────────────

export interface Coach {
  id:           string;
  name:         string;
  initials:     string;
  specialties:  string[];
  rating:       number;
  reviews:      number;
  experience:   string;
  bio:          string;
  available:    boolean;
  color:        string;
  sessionRate?: number;
}

// ─── Coach Application ────────────────────────────────────────────────────────

export interface CoachApplication {
  id:             string;
  applicantName:  string;
  applicantEmail: string;
  applicantPhone: string;
  experience:     string;
  bio:            string;
  portfolioNote:  string;
  expectedRate:   number;
  specialties:    string[];
  certifications: string[];
  availability:   string[];
  status:         ApplicationStatus;
  submittedAt:    string;
  reviewedAt?:    string;
  reviewNote?:    string;
}

// ─── Gym Session ─────────────────────────────────────────────────────────────

export interface GymSession {
  id:          string;
  name:        string;
  type:        MuscleGroup;  // ← FIXED: was 'HIIT' | 'Yoga' | 'Boxing' | 'Strength' | 'Cardio'
  coach:       string;
  coachId?:    string;
  time:        string;
  duration:    number;
  slots:       number;
  bookedSlots: number;
  intensity:   'Low' | 'Medium' | 'High';
  color:       string;
}

/** Alias — gymStore and session screens can import either name */
export type Session = GymSession;

// ─── Equipment ───────────────────────────────────────────────────────────────

export interface Equipment {
  id:        string;
  name:      string;
  total:     number;
  available: number;
  location:  string;
  status?:   'Available' | 'In Use' | 'Maintenance';
  usage?:    number;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Product {
  id:           string;
  name:         string;
  category:     string;
  price:        number;
  image:        string;
  rating?:      number;
  reviews?:     number;
  inStock?:     boolean;
  description?: string;
  forGym?:      boolean;
  forCourt?:    boolean;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id:       string;
  name:     string;
  price:    number;
  qty:      number;
  product?: Product;
}

// ─── Court ───────────────────────────────────────────────────────────────────

export interface Court {
  id:            string;
  name:          string;
  type:          SportCategory | EventCategory | 'Multi-purpose';
  capacity:      number;
  pricePerHour:  number;
  pricePerDay?:  number;
  available:     boolean;
  amenities:     string[];
  image:         string;
}

export interface TimeSlot {
  id:        string;
  time:      string;
  available: boolean;
  courtId?:  string;
}

// ─── Booking ─────────────────────────────────────────────────────────────────

export interface Booking {
  id:             string;
  userId:         string;
  courtId:        string;
  courtName:      string;
  date:           string;
  timeSlots:      string[];
  duration:       number;
  category:       string;
  totalAmount:    number;
  status:         BookingStatus;
  paymentStatus:  PaymentStatus;
  paymentMethod?: PaymentMethod;
  createdAt:      string;
  notes?:         string;
  guestCount?:    number;
  eventType?:     EventCategory;
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export interface PaymentTransaction {
  id:          string;
  userId:      string;
  amount:      number;
  method:      PaymentMethod;
  status:      PaymentStatus;
  reference:   string;
  createdAt:   string;
  description: string;
  items?:      CartItem[];
  bookingId?:  string;
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id:          string;
  senderId:    string;
  senderName:  string;
  senderType:  'user' | 'admin' | 'ai';
  content:     string;
  timestamp:   Date;
  read:        boolean;
}

// ─── Event Package ───────────────────────────────────────────────────────────

export interface EventPackage {
  id:        string;
  name:      string;
  eventType: EventCategory;
  emoji:     string;
  price:     number;
  duration:  string;
  maxGuests: number;
  includes:  string[];
  color:     string;
}
