import { Router } from 'express';
import multer from 'multer';
import { ProfileController } from './profile.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validateRequest } from '../auth/auth.validator';
import { updateProfileSchema, updatePreferencesSchema, changePasswordSchema } from './profile.validator';

import path from 'path';

const router = Router();
const storage = multer.diskStorage({
  destination: 'public/uploads/avatars/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.use(requireAuth);

router.get('/', ProfileController.getProfile);
router.patch('/', validateRequest(updateProfileSchema), ProfileController.updateProfile);
router.patch('/preferences', validateRequest(updatePreferencesSchema), ProfileController.updatePreferences);
router.post('/avatar', upload.single('avatar'), ProfileController.uploadAvatar);
router.delete('/avatar', ProfileController.deleteAvatar);
router.patch('/security/password', validateRequest(changePasswordSchema), ProfileController.changePassword);
router.get('/sessions', ProfileController.getActiveSessions);
router.delete('/sessions/:id', ProfileController.revokeSession);
router.delete('/', ProfileController.deleteAccount);

export default router;
