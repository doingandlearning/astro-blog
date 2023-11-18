---
title: "Is Blitz.js worth your time?"
date: "2020-09-26"
tags: []
---

Have you heard about Blitz.js yet? It's a framework built on top of Next that makes building applications quicker and easier. That's what the pitch claims anyway! You can find out more on [their site](https://blitzjs.com/) on which they claim to be `The React Fullstack Framework`.

I decided to stream me working through the tutorial on their website to see what I thought. It was a positive experience and I'm going to give it more time.

# What I liked

Blitz offers scaffolding and structure to React projects. It has an awesome command line tool and helpful conventions. Anyone who has worked with Laravel or Ruby on Rails will enjoy the approaches taken.

There is definitely a reduction in decision fatigue. Blitz makes a lot of the back-end design decisions for you to start with. This allows you to focus on your business logic and design. At the same time, each of those decisions are easy to opt out of.

## Community

When coming fresh to a language or framework, I want to scope out the community. Blitz seems to be doing a lot of good work in this area. The website is clear and the documentation is helpful. It was also refreshing to see contributors responding to Github issues with compassion and humanity. This is vital for me when deciding whether to invest time and energy into a project and it looks promising..

## CLI Tool

If you've used Laravel's `artisan` and `tinker` you'll appreciate Blitz's CLI and REPL. I know Rails has similar tools but I don't know what they're called :). The autogenerated code is well-structured and a great headstart. I'm not a TypeScript user and the generated code does use TS. I'd work with the generated TS files that and add my own JS files as I wanted to. It could be that Blitz makes me make the jump into Typescript!

## Improvements on Next

Before I came to React, I lived in the world of monolithic frameworks - Laravel, Drupal and WordPress. The move can be a little bit disconcerting. Living without persistent storage feels odd and there is no 'one best way' to achieve it. A configured and configurable database is nice.

(Don't tell anyone - but I quite like a monolith!)

Blitz allows for more than one `pages` directories which feels like a game changer. Rather than every route being in one folder, you can separate them as you like. To be able to sort your routes, components and utility functions in this way feels so nice.

# Questions I still have

I finished the stream by thinking about what questions I still had. These are the things I'd need to settle on before I moved more into this project.

## How is state managed locally?

I'd like to understand how state is being managed. I know we're reading from the database but is that happening on every call and is it being cached? Is it a stale-while-refetching and optimistic update approach or is there something else going on?

## Is it possible to have page/api routes?

I've worked on almost a dozen largish projects in Next and have appreciated Vercel's serverless API routes. I don't know if Blitz makes this possible or not. I want to know how to interact with 3rd party services and carry out more complex data manipulations.

The Blitz webpage talks about not having to have an API. I'm not sure that's true. The interaction with the database with Prisma is a whole DSL (domain specific language) - is that not an API? Maybe they mean a HTTP accessible API - either way, my eyebrows raised at that one.

## Deployment

This is my biggest sticking point - deployment is not fun!

Blitz is monolithic and needs a database. Everything I've been working on lately has had Gatsby or Next on the front-end. On the back-end I've been using everything from WordPress to Airtable to MongoDB as the database layer. I haven't had to manage any of those and it feels interesting to come back to server and database management. Unlike Django or Rails, it doesn't have a Heroku recipe. Instead, I have to host a Postgres database on Digital Ocean or use a service called Render.

Although, I'd never heard of Render, it was easier to set up and I was able to get it launched (after the stream though!). The UI wasn't great, it uses YAML (which is fine) and it was slow to deploy. I've come to love Vercel's deployment flow and I'd be sad to lose this with Blitz.

# So is it worth it?

I haven't decided yet but it might be. I'm going to spend a bit more time with this project and try to answer the questions I have. I'll build a more complex project and stream that process. For the moment, though, the deployment is the sticker.

My focus is likely to be an admin panel - always a fun task with a new framework.

If, like most people in the world, you didn't get to see the stream live, you can catch it below. [Sign up to my newsletter](https://kevincunningham.co.uk/newsletter) and follow me on [Twitter](https://www.twitter.com/dolearning) and [Twitch](https://twitch.tv/dolearning) if you want to find out about what I'm blogging, streaming and recording about.

https://www.youtube.com/embed/PojjHo2gczQ