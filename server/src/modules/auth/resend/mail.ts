import { Resend } from 'resend';
import { envConfig } from '@/config/env.config';

export const resend = new Resend(envConfig.resend);
