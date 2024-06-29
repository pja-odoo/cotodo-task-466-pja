import { router } from '.';
import { workspaceRoute } from '$lib/server/trpc/routes/workspace';

export const trpcRouter = router({
	workspace: workspaceRoute
});

export type TrpcRouter = typeof trpcRouter;
