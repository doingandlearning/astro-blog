---
title: "Why does your frontend application need a server?"
date: "2020-10-08"
tags: ["next"]
---

I started my development career working with monolithic frameworks like Django (in Python) and Drupal (in PHP). Now, I'm paid almost entirely to build React applications. It was strange for me when I started this journey to properly understand that React only deals with part of building an application. I wonder if you've considered this before?

## Deliberately unopinionated

Even though some habits and practices have grown up around data fetching, persistence and state management there is no "official" best way to handle these.

The Python community value having the one "Pythonic" way to solve any given problem. The Ruby community values the ability to solve the same problem in myriad different ways. Each language and community has different approaches.

With React there are clear opinions about how things are handled in the browser - re-rendering, hook rules, error boundaries - but that leaves the back-end more freeform. Everything about how data arrives in React is left to the discretion of the individual teams of developers.

## Do we need our own servers?

Say you are building something like the [Johns Hopkins Covid Dashboard](https://coronavirus.jhu.edu/map.html). This relies on the fetching and processing of a lot of varying data points

If you don't have a server, your application is going to need to do the following:

- query the data (possibly from multiple sources)
- parse the data (make it readable, exclude unnecessary information, get it into the right form, carry out any calculations)
- possibly cache the data (to stop fetching too much information)
- render the data (make things look understandable and helpful)
- update the displayed data based on user interactions (selections, movements, etc)

You can see that this would take a lot of time and put a lot of pressure on the browsers of your users. With a custom server, you gather all the data in one spot, have it in the right shape and cache it for your visitors.

This means React can do what it does best, render the data and update the UI.

## Is that the only reason?

There are other big reasons that servers are important for your applications.

First, there is the need to persist data through sessions. Without interacting with a server, any updates to the data in a browser will be lost after refresh. We could use cookies and localStorage to have some short-term persistence but these would not survive a cache clear, for example.

Second (and maybe this should have been first), security. If Johns Hopkins is relying on proprietary information, they would have an API key that uniquely identifies them to the vendor. If their application queried this data from the browser that API key would need to be shared and therefore could be found by the users. Having a server means the API key is safe, the proprietary data is only ever accessed by the server. The relevant data is built into the correct shape and passed back to the frontend with no knowledge where it started.

Thirdly, any costly calculations can be carried out on the server and the answers passed back to the client. This makes the experience of the end-user more smooth and responsive.

## What do you build your server with?

There are so many options here! You could use Node.js and Express - a favourite of JavaScript developers. You could build your backend in Rust, PHP, Python, Clojure or any other language that can run a webserver.

Frameworks like Next.js are trying to help with this overload. Next allows the creation of API routes in their applications. Once the applications are deployed to Vercel or Netlify, this routes are transformed into individual serverless functions. This reduces the development and deployment costs, as well as decision fatigue.

* * *

- Why else do you think we use servers?
- What other good ways do you use to build servers?

* * *

Follow me on [Twitter](https://twitter.com/dolearning) and sign-up for my newsletter if you've found this helpful.
