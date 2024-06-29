<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let message = '';
</script>

<Tooltip.Root>
	<Tooltip.Trigger><slot /></Tooltip.Trigger>
	<Tooltip.Content>
		<p class="text-center">{message}</p>
	</Tooltip.Content>
</Tooltip.Root>
