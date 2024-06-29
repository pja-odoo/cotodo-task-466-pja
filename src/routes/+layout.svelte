<script>
	import '$lib/styles/global.css';

	import DefaultLayout from '$layouts/default.svelte';
	import AppLayout from '$layouts/app.svelte';
</script>

<DefaultLayout>
	<AppLayout>
		<slot />
	</AppLayout>
</DefaultLayout>

<style></style>
