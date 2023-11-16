---
title: "Developing an Express API"
date: "2020-10-02"
tags: ["express"]
---

I'm working on a collection of lessons on egghead.io around Express. I'll post them here as I put them up and add some commentary around them.

The first one is about getting setup in Express and using Nodemon to auto-reload the server when the files are saved. This really speeds up development. Nodemon monitors your files and, when it notices you've saved changes automatically restarts the server.

https://egghead.io/lessons/express-set-up-express-to-automatically-reload-on-save-with-nodemon

The lesson after that was on returning JSON and handling CORS errors. This is quite straight-forward with Express and the npm cors package. I'm serving the application from port 3000 and the API from 3001 but this type of error could occur on any difference in origin.

I then looked at serving static files with Express. Again, there are useful helpers that allow this to happen. I want to serve a random file and so I use the core file-system Node module (fs) and some Math functions to achieve this.

Next up, I want to be able to receive a guess on my API and parse the JSON request. I want to decide if the guess is correct and send an appropriate response.
