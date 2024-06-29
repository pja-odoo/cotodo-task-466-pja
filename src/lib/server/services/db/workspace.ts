import { db } from '$lib/server/db';
import type { Workspace } from '@prisma/client';

interface CreateWorkspaceData {
	name: string;
	userId: string;
}
export function createWorkspace(data: CreateWorkspaceData) {
	return db.workspace.create({
		data: {
			name: data.name,
			owner: {
				connect: {
					id: data.userId
				}
			}
		}
	});
}

interface UpdateWorkspaceData {
	id: string;
	values: Partial<Workspace>;
}
export function updateWorkspace(data: UpdateWorkspaceData) {
	return db.workspace.update({
		where: {
			id: data.id
		},
		data: {
			...data.values
		}
	});
}

interface ShareWorkspaceData {
	id: string;
	userId: string;
	canEdit: boolean;
}
export function shareWorkspace(data: ShareWorkspaceData) {
	return db.sharedWorkspace.create({
		data: {
			workspace: {
				connect: {
					id: data.id
				}
			},
			user: {
				connect: {
					id: data.userId
				}
			},
			canEdit: data.canEdit
		}
	});
}
