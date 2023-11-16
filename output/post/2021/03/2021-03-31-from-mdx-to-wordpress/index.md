---
title: "From MDX to WordPress"
date: "2021-03-31"
categories: 
  - "wordpress"
tags: 
  - "mdx"
  - "migration"
  - "wordpress"
---

My experience with blogging may be back to front to others. When I started blogging back in early 2019, I worked entirely in Markdown. That had some amazing benefits.

1. As I learnt about new systems, both through work and experimentation, I could easily pivot. I've used the same content in a Gatsby, Jeykll and Next based blog.
2. I could grow the amount of front matter that I wanted and be in control of that.
3. It's easy to source control my markdown files and be driven by git.
4. I could use the same tools for my daily work as for my writing and blogging.

## The case for migration

![brown cardboard boxes on gray asphalt road](https://res.cloudinary.com/kc-cloud/images/w_685,h_1024/v1617645913/rwturjf7i5w/rwturjf7i5w.jpg?_i=AA)

The need to move

I've been banging the headless WordPress drum for a while now and been using it to built solutions for clients. Initially, I wasn't a bit fan of WordPress and had been infected with the scorn and derision that tech people tend to pour on it. But, I've been falling in love with it.

1. Working headlessly means that I can move this to another system if I want. I'm currently still building this blog on Next and, now sourcing the data from WordPress.
2. Copying and pasting the front matter was getting tedious. I can set dates without having to get the ISO date string, I can automatically set slugs, tags and categories. I can keep track of these more easily.
3. I have better overview of my content. Migrating to WordPress made me read my old posts and reminded me of ideas I'd had previously. Seeing the posts in the admin panel is helping me think of new ideas.
4. Separation from my daily drivers is actually quite helpful. Having a specific tool for this is helpful for me.
5. I like that it is focused on content creation. Working in Markdown meant that I was turning on and off word wrapping. There is no formatting that can help remind me that I don't have any images, just a wall of text.
6. I can experiment here with the same technologies I'm shouting about and live to tell the story.

## The actual migration

![brown wooden drawer](https://res.cloudinary.com/kc-cloud/images/w_1024,h_711/v1617645911/lrox0shwjuq/lrox0shwjuq.jpg?_i=AA)

Getting things in order

The actual migration was at times tedious but also informative.

### 1\. The content

As mentioned, all of my content was in markdown. I added a new post for each file and copied in the markdown. Gutenberg recognised the code ticks, the headings and all of the other formatting hints that markdown uses.

I had been inconsistent with line breaks, though and this was frustrating. markdown ignores single line breaks and only uses double line breaks as an indicator of a new paragraph. So, where I'd used this feature rather than relying on word wrapping, I had to go and edit the text.

For the frontmatter, I manually set the published date, slug, categories and tags to match the markdown. This was mostly quick and easy. The one slight frustration was not being able to change the slug until after publishing.

### 2\. The pages

With some of our clients, we've been working on partial CMS solutions and I was definitely inspired by this. There were three main pages I wanted to capture in the CMS and I knew I'd work on the others going forward.

#### The Homepage

Working in React, my homepage is made up of multiple components. A feature blog at the top, multiple "Panels" and a newsletter block.

I used ACF to capture the props for these in WordPress, constructed the graphQL query and then populated the page. This was pretty smooth and now allows me to keep this up-to-date quite easily. Woohoo!

I want to add and move things around going forward. Having flexible, CMS managed content allows me to separate the coding of this with the copy generation. I appreciate that separation.

#### The /blog page

As with all of this project, I was leaning heavily on the work of Colby Fayock and others in the `next-wordpress-starter`. I used the hooks that Colby had worked on to populate this page from the WordPress data rather than the MDX data. It was a pretty straightforward process to change from one data source to another - woohoo!

#### A single blog post

The view you are seeing here. Again, I needed to source how the data was being fetched but in general this was pretty straightforward. I didn't change much but have left things open to come back and play with going forward.

### 3\. The Layout

One of my frustrations with Next sourced with MDX has been the struggle around RSS feeds and related posts.

With a previous Next plugin, the RSS generation was just giving me the page creation date rather than the publication date. This could have been an easy problem to fix but moving to this solution meant I could use Colby's excellent webpack plugin to do the job for me.

I can uses categories and tags to generate related posts. This was always something on my to-do list but it is now happening and they are being surfaced at the end of the post. No more dead-ends - woohoo!

Surfacing most recent posts in the footer is another thing I'm glad to have been doing.

## What's next?

![man in blue polo shirt sitting on chair](https://res.cloudinary.com/kc-cloud/images/w_1024,h_717/v1617645915/myxzg5nwdns/myxzg5nwdns.jpg?_i=AA)

There are some formatting issues I have at the moment. To start with, I don't like how code is rendered and I don't like how embedded videos are handled. These were problems I was already having with MDX and I'm excited to think through how to handle this here.

I want to simplify my homepage, add a few more static pages and point towards some of the content I'm creating elsewhere. I want to keep copy up to date and have important posts rather than just recent posts front and centre.

I'm excited by this change and looking forward to writing more from here.

* * *

I have [written a book](https://learnetto.com/users/dolearning/courses/off-with-your-head) and [published a course on egghead](http://egghead.io/playlists/headless-wordpress-4a14) about getting setup with headless WordPress. I also share tips and pointers on my weekly newsletter as I try to help people escape tutorial hell. Sign up below.
