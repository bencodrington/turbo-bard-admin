<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	let trackName = '';
	let author = '';
	let url = '';
	let isMusic = false;
	let currentTag = '';
	let tags: string[] = [];
	let fileNameOverride = '';
	// TODO: file upload

	const addTag = () => {
		if (currentTag.length === 0) return;
		tags = [...tags, currentTag];
		currentTag = '';
	};

	const removeTag = (tagToRemove: string) => {
		tags = [...tags.filter((tag) => tag !== tagToRemove)];
	};

	$: tagsString = [...(isMusic ? ['music'] : []), ...tags].map((tag) => `"${tag}"`).join(', ');

	$: defaultFileName = trackName.toLowerCase().replaceAll(' ', '-');
</script>

<div class="add-track-container">
	<h2>Add a track</h2>
	<div class="two-column">
		<div class="form-rows">
			<div class="form-row">
				<label for="trackName">Name</label>
				<input name="trackName" bind:value={trackName} />
			</div>
			<p>Source</p>
			<div class="form-row">
				<label for="author">Author</label>
				<input name="author" bind:value={author} />
			</div>
			<div class="form-row">
				<label for="url">URL</label>
				<input name="url" bind:value={url} />
			</div>
			<div class="form-row">
				<label for="isMusic">Is music</label>
				<input type="checkbox" name="isMusic" bind:checked={isMusic} />
			</div>
			<div class="form-row">
				<label for="fileNameOverride">File name</label>
				<input
					name="fileNameOverride"
					bind:value={fileNameOverride}
					placeholder={defaultFileName}
				/>
			</div>
			<!-- TODO: -->
			<!-- <div class="form-row">
			<label for="isLoop">Is loop</label>
			<input type="checkbox" name="isLoop" bind:checked={isLoop} />
		</div> -->
			<div class="form-row">
				<label for="addTag">Tags</label>
				<div class="tags-section">
					<form on:submit|preventDefault={addTag}>
						<input name="addTag" bind:value={currentTag} />
						<button type="submit" disabled={currentTag.length === 0}>Add tag</button>
					</form>
					<ul>
						{#each tags as tag}
							<li>
								<span>{tag}</span>
								<button on:click={() => removeTag(tag)}>Remove</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<pre class="output">
      <code>
        ,
        "{uuidv4()}": {'{'}
          "name": "{trackName}",
          "source": {'{'}
            "author": "{author}",
            "urls": [ "{url}" ]
          {'}'},
          "tags": [ {tagsString} ],
          "fileName": "{fileNameOverride !== '' ? fileNameOverride : defaultFileName}",
          "type": "LOOP"
        {'}'}
      </code>
  </pre>
	</div>
</div>

<style>
	.add-track-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.two-column {
		display: flex;
	}

	.form-rows,
	.output {
		flex: 1;
		min-width: 0;
	}

	.form-rows {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.form-row {
		display: flex;
		gap: 0.5rem;
		align-items: baseline;
	}
	.form-row label {
		width: 5rem;
	}
	.form-row input,
	.form-row button {
		height: 1.5rem;
	}
	.form-row button {
		padding: 0 0.5rem;
		width: 5rem;
	}
	.form-row input[type='checkbox'] {
		height: auto;
	}

	ul {
		margin-top: 0.5rem;
	}
	li {
		margin-top: 0.5rem;
		display: flex;
	}
	li span {
		flex: 1;
		min-width: 0;
	}

	pre {
		background: var(--grey-2);
		border-radius: 3px;
		line-height: 1.75rem;
	}

	pre code {
		font-family: monospace;
	}
</style>
