import app from './app';
import { env } from './config/env';
import { connectDB } from './config/database';
import { logger } from './config/logger';
import { seedSystemCategories } from './modules/habit/models/Category';

const startServer = async () => {
  try {
    await connectDB();
    await seedSystemCategories();
    logger.info('System categories seeded');

    app.listen(env.PORT, () => {
      logger.info(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
