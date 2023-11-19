
export default function SearchBlogPost({ title, description, url, withImage = false }) {
	return <div>
		<a href={url}>{title}</a>
		{description && ` - ${description}`}
	</div>

}