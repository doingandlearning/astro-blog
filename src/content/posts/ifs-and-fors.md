---
title: "Ifs and Fors - some rules of thumb"
date: "2023-11-19T21:07"
tags: ["heuristics"]
dateUpdated: ""
description: "A helpful post on some heuristics around a few common coding structures"
---

I came across the post [Push Ifs Up and Fors Down](https://matklad.github.io/2023/11/15/push-ifs-up-and-fors-down.html) from Alex Kladov (aka matklad) about ifs and fors.

I love a helpful mental model when stepping in to code and this one applies in whichever language you're working on.


> If there’s an if condition inside a function, consider if it could be moved to the caller instead:

Alex talks through a number of helpful implications of this, including more easily spotting dead branches. When more of the conditionals are co-located then it's easy to see when they overlap and when they annul each other.

> Few things are few, many things are many. Programs usually operate with bunches of objects.

Again, Alex's examples are top notch. I particularly liked his walrus example which I'll repeat here:

```js
// GOOD
if condition {
  for walrus in walruses {
    walrus.frobnicate()
  }
} else {
  for walrus in walruses {
    walrus.transmogrify()
  }
}
// BAD
for walrus in walruses {
  if condition {
    walrus.frobnicate()
  } else {
    walrus.transmogrify()
  }
}
```

Here, both bits of advice have composed well together. We have moved the if statement up, meaning we only check the condition once. We then don't iterate needlessly on instances of walrus that would fail our condition anyway.

I think I found this article on Hacker News. As usual though, when I land on a new blog, I find the feed and subscribe. There's lots of great stuff on the rest of the site and I'm looking forward to learning more from Alex soon.
