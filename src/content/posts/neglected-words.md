---
title: "Neglected Words Stream"
date: "2024-01-08T20:12"
tags: ["stream", "node", "fastify"]
updateDate: ""
description: "First stream in a while - exploring neglected words"
draft: false
---

I've got two main tasks this week:

- Record some videos for a course
- Prepare teaching resources for upcoming courses

Today was the first day back in routine after the holidays and inspired by [Charlie Coppinger](https://twitter.com/TheCoppinger) I decided to stream to help keep my motivation up.

So, I pulled up my idea inbox and found a link to a list of [words that deserve wider use](https://wordwarriors.wayne.edu/list).

Each word has its definition and use in a sentence and is structured like this:

```html
<li class="border-solid border-b border-grey-light py-4" id="Abate">
  <h2 class="mb-0 word">Abate</h2>
  <p class="sentence">After an hour in the cellar, we breathed easier as the sound of the wind began to abate. </p>
  <p class="submitter">Word submitted by: Christopher Williams, Livonia Mi, United States</p>
</li>
```

It's a static HTML page and I wanted to use Node to parse the HTML and then persist it to a file.

I used Cheerio to be able to access get the data and parse it:

```ts
import { load } from "cheerio";

const url = "https://wordwarriors.wayne.edu/list";

async function getWords(): Promise<Array<Word>> {
  const response = await fetch(url);
  const data = await response.text();
  const $ = load(data);
  const words: Array<Word> = [];
  let i = 0;
  $("li").each((i, el) => {
    const wordElement = $(el).find(".word");
    const definitionElement = $(el).find(".definition");
    const sentenceElement = $(el).find(".sentence");
    if (
      !wordElement.text() ||
      !definitionElement.text() ||
      !sentenceElement.text()
    )
      return;
    words.push({
      word: wordElement.text(),
      definition: definitionElement.text(),
      sentence: sentenceElement.text(),
      id: i++,
    });
  });
  return words;
}
```

`fetch` is now a Node global now and so didn't need any import. 

With  the text of the body, we instantiate Cheerio with the text and assign it to a variable. You can call the variable anything you want but there is a general convention to use `$`. This is a reminder to those of us who have used jQuery before.

You can now use this function to access elements:

```js
$("li")    // by tag
$("#word") // by id
$(".word") // by class
```

The returned element has a `.each()` method that allow you to loop over everything that matches the query.

Within each li then, we find the word, definition and sentence which are all identified by class. We then append this to an array with an id.

For the rest of the stream, we built a fastify API to serve the data which was a lot of fun.

I think I might stream tomorrow and make a game using the data. I've got a React course coming up in a few weeks, so I'll probably build in React.

<strong>If you're around at 2pm GMT, I'll see how much I can get done in an hour.</strong>

Here's the [Git repo](https://github.com/doingandlearning/neglected-words) of what we've been working on.

I can't decide whether it's worth putting the video of the stream up on YouTube or not. 