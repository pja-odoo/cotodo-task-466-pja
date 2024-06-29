<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$components/ui/avatar';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { ROUTES } from '$lib/const/routes';
	import { ICONS } from '$lib/const/ui';

	const user = $page.data.user;
	$: fallbackAvatarName = user?.name[0] || 'U';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root class="!h-8 !w-8">
			<Avatar.Image src={user?.avatar} />
			<Avatar.Fallback>{fallbackAvatarName}</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item href={ROUTES.AUTH_LOGOUT.pathname} class="gap-1 text-red-600">
				<Icon icon={ICONS.LOGOUT} />
				<span>Log out</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
