import { formatDistance } from 'date-fns'
export default function SearchBlogPost({ title, description, url, date, tags = [] }) {
	return <div class="blog-card-container">
		<a href={url}>
			<div class="blog-card">
				{title}
				{
					date &&
					` - ${formatDistance(new Date(date), new Date(), {
						addSuffix: true,
					})}`
				}
				<p class="desc-string" id="desc-string">{description}</p>
			</div>
		</a>
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