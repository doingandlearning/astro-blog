---
title: "Scheduling with node-cron"
date: "2024-09-19T17:07"
tags: ["node-cron", "node", "scheduling"]
updateDate: ""
description: "WIP: Scheduling tasks with Node without other software dependencies."
---

Are there tasks that you want to perform at a given time each day, week or month?

In modern development, there are often recurring tasks that need automation — from sending out reports every Monday to clearing out caches or checking football scores in real-time. If you’re running a Node.js server, you can easily schedule these tasks using `node-cron`, a simple and powerful tool for managing jobs inside your Node.js processes. Let’s explore how it works and how you can integrate it into your workflow.

## cronjob? node-cron?

First up, what is a cronjob and node-cron?

A cronjob, short for chronological job, is a job you schedule for a particular time. It has a somewhat obscure notation that we’ll unpack in a bit.

`node-cron` then, allows you to schedule jobs to run at particular times. For web-servers, this might be clearing up logs or refreshing user tokens or clearing caches. Managing these jobs inside of your Node process can give better visibility and control (and stops you having to use bash).

## cron schedule expressions

In order to run a job at a particular time, I need to know how to reference that time. To do this, we’ll need a cron schedule expression. For years now, the place I go when I want to check or create an expression is [crontab guru](https://crontab.guru/).

The expression is a string made up of five (or in node-cron possibly 6) space separated expressions.

```
* * * * *
| | | | |
| | | | └── Day of the week (0-7, where Sunday is both 0 and 7)
| | | └─── Month (1-12, where January is 1)
| | └───── Day of the month (1-31)
| └─────── Hour (0-23)
└───────── Minute (0-59)
```

Working from left to right, each of these expressions represents on which minutes, hours, days (1-31), months, days (1-7) you want a job to execute on.

You can have single digits, a range of value (-), a list of values (,), stepped values (/) or any value (\*).

Here are some examples:

`0 0 * * *` - this job will at 0 minutes and 0 hours on every day. Perhaps you want to back up your database at the start of each day. This cron expression will run it at midnight.

`0 7 * * 1` - this job will run at 7am on Monday morning. You could use this to send weekly reports to your team just before the workweek starts.

`*/5 * * * *` - this job runs every 5 minutes and is useful for monitoring or frequent API calls.

`0 0 1 * *` - this job runs at midnight at the start of every month - useful for monthly reports or billing.

`* 10-17 * * 6,7` - this job will run every minute from 10am-5pm on the weekend. For a sports enthusiast or an app pulling real-time scores, use this to check updates every minute on Saturday and Sunday.

## Using `node-cron`

Now that we have our cron expressions, we can start to use `node-cron` to schedule some jobs. First, I’ll start a new project and install `node-cron`.

```bash
npm init -y
npm i node-cron
```

I like to work in ESM, so I’ll change my module type in package.json to by module.:

```json
  "type": "module"
```

I’ll create new file, import node-cron and schedule a job:

```js 
import cron from "node-cron";

cron.schedule("* * * * *", () => { console.log("I will run every minute.") })
```

When I start this file with Node now, it will run and when my clock gets to 0 seconds it will run the code. So, check your clock and see if it prints when you expect.

`node-cron` also lets us pass a sixth optional expression which will allow us to schedule to the second.

```js
cron.schedule("* * * * * *", () => { console.log("I have 6 stars and will run every second") })
```

I’m passing a lambda function here but you can use this to run maintenance tasks, send emails, schedule reminders or anything else that needs to happen at a particular point in time. I’m also not using any error handling here.

—
 
Scheduling tasks is a crucial part of many applications, from sending reminders to maintaining system health. With `node-cron`, you can manage and schedule tasks directly in your Node.js app without external dependencies. Try implementing it in your project today, and see how it can simplify your task automation.
