---
title: "Using parseArgs in Node"
date: "2022-08-09"
---

In Node 18.3, [parseArgs was added to the core util](https://nodejs.org/api/util.html#utilparseargsconfig) module. This is still marked as experimental but is a great addition to CLI tools you might be building.

Up until now, to able to parse arguments you'd need to use a 3rd party library or to write some custom logic to handle this. Here's some code I wrote for a recent project:

```
const flags = [];
process.argv.forEach((arg) => {
  if (/^-/.test(arg)) {
    flags.push(arg.replaceAll("-", ""));
  }
});
```

This code loops over `process.argv` and gathers the arguments. I then tested the array for the presence of a given string:

```
if (flags.includes("a") || flags.includes("add")) {
```

Let's refactor this code to use the new util function. We'll import the new method and create a functions object:

```
import { parseArgs } from "node:util";

const options = { 
  add: { 
    type: "boolean", 
    short: "a" 
  } 
};
```

The options object takes the long form of a given argument as the key and a configuration object as a value. Here's the TypeScript interface for that configuration object:

```
interface Configuration {
  type: 'boolean' | 'string' // required
  short?: string // optional
  multiple?: boolean // optional, default `false`
};
```

There are two possible types of argument in this method, boolean and string. The boolean type will be undefined if the argument isn't present but true if it is. The string type will capture the string the immediately follows to the variable.

If passed a short option, then this will be available. So, our options allow the argument to be passed as `--add` or `-a`.

Next, we'll pass the options through the arguments and destructure the value.

```
const {
  values: { add },
} = parseArgs({ options });
```

This makes our conditional much more readable:

```
if (add) {
```

You can see this in action in my quizme project [here](https://github.com/doingandlearning/egghead-building-a-node-cli/tree/main/16-using-parseargs).

Here's the code difference of the refactor:

![](https://res.cloudinary.com/kc-cloud/images/v1660060007/CleanShot-2022-08-09-at-16.46.08/CleanShot-2022-08-09-at-16.46.08.png?_i=AA)

Code difference for using parseArgs

You can work through the whole build of this project in my egghead course, [Get Started Building CLI Tools with Node.js](https://egghead.io/courses/get-started-building-cli-tools-with-node-js-2af0caec).

I've just recorded a new video for this refactor.
