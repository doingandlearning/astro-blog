---
title: "homebrew and all the updates"
date: "2023-11-27"
tags: ["macos", "brew", "til"]
updateDate: ""
description: "A way to handle all of the brew updates when all you want is one thing"
---

I wanted to quickly `brew install` something last week and was a bit frustrated when it took so long. It should really have taken a few seconds but it took closer to 5 minutes.

Why? Because brew, having been awoken from a lengthy slumber, wanted to update all the things.

I get it brew but do this some other time.

So, like any rational person, I complained on Twitter and got two super helpful responses that will hopefully make my life (and yours) easier.

First from Hrishi:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">HOMEBREW_NO_AUTO_UPDATE=1<br><br>why this is not the default remains one of the unsolved mysteries of the universe</p>&mdash; Hrishi Mittal (@hrishio) <a href="https://twitter.com/hrishio/status/1727974295949754382?ref_src=twsrc%5Etfw">November 24, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Genuis! Don't do that auto-updating brew.

But, then when does brew do it's updating?

Well, Jacob fixes that by having a daily job to run brew update:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I have a script I run daily to update brew, and packages in my brewfile exactly to avoid this problem 😅</p>&mdash; Jacob Stordahl (@stordahldotdev) <a href="https://twitter.com/stordahldotdev/status/1728330105909629180?ref_src=twsrc%5Etfw">November 25, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

With these two excellent pieces of advice, I will be less frustrated by brew the next time I want to use it to install a new package.