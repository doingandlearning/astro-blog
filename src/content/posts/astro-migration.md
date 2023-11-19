---
title: "Moving my website ... again"
date: "2023-11-18"
tags: ["astro"]
dateUpdated: "2023-11-19T14:20:46.033Z"
description: "Landing on Astro ... first thoughts"
---

You probably don't care and are unlikely to have been reading along long enough to know that this isn't the first time I moved my website.

A few years ago, I migrated from a Markdown and Next setup to a headless WordPress and Next setup. If you want to see how that went you can read more [here](/posts/from-mdx-to-wordpress).

At the time, I was doing a lot of work with WordPress and Next and this made sense. I was able to use the tools that my clients were using and find the sticking points. What I was learning on both sides of the fence, as developer and content creator, informed what I did.

The thing is though, it has stopped me being able to create some of the experiences I've been excited to work on.

A headless setup makes a lot of sense if you are developing a lot of content and it is always going to be in the same consistent format. For me, I want to create little component experiments and drop them in. In my previous setup I have to:

- Potentially register some ACF fields to capture some props
- Create the page which uses those new props
- Run my Next instance to "catch" those props and build out the experience (which involves updating GraphQL queries, adding to a growing component switch table and the rest)
- Go back to WordPress and edit, retrigger the Next.js 
- Rinse and repeat.

Now, in my MDX setup in Astro, I:

- Create a component in React/Vue/Svelte - whatever!
- Import it in the MDX
- Use it

It's immediately visible and my feedback loop has reduced massively.

I was nervous about moving *again* - would this just be wasted work? Pointless? [Yak Shaving](/posts/yak-shaving)? But, I thought I'd give Astro a go - all the cool kids are talking about it after all.

Here are some things I've enjoyed about Astro so far.

## It feels really obvious

I've been creating websites for a while and the tooling hasn't always made our jobs easier. 

When first starting out with Next.js and Gatsby, the pain of trying to inject meta tags on every page was real. You had to know about the config, the build tool, the use of special files like `_document.js` and `_app.js`. 

In Astro, you get access to the HTML and you add the tags where you need them. Amazing!

## The quality of docs is excellent

A few years ago, I was part of a book group that read through "7 Languages in 7 weeks". That was a lot of fun! The book and the people! If anyone is up for exploring a tech book club, hit me up!

One of the takeaways I had from that experience was how important is to think about the community that forms around any language/framework/tool. I don't think that I'd been as aware of that as a point to consider before that experience.

I think I big indicator of community health is how well they onboard newcomers. The Astro docs are top notch. I worked through their three tutorials and felt confident I could do whatever I need to do.

## It's not a new framework

Another fear I had was that I would be learning YAJSF (yet another JavaScript framework). Astro doesn't feel like that at all. 

It feels like how HTML "should" be. We can use all the things from the vanilla web and progressively enhance as needed. 

Got a favourite framework? Bring it along! I work and teach in React, Vue, Svelte and Angular - what I'm excited about is that as I'm explaining those technologies on this site I can use them in place.

The feels so powerful.

## What's next?

I'm not finished with this migration but don't plan on writing more content on my existing blog. Things that need to be handled before I move permanently:

- [x] Newsletter sign up (this involves some SSR which I haven't had a chance to look into fully yet)
- [ ] Main landing pages
- [x] Course pages
- [ ] Course page content

I'll add other things to this list and check it off as I go. But I'm excited to write in Markdown again and see the changes happening so quickly. 

Update: I think that some of this might become an endless blocker. Considering just launching and iterating from there.
