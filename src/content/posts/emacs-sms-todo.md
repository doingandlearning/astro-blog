---
title: "Adding todos with SMS"
date: "2020-08-21"
tags: ["emacs"]
---

Recently, I've been moving my life over to Emacs. This started before the summer when Ian Jones mentioned org-roam as an alternative to Roam. Having enjoyed Roam but also loving owning my own data and knowing where it is, I tried it out.

I described Emacs as a pair of old slippers last week (my wife once used that phrase to describe me but that's another story). For those who don't know Emacs, it is a text editor but it is a lot more.

Real enthusiasts describe it as an operating system. Any operation with text is possible - email, texting, code editing, writing, blogging, and on and on.

Real haters say it's even harder to get out of than Vim. I like Vim.

I'm using Doom Emacs which is Emacs but with a whole lot of Vim bindings. This is sometimes jokingly referred to as a better version of Vim than Vim.

I won't explain all the reasons I love Emacs here (doesn't use a lot of system processes, adaptable and extensible, written in a Lisp, …) instead I want to talk about a problem I've been having.

## GTD

I'm a proponent of David Allen's Get Things Done approach to productivity. Collecting todos, processing, reviewing and prioritising - deciding on the next tasks and having a reliable system to comfort a spiralling brain. Putting a task into a system you trust allows you to forget about it for now. Future you has this!

Emacs is great for this. You can collect todos, schedule them, refile them and set deadlines. I've been enjoying this but my problem was I couldn't really add to it when I wasn't at my computer. I wanted a way to get my todos into Emacs while I was away from my computer. I trust that when I'm back at my computer I'll deal with them.

I backup all of my notes with Dropbox and I walk everywhere with my phone. The _obvious_ answer then is to create a SMS integration with Dropbox that will append a new line to my todo list - right? Surely your brain had gone there already.

## Getting Dropbox setup

I headed over to [Dropbox's developer portal](https://www.dropbox.com/developers/), logged in, went to the App Console and created a new app.

![Dropbox developer portal](https://p64.f2.n0.cdn.getcloudapp.com/items/Jru6xl4x/Image%202020-08-21%20at%202.54.04%20pm.png?source=viewer&v=66be67644ed1df52d04b0e1dbc899a57)

I gave this new app permissions to read and write to my files

![Dropbox app permissions](https://p64.f2.n0.cdn.getcloudapp.com/items/eDuBRzll/Image%202020-08-21%20at%202.56.30%20pm.png?source=viewer&v=5080d69b560b4db1015d5fe4a25592aa)

and generated an access token with no expiration date.

![Dropbox App Token](https://p64.f2.n0.cdn.getcloudapp.com/items/kpubnk8q/Image%202020-08-21%20at%202.57.45%20pm.png?source=viewer&v=2f558f89f242e4f552db808abab50ff0)

The last thing I needed from Dropbox was the path to my inbox, in my case this was /gtd/inbox.org.

## Get my Twilio number

I headed over to Twilio and setup a new project. Each new project gets a trial balance which I'm hoping will last me for a while.

With this project, I went to Phone Numbers and claimed one that could receive SMS messages in my region (the UK). This costs about 80p/month and recieving text messages costs less than 1p each. After all my testing and setup I have over $11 left in my trial account which should do me for most of the next year.

I'm using a free Dropbox account, Emacs (which is free) and Twilio (which will be free for the next year) - so pretty cost effective so far.

## Configure and code my Twilio function

  
Twilio provide runtime serverless functions with a maximum execution time of 10s. This is more than I need. I need to receive the text, get the current inbox, add the new todo to the bottom and swap the result with the inbox on Dropbox.

Here's my code (improvements welcome - I couldn't seem to stop the callback from activating too early using normal async/await or Promises so it's in a setTimeout).

```
const fetch = require("isomorphic-unfetch");
const Dropbox = require("dropbox").Dropbox;
const request = require("request");

const TOKEN = process.env.TOKEN;

const dbx = new Dropbox({
  accessToken: TOKEN,
  fetch,
});

const downloadLink = async () => {
  return await dbx
    .filesGetTemporaryLink({ path: "/gtd/inbox.org" })
    .then((response) => {
      return response.link;
    })
    .catch((error) => console.log(error));
};

const uploadLink = async () => {
  return await dbx
    .filesGetTemporaryUploadLink({
      commit_info: { path: "/gtd/inbox.org", mode: "overwrite" },
    })
    .then((response) => {
      return response.link;
    })
    .catch((error) => console.log(error));
};

const uploadFile = async (file, link) => {
  request.post(
    link,
    {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: Buffer.from(file),
    },
    function optionalCallback(err, httpResponse, bodymsg) {
      if (err) {
        console.log(err, httpResponse);
      } else {
        console.log(bodymsg);
      }
    }
  );
};

async function updateTodo(todo, callback) {
  try {
    const upload = await uploadLink();
    const download = await downloadLink()
    .then(
      async (link) => {
      return  await request(link, function (error, response, body) {
          uploadFile(body + `** TODO ${todo} :sms:\n`, upload);
          return body
        })
    });
    setTimeout(() => {callback()}, 2000)
  } catch (err) {
    console.log(err);
  }
}

exports.handler = async function(context, event, callback) {
    const body = event.Body ? event.Body : null;

    if (body) {
        await updateTodo(body, callback)
    }

};
```

The work starts at the bottom with the handler. We check if there is a body and if there is we add it to the body.

We then call our update function which does all the heavy lifting.

Here we get the upload link first. This tripped me up a bit as I didn't know how to set the mode to overwrite. The Dropbox documentation for the API and the SDK could do with simplification and better examples.

We next get a temporary download link from Dropbox, use that to download the file, append our new todo with the correct syntax and a tag of sms and then upload.

The setTimeout stops the callback from executing too early and it needs to execute otherwise Twilio logs it as an error when it runs over 10s.

## Add dependencies

I configured my function to add the app token and the dependencies to the run time environment.

![adding dependencies](https://p64.f2.n0.cdn.getcloudapp.com/items/9ZuXQ2Gk/Image%202020-08-21%20at%203.32.31%20pm.png?source=viewer&v=1d9fa0a4edc4c966bb5052b7f08aa60d)

## Point my number to the function

The last thing to do then is to configure the phone number to use this function when a text message comes in.  
![Twilio phone number config](https://p64.f2.n0.cdn.getcloudapp.com/items/WnuJ041J/Image%202020-08-21%20at%203.11.02%20pm.png?source=viewer&v=17478ebc5167b6f042952124712957f5)

## And that's it …

I can now text this number and a new todo will appear on my list. I think it's pretty cool. My wife is also enjoying texting to add new things here … hopefully noone else gets the number otherwise I'll have to revisit the function and send rude text messages back to those jokers!

If you think this has been useful I might make a tutorial for egghead about it. Let me know if you have any code improvements and any suggestions for how to make Emacs even cooler.

Also, sign up for the newsletter at the bottom of the page :)
