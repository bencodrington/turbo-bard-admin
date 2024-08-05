<script lang="ts">
	import AddTrack from './AddTrack.svelte';
</script>

<div class="dashboard">
	<h1>TurboBard Admin Dashboard</h1>

	<AddTrack />
</div>

<style>
	.dashboard {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 4rem;
	}
</style>
