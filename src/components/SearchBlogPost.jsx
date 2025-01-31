import { formatDistance } from 'date-fns'
export default function SearchBlogPost({ title, description, url, date, tags = [] }) {
	return <div class="search-card-container">
			<div class="search-card">
		<a href={url}>
				{title}
				{
					date &&
					` - ${formatDistance(new Date(date), new Date(), {
						addSuffix: true,
					})}`
				}
				<p class="desc-string" id="desc-string">{description}</p>
		</a>
			</div>
		{
			tags && (
				<div class="tags">
					{tags.map((tag) => (
						<p class="small-tag">
							<a href={`/tags/${tag}`}>
								#{tag[0].toUpperCase() + tag.substring(1)}
							</a>
						</p>
					))}
				</div>
			)
		}
	</div>

}
