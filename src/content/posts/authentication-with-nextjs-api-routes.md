---
title: "Authentication with Next.js API routes"
date: "2020-10-15"
tags: [ "auth","next"]
---

There is so much to say about authentication, right? Not only that but everyone seems to have very definite opinions about the perfect setup.

Since most of my time is spent building rapid, digital prototypes - I tend to find myself leaning on 3rd party services a lot. Specifically for those parts of development which aren't specific to the product. User registration, authentication and route authorization falls heavily in this category for me.

I've tried a few different authentication services and the one I have come to know and love is [Auth0](https://auth0.com). You've probably heard of them, right? They have a great developer relations team, good docs, great APIs and tools and you can have 7,000 users for free. Pretty great!

## Starting with Express

Auth0 have an Express/Node setup as one of the default walkthroughs when you first sign up ([this is a great tutorial](https://auth0.com/blog/create-a-simple-and-secure-node-express-app/)).

You start by configuring Auth0 and getting your keys and secrets. You then add these to your `.env` file - remember that?

Back on the express server, you add some libraries,

```
npm i passport passport-auth0 express-session dotenv
```

and configure express-session. This is going to use a server session to manage your token sharing and verification.

Passport is an authentication middleware that can use Auth0 pretty seamlessly. There is some config for that and then you're off to the races.

Auth0 has provisions for the login page, email verification and OAuth support for social logins. You need to set up some HTTP routes (/login, /logout, /callback) and implement some Passport callback code. You might even write some middleware to encapsulate some guard logic.

```
const secured = (req, res, next) => {
  if (req.user) {
    return next()
  }
  req.session.returnTo = req.originalUrl
  res.redirect('/login')
}
```

That's pretty cool! But, things are slightly different if you don't have a server.

## How to handle a Next API route approach?

I promise Auth0 aren't paying me for this article but they have a solution for that too. They have produced a library - it's available [on Github](https://github.com/auth0/nextjs-auth0) and has decent documentation.

Remembering we're in a serverless world, we can't just initialize our system and move on. We need a utility function to do that for us.

```
// /utils/auth0.js
import { initAuth0 } from '@auth0/nextjs-auth0'
import config from './config'

export default initAuth0({
  // config object
})
```

We're also going to setup our login, logout and callback routes. These are all in the documentation and are pretty clear. Here's one:

```
// /pages/api/login.js
import auth0 from '../../utils/auth0'

export default async function login(req, res) {
  try {
    await auth0.handleLogin(req, res)
  } catch (error) {
    console.error(error)
    res.status(error.status || 400).end(error.message)
  }
}
```

Our data from Auth0 isn't stored on the server session but we can access it:

```
// /pages/api/me
import auth0 from '../../utils/auth0'

export default async function me(req, res) {
  try {
    await auth0.handleProfile(req, res, { refetch: true })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}
```

If you'd like to use JWTs then you can do that with this library.

## Protecting a route

To protect an API route we just need to wrap it in another helper function from the Auth0 library. So this,

```
export default async function billingInfo(req, res) {
  res.json({
    email: req.user.email,
    country: 'United States',
    paymentMethod: 'Paypal'
  });
});
```

becomes

```
import auth0 from '../../lib/auth0'

export default auth0.requireAuthentication(async function billingInfo(
  req,
  res
) {
  res.json({
    email: req.user.email,
    country: 'United States',
    paymentMethod: 'Paypal',
  })
})
```

and you could even use the email from the Auth0 profile.

```
import auth0 from '../../lib/auth0'

export default auth0.requireAuthentication(async function billingInfo(
  req,
  res
) {
  const { user } = await auth0.getSession(req)
  res.json({
    email: user.email,
    country: 'United States',
    paymentMethod: 'Paypal',
  })
})
```

## Tying it up

This isn't meant to be an exhaustive tour of authentication or Next API routes. Instead, it's to call out some opportunities and some changes in thinking that might be helpful.

Next is an awesome framework that I love working in - every release gets better and better. Deployment with serverless functions and no Express API is a breeze.

So, whenever you come across a library that only documents an Express setup, have a think about how you'd move to serverless. Test if you're already connected, hide the variables, leverage 3rd party services!

If you want to keep in touch follow me on [Twitter](https://www.twitter.com/dolearning) or sign up for my newsletter.

Hope this has been useful!
