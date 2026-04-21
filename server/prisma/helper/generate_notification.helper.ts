import { pickRandom } from './random_generator.helper';
import { notificationMessages, notificationTitles, notificationTypes } from '../data/notification.data';

export const generateNotification = (user_id: number) => {
	return {
		user_id,
		type: pickRandom(notificationTypes),
		title: pickRandom(notificationTitles),
		message: pickRandom(notificationMessages),
		created_at: new Date(2023, 0, 1),
	};
};
