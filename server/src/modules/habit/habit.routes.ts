import { Router } from 'express';
import { HabitController } from './habit.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import type { AuthRequest } from '../../middleware/auth.middleware';
import type { Response, NextFunction } from 'express';

const router = Router();

// All habit routes require authentication
router.use(requireAuth);

// Habit CRUD
router.post('/', (req, res, next) => HabitController.create(req as AuthRequest, res, next));
router.get('/', (req, res, next) => HabitController.list(req as AuthRequest, res, next));
router.get('/:id', (req, res, next) => HabitController.getOne(req as AuthRequest, res, next));
router.patch('/:id', (req, res, next) => HabitController.update(req as AuthRequest, res, next));
router.delete('/:id', (req, res, next) => HabitController.remove(req as AuthRequest, res, next));

// Status transitions
router.patch('/:id/archive', (req, res, next) => HabitController.archive(req as AuthRequest, res, next));
router.patch('/:id/pause', (req, res, next) => HabitController.pause(req as AuthRequest, res, next));
router.patch('/:id/resume', (req, res, next) => HabitController.resume(req as AuthRequest, res, next));

// Duplicate
router.post('/:id/duplicate', (req, res, next) => HabitController.duplicate(req as AuthRequest, res, next));

// Logging
router.post('/:id/log', (req, res, next) => HabitController.log(req as AuthRequest, res, next));
router.get('/:id/logs', (req, res, next) => HabitController.getLogs(req as AuthRequest, res, next));

export default router;
