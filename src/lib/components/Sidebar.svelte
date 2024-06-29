<script lang="ts">
	import type { RouterOutput } from '$lib/server/trpc/router';
	import { trpc } from '$lib/use/trpc';
	import { onMount } from 'svelte';
	import Button from '$components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import { ICONS } from '$lib/const/ui';
	import LogoSVG from '$lib/assets/logo.svelte';
	import { ROUTES } from '$lib/const/routes';

	let workspaces: NonNullable<RouterOutput['workspace']['getUserWorkspaces']['data']> = [];

	const refetchWorkspaces = async () => {
		const workspacesResponse = await trpc().workspace.getUserWorkspaces.query();

		if (workspacesResponse.error && workspacesResponse.data !== null) {
			return false;
		}

		workspaces = workspacesResponse.data!;

		return true;
	};

	async function createNewWorkspace() {
		const name = prompt('Enter Workspace name');

		if (!name) return;

		const createResponse = await trpc().workspace.create.mutate({
			name: name
		});

		refetchWorkspaces();
	}

	async function deleteWorkspace(id: string) {
		const response = await trpc().workspace.delete.mutate({
			id
		});

		console.log(response);

		refetchWorkspaces();
	}

	onMount(() => {
		refetchWorkspaces();
	});
</script>

<div class="sidebar">
	<div class="main-header">
		<a href={ROUTES.APP.pathname} class="app-title">
			<LogoSVG />
			<h1>CoTodo</h1>
		</a>
	</div>

	<div class="my-6"></div>

	<div class="header">
		<h1>Workspaces</h1>
		<Button on:click={createNewWorkspace} variant="secondary" size="sm" class="p-2">
			<Icon icon={ICONS.PLUS} font-size={22} />
		</Button>
	</div>

	<hr class="my-3" />

	<div class="workspace-list">
		{#if workspaces.length > 0}
			{#each workspaces as workspace}
				<a href={`/w/${workspace.id}`} class="workspace-item group">
					{workspace.name}

					<div class="absolute right-4 top-1/2 hidden -translate-y-1/2 group-hover:flex">
						<Button
							on:click={() => deleteWorkspace(workspace.id)}
							variant="destructive"
							class="p-2 text-lg"
						>
							<Icon icon={ICONS.DELETE} />
						</Button>
					</div>
				</a>
			{/each}
		{:else}
			<div class="none-found">
				<p>You do not have any workspaces yet!</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.sidebar {
		min-width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;

		padding: theme('padding.6') theme('padding.8');

		& .main-header {
			& .app-title {
				display: flex;
				gap: theme('gap.4');
				align-items: center;

				& h1 {
					font-size: theme('fontSize.2xl');
					font-weight: theme('fontWeight.semibold');
				}
			}
		}

		& .header {
			display: flex;
			justify-content: space-between;
			padding: 0 theme('padding.4');

			& h1 {
				font-size: theme('fontSize.xl');
				font-weight: theme('fontWeight.semibold');
			}
		}

		& .workspace-list {
			display: flex;
			flex-direction: column;

			& .none-found {
				padding: theme('padding.4') 0;
				color: theme('colors.muted.foreground');
				text-align: center;
			}

			& .workspace-item {
				width: 100%;
				height: fit-content;

				position: relative;

				padding: theme('padding.4') theme('padding.4');
				cursor: pointer;

				border-radius: theme('borderRadius.md');

				&:hover {
					background-color: theme('backgroundColor.secondary.DEFAULT / 20%');
				}
			}
		}
	}
</style>
