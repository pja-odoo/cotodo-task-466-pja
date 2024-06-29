<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
</script>

<Dialog.Root>
	<Dialog.Trigger><slot /></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Task</Dialog.Title>
		</Dialog.Header>

		<div class="my-4 flex flex-col gap-6">
			<div class="flex w-full flex-col gap-1.5">
				<Label for="title">Title</Label>
				<Input type="text" id="title" placeholder="Title" />
			</div>

			<div class="flex w-full flex-col gap-1.5">
				<Label for="description">Description</Label>
				<Input type="text" id="description" placeholder="Description" />
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
