import { writable } from 'svelte/store';
import { Priority } from '@prisma/client';

interface Workspace {
	name: string;
	id: string;

	tasks: {
		title: string;
		description: string;
		priority: Priority;
		assignedUsers: {
			name: string;
			id: string;
			email: string;
			avatar: string;
		}[];
		done: boolean;
		dueDate: Date;
	}[];

	onlineUsers: {
		avatar: string;
		name: string;
	}[];

	updatedAt: Date;
	createdAt: Date;
}

export const currentWorkspace = writable<Workspace | null>(null);
