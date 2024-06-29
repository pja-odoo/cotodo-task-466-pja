import { db } from '$lib/server/db';
import { dbService } from '$lib/server/services/db';
import { tryCatch } from '$lib/utils/tryCatch';
import { privateProcedure, publicProcedure, router } from '..';
import { z } from 'zod';

export const workspaceRoute = router({
	create: privateProcedure
		.input(
			z.object({
				name: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const [data, error] = await tryCatch(async () => {
				return await dbService.workspace.createWorkspace({
					name: input.name,
					userId: ctx.user.id!
				});
			});

			if (error) {
				return {
					error: true,
					code: 'DATABASE_ERROR',
					message: 'Failed to create workspace'
				};
			}

			return {
				error: false,
				code: 'DONE',
				message: 'Workspace created',
				data: {
					id: data.id,
					name: data.name
				}
			};
		}),

	update: privateProcedure
		.input(
			z.object({
				id: z.string(),
				values: z.object({
					name: z.string().optional()
				})
			})
		)
		.mutation(async ({ ctx, input }) => {
			const [data, error] = await tryCatch(() => {
				return dbService.workspace.updateWorkspace({
					id: input.id,
					values: input.values
				});
			});

			if (error) {
				return {
					error: true,
					code: 'DATABASE_ERROR',
					message: 'Failed to create workspace'
				};
			}

			return {
				error: false,
				code: 'DONE',
				message: 'Workspace updated',
				data: {
					id: data.id,
					name: data.name
				}
			};
		}),

	delete: privateProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const [data, error] = await tryCatch(async () => {
				return await db.workspace.delete({
					where: {
						id: input.id
					}
				});
			});

			console.log(data);

			if (error) {
				return {
					error: true,
					code: 'DATABASE_ERROR',
					message: 'Failed to delete workspace',
					data: null
				};
			}

			return {
				error: false,
				code: 'DONE',
				message: 'Workspace deleted'
			};
		}),

	getUserWorkspaces: privateProcedure.query(async ({ ctx, input }) => {
		let [data, error] = await tryCatch(async () => {
			return await db.workspace.findMany({
				where: {
					ownerId: ctx.user.id!
				},
				include: {
					tasks: {
						include: {
							assignedUsers: {
								select: {
									email: true,
									name: true,
									avatar: true,
									id: true
								}
							}
						}
					}
				}
			});
		});

		if (error) {
			return {
				error: true,
				code: 'DATABASE_ERROR',
				message: 'Failed to fetch',
				data: null
			};
		}

		const [sharedWorkspace, sharedWorkspaceFetchError] = await tryCatch(async () => {
			const sharedWorkspaces = await db.sharedWorkspace.findMany({
				where: {
					user: {
						id: ctx.user.id
					}
				},
				include: {
					workspace: {
						include: {
							tasks: {
								include: {
									assignedUsers: {
										select: {
											email: true,
											name: true,
											avatar: true,
											id: true
										}
									}
								}
							}
						}
					}
				}
			});

			return sharedWorkspaces.map((share) => share.workspace);
		});

		if (sharedWorkspace) {
			data?.push(...sharedWorkspace);
		}

		return {
			error: false,
			code: 'DONE',
			message: 'Workspaces fetched',
			data: data
		};
	}),

	fetch: privateProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			let [data, error] = await tryCatch(async () => {
				return await db.workspace.findFirst({
					where: {
						OR: [
							{
								id: input.id,
								ownerId: ctx.user.id!
							},
							{
								sharedWorkspaces: {
									some: {
										workspace: {
											id: input.id
										},
										user: {
											id: ctx.user.id
										}
									}
								}
							}
						]
					},
					include: {
						tasks: {
							include: {
								assignedUsers: {
									select: {
										email: true,
										name: true,
										avatar: true,
										id: true
									}
								}
							}
						},
						sharedWorkspaces: {
							include: {
								user: true
							}
						},
						owner: {
							select: {
								id: true,
								avatar: true,
								name: true
							}
						}
					}
				});
			});

			if (error) {
				return {
					error: true,
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch',
					data: null
				};
			}

			if (!data) {
				return {
					error: true,
					code: 'NOT_FOUND',
					message: 'Workspace not found',
					data: null
				};
			}

			if (data.ownerId !== ctx.user.id) {
				data.tasks = data.tasks.filter((task) => {
					return task.assignedUsers.find((user) => user.id === ctx.user.id);
				});
			}

			return {
				error: false,
				code: 'DONE',
				message: 'Workspace fetched',
				data: data
			};
		}),

	share: privateProcedure
		.input(
			z.object({
				email: z.string(),
				workspaceId: z.string(),
				canEdit: z.boolean().default(false)
			})
		)
		.mutation(async ({ ctx, input }) => {
			let [sharedUser, sharedUserFetchError] = await tryCatch(async () => {
				return await dbService.user.getUserByEmail(input.email);
			});

			if (sharedUserFetchError) {
				return {
					error: true,
					code: 'DATABASE_ERROR',
					message: 'Something went wrong',
					data: null
				};
			}

			if (!sharedUser) {
				return {
					error: true,
					code: 'BAD_INPUT',
					message: 'User not found',
					data: null
				};
			}

			const [sharedUsers, sharedUsersError] = await tryCatch(async () => {
				return await dbService.workspace.getSharedUsers({
					id: input.workspaceId
				});
			});

			if (sharedUsersError) {
				return {
					error: true,
					code: 'DATABASE_ERROR',
					message: 'Something went wrong',
					data: null
				};
			}

			if (sharedUsers?.find((share) => share.userId === sharedUser.id)) {
				return {
					error: true,
					code: 'BAD_INPUT',
					message: 'User has already been added',
					data: null
				};
			}

			let [sharedWorkspace, sharedWorkspaceError] = await tryCatch(async () => {
				return await dbService.workspace.shareWorkspace({
					id: input.workspaceId,
					userId: sharedUser.id,
					canEdit: input.canEdit
				});
			});

			if (sharedWorkspaceError || !sharedWorkspace) {
				return {
					error: true,
					code: 'DATABASE_ERORR',
					message: 'Something went wrong',
					data: null
				};
			}

			return {
				error: false,
				code: 'DONE',
				message: 'Access granted',
				data: {
					id: sharedWorkspace.id
				}
			};
		}),

	getSharedUsers: privateProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			let [data, error] = await tryCatch(async () => {
				return await db.workspace.findFirst({
					where: {
						id: input.id
					},
					select: {
						sharedWorkspaces: {
							include: {
								user: true
							}
						}
					}
				});
			});

			if (error || !data) {
				return {
					error: true,
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch',
					data: null
				};
			}

			return {
				error: false,
				code: 'DONE',
				message: 'Users fetched',
				data: data.sharedWorkspaces
			};
		})
});
