import mongoose from 'mongoose';
import { env, isDev } from './env';
import { logger } from './logger';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Implements retry logic and robust error handling.
 */
export const connectDB = async (): Promise<void> => {
  const MAX_RETRIES = 5;
  let retries = 0;

  let uri = env.MONGO_URI;

  if (isDev && (!uri || uri.includes('<username>'))) {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    logger.info(`Using in-memory MongoDB for local development: ${uri}`);
  }

  while (retries < MAX_RETRIES) {
    try {
      logger.info(`Attempting to connect to MongoDB (Attempt ${retries + 1}/${MAX_RETRIES})...`);
      
      await mongoose.connect(uri);
      
      logger.info('MongoDB connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB connection error: ${err}`);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      return;
    } catch (error: any) {
      retries += 1;
      logger.error(`MongoDB Connection Error: ${error.message}`);
      
      if (retries === MAX_RETRIES) {
        logger.error('Failed to connect to MongoDB after maximum retries. Exiting...');
        process.exit(1);
      }
      
      // Wait 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
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
