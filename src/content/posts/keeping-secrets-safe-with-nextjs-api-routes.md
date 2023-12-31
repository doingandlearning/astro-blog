---
title: "Keeping secrets safe with Next.js API routes"
date: "2020-10-10"
tags: ["next", "security"]
---

Have you ever been tempted to hand over your car keys to a stranger? How about your Facebook login details? Your debit card PIN?

Each of these are ridiculous scenarios - you wouldn't even contemplate them. When your application contacts other services on your behalf, it has to prove that it is allowed. That you've given it the keys. In almost all instances, we achieve this by using an API key.

An API key is a long string of characters that, together with other information, is used to uniquely identify you. If your frontend application contacts these APIs, then it needs these keys. That's a problem. For the React or Vue or Ember application to have those keys they need to be in the browser and so are available to the user. Not immediately but with a little bit of digging.

# How do keep them safe?

We are going to use environment variables. In a deployed environment, such as Vercel or Netlify, you enter these in the application settings. Locally, however, we need to use a `.env` file.

We create the `.env` file in the root of our application and add it to our `.gitignore` file. This way we can safely add secrets without worrying about them ending up in source control.

We write variables in our `.env` files as key/value pairs separated by an `=` sign. There are no spaces.

```
    API_KEY=SECRETAPIKEYHERE
```

To use these secrets locally, we need to use a library called `dotenv`. So, let's install that,

```
    npm install dotenv
```

and then import it. We'll use the `.config()` helper function to load all of the environment variables into memory.

```
    require("dotenv").config();
```

Now, in our file, we are able to use these variables. They have all been added to our `process.env` object.

```
    console.log(process.env.API_KEY) // SECRETAPIKEYHERE
```

Our Next API routes can access these secrets but our clientside application can not. Perfect!

# Some gotchas!

When you add or change the `.env` file, restart your server. The file is only processed and parsed on startup. Don't bang your head against the desk wondering what is wrong like me!

The other one is slightly more involved.

## Server and client side rendering

Next is awesome because it renders the first interaction with any route on the server. This means that you get all that lovely SEO as the content is sent to the client as HTML. After that initial bootstrapping, the application acts like any other React app. Why is this a big deal?

If you are querying your API, you'll probably be doing something like this:

```
    fetch("/api/hello").then(data => data.json)
```

From your client that is going to be fine but for the first render, the server side render, you need to use an absolute URL.

So, maybe something like this?

```
    fetch(`${process.env.BASE_URL}/api/hello`).then(data => data.json)
```

Providing you have `BASE_URL` in your `.env` file then you've fixed the server side render. This time, however, the client side doesn't have access to the environment variables. A better version of this would look like:

```
    fetch(`${process.env.BASE_URL || ""}/api/hello`).then(data => data.json)
```

Using environment variables to store secrets that can only be accessed on the server is a great way to be more secure. Just remember, these can't be used on a client side route. If something works on first render but not when you navigate to the page, this might be the problem.

If you've found this useful then please follow me on [Twitter](https://www.twitter.com/dolearning) and sign up to my newsletter below.
