<template>
	<div id="app">
		<transition name="fade" modeSlit="out-in">
			<router-view class="view" />
		</transition>
	</div>
</template>

<style lang='scss'>
	@import './style/App.scss';
	#app {
		width: 100%; // width: auto;
		padding: 1px;
	}
</style>

<script lang="ts">
	export default {
		name: 'App',
		created() {
			// do something after creating vue instance
		}
	}
</script>
