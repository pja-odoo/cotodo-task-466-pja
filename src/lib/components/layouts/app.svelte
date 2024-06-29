<script>
	import Sidebar from '$components/Sidebar.svelte';
	import Topbar from '$components/Topbar.svelte';
</script>

<div class="wrapper">
	<Sidebar />
	<div class="main">
		<Topbar />

		<slot />
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: row;
		height: 100%;

		& .sidebar {
			width: 25%;
			min-width: 300px;
			height: 100%;
			background-color: theme('backgroundColor.primary.DEFAULT');
			color: theme('colors.primary.foreground');
		}

		& .main {
			width: 100%;
			height: 100%;

			display: flex;
			flex-direction: column;

			& .topbar {
				background-color: theme('backgroundColor.secondary.DEFAULT');
				color: theme('colors.secondary.foreground');
				width: 100%;
				height: 50px;
			}
		}
	}
</style>
