<script lang="ts">
	import { goto, onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import CreateTaskDialog from '$lib/components/CreateTaskDialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ROUTES } from '$lib/const/routes';
	import { ICONS } from '$lib/const/ui';
	import { currentWorkspace, globalChannel } from '$lib/stores/global';
	import { trpc } from '$lib/use/trpc';
	import Icon from '@iconify/svelte';
	import { Priority } from '@prisma/client';
	import * as Avatar from '$components/ui/avatar';
	import { onMount } from 'svelte';
	import SimpleTooltip from '$lib/components/SimpleTooltip.svelte';
	import { pusherClient } from '$lib/use/pusher';
	import WorkspaceComments from '$lib/components/WorkspaceComments.svelte';

	const { workspaceId } = $page.params;

	async function fetchWorkspace() {
		const response = await trpc().workspace.fetch.query({
			id: workspaceId
		});

		if (response.code === 'NOT_FOUND') {
			goto(ROUTES.APP.pathname);
		}

		const data = response.data;

		if (!data) return;

		$currentWorkspace = {
			id: data.id,
			name: data.name,
			createdAt: new Date(data.createdAt),
			updatedAt: new Date(data.updatedAt),
			onlineUsers: [],
			tasks: data.tasks.map((task) => ({
				id: task.id,
				title: task.title,
				description: task.description || undefined,
				done: task.done,
				dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
				priority: task.priority,
				assignedUsers: task.assignedUsers.map((user) => {
					return {
						name: user.name,
						id: user.id,
						email: user.email,
						avatar: user.avatar!
					};
				})
			})),
			sharedUsers: data.sharedWorkspaces.map((share) => ({
				id: share.user.id,
				avatar: share.user.avatar!,
				canEdit: share.canEdit,
				email: share.user.email,
				name: share.user.name
			})),
			owner: {
				id: data.owner.id,
				avatar: data.owner.avatar!,
				name: data.owner.name
			}
		};
	}

	onNavigate((data) => {
		if (data.to?.route.id === '/') {
			$currentWorkspace = null;
			return;
		}

		fetchWorkspace();
	});

	onMount(() => {
		fetchWorkspace();
	});

	function initChannel() {
		const channel = pusherClient.subscribe(`${$currentWorkspace!.id}`);

		channel.bind('refresh', fetchWorkspace);

		$globalChannel = channel;
	}

	$: $currentWorkspace && !$globalChannel ? initChannel() : null;
</script>

<div class="wrapper">
	{#if $currentWorkspace}
		<div class="absolute bottom-10 right-10 flex gap-4">
			{#if $currentWorkspace}
				<WorkspaceComments>
					<Button class="h-fit w-fit rounded-full p-3 " size="lg"
						><Icon font-size={30} icon={ICONS.COMMENT} /></Button
					>
				</WorkspaceComments>
			{/if}
			{#if $currentWorkspace && $currentWorkspace.owner.id === $page.data.user?.id}
				<CreateTaskDialog on:create={fetchWorkspace}>
					<Button class="h-fit w-fit rounded-full p-3 " size="lg"
						><Icon font-size={30} icon={ICONS.PLUS} /></Button
					>
				</CreateTaskDialog>
			{/if}
		</div>
	{/if}
	{#if $currentWorkspace?.tasks.length === 0}
		<div class="w-full items-center justify-center px-5 py-10 text-center">
			<div>This workspace does not have any tasks yet!</div>
			<div>Add the task using + button</div>
		</div>
	{/if}
	<div class="grid grid-cols-3 gap-3 p-6">
		{#if $currentWorkspace && $currentWorkspace.tasks.length > 0}
			{#each $currentWorkspace.tasks as task}
				<div class="flex min-h-[150px] rounded border p-4">
					<div class="flex flex-grow flex-col items-start gap-4">
						<div class="flex items-center gap-2">
							<input type="checkbox" class="h-5 w-5" />
							<h1 class="font-semibold">{task.title}</h1>
						</div>

						<p class="text-sm text-muted-foreground">{task.description || ''}</p>
					</div>
					<div class="flex h-full min-w-fit flex-col items-end gap-2">
						<div
							class="w-[80px] rounded px-2 py-1 text-center text-xs {task.priority === Priority.LOW
								? 'bg-green-700 text-white'
								: task.priority === Priority.MEDIUM
									? 'bg-yellow-600 text-white'
									: 'bg-red-600 text-white'}"
						>
							{task.priority}
						</div>
						{#if task.dueDate}
							<div class="text-sm text-muted-foreground">
								By {task.dueDate.toLocaleDateString()}
							</div>
						{/if}
						{#if task.assignedUsers.length > 0}
							<div class="flex gap-1">
								{#each task.assignedUsers as user}
									<SimpleTooltip message={user.name}>
										<Avatar.Root class="!h-7 !w-7">
											<Avatar.Image src={user.avatar} />
											<Avatar.Fallback>{user.name}</Avatar.Fallback>
										</Avatar.Root>
									</SimpleTooltip>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;

		position: relative;
	}
</style>
