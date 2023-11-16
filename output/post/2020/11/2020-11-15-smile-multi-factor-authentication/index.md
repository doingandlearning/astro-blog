---
title: "Smile Multi Factor Authentication"
date: "2020-11-15"
categories: 
  - "auth"
---

As part of being an Auth0 ambassador, I get to partake in internal hackathons. I had a lot of fun taking part in my first one as we put the new [`Actions`](https://auth0.com/docs/actions) through it's paces.

### What are Actions?

Actions are secure serverless functions that are triggered at various points of the authentication flow. At the moment, there are two triggers but there will be more soon.

![Auth0 Action triggers](/images/Screenshot_2020-11-15_at_17.56.26_ddokpp.png)

The action is written in JavaScript and the editor has great type hints to make development easier. You can test on the editor, add environment variables (called `secrets`) and install 3rd party modules from npm.

The most common applications so far are enhancing the user object and redirecting to an external provider.

I was working with [Tyler Clark](https://twitter.com/iamtylerwclark), a member of Auth0's dev rel team, and we had a lot of ideas about what we could do.

### What did we make?

We knew we wanted to something fun. In the kickoff meeting someone had mentioned checking if the user was wearing sunglasses. This sounded fun but we didn't want to steal the idea outright.

All the cool kids love playing with machine learning - so that's what we decided to do.

We decided we'd redirect and add an extra authentication steps. Maybe someone could use a finger to trace a maze? Maybe the user could move their head in the old cheat code pattern?

![Cheat code](/images/Screenshot_2020-11-15_at_18.31.02_ld5lrd.png)

Exploring the space, we found lots of ideas and then we found [face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html). This had a face expression recognition and we were inspired.

We decided we'd show our users funny videos and if they laughed we'd invalidate their login. Genius!

![Don't smile picture](/images/Screenshot_2020-11-15_at_18.34.47_ssoeme.png)

We based this largely on one of the examples from the repo. We added in a video, a timer and our logic. [The repo is here](https://github.com/doingandlearning/stop-smiling) if you're interested and it's deployed [here](https://stop-smiling.herokuapp.com/). We couldn't get the iframed video to autoplay so we abandoned our curated list of funny videos and had to stick with one for this prototype.

The action redirects to the Heroku app with a state token as a query parameter. The Heroku app then sends back to `<Auth0 tenant>/continue?state=THESAMESTATETOKEN` with any extra query parameters you want to send. I got tangled in double negatives here -> notsmiling = true/false 🤔.

On the callback, we investigate the query parameters and allow the login to continue or throw an exception based on our logic.

Here's the code for our action:

```
/** @type {PostLoginAction} */
module.exports = async (event, context) => {
  if (event.protocol === "redirect-callback") {
    // console.log(event.actor.query.notsmiling)
    if (event.actor.query.notsmiling === "false") {
      throw new Error("Too much smiling.");
    }
    return {
      user: { userMetadata: { smiling: event.actor.query.notsmiling } }
    };
  }
  return {
    command: {
      type: "redirect",
      url: "https://stop-smiling.herokuapp.com/"
    }
  };
};
```

### So much creativity …

Our plan worked for the most part but the final redirection didn't work quite as expected. The actions team are going to fix that though.

There were a few UI tweaks we suggested but overall it was a really smooth experience. Being able to test the functions before deploying them is a great jump forward from `Rules` and `Hooks` that we've had before.

Some of the other ideas were great (I've forgotten some but I'll try to remember and add them):

- Progressive profiling: As your user logs in, check which fields of their profile aren't filled in yet and ask them one question to fill it in. This stops the sign up process being a long form filling exercise.
- Text to confirm: A Twilio integration that texts when a child uses shared credentials and confirms that this is an authorised login.

This was a lot of fun. I'm looking forward to using these in production and will be watching closely as the platform evolves. It was great working with the team here who were really helpful and open to feedback.

* * *

I love learning new things and sharing what I've found. If this sounds like something you might enjoy then sign up below.
