---
title: "WTF does headless mean?"
date: "2020-10-31"
tags: ["wordpress"]
---

I realised last night that I've been writing a lot about why Headless WordPress is a great solution but haven't been clear about what headless actually means.

Every website or application that you use is made up of at least two components. There is the content - the words, articles, pictures and assets - and there is the experience of that content - the layout, styling and interactivity.

For the longest time, most web platforms have worked to do it all. To be both the place where you create content and the place where your audience comes to consume it. These platforms are sometimes described as `monolithic`.

There are lots of examples, with WordPress being one of the most well-known.

## Breaking the monolith

![image.png](/images/O2P9K6YIk.png)  
Maybe you've heard of the JAMstack? That stands for JavaScript, APIs and Markup. It's one way of separating those two components - the `front` and `back` end. This is one way of breaking the monolith.

For the front-end, there are myriad frameworks and approaches you can use. React, Vue and Angular are all popular. Whichever you choose, how you manage your content is pretty much up to you. As long as it can be accessed by your frontend, either during a build step or when someone accesses your site, you can do what you want.

The technical phrase for this is decoupling. The great thing about this is that the same content store can be used for your web application, for your mobile app and for the email you are sending to your clients. This single source of content can be used in lots of ways. If you decide to change from React to Vue then there is no need to alter how your content is stored.

For the back-end, the content store, there are many options. Lots of these are paid solutions, some are just a folder full of markdown files that are used to create the pages for your users. [And this is where I blow my Headless WordPress trumpet](https://www.kevincunningham.co.uk/posts/advantages-of-headless-wordpress/)!

In this approach, WordPress is where your content team creates posts, stores images, organises releases and the like. If you've written a post on Hashnode, Dev.to or Medium then you've used a system like this.

## Headless means …

![image.png](/images/4L6YEmPpp.png)

- Being responsible for content creation and storage, not display
- Having a clear, documented way to allow access to the content
- Cutting off the head (the display and rendering of the content) and leaving everything else
- A content repository that can be accessed by an API

* * *

What other metaphors could I use here? How else could I explain this?
