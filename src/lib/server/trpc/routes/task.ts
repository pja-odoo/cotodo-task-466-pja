import { db } from '$lib/server/db';
import { dbService } from '$lib/server/services/db';
import { tryCatch } from '$lib/utils/tryCatch';
import { Priority } from '@prisma/client';
import { privateProcedure, publicProcedure, router } from '..';
import { z } from 'zod';

export const taskRoute = router({
	create: privateProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string().optional(),
				priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
				assignedUsersId: z.array(z.string()),
				dueDate: z.string().optional(),
				workspaceId: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const [data, error] = await tryCatch(async () => {
				return await dbService.task.create({
					assignedUsersId: input.assignedUsersId,
					createdById: ctx.user.id!,
					dueDate: input.dueDate,
					priority:
						input.priority == 'LOW'
							? Priority.LOW
							: input.priority == 'MEDIUM'
								? Priority.MEDIUM
								: Priority.HIGH,
					title: input.title,
					workspaceId: input.workspaceId,
					description: input.description
				});
			});

			if (error) {
				return {
					error: true,
					code: 'DATABASE_ERROR',
					message: 'Failed to create task'
				};
			}

			return {
				error: false,
				code: 'DONE',
				message: 'Task created',
				data: {
					id: data.id
				}
			};
		})
});
