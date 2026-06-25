"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Habit_1 = require("./src/modules/habit/models/Habit");
mongoose_1.default.connect('mongodb://127.0.0.1:27017/habitflow').then(async () => {
    try {
        await Habit_1.Habit.create({
            userId: new mongoose_1.default.Types.ObjectId(),
            title: 'Test Habit',
            category: 'General',
            goalType: 'duration',
            targetValue: 43,
            estimatedDuration: 15,
            priority: 'medium',
            status: 'active',
            isArchived: false,
            isPaused: false,
            sortOrder: 0,
            statistics: {},
            repeatSchedule: { type: 'daily', days: [] },
            reminder: { enabled: false }
        });
        console.log('success');
    }
    catch (e) {
        console.error('MONGO_ERROR:', e);
    }
    process.exit(0);
});
