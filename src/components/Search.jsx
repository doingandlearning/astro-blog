import { useState, useEffect } from 'preact/hooks'
import SearchBlogPost from './SearchBlogPost'
import { useStore } from '@nanostores/preact'

import { queryStore, setQuery } from '../store/search'

export default function Search({ posts }) {
	const query = useStore(queryStore)
	const [results, setResults] = useState(posts)

	useEffect(() => {
		handleOnSearch(query)
	}, [])

	function handleOnSearch(value) {
		const filteredResults = posts.filter(post => {
			const { title = '', description = '', tags = [] } = post.data
			return (
				title.toLowerCase().includes(value.toLowerCase()) ||
				description.toLowerCase().includes(value.toLowerCase()) ||
				tags.join('').toLowerCase().includes(value.toLowerCase())
			)
		})
		setQuery(value)
		setResults(filteredResults)
	}

	return (
		<>
			<label for='search' class='sr-only'>
				Search
			</label>
			<div>
				<input
					class='search-bar'
					type='text'
					value={query}
					onKeyUp={e => handleOnSearch(e.target.value)}
					placeholder={query || 'Search posts ...'}
					id='search'
				/>
			</div>
			{query.length > 1 && (
				<p>
					Found {results.length} {results.length === 1 ? 'result' : 'results'}{' '}
					for '{query}'
				</p>
			)}
			{results &&
				results.map(post => (
					<SearchBlogPost
						title={post.data.title}
						url={`/posts/${post.slug}`}
						description={post.data.description}
						date={post.data.date}
						tags={post.data.tags}
					/>
				))}
		</>
	)
}
