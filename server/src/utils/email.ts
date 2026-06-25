import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_PORT === 465,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
      from: `"HabitFlow AI" <no-reply@habitflow.ai>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    logger.info(`Email sent: ${info.messageId}`);
    
    // For ethereal email testing
    if (env.EMAIL_HOST.includes('ethereal')) {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error('Could not send email');
  }
};
