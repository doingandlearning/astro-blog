---
title: "Headless WordPress: Where should you host the WordPress instance?"
date: "2020-09-30"
tags: ["wordpress"]
---

Hey, have you heard about headless WordPress? Already convinced?

Was it because this way your content creators have a familar and powerful interface to do their work? Or that your developers can use modern frameworks to create amazing experiences for your users?

Maybe it was because of security? You no longer need to worry about database vulnerabilities after you've statically built your site. The content is available as static files served from a CDN. That also means that you don't have to worry about scaling up servers when your site hits the front page of Hacker News. So this is cheaper and more resilient - was that the reason?

Whatever brought you to this point, you're now ready to go. There seems to be a problem though - WordPress needs PHP, a webserver and a database. Even if you can end up with a statically built site served from Netlify, Vercel or AWS, where are you going to host your WordPress instance?

## Wordpress.com

You could go back to the source. The WordPress team have got a free and seamless experience for creating new blogs and sites. Automattic own and operate this site. They are the creators and maintainers of WordPress. That means this site is optimised to provide a fast and high-quality experience.

This can be a great option to get starter. If you're happy with WordPress without any extra plugins, for example. Or if you're not planning on exposing the address of the instance to your users which will be a subdomain of WordPress.com.

If you want to use Gatsby or GraphQL or if you want more functionality for your REST API this is going to be a costly route. Most headless implementations expect some customisation here. It isn't until their business plan that WP.com allows you to install plugins. They also charge extra if you want to use a custom domain. The [pricing plan is here](https://wordpress.com/pricing/) if you want to see how much that will cost in your region.

## One-click install on your ISP

Have you have ever paid for hosting with an ISP (Internet Service Provider)? Then you've probably encountered CPanel and WordPress installs "in one step". This will be on a shared hosting machine. Clicking will automatically provision a new database, webserver and install the files to allow WordPress to run.

With this option, you have full control over the types of plugins you want to install. You will be sharing a computer with some other clients and you won't have control over how fast your machine runs. Some providers charge extra to allow you to get command line access to the machine running your WordPress instance but, for most cases, this isn't a problem.

You might be concerned about the speed of this machine and whether your ISP will rate-limit visitors to your site. This isn't a concern with the headless approach. The only time you will use this site is when you are creating new content or when you are re-building your site for deployment. Users interacting with the site won't be affected by how slow this machine, only your content creators and developers.

There are so many possible providers here that I couldn't list them all. [BlueHost](https://www.bluehost.com/wordpress/wordpress-hosting), [Ionos](https://www.ionos.co.uk/hosting/wordpress-hosting) and [GoDaddy](https://uk.godaddy.com/hosting/wordpress-hosting) are providers I've used in the past but that isn't necessarily an endorsement. The joy of this approach is that you can fearlessly choose one of their cheapest options and not worry about it impacting on your users.

## Build your own in a VPS

Do you want more control? If you're looking for more control of the type of computer that is running your WordPress instance, you might think about spinning up your own virtual machine.

Some providers will have automatic deployments for WordPress or you may choose to use a provisioning tool such as [Ansible](https://www.ansible.com/use-cases/provisioning) to prepare your database, web-server, PHP install and WordPress file downloads.

In this scenario, you'll have full control over file permissions and directory structures. This is probably way more control than you'll need but you could use this server to host lots of WordPress instances instead of just one. Or you could use this server for other experiments and projects without worrying about impacting your end users.

Again, there are any number of providers for this service. From [AWS EC2 instances](https://aws.amazon.com/ec2/pricing/), [Digital Ocean's Droplets](https://www.digitalocean.com/pricing/) and [Linode's virtual machines](https://www.linode.com/pricing/). You may already have a server running and you add a WordPress instance with very little disruption to the current site.

## localhost

If you are the one creating the content and deploying the site, say for a personal blog or side project, you don't have to use a hosted solution. Instead, you can run WordPress locally on your machine and, when you are ready to build you can use this instance.

The benefit of this approach is you have complete control and don't have to pay anything extra. There are many tools that allow you to set this up with one click. The one I use is [Local from Flywheel](https://localwp.com/) which I would highly recommend.

It is more challenging to allow other people to edit content from your local machine but it is possible using approaches such as tunneling. If you are looking to have multiple remote editors, this isn't the approach I would suggest.

## AWS Lightsail

I'm not sure whether this belongs in one of the other categories but it kind of overlaps some the things above. AWS have a product called Lightsail that can be used to [run and deploy WordPress instances in one click](https://aws.amazon.com/lightsail/projects/wordpress/). It's pretty cool!

If you don't use any other AWS products, this would be completely possible to run on the free tier. AWS give you 750 hours of compute time every month. This then has the benefits of one-click and on your own VPS.

## Specialist providers

There are a number of providers who focus primarily on providing hosting for WordPress. Rather than relying on generic, shared hosting these platforms tailor their service and setup to make WordPress shine. This can be by how they deal with caching, backups, performance or security in ways that are designed to make your experience better.

I've worked with a number of these [WPEngine](https://wpengine.co.uk/) and [FlyWheel](https://getflywheel.com/) are the two I have personal experience with. I've found both to be excellent. Again, working in a headless way means you'll probably never need their more expensive tiers, particularly if you are building a static site.

These providers generally have great developer workflows, allowing you to deploy with Git and as part of CI/CD workflow. Worth thinking about as your applications get bigger and more robust.

# Conclusion

There are so many different ways you could host your WordPress instance to get going with headless WordPress. For most of my personal projects, I'm happy with localhost whereas most of my client projects are with AWS or Digital Ocean. Whichever, you choose I wish you luck in your headless journey.

I write a newsletter each week which often contains headless WordPress goodies. Sign up below if you want to keep up to date.
