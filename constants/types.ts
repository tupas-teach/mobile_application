// ─── Enums & Literals ─────────────────────────────────────────────────────────

import { ApplicationStatus } from "@/store/coachApplicationStore";

export type PaymentMethod = 'gcash' | 'maya' | 'credit_card' | 'cash';

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export type PaymentStatus = 'paid' | 'unpaid' | 'refunded' | 'failed' | 'success';

export type MembershipTier = 'basic' | 'premium' | 'vip';

// ─── Coach ────────────────────────────────────────────────────────────────────

// ─── types/index.ts ───────────────────────────────────────────────────────────

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

export interface GymCoach {
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

export interface ChatMessage {
  id:        string;
  senderId:  string;
  text:      string;
  createdAt: string;
  read:      boolean;
}

export interface CoachChat {
  id:          string;
  coachId:     string;
  coachName:   string;
  coachEmoji:  string;
  userId:      string;
  userName:    string;
  messages:    ChatMessage[];
  updatedAt:   string;
  unreadCount: number;
}

export interface BookedSession {
  id:          string;
  coachId:     string;
  coachName:   string;
  coachEmoji:  string;
  sessionType: string;
  date:        string;
  time:        string;
  duration:    string;
  price:       number;
  status:      'upcoming' | 'completed' | 'cancelled';
  bookedAt:    string;
}

// ─── GymSession ───────────────────────────────────────────────────────────────

export interface GymSession {
  id: string;
  name: string;
  type: 'HIIT' | 'Yoga' | 'Boxing' | 'Strength' | 'Cardio';
  coach: string;
  time: string;           // e.g. '7:00 AM'
  duration: number;       // minutes
  slots: number;
  bookedSlots: number;
  intensity: 'Low' | 'Medium' | 'High';
  color: string;
}

// ─── Equipment ────────────────────────────────────────────────────────────────

export interface Equipment {
  id: string;
  name: string;
  location: string;
  available: number;
  total: number;
}

// ─── EventPackage ─────────────────────────────────────────────────────────────

export interface EventPackage {
  id: string;
  name: string;
  eventType: string;
  emoji: string;
  color: string;
  price: number;
  duration: string;       // e.g. '3 hours'
  maxGuests: number;
  includes: string[];
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  courtName: string;
  date: string;           // 'YYYY-MM-DD' or formatted
  timeSlots: string[];
  duration: number;       // hours
  category: string;
  totalAmount: number;
  status: BookingStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  guestCount?: number;
  notes?: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;      // ISO date string
  items?: CartItem[];
}

// ─── TimeSlot ─────────────────────────────────────────────────────────────────

export interface TimeSlot {
  id: string;
  label: string;          // e.g. '8:00 AM'
  available: boolean;
  price?: number;
}