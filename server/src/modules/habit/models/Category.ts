import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Category — supports system defaults and user-created categories.
 * userId === null means it's a system-wide category available to all users.
 */
export interface ICategory extends Document {
  userId?: Types.ObjectId | null;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: 'Tag' },
    color: { type: String, default: 'zinc' },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CategorySchema.index({ userId: 1, name: 1 }, { unique: true, sparse: true });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);

// ── System category seed data ──────────────────────────────────────────────

export const SYSTEM_CATEGORIES = [
  { name: 'Fitness',     icon: 'Dumbbell',   color: 'zinc'   },
  { name: 'Reading',     icon: 'BookOpen',    color: 'stone'  },
  { name: 'Coding',      icon: 'Code2',       color: 'slate'  },
  { name: 'Meditation',  icon: 'Sparkles',    color: 'neutral'},
  { name: 'Health',      icon: 'Heart',       color: 'zinc'   },
  { name: 'Study',       icon: 'GraduationCap', color: 'stone'},
  { name: 'Work',        icon: 'Briefcase',   color: 'slate'  },
  { name: 'Finance',     icon: 'TrendingUp',  color: 'zinc'   },
  { name: 'Nutrition',   icon: 'Apple',       color: 'neutral'},
  { name: 'Creativity',  icon: 'Palette',     color: 'stone'  },
  { name: 'Learning',    icon: 'Brain',       color: 'slate'  },
  { name: 'Mindfulness', icon: 'Wind',        color: 'zinc'   },
  { name: 'Social',      icon: 'Users',       color: 'neutral'},
  { name: 'Sleep',       icon: 'Moon',        color: 'slate'  },
  { name: 'General',     icon: 'Circle',      color: 'zinc'   },
];

/**
 * Seeds the default system categories into the database.
 * Safe to call on every server startup — uses upsert to avoid duplicates.
 */
export const seedSystemCategories = async (): Promise<void> => {
  const ops = SYSTEM_CATEGORIES.map((cat) => ({
    updateOne: {
      filter: { name: cat.name, isSystem: true, userId: null },
      update: { $setOnInsert: { ...cat, isSystem: true, userId: null } },
      upsert: true,
    },
  }));
  await Category.bulkWrite(ops);
};
