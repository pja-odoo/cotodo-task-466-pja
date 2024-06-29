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

	let error: string | null = null;

	let inputEmail = '';
	let canEdit = false;
	let shareLoading = true;

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
	}

	$: disableShare = shareLoading || inputEmail !== '';
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
						? 'Can Edit Task'
						: 'Can not edit task details (Only mark or unmark as done)'}
				>
					<Button on:click={() => (canEdit = !canEdit)}>
						{#if canEdit}
							<Icon icon={ICONS.PENCIL} />
						{:else}
							<Icon icon={ICONS.PENCIL_OFF} />
						{/if}
					</Button>
				</SimpleTooltip>

				<Button bind:disabled={disableShare} on:click={shareWorkspace}>Share</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
