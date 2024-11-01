<script lang="ts">
	import { enhance } from '$app/forms';
	import { v4 as uuidv4 } from 'uuid';

	let trackName = '';
	let author = '';
	let url = '';
	let isMusic = false;
	let currentTag = '';
	let tags: string[] = [];

	let outputFileName = '';
	$: outputFileName = trackName.toLowerCase().replaceAll(' ', '-');

	let randomId = uuidv4();
	$: {
		outputFileName;
		randomId = uuidv4();
	}

	let inputFile = '';

	const addTag = () => {
		if (currentTag.length === 0) return;
		tags = [...tags, currentTag];
		currentTag = '';
	};

	const removeTag = (tagToRemove: string) => {
		tags = [...tags.filter((tag) => tag !== tagToRemove)];
	};
	const removeAllTags = () => {
		tags = [];
	};

	$: tagsString = [...(isMusic ? ['music'] : []), ...tags].map((tag) => `"${tag}"`).join(', ');

	const copyEntry = () => {
		const element = document.querySelector('.output code');
		if (element === null) {
			console.error('Unable to find output element to copy its contents.');
			return;
		}
		// Select the text contents inside the output element.
		var range = document.createRange();
		range.selectNodeContents(element);
		// Copy it to the clipboard.
		navigator.clipboard.writeText(range.toString());
	};
</script>

<div class="add-track-container">
	<h2>Add a track</h2>
	<div class="two-column">
		<!-- Override default form submission behaviour with use:enhance to avoid
		 	resetting the form after clicking submit. -->
		<form
			method="POST"
			class="form-rows"
			enctype="multipart/form-data"
			use:enhance={() => () => {}}
		>
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
								<button type="button" on:click={() => removeTag(tag)}>Remove</button>
							</li>
						{/each}
					</ul>
					<button type="button" on:click={removeAllTags} class="remove-all-tags">Remove all</button>
				</div>
			</div>

			<div class="form-row">
				<label for="outputFileName">Output file name</label>
				<input name="outputFileName" bind:value={outputFileName} />
			</div>

			<div class="form-row">
				<label for="inputFile">File</label>
				<div class="column">
					<input type="file" name="inputFile" bind:value={inputFile} accept="audio/*" />
					<button type="submit" disabled={inputFile === '' || outputFileName === ''}
						>Convert to .mp3 and .webm
					</button>
				</div>
			</div>
		</form>

		<pre class="output">
      <code>
,
"{randomId}": {'{'}
	"name": "{trackName}",
	"source": {'{'}
		"author": "{author}",
		"urls": [ "{url}" ]
	{'}'},
	"tags": [ {tagsString} ],
	"fileName": "{outputFileName}",
	"type": "LOOP"
{'}'}
      </code>
  </pre>
	</div>

	<div class="instructions">
		<ol>
			<li>
				Upload the .mp3 and .webm files from the <code>output</code>
				directory to <code>https://console.cloud.google.com/</code>
			</li>
			<li>
				<button type="button" class="button-padding" on:click={copyEntry}>Copy</button> the JSON list
				entry above.
			</li>
			<li>Navigate to <code>turbo-bard/database/tracks.json</code> and paste it.</li>
			<li>
				<p>From <code>turbo-bard/database</code>, run</p>
				<code
					>firestore-import -a turbo-bard-firebase-adminsdk-mnkgs-6b3c744dd4.json -b tracks.json -n
					tracks</code
				>
				<p>or check the README there for more info.</p>
			</li>
		</ol>
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

	.form-row button.remove-all-tags {
		width: 100%;
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

	.column {
		display: flex;
		flex-direction: column;
	}

	.column button {
		width: auto;
	}

	.output {
		padding: 0 2rem;
	}

	.output,
	.instructions code {
		background: var(--grey-2);
		border-radius: 3px;
		line-height: 1.75rem;
	}

	code {
		font-family: monospace;
	}

	.instructions {
		line-height: 1.75rem;
	}

	.instructions code,
	.button-padding {
		padding: 0 0.25rem;
		margin: 0 0.25rem;
	}

	ol li {
		display: list-item;
	}
</style>
