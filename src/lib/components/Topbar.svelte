<script>
	import Button from '$components/ui/button/button.svelte';
	import * as Avatar from '$components/ui/avatar';
	import { page } from '$app/stores';
	import UserProfileDropdown from '$components/UserProfileDropdown.svelte';

	const user = $page.data.user;
	$: fallbackAvatarName = user?.name[0] || 'User';
</script>

<div class="topbar">
	<div class="workspace-name">Workspace Name</div>
	<div class="online-users">hi</div>
	<div class="tail">
		<Button variant="default" size="sm">Share</Button>

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

		& .tail {
			display: flex;
			justify-content: center;
			align-items: center;

			gap: theme('gap.2');
		}
	}
</style>
