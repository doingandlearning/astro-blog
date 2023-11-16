---
title: "8 Advantages of Headless WordPress"
date: "2020-10-29"
categories: 
  - "wordpress"
---

I'm a big fan of the JAMStack and WordPress. I think they are excellent companions, adding value both to content creators and developers. I'm glad to say, I'm not alone. However, it doesn't take long before you come across the view that this combination is needlessly complicated.

I'd like to share a bit about what I find compelling about this architecture.

## Customisable backend

I've played with a number of productised headless CMSs (should that be CMSes? 🤷🏽). Each of these products is pretty good and for some of our clients we are indeed using Prismic and Airtable. The challenge though is that they are solving a general problem for a lot of people rather than your specific problem.

With a headless WordPress instance, you can extend your API infinitely allowing you to make a bespoke solution.

Want to internationalise? We got you!

Fancy connecting related posts with snippets? A few lines of code.

If you can imagine it for your backend (or you've seen it on the Premium package of a 3rd party provider), you can get your headless WP to do it.

## Easy to deploy

If you have ever bought a domain with GoDaddy or Bluehost or any of the mainstream providers, you've probably come across cPanel or something similar.

![image.png](images/9FV8-wHZc.png)

These shared hosting providers give one-click setups for WordPress and, for the most part, work seamlessly (my experience is that they aren't always the fastest of sites which is one of the reasons I love headless).

If you'd rather, my friend Colby [has a great walkthrough](https://egghead.io/lessons/aws-create-a-new-wordpress-instance-on-aws-with-amazon-lightsail) on setting up a WordPress instance on AWS Lightsail. This is possible on the free tier, so if you aren't using many other AWS services then you're sorted!

Or, if you're going to statically build your site, and not interact with the headless WordPress apart from that, you could host it locally. I tend to use [Local from Flywheel](https://localwp.com/) for this.

## A familiar editing experience

I've come to enjoy headless WordPress for a number of reasons but the most compelling has been client demand.

I had clients who wanted their content team to continue to use WordPress but wanted a statically built frontend. By working with headless WordPress, the back of house staff don't need to be bothered as the frontend changes. They provide the content and page structure, that is consumed and enriched by the frontend.

WordPress has been around for a long time and editors have generally used it in one form or another. People are comforted by familiarity and we can lean into that.

## RESTful or GraphQL

Out of the box, WP comes with a decent RESTful API. The endpoint is /wp-json and it is descriptive and comprehensive. With a bit of custom code it is possible to extend the API and add your own custom fields and data to the JSON responses. You can reduce the need for multiple requests if you know the shape of the data you're going to ask for.

But, if you don't want REST and would rather have a graphQL API, WP has you covered. There are plugins for a really detailed and self-descriptive graphQL API. You'll be able to integrate with Gatsby or NextJS or any front-end architecture you want to hook up.

## Open source

I mentioned plugins in the last section and it's worth noting that WP development is open source. I love OSS and think that we make some amazing advances by working in the open. WordPress has been around a long time. There are myriad resources for learning and answering any question you might have. Not only that, there is a dedicated and committed community who are fun to be a part of.

## Cost

I'm always curious on price points around headless CMSes. Here are some selections from pricing pages:

![Screenshot 2020-10-29 at 05.55.24.png](images/70O_jN66r.png)

![Screenshot 2020-10-29 at 05.56.31.png](images/a74LMgbW1.png)

I've mentioned some free or super low-cost deployment options for headless WordPress. With each WP you can have unlimited users, unlimited roles and can implement any of the features that these solutions offer with a bit of work.

It doesn't have to be a lot of work though. Even out of the box, you get a ton of functionality.

## Frontend choices

The primary reason to go headless is generally to decouple the front-end and the back-end. Once you're set up, you can swap in and out any front-end you'd like.

You can use Gatsby or Next, Svelte or Clojure - headless WordPress is providing the data and you can do whatever you want for it.

## Security

WordPress powers a lot of the internet and any security issue is quickly made public. If you don't keep your instance up-to-date then you can face some security issues. Working headlessly though, means that your end-users never need to know where your WordPress instance is.

A statically built frontend means files served from a CDN with no interaction with the database or sensitive assets after build.

* * *

  
  
I'm currently exploring and thinking about headless WordPress a lot. If you want more content like this and a weekly spotlight on cool projects around the web, sign up to my newsletter below.
