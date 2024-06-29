<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import MultiSelect from 'svelte-multiselect';
	import { currentWorkspace } from '$lib/stores/global';
	import { ICONS } from '$lib/const/ui';
	import { Button } from '$components/ui/button';
	import Icon from '@iconify/svelte';
	import Switch from '$components/ui/switch/switch.svelte';
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { trpc } from '$lib/use/trpc';
	import { createEventDispatcher } from 'svelte';

	let taskTitle = '';
	let taskDescription = '';
	let taskPriority: Selected<'LOW' | 'MEDIUM' | 'HIGH'> = {
		value: 'MEDIUM',
		label: 'Medium'
	};
	let enableDueDate = false;
	let dueDate: string;
	let assignTo: string[] = [];

	let loading = false;
	export let dialogOpen = false;

	$: assignableUsers = $currentWorkspace?.sharedUsers.map((user) => user.name) || [];

	const dispatch = createEventDispatcher();

	async function createTask() {
		loading = true;

		const createResponse = await trpc().task.create.mutate({
			title: taskTitle,
			description: taskDescription,
			dueDate: dueDate,
			priority: taskPriority.value,
			assignedUsersId:
				assignTo.map(
					(name) => $currentWorkspace?.sharedUsers.find((user) => user.name === name)!.id!
				) || [],
			workspaceId: $currentWorkspace!.id
		});

		taskTitle = '';
		taskDescription = '';
		assignTo = [];
		dueDate = '';
		enableDueDate = false;
		dialogOpen = false;
		loading = false;

		dispatch('create');
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger><slot /></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Task</Dialog.Title>
		</Dialog.Header>

		<form on:submit|preventDefault={createTask} class="my-4 flex flex-col gap-6">
			<div class="flex w-full flex-col gap-1.5">
				<Label for="title">Title</Label>
				<Input bind:value={taskTitle} type="text" id="title" required placeholder="Title" />
			</div>

			<div class="flex w-full flex-col gap-1.5">
				<Label for="description">Description</Label>
				<Input
					bind:value={taskDescription}
					type="text"
					id="description"
					placeholder="Description"
				/>
			</div>

			<div class="flex w-full flex-col gap-1.5">
				<Label for="assignTo">Assign To</Label>
				<MultiSelect bind:selected={assignTo} options={assignableUsers} />
			</div>

			<div class="flex w-full flex-col gap-1.5">
				<Label for="assignTo">Priority</Label>
				<Select.Root bind:selected={taskPriority}>
					<Select.Trigger class="w-full">
						<Select.Value placeholder="Priority" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="LOW">Low</Select.Item>
						<Select.Item value="MEDIUM">Medium</Select.Item>
						<Select.Item value="HIGH">High</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex w-full flex-col gap-1.5">
				<Label for="dueDate">Due Date</Label>
				<Switch bind:checked={enableDueDate} />
				{#if enableDueDate}
					<input type="date" bind:value={dueDate} />
				{/if}
			</div>

			<div class="flex w-full justify-end">
				<Button bind:disabled={loading} type="submit" class="gap-2">
					{#if loading}
						<Icon icon={ICONS.SPINNER} font-size={24} />
					{:else}
						<Icon icon={ICONS.PLUS} font-size={24} />
					{/if}
					Create</Button
				>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
