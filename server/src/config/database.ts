import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Implements retry logic and robust error handling.
 */
export const connectDB = async (): Promise<void> => {
  if (!env.MONGO_URI) {
    logger.warn('MONGO_URI is not defined in the environment. Skipping database connection for Phase 1.');
    return;
  }

  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      logger.info(`Attempting to connect to MongoDB (Attempt ${retries + 1}/${maxRetries})...`);
      const conn = await mongoose.connect(env.MONGO_URI);
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      logger.error(`MongoDB Connection Error: ${(error as Error).message}`);
      if (retries >= maxRetries) {
        logger.error('Max retries reached. Exiting application.');
        process.exit(1);
      }
      // Wait for 5 seconds before retrying
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

/**
 * Handle graceful shutdown
 */
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed due to application termination');
    process.exit(0);
  }
});
