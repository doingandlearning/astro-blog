---
title: "Building CLIs for Humans"
date: "2022-07-04"
---

When someone who is less technical sees a terminal in use, they can feel intimidated and overwhelmed.

The reality is that the command line should empower users not scare them.

Here's some thoughts on how.

## 1\. Adaptive onboarding

A new native or web app takes its time to show users how to achieve the key tasks with the tool. These tooltips can be skipped if not needed but help to situate the user.

CLIs often expect users to have read the docs and to know which combination of flags and arguments the user needs to do their job.

Other tools have dialogue driven interactions.

What about a mixture of the two? A dialogue that, having achieved the goal, also let's the user know which arguments and flags would do the same thing.

The dialogue helps the newer user and allows for more complex configuration (npm init), the arguments and flags work for speed and automation (npm init -y).

## 2\. Don't defy expectations

When opening a native application, it's predictable where to find the \`About\` or \`Help\` information.

Similarly, we are used to passing \`--help\` and \`--version\` to find the same information on a CLI.

When designing your own tool make sure you have these, along with othere expections (returning zero exit code on success, sending output to stdout and logs/errors to stderr, etc).

It's great to be innovative but there's a time and a place.

## 3\. Show don't (just) tell

In using the command line, the user is signalling that they have some technical expertise (or that they've copied some code from SO).

Provide them with details and not just a flashing cursor, particularly if the CLI takes more than a second or two. But, don't just dump a wall of text.

The best tools give detailed technical output alongside more visual representations. The docker toolchain does a great job of achieving both these goals.

## 4\. Have some whimsy

When designing a CLI, your primary audience is another human.

Use some colour on the terminal, alongside the technical add some encouraging or funny feedback or give helpful hints as to what might come next.

Help your users achieve their goals with a slight smile as they go about the rest of their day.

* * *
