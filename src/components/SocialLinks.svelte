<script>
	import GitHub from '@/assets/socialLinks/github.svg';
	import LinkedIn from '@/assets/socialLinks/linkedin.svg';
</script>

<style>
	div {
		display: flex;
		align-items: center;

	}

	ul {
		margin: 0;
		padding: 0;
		display: flex;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: inline-block;
	}

	a {
		text-decoration: none;
		margin-right: 10px;
		width: 25px;
		height: 100%;
		fill: white;
		display: flex;
	}

	a :global(svg) {
		width: 100%;
	}
</style>

<div>
	<ul>
		<li><a href='.'>{@html GitHub}</a></li>
		<li><a href='.'>{@html LinkedIn}</a></li>
	</ul>
</div>