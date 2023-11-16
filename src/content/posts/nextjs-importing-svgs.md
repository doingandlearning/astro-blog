---
title: "Importing SVGs to Next.js"
date: "2020-12-14"
tags: ["next"]
---

SVGs are great! They are scalable vector graphics. As they are vector based they can be scaled to be huge or tiny and they won't pixelate. They are made up of XML describing the paths and shapes needed to make the final image. They are an excellent choice for responsive web design but importing them to your Next.js application isn't always straight-forward.

This article will look at a few different ways to approach this common task.

## Including directly

`<svg>` is a standard HTML tag that can be directly used in JSX. That means if your SVG is quite short, it can be easiest to include it in place.

## Using the `<img>` tag

You can use a regular img tag and reference the SVG by URL. You need to place the image in the `/public` directory and reference it relative to that.

```
<img src="/eye.svg" alt="An SVG of an eye" />
```

This file would be in the root of the `public` directory.

## Use next/image

Equally, you could use the `Image` component that is included in `next/image`. The only thing to be aware here is that this component requires the height and width to be passed through as props.

```
<Image src="/eye.svg" height={30} width={30} />
```

## As a component

You can include it as component in your document and call it as you need. This has the benefit of keeping the SVG code in one place.

It isn't much further from this to have this SVG as a component in a separate file.

Once you have your SVG as a component, you can pass it props to alter it's appearance. You receive the props and then use them directly on your SVG.

# Importing as a file

If you try to import an SVG directly as a file like this,

```
import eye from "../assets/eye.svg";
```

you will get an error that looks like this:

```
 Module parse failed: Unexpected token (1:2)
 You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
```

To be able to make this work, you'll need to either add a webpack or babel extension.

Let's look at a webpack solution first.

## SVGR

This tool comes built in with create-react-app, so if you've used that before then this will be a familiar tool.

First, use yarn or npm to install `@svgr/webpack` to your project. You'll then need to create or add to your `next.config.js` in the root of your project.

```
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
};
```

Webpack can sometimes be a little bit incomprehensible to me. Here we are adding a rule (`rules.push`). Specifically, we test if the file is an SVG and, if it is, we use the library we installed above.

It's worth noting that if you make changes to your `next.config.js` you'll need to restart the development server before you'll notice the changes.

Once restarted, the error above should be gone.

## babel plugin

If you'd rather not hook into webpack, you can use babel instead. There is a plugin called `babel-plugin-inline-react-svg`. Install the library and then create a `.babelrc` in the root of your repo.

`.babelrc` is an object that has two keys, presets and plugins. In presets, we are going to add `next/babel`. This is included in the project anyway but by adding a configuration file we need to specify it explicitly.

For our plugins, we are going to add `inline-react-svg`. So, the final file will look like this.

```
{
  "presets": [
    "next/babel"
  ],
  "plugins": [
    "inline-react-svg"
  ]
}
```

## next-images

If you'd rather have one solution that covers a number of different image types, then `next-images` is a library that might be of interest. This is a plugin optimised for Next.js and allows for a `svg`, `ico`, `jp2` and other types of images to be imported into your projecct.

Once the dependency has been installed, this one needs a `next.config.js` configuration as well.

```
const withImages = require("next-images");
module.exports = withImages();
```

# Which one should you use?

I'm not the boss of you :)

I have a decision tree that looks a bit like this:

- Do I want control over the SVG?
- Component with props
- Is it an image that is going to be content managed?
- `next-images` or webpack
- Is it an image I'm only going to use once?
- Stick it in the `public` direct and reference it directly

How about you? Which approach do you prefer and why?

[Here's a Codesandbox](https://codesandbox.io/s/next-import-svg-8rip3) with all of the various options we've discussed in this post.

* * *

Next.js and Headless WordPress are my jam at the moment. If this has been useful and you'd like helpful tips like this arrive in your inbox once a week, sign up below.
