---
title: "What are Next.js API routes all about?"
date: "2020-10-09"
tags: ["next"]
---

In a [previous post](https://kevincunningham.co.uk/posts/why-does-your-frontend-application-need-a-server), I discussed why we need servers for our frontend applications. There are lots of reasons - security, performance and convenience being high on the list. The React developer is left open to choose for themselves whichever backend most appeals to them. This is freeing but can add to the decision fatigue that faces developers from time to time.

## What is Next.js?

Have you heard of Next.js? I imagine you have but if you haven't, Next is a framework built on top of React. It seeks to make some of those decisions for us and make development quicker and more productive.

I love working in Next - from server-side rendering to file-based routing - I feel like I can speedily create solutions and add value for clients.

A few release ago, [Next introduced API routes](https://nextjs.org/docs/api-routes/introduction). These have been a game changer for me. Previously, I've had to build custom servers to provide for my applications. Now, I have a straight-forward and speedy way to handle these tasks.

## File based routing

The API routes follow the helpful file based routing paradigm that the rest of Next supports. Creating a file in the `/pages/api` directory will immediately create an API route.

```
// /pages/api/hello.js
export default function handler(req, res) {
  return res.end('Hello!')
}
```

Visiting this route with a browser or API client will respond with a "Hello!". What a friendly API!

As they are file based, you can have dynamic routes as well. You place the dynamic part in square brackets and can then query it within the handle.

```
// /pages/hello/[name].js
export default function handler(req, res) {
  const name = req.query.name || 'there'
  return res.send(`Hello ${name}!`)
}
```

Now our API is so friendly, it even uses your name! Hit `/api/hello/Kevin` and see "Hello Kevin!' as the response.

## JavaScript based

You'll notice that the handler above receives the request and the response. If you've ever worked with Express this will be very familiar. In fact, these objects both have a lot of the same helper functions and properties that Express users will have used in the past.

You can use all of your JS libraries and logic, you can work with middleware and interact with APIs. It's pretty sweet!

## What helpers are included?

Not all of the helpers have been transferred from the Express implementation. Here's what has been:

- res.status(code) - set the HTTP status code of the response.
- res.json(json) - Send a JSON response.
- res.send(body) - Sends the HTTP response. The body can be a string, an object or a Buffer.
- res.redirect(\[status,\] path) - Redirects to a specified path or URL. The status must be a valid HTTP status code. If not specified, status defaults to "307" "Found".

## Deployment

The real win here though is deployment. When you deploy to Vercel or Netlify, each of these API routes is converted to a serverless function. How cool is that! You don't have to provision a server or keep it up and running. You are allowed a ridiculous amount of free requests that these almost always work out as free. If not, it will be much cheaper than any server hosting would be.

There are a few gotchas in moving from a custom server in Express to using Next API routes. I'm going to explore some of these in future posts.

Thanks for being here. Follow me on [Twitter](https://www.twitter.com/dolearning) and signup to my newsletter below if you've found this helpful :)
