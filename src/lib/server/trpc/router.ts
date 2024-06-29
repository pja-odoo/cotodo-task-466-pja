import { router } from '.';
import { workspaceRoute } from '$lib/server/trpc/routes/workspace';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { taskRoute } from './routes/task';

export const trpcRouter = router({
	workspace: workspaceRoute,
	task: taskRoute
});

export type TrpcRouter = typeof trpcRouter;

export type RouterInput = inferRouterInputs<TrpcRouter>;
export type RouterOutput = inferRouterOutputs<TrpcRouter>;
