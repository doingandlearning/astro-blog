---
title: "Protect Fastify routes with Authorization"
date: "2023-06-12"
tags: []
---

Every web application needs to have control over who or what can access its resources. This is where authorization comes in. In this tutorial, we will learn how to implement an API key-based authorization strategy in Fastify. We'll focus on how to create middleware to handle this, and how to apply this middleware at both a global level and on individual routes. Buckle up and let's dive right in.

We often talk about public and private data. Public data is accessible to anyone, while private data is only accessible by certain requests - typically those that provide certain credentials. How can we ensure that only authorized requests can access these private routes? This is where we apply authorization, which we'll implement through a simple API key check.

## Creating the authorization middleware

We'll start by creating an authorization middleware function that we'll call `auth`. This function will be responsible for checking incoming requests to see if they have the right credentials. For our simple example, we're going to look for an `x-api-key` header and test that against a known value.

```
async function auth(request, reply) {
    const apiKey = request.headers['x-api-key'];
    const knownKey = 'known-api-key'; // Typically, this would be stored securely

    if (apiKey !== knownKey) {
        return reply.code(401).send({ error: 'Unauthorized' });
    }
}
```

In the above code, we're looking for the `x-api-key` in the headers of the incoming request. If it doesn't match our known key, we return a 401 status code (indicating Unauthorized Access).

## Adding the Middleware Using the preHandler Hook

Fastify has various lifecycle hooks we can tap into, one of which is `preHandler`. This hook gets called after a request has been routed but before the request handler is invoked. It's perfect for our authorization middleware, as it allows us to intercept and potentially deny a request before it gets to our actual endpoint.

So why `preHandler` instead of other hooks? The short answer is that it allows us to catch unauthenticated requests as early as possible while giving us access to the request and reply objects. This way, we can reply directly with a 401 status without involving the actual route handlers.

Let's add our `auth` middleware function at the global level, applying it to all routes:

```
fastify.addHook('preHandler', auth);
```

By doing this, we're saying that every request, regardless of its route or HTTP method, should first pass through our `auth` function. If it doesn't return a 401 status (i.e., if the request is authorized), it then proceeds to the intended route handler.

To verify this is working as expected, you can start your server and make requests to your endpoints. Any request without the correct `x-api-key` in the headers should now receive a 401 status response.

## Adding to a Single Route

If you want to apply this authentication to a specific route only and not all routes, you can easily do so. Remove the `fastify.addHook('preHandler', auth);` line and add the `preHandler` hook specifically to the routes you want to protect:

```
fastify.post("/", { preHandler: auth }, projectController.createProject);
fastify.put("/:id", { preHandler: auth }, projectController.updateProject);
fastify.delete("/:id", { preHandler: auth }, projectController.deleteProject);
```

This way, only requests to these routes will be checked for the correct API key.

## Excluding Safe HTTP Methods

In some cases, you might want to allow "safe" HTTP methods like `GET` and `HEAD` to bypass the authorization check. We can tweak our `auth` function to return early if the request's method is one of the safe ones:

```
async function auth(request, reply) {
    if (['GET', 'HEAD'].includes(request.method)) {
        return;
    }

    const apiKey = request.headers['x-api-key'];
    const knownKey = 'known-api-key'; // Typically, this would be stored securely

    if (apiKey !== knownKey) {
        return reply.code(401).send({ error: 'Unauthorized' });
    }
}
```

By adding this code at the start of our `auth` function, we're saying: if the request method is `GET` or `HEAD`, don't bother checking the `x-api-key` - just proceed to the next step in the lifecycle. This allows us to apply the `auth` function at the global level while still letting safe methods through unimpeded.

## Conclusion

Congratulations! You've now implemented a simple form of authorization on your Fastify server. While this method of using an API key isn't the most secure method for authorizing requests, it's a good first step. In future tutorials, we'll look at more secure methods of authorization.

Remember, the goal of authorization is to ensure the right people or systems are accessing your application's resources. Fastify's lifecycle hooks, such as `preHandler`, make it easy to implement authorization at any level of your app. Happy coding!

https://www.youtube.com/embed/JwCu0oTK-OI
