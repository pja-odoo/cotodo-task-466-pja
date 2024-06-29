import { writable } from 'svelte/store';
import { Priority } from '@prisma/client';

interface Workspace {
	name: string;
	id: string;

	tasks: {
		id: string;
		title: string;
		description?: string;
		priority: Priority;
		assignedUsers: {
			name: string;
			id: string;
			email: string;
			avatar: string;
		}[];
		done: boolean;
		dueDate?: Date;
	}[];

	onlineUsers: {
		avatar: string;
		name: string;
	}[];

	sharedUsers: {
		id: string;
		canEdit: boolean;
		name: string;
		email: string;
		avatar: string;
	}[];

	updatedAt: Date;
	createdAt: Date;

	owner: {
		id: string;
		name: string;
		avatar: string;
	};
}

export const currentWorkspace = writable<Workspace | null>(null);
