<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import Icon from '@iconify/svelte';
	import { ICONS } from '$lib/const/ui';
	import { trpc } from '$lib/use/trpc';
	import { currentWorkspace } from '$lib/stores/global';
	import SimpleTooltip from './SimpleTooltip.svelte';
	import { onMount } from 'svelte';
	import * as Avatar from '$components/ui/avatar';

	let error: string | null = null;

	let inputEmail = '';
	let canEdit = false;
	let shareLoading = false;

	let sharedUsers: {
		name: string;
		avatar: string;
		canEdit: boolean;
	}[] = [];

	async function fetchSharedUsers() {
		const sharedUsersResponse = await trpc().workspace.getSharedUsers.query({
			id: $currentWorkspace!.id
		});

		if (sharedUsersResponse.error) {
			error = sharedUsersResponse.message;
		}

		$currentWorkspace!.sharedUsers = (sharedUsersResponse.data || []).map(({ user, canEdit }) => ({
			id: user.id,
			avatar: user.avatar!,
			canEdit: canEdit,
			email: user.email,
			name: user.name
		}));
	}

	async function shareWorkspace() {
		if (!inputEmail) return;

		shareLoading = true;

		const response = await trpc().workspace.share.mutate({
			email: inputEmail,
			workspaceId: $currentWorkspace!.id,
			canEdit
		});

		shareLoading = false;

		if (response.error) {
			error = response.message;
		}

		inputEmail = '';
		canEdit = false;

		fetchSharedUsers();
	}

	onMount(() => {
		fetchSharedUsers();
	});

	$: disableShare = inputEmail === '' || shareLoading;
</script>

<Dialog.Root>
	<Dialog.Trigger><slot /></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Share workspace</Dialog.Title>
		</Dialog.Header>

		<div class="my-4 flex flex-col gap-6">
			{#if error}
				<Alert.Root variant="destructive">
					<Icon icon={ICONS.INFO} />
					<Alert.Title>OOPS!</Alert.Title>
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{/if}

			<div class="flex items-end gap-2">
				<div class="flex w-full flex-col gap-1.5">
					<Label for="email">Email</Label>
					<Input
						bind:value={inputEmail}
						type="email"
						id="email"
						placeholder="Email of the user you want to share the workspace with"
					/>
				</div>

				<SimpleTooltip
					message={canEdit
						? 'Can edit details of task'
						: 'Can only mark/unmark tasks as done assigned to them'}
				>
					<Button class="text-lg" on:click={() => (canEdit = !canEdit)}>
						{#if canEdit}
							<Icon icon={ICONS.PENCIL} />
						{:else}
							<Icon icon={ICONS.PENCIL_OFF} />
						{/if}
					</Button>
				</SimpleTooltip>

				<Button bind:disabled={disableShare} on:click={shareWorkspace}>Share</Button>
			</div>

			<div class="flex flex-col">
				<div class="my-2 text-lg font-semibold">Shared Users</div>
				{#if $currentWorkspace}
					{#each $currentWorkspace.sharedUsers as user}
						<div class="flex items-center gap-2 py-4">
							<Avatar.Root class="!h-8 !w-8">
								<Avatar.Image src={user.avatar} />
								<Avatar.Fallback>{user.name}</Avatar.Fallback>
							</Avatar.Root>
							<div class="flex flex-col justify-center">
								<p class="text-sm">{user.name}</p>
								<p class="text-xs text-muted-foreground">
									{canEdit
										? 'Can edit details of task'
										: 'Can only mark/unmark tasks as done assigned to them'}
								</p>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
