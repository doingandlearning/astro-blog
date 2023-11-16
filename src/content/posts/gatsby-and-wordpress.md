---
title: "Why is my video file not being cached by gatsby-source-wordpress?"
date: "2021-03-24"
categories: 
tags: ["gatsby", "wordpress"]
---

I'm not picky over what technology I use to deliver results for my clients. At SpinUp, we'll normally help find the best mix of technologies that will allow for excellent results fast. Recently though, we had a project in which the technology was pre-defined - WordPress on the backend and Gatsby on the front-end.

I learnt a lot on this project. The client, a huge computer game publishing house, had very clear requirements. But, the one that was very clear was that the Gatsby site had to be entirely statically built - there could be no calling back to the WordPress instance after deployment.

We used a combination of Gutenberg blocks with ACF, WPGraphQL (thanks Jason!), WPGatsby (thanks Tyler and Jason!) and also some plugins from Peter Pritas to integrate Gutenberg and ACf to GraphQL. This whole approach was slightly more brittle than we might have liked - a few of the plugins stopped playing well together mid-build but we got there!

On the Gatsby site, we were using the excellent `gatsby-source-wordpress` which was in expermental mode while we were building. Everything was going well until we realised that not all of the assets were being statically cached - uh oh!

## The problem

Specifically, video files weren't being cached and we weren't able to use Gatsby's localFile.publicURL because it wasn't being created. I raised issues on the repo, Tyler tried to help and pointed me towards the docs. I couldn't see the problem.

I have been tearing my hair out on this for months but this week I finally fixed it.

Up til now, I was using my own bare `gatsby-config.js`. I build up from scratch, adding the plugins I need as I went. I decided to rebuild Gatsby from scratch with a bare minimum example of my problem. For some reason, this time I decided to use a template.

I set-up the fields in WordPress, configured `gatsby-node` with the correct queries, setup the templates and components. Then, I checked the Gatsby graphQL layer and there was a publicURL! I couldn't believe it.

I pointed it toward my more populated WordPress instance and publicURL was still there. This was amazing!

Somehow, with the same WordPress configuration, this was working - so the problem had to be in Gatsby - but where?

I copied over the site structure piece by piece and it seemed to be doing fine. I copied over the `gatsby-node.js` and still nothing. Finally, I copied over the `gatsby-config.js` and the publicURL had gone again. Ah ha!

## The solution

So, what was different? Looking down the configs I noticed that the template had `gatsby-source-filesystem`. I don't have that in my in config because I'm not using the source. I added it anyway and it worked - I now had the MP4 files caching and the localFile had a publicURL.

For launch, we'd hardcoded any video assets we needed because I hadn't been able to fix this. Now we can go back and make those dynamic.

## Next time?

I've been a big fan of this technology stack. I think I still prefer building with Next but can see that Gatsby does some things much better. I like that Gatsby knows about my whole site and am a big fan of the GraphQL datalayer.

We're working on v2 for this client and so we'll no doubt learn more about what is working and what isn't. But, for now, it's two thumbs up for me for Gatsby and WordPress!

* * *

I've written [an ebook](https://learnetto.com/users/dolearning/courses/headless-wordpress) and [created a course](https://egghead.io/playlists/headless-wordpress-4a14) on getting setup with Headless WordPress.  
I also send out a weekly newsletter trying to help us all escape tutorial hell! Sign up below.
