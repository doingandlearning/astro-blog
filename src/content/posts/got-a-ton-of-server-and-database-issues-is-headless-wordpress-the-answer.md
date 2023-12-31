---
title: "Got a ton of server and database issues - is headless WordPress the answer?"
date: "2020-10-05"
tags: ["wordpress"]
---

WordPress is an often overlooked and underrated tool in a content toolkit. Over the past 17 years, Matt and the team at Automattic have built a product that is trusted by many. The ubiquity of WP means that most people have had some exposure to it already and for less trafficed sites that works out well.

For complex and popular sites, WordPress needs some special attention to run efficiently and well. Databases can slow down and servers can have issues - maybe you've had to fight to keep yours online? Is headless WordPress the solution for this?

## The fears

If your site has been up and running for a while, you probably have LOTS of posts. You have a workflow that your team is familar with and results you have come to anticipate. You know your system so well that you can predict what the problem is when the site goes down. You're normally right!

You've thought about a migration but that's been scary.

- What if there are slow updates from content additions and edits?
- Will you be able to handle the existing comments which use Disqus?
- How are you doing to deal with advertisements?
- What about autoposting to Facebook and Twitter?

## What is headless WordPress?

At the moment, WordPress is doing all of the heavy lifting for your site. It is responsible for creating , styling and sending the content to your users. It is also handling user accounts, tracking of ad revenue and comment systems. That's a lot to expect from any software!

In a headless scenario, you allow WordPress to handle all of the content creation and administation. You can then make the content available to any application you allow to use it.

This way you can build your website using the same content as you might build a mobile app or chat bot with. You have a single source of truth for your content that is automatically pushed to all of your platforms when you change it.

## What is the benefit?

I'm a big fan of React frameworks like Next and Gatsby. I think they do a great job of statically building sites and updating the content quickly and beautifully.

When changes are made to your content, the site files are instantly rebuilt and pushed to a server. This is simply HTML, CSS and Javascript files and can be hosted anywhere for next to nothing.

Once the site has been built, it does not need to access the database or server for any content viewing. You can rest a bit and not worry so much about your system going down when you hit the front page of Hacker News.

Your site becomes both cheaper to run and more resilient to unpredictable traffic loads. It is also more secure. Not needing to access the database means that there are less ways for hackers to access your site and be malicious with your servers.

## What's the catch?

For some, it is a new way of working. Each of the features that you've used up to now will need to be considered. Things like the commenting system and the ad-revenue system will need to be reviewed and analysed. Are they going to work in this new way?

You are also going to be able to work with a modern tech-stack of your choice. This is both a blessing and a curse. Thankfully, this is not an un-trodden road and there are resources to help along the way. It is a learning curve though and will probably not just be in the PHP you've come to know and love.

You are going to have two systems - that's a little added complexity. You're likely to save money and be more proactive as you won't be putting out fires as regularly.

I do think that headless WordPress might be a solution for a site that is having these problems. It is a good compromise between moving off WordPress altogether and staying still putting out the fires where you are at the moment.

I'm in the middle of creating resources to help support getting started with headless [Twitter](https://www.twitter.com/dolearning) and sign up in my newsletter if you want to make sure you don't miss out.
