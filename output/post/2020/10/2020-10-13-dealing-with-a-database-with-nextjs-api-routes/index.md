---
title: "Dealing with a database with Next.js API routes"
date: "2020-10-13"
categories: 
  - "next"
---

With Next API routes serverless functions become much more accessible. But in a serverless world, maintaining a connection with a database isn't achieved in the same way.

## How did this work before?

Previously we may have provisioned, maintained and benefited from persistent servers. When our server starts, it connects with and maintains a connection to our database.

Any web-request that requires information from the database would use this connection.

Here is how I might have achieved it with Mongoose & MongoDB.

```
const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
```

Once declared and bound, this database connection is available throughout the application. We can carry out read/write operations to our database and gather the content for our clients.

If your website suddenly gets a lot of traffic, you have a few options. They are generally quite manual though or require a complex web of scaling triggers. You could:

- Increase the pool of connections. This allows for multiple requests and responses to be dealt with simulataneously;
- Increase the number of servers to handle the requests, behind a load balancer normally;
- Heavily cache your responses allowing for less demand on the database layer.

## Why are things different in a serverless world?

With Next, each API route is deployed as a serverless function. As one of these routes is accessed, the function spins up and processes the request. For some time after that request, the environment remains active.

Previously, we have been able to assume that the connection is alive. Now, like Schrödinger's cat, it could be either alive or dead - until we observe it.

So, our code needs to check if there is a connection. If there is an active connection then we return to our API component, allowing it to access the connection through mongoose. If there is not an active connection, then we need to create the connection and then pass back control.

```
// /utils/db.js
import mongoose from "mongoose";
require("dotenv").config();

export default async () => {
  // Here is where we check if there is an active connection.
  if (mongoose.connections[0].readyState) return;

  try {
    // Here is where we create a new connection.
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database.");
  } catch (error) {
    console.log("DB error", error);
  }
};
```

Since every API route is atomic, we can't tell if this function has been called already. This means that we need to check for the database status in each route rather than centrally. So, our utility from above needs to be imported and used on every route.

```
import connectToDb from "utils/db";

export default async (req, res) => {
  await connectToDb();
 ...
};
```

The great thing is that our underlying logic remains mostly unchanged and a migration to a serverless approach is pretty smooth.

## What happens in high traffic situations now?

We had three options previously - more connections, more servers, more caching. Each of these options required manual configuration or intervention. It was also hard to match the provisioning to our actual needs. We either had too much or too little - rarely hitting the Goldilocks point.

Now that every route is handled separately and serverlessly, our environments will automatically provide more of that route if it is needed. We no longer have to manage these traffic interventions manually. We don't have to keep a server up and running when we don't need it. We also don't have to provide a whole new server if it is only one or two routes that are being requested more often.

Serverless doesn't mean no server, but rather no server that we are responsible for! These functions are generally very reliable. Not only that, if one crashes another will spin up to take its place.

* * *

Thoughts or ideas? Let me know if I'm missing anything, here or on [Twitter](https://www.twitter.com/dolearning).
