import mongoose from 'mongoose';
import { Habit } from './src/modules/habit/models/Habit';

mongoose.connect('mongodb://127.0.0.1:27017/habitflow').then(async () => {
  try {
    await Habit.create({
      userId: new mongoose.Types.ObjectId(),
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
      repeatSchedule: {type: 'daily', days: []},
      reminder: {enabled: false}
    });
    console.log('success');
  } catch(e) {
    console.error('MONGO_ERROR:', e);
  }
  process.exit(0);
});
