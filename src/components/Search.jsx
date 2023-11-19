import { useState } from 'preact/hooks';

export default function Search({ posts }) {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState(posts);

	function handleOnSearch({ target }) {
		const { value } = target;
		const filteredResults = posts.filter((post) => {
			const { title = '', description = '', tags = [] } = post.data;
			return (
				title.toLowerCase().includes(value.toLowerCase()) ||
				description.toLowerCase().includes(value.toLowerCase()) ||
				tags.join('').toLowerCase().includes(value.toLowerCase())
			);
		});
		setQuery(value);
		setResults(filteredResults);
	}

	return (
		<>
			<label>Search</label>
			<div>
				<input type="text" value={query} onKeyUp={handleOnSearch} placeholder="Search posts" />
			</div>
			{query.length > 1 && (
				<p>
					Found {results.length} {results.length === 1 ? 'result' : 'results'} for '{query}'
				</p>
			)}
			<ul>
				{results &&
					results.map((post) => (
						<li>
							<a href={`/${post.slug}`}>{post.data.title}</a>
							{post.data.description && ` - ${post.data.description}`}
						</li>
					))}
			</ul>
		</>
	);
}