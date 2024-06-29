import { db } from '$lib/server/db';
import type { Priority } from '@prisma/client';

interface CreateTaskData {
	title: string;
	description?: string;
	priority: Priority;
	workspaceId: string;
	dueDate?: string;
	assignedUsersId: string[];
	createdById: string;
}
export function create(data: CreateTaskData) {
	return db.task.create({
		data: {
			title: data.title,
			description: data.description,
			createdBy: {
				connect: {
					id: data.createdById
				}
			},
			priority: data.priority,
			dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
			assignedUsers: {
				connect: data.assignedUsersId.map((id) => {
					return {
						id
					};
				})
			},
			done: false,
			workspace: {
				connect: {
					id: data.workspaceId
				}
			}
		}
	});
}
