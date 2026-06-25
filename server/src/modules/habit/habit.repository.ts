import { Habit, IHabit } from './models/Habit';
import { HabitLog, IHabitLog } from './models/HabitLog';
import { Category, ICategory } from './models/Category';
import type { CreateHabitDTO, UpdateHabitDTO, LogHabitDTO, ListHabitsQuery } from './habit.types';

/**
 * HabitRepository — all database operations for the habit domain.
 * No business logic here; only data access.
 */
export class HabitRepository {
  // ── Habits ────────────────────────────────────────────────────────────────

  static async create(userId: string, data: CreateHabitDTO): Promise<IHabit> {
    const count = await Habit.countDocuments({ userId, status: { $ne: 'deleted' } });
    return Habit.create({ ...data, userId, sortOrder: count } as any);
  }

  static async findById(id: string, userId: string): Promise<IHabit | null> {
    return Habit.findOne({ _id: id, userId, deletedAt: null }).lean();
  }

  static async findAll(userId: string, query: ListHabitsQuery) {
    const {
      search, status, priority, category,
      isArchived, isPaused,
      sortBy = 'createdAt', order = 'desc',
      page = 1, limit = 20,
    } = query;

    const filter: any = {
      userId,
      deletedAt: null,
    };

    if (search) filter.title = { $regex: search, $options: 'i' };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (isArchived !== undefined) filter.isArchived = isArchived;
    if (isPaused !== undefined) filter.isPaused = isPaused;

    const sortDir = order === 'desc' ? -1 : 1;
    const sortField: any = sortBy === 'priority'
      ? { priority: sortDir }
      : { [sortBy]: sortDir };

    const [habits, total] = await Promise.all([
      Habit.find(filter)
        .sort(sortField)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Habit.countDocuments(filter),
    ]);

    return { habits, total, page, limit, hasMore: page * limit < total };
  }

  static async update(id: string, userId: string, data: UpdateHabitDTO): Promise<IHabit | null> {
    return Habit.findOneAndUpdate(
      { _id: id, userId, deletedAt: null },
      { $set: data },
      { returnDocument: 'after', new: true }
    ).lean();
  }

  static async softDelete(id: string, userId: string): Promise<IHabit | null> {
    return Habit.findOneAndUpdate(
      { _id: id, userId },
      { $set: { status: 'deleted', deletedAt: new Date() } },
      { returnDocument: 'after', new: true }
    ).lean();
  }

  static async setStatus(
    id: string,
    userId: string,
    updates: Partial<Pick<IHabit, 'status' | 'isArchived' | 'isPaused'>>
  ): Promise<IHabit | null> {
    return Habit.findOneAndUpdate(
      { _id: id, userId, deletedAt: null },
      { $set: updates },
      { returnDocument: 'after', new: true }
    ).lean();
  }

  static async duplicate(id: string, userId: string): Promise<IHabit | null> {
    const original = await Habit.findOne({ _id: id, userId, deletedAt: null }).lean();
    if (!original) return null;

    const { _id, createdAt, updatedAt, deletedAt, statistics, sortOrder, ...rest } = original as any;
    const count = await Habit.countDocuments({ userId, status: { $ne: 'deleted' } });

    return Habit.create({
      ...rest,
      title: `${original.title} (Copy)`,
      status: 'active',
      isArchived: false,
      isPaused: false,
      sortOrder: count,
    });
  }

  // ── HabitLogs ─────────────────────────────────────────────────────────────

  static async upsertLog(habitId: string, userId: string, data: LogHabitDTO): Promise<IHabitLog> {
    const result = await HabitLog.findOneAndUpdate(
      { habitId, userId, date: data.date },
      {
        $set: {
          completed: data.completed,
          completionTime: data.completed ? new Date() : undefined,
          value: data.value,
          notes: data.notes,
        },
      },
      { upsert: true, returnDocument: 'after', new: true }
    );
    return result!;
  }

  static async getLogs(
    habitId: string,
    userId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<IHabitLog[]> {
    const filter: any = { habitId, userId };
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }
    return HabitLog.find(filter).sort({ date: -1 }).lean();
  }

  /** Returns today's completed habit IDs for a user. Used by Dashboard. */
  static async getTodayCompletedIds(userId: string, date: string): Promise<string[]> {
    const logs = await HabitLog.find({ userId, date, completed: true }).select('habitId').lean();
    return logs.map((l) => String(l.habitId));
  }

  // ── Categories ────────────────────────────────────────────────────────────

  static async getCategories(userId: string): Promise<ICategory[]> {
    return Category.find({
      $or: [{ isSystem: true }, { userId }],
    })
      .sort({ isSystem: -1, name: 1 })
      .lean();
  }
}
