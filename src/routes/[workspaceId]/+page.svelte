<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import CreateTaskDialog from '$lib/components/CreateTaskDialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ICONS } from '$lib/const/ui';
	import { currentWorkspace } from '$lib/stores/global';
	import { trpc } from '$lib/use/trpc';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	const { workspaceId } = $page.params;

	async function fetchWorkspace() {
		const response = await trpc().workspace.fetch.query({
			id: workspaceId
		});

		const data = response.data;

		if (!data) return;

		$currentWorkspace = {
			id: data.id,
			name: data.name,
			createdAt: new Date(data.createdAt),
			updatedAt: new Date(data.updatedAt),
			onlineUsers: [],
			tasks: data.tasks.map((task) => ({
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
</script>

<div class="wrapper">
	<CreateTaskDialog>
		<Button class="create-button" size="lg"><Icon font-size={40} icon={ICONS.PLUS} /></Button>
	</CreateTaskDialog>
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;

		position: relative;

		& .create-button {
			height: fit-content;
			border-radius: theme('borderRadius.full');

			padding: theme('padding.4');

			position: absolute;
			bottom: theme('size.10');
			right: theme('size.10');
		}
	}
</style>
