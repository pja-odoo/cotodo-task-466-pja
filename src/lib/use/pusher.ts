import { PUBLIC_PUSHER_APP_CLUSTER, PUBLIC_PUSHER_APP_KEY } from '$env/static/public';
import Pusher from 'pusher-js';

export const pusherClient = new Pusher(PUBLIC_PUSHER_APP_KEY, {
	cluster: PUBLIC_PUSHER_APP_CLUSTER,
	enabledTransports: ['xhr_polling']
});
