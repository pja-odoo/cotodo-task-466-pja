<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Icon from '@iconify/svelte';
	import { ICONS } from '$lib/const/ui';
	import { Button } from '$lib/components/ui/button';
</script>

<Sheet.Root>
	<Sheet.Trigger><slot /></Sheet.Trigger>
	<Sheet.Content class="flex flex-col">
		<Sheet.Header>
			<Sheet.Title>Comments</Sheet.Title>
		</Sheet.Header>

		<div class="flex flex-grow flex-col">No Comments Yet</div>
		<div class="flex items-end gap-4">
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Input type="text" id="comment" placeholder="Type Comment" />
			</div>
			<Button class=""><Icon icon={ICONS.SEND} /></Button>
		</div>
	</Sheet.Content>
</Sheet.Root>
