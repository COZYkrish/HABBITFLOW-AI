"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Habit = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// ── Schema ─────────────────────────────────────────────────────────────────
const RepeatScheduleSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['daily', 'weekdays', 'weekends', 'weekly', 'monthly', 'yearly', 'custom'],
        default: 'daily',
    },
    days: { type: [Number], default: [] },
    dayOfMonth: { type: Number },
}, { _id: false });
const ReminderSchema = new mongoose_1.Schema({
    enabled: { type: Boolean, default: false },
    time: { type: String },
    timezone: { type: String },
}, { _id: false });
const HabitStatisticsSchema = new mongoose_1.Schema({
    totalLogs: { type: Number, default: 0 },
    completedLogs: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedAt: { type: Date },
}, { _id: false });
const HabitSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    category: { type: String, required: true, default: 'general' },
    icon: { type: String, default: 'Circle' },
    color: { type: String, default: 'zinc' },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },
    goalType: {
        type: String,
        enum: ['boolean', 'duration', 'count'],
        default: 'boolean',
    },
    targetValue: { type: Number, default: 1, min: 1 },
    estimatedDuration: { type: Number, default: 15, min: 1 },
    repeatSchedule: { type: RepeatScheduleSchema, default: () => ({ type: 'daily', days: [] }) },
    reminder: { type: ReminderSchema, default: () => ({ enabled: false }) },
    notes: { type: String, trim: true, maxlength: 2000 },
    status: {
        type: String,
        enum: ['active', 'paused', 'archived', 'completed', 'deleted'],
        default: 'active',
        index: true,
    },
    isArchived: { type: Boolean, default: false },
    isPaused: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    statistics: { type: HabitStatisticsSchema, default: () => ({}) },
    deletedAt: { type: Date },
}, { timestamps: true });
// ── Compound indexes for performance ─────────────────────────────────────
HabitSchema.index({ userId: 1, status: 1 });
HabitSchema.index({ userId: 1, deletedAt: 1 });
HabitSchema.index({ userId: 1, isArchived: 1 });
HabitSchema.index({ userId: 1, sortOrder: 1 });
exports.Habit = mongoose_1.default.model('Habit', HabitSchema);
