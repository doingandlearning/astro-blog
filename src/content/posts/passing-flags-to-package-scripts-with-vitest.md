---
title: "Passing Flags to Package Scripts with vitest"
date: "2023-10-06"
tags: []
---

In the realm of JavaScript development, the subtleties in running package scripts can make a significant difference in workflows. One nuance, often overlooked but crucial, is passing flags to package scripts using `npm run`. Here, we'll focus on this, bringing light to the ins and outs of flag management, using `vitest` as our guide.

#### The Preliminaries

Executing a package script typically follows this familiar structure:

```
npm run test
```

This runs the corresponding script in our `package.json`.

```
  "scripts": {
    "test": "vitest"
  },
```

For our `vitest` example, this would initiate the test in watch mode, ensuring developers obtain instant feedback upon making code changes.

#### The Conundrum with Flags

Passing flags might seem intuitive at first, but there's a snag. If you're aiming to utilize the user interface (ui) of `vitest`, your first instinct might be:

```
npm run test --ui
```

However, this won't activate the ui as one might expect. The reason? The `--ui` flag gets interpreted by `npm`, not the `vitest` script.

#### The Magic of Double Dash

Enter the elegant solution: the double dash `--`.

The rule of thumb: To direct flags to the intended package script, always prepend them with an additional `--`.

Therefore, to launch `vitest` with its ui, the correct command is:

```
npm run test -- --ui
```

Here, the initial `--` instructs `npm` to relay all subsequent parameters to the package script, bypassing `npm` itself. In essence, `npm run test -- --ui` is internally processed as `vitest --ui`.

#### Nuggets of Wisdom

1. **Trimming Redundancies**: It's pivotal to recognize and prune redundant commands. For example, both `npm run test run` and `npm run test once` might serve identical purposes.

3. **Optimizing Script Commands**: If certain flags are seldom used, consider passing them inline using the double dash technique. This negates the need for creating entirely separate scripts for every flag variant.

#### Wrap-up

Mastering the art of flag passage to package scripts via `npm run` not only simplifies your development cycle but also prevents unintended script behaviors. With a clear grasp on the double dash `--` mechanism, you'll maneuver through your `npm` and `vitest` tasks with renewed confidence and efficiency.
