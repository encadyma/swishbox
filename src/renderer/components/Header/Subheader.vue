<template>
	<div id="app-subheader">
		<div class="app-subheader-title-main">Swishbox</div>
	</div>
</template>
<style lang="scss">
#app-subheader {
	background-color: #333;
	color: #fff;
	cursor: default;
	display: flex;
	position: fixed;
	width: 100%;
	height: 30px;
	font-size: 14px;
	max-height: 30px;
	justify-content: space-between;
	-webkit-app-region: drag;
	z-index: 9999;
	transition: 150ms ease;

	.app-subheader-title-main {
		padding: 6px 16px;
	}

	&:active {
		background-color: #2C2C2C;
	}
}
</style>
<script>
export default {

};
</script>
