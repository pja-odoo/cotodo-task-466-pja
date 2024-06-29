import { router } from '.';
import { workspaceRoute } from '$lib/server/trpc/routes/workspace';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const trpcRouter = router({
	workspace: workspaceRoute
});

export type TrpcRouter = typeof trpcRouter;

export type RouterInput = inferRouterInputs<TrpcRouter>;
export type RouterOutput = inferRouterOutputs<TrpcRouter>;
