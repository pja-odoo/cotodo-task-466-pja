import { TRPCError, initTRPC, type inferAsyncReturnType } from '@trpc/server';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export type Context = inferAsyncReturnType<typeof createContext>;

/*
	what ever you return from this function will be available in `ctx` param in t.query function
*/
export async function createContext(event: RequestEvent) {
	return {
		db,
		event
	};
}

const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const privateProcedure = t.procedure.use(({ next, ctx }) => {
	const { event } = ctx;

	// if session or user does not exist then throw 401 error
	if (!event.locals.session || !event.locals.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED'
		});
	}

	return next();
});
