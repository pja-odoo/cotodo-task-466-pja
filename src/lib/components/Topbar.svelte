<script>
	import Button from '$components/ui/button/button.svelte';
	import * as Avatar from '$components/ui/avatar';
	import { page } from '$app/stores';
	import UserProfileDropdown from '$components/UserProfileDropdown.svelte';
	import { currentWorkspace } from '$lib/stores/global';
	import ShareWorkspace from './ShareWorkspace.svelte';

	const user = $page.data.user;
</script>

<div class="topbar">
	<div class="workspace-name">{$currentWorkspace?.name || ''}</div>
	<div class="online-users">
		{#each $currentWorkspace?.onlineUsers || [] as user}
			<Avatar.Root class="h-8 w-8">
				<Avatar.Image src={user.avatar} />
				<Avatar.Fallback>{user.name}</Avatar.Fallback>
			</Avatar.Root>
		{/each}
	</div>
	<div class="tail">
		{#if $currentWorkspace && $currentWorkspace.owner.id === user?.id}
			<ShareWorkspace>
				<Button variant="default" size="sm">Share</Button>
			</ShareWorkspace>
		{/if}

		<UserProfileDropdown />
	</div>
</div>

<style>
	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: theme('padding.2') theme('padding.4');
		gap: theme('gap.4');

		& .online-users {
			width: fit-content;

			display: flex;
			justify-content: center;
			align-items: center;

			gap: theme('gap.1');
		}

		& .tail {
			display: flex;
			justify-content: center;
			align-items: center;

			gap: theme('gap.2');
		}
	}
</style>
