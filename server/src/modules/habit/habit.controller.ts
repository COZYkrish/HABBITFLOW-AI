import { Request, Response, NextFunction } from 'express';
import { HabitService } from './habit.service';
import {
  createHabitSchema,
  updateHabitSchema,
  logHabitSchema,
  listHabitsQuerySchema,
} from './habit.validator';
import type { AuthRequest } from '../../middleware/auth.middleware';

const userId = (req: AuthRequest) => req.user!.id;

export class HabitController {
  // POST /habits
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createHabitSchema.parse(req.body);
      const habit = await HabitService.createHabit(userId(req), data);
      res.status(201).json({ success: true, message: 'Habit created', data: habit });
    } catch (e) { next(e); }
  }

  // GET /habits
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = listHabitsQuerySchema.parse(req.query);
      const result = await HabitService.getHabits(userId(req), query);
      res.status(200).json({ success: true, message: 'Habits fetched', data: result });
    } catch (e) { next(e); }
  }

  // GET /habits/:id
  static async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const habit = await HabitService.getHabitById(userId(req), String(req.params.id));
      res.status(200).json({ success: true, message: 'Habit fetched', data: habit });
    } catch (e) { next(e); }
  }

  // PATCH /habits/:id
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateHabitSchema.parse(req.body);
      const habit = await HabitService.updateHabit(userId(req), String(req.params.id), data);
      res.status(200).json({ success: true, message: 'Habit updated', data: habit });
    } catch (e) { next(e); }
  }

  // DELETE /habits/:id
  static async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await HabitService.deleteHabit(userId(req), String(req.params.id));
      res.status(200).json({ success: true, message: 'Habit deleted', data: null });
    } catch (e) { next(e); }
  }

  // PATCH /habits/:id/archive
  static async archive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const habit = await HabitService.archiveHabit(userId(req), String(req.params.id));
      res.status(200).json({ success: true, message: 'Habit archive status toggled', data: habit });
    } catch (e) { next(e); }
  }

  // PATCH /habits/:id/pause
  static async pause(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const habit = await HabitService.pauseHabit(userId(req), String(req.params.id));
      res.status(200).json({ success: true, message: 'Habit paused', data: habit });
    } catch (e) { next(e); }
  }

  // PATCH /habits/:id/resume
  static async resume(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const habit = await HabitService.resumeHabit(userId(req), String(req.params.id));
      res.status(200).json({ success: true, message: 'Habit resumed', data: habit });
    } catch (e) { next(e); }
  }

  // POST /habits/:id/duplicate
  static async duplicate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const habit = await HabitService.duplicateHabit(userId(req), String(req.params.id));
      res.status(201).json({ success: true, message: 'Habit duplicated', data: habit });
    } catch (e) { next(e); }
  }

  // POST /habits/:id/log
  static async log(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = logHabitSchema.parse(req.body);
      const log = await HabitService.logHabit(userId(req), String(req.params.id), data);
      res.status(200).json({ success: true, message: 'Habit logged', data: log });
    } catch (e) { next(e); }
  }

  // GET /habits/:id/logs
  static async getLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { fromDate, toDate } = req.query as { fromDate?: string; toDate?: string };
      const logs = await HabitService.getHabitLogs(userId(req), String(req.params.id), fromDate, toDate);
      res.status(200).json({ success: true, message: 'Logs fetched', data: logs });
    } catch (e) { next(e); }
  }

  // GET /categories
  static async getCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const categories = await HabitService.getCategories(userId(req));
      res.status(200).json({ success: true, message: 'Categories fetched', data: categories });
    } catch (e) { next(e); }
  }
}
