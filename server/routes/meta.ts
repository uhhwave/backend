import { version } from '../utils/config';

export default defineEventHandler(event => {
  return {
    name: process.env.META_NAME || '',
    description: process.env.META_DESCRIPTION || '',
    version: version || '',
    hasCaptcha: process.env.CAPTCHA === 'true',
    captchaClientKey: process.env.CAPTCHA_CLIENT_KEY || '',
  };
});
