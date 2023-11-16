---
title: "Moving to Vue from React"
date: "2021-05-07"
tags: []
---

**Are you a React developer who has a new job mainly run on Vue? Are you excited for the challenge but want to know where to start learning? Are you looking for resources specifically for someone from a React background?**

Let me point out some quick wins and then point you towards more learning resources to help you out.

## 1\. How do I get data to the DOM?

Having your page dynamically update in response to data is one of the main reasons we lean on front-end frameworks like React and Vue. We fetch data from an API and display it in interesting and engaging ways. In React, we use curly braces in JSX to indicate to the compiler that we want to interpolate.

```
<h1>{title}</h1>
```

That same result looks very similar in Vue but, rather than single curly braces, we have double curly braces. This is sometimes referred to as moustache syntax.

```
<h1>{{title}}</h1>
```

In JSX, this same open curly syntax is used when you want to interpolate in element attributes.

```
<img src={myImageVariable} />
```

In Vue, however, we use a `directive` to indicate the the attribute should be interpolated.

```
<img v-bind:src="myImageVariable" />
```

**Things to note:**

- The JavaScript that we want to be processed is passed through as a string.
- It can be a ternary or expression but needs to return a value.
- You'll often see the following abbreviation for binding to an element attribute:

```
<img :src="myImageVariable" />
```

## 2\. How do I add event listeners?

What's the point of an application that doesn't respond to user interactions? We want out applications to respond to events - be that a touch, click or slide event. Here's how we'd add a click event in React that executes a function elsewhere in our code:

```
<div onClick={()=>doSomething()}>
...
</div>
```

In Vue, we have a directive that is used to attach a listener to an element.

```
<div v-on:click="doSomething()">
...
</div>
```

**Things to note:**

- The v-on directive can be applied to both browser events and custom events.
- This directive is also often abbreviated in Vue.

```
<div @click="doSomething()">
  ...
</div>
```

## 3\. Where have all my .map()s gone?

Imagine you have this array in React and think about how you might iterate over it?

```
const incomingArray = [
  {name: "Kevin", age: 38}, 
  {name: "Super Gran", age: 104}, 
  {name: "Spiderman", age: 18},
  {name: "Kid Normal", age: 11}
] 
```

If you're anything like me, you're going to map over it and render the content to the DOM. Something like this?

```
<ul>
 {incomingArray.map((item, idx) => <li key={idx}>
   {item.name} is {item.age} years old.
  </li>)}
</ul>
```

Your React codebase is probably littered with this kinds of operations. In Vue, we use directives to achieve these same goals. We apply them to the HTML elements we care about directly, as if they were normal attributes. They all begin with `v-` but there are a few abbreviations available.

So, what does that look like for our array above?

```
<ul>
  <li v-for="item in incomingArray" v-bind:key="item.name">
    {{item.name}} is {{item.age}} years old.
  </li>
</ul>
```

**Things to note:**

- We use the `v-for` directive to iterate over an array or object
- We define the key on the element itself
- We use double curly braces to interpolate within the content of the element
- We use simple strings within quotes to interpolate within the attributes

## 4\. How can I keep forms up-to-date à la React.useState()?

In React, if I want to maintain control over a form element or control, I am most likely going to lean on `.useState()`. There are libraries that help support this but to connect data it tends to follow a pattern something like this:

```
...
const [name, setName] = React.useState('')
...
<input type="text" 
  name="name" 
  value={name} 
  onChange={(e) => setName(e.target.value)} 
/>
...
```

Does this look familiar? We're passing the data and the setter into the component and then binding the change to an event. In Vue, this looks slightly different.

```
...
data() {
  return {
    name: ""
  }
}
...
<input type="text" name="name" v-model="name" />
```

**Things to note:**

- We have defined the variable in our data function. There are slight differences between how data is declared in Vue 2 and 3. I'm using the Vue 3 approach here.
- The `v-model` directive is handling both the getting and setting. Any change in the input field will be reflected in the data object immediately.

## 5\. How do I handle conditional rendering?

There are times when you want to only show an element in your DOM when there is data passes some checks. Maybe, when the amount of tickets remaining is at a particular level, you want to update the call to action. In React, this might look something like:

```
{ticketsLeft > 20 ? <h3>On sale now</h3> : <h3>Tickets running low!</h3>}
```

If there were more than two possibilities, you might end up with some more complex conditionals.

```
{tickets > 20 && <h3>On sale now</h3>}
{tickets <= 20 && tickets > 5 && <h3>Tickets running low!</h3>}
{tickets <= 5 && tickets > 0 && <h3>Last few remaining!</h3>}
{tickets === 0 && <h3>Sold out, sorry!</h3>}
```

To be honest, you might abstract that to a function with a switch statement maybe?

```
{CTAforTicketNumber(tickets)}
```

I don't know! Anyway, in Vue this looks like this:

```
<h3 v-if="tickets > 20">On sale now!</h3>
<h3 v-else-if="tickets > 5">Tickets running low!</h3>
<h3 v-else-if="tickets > 0">Last few remaining!</h3>
<h3 v-else>Sold out, sorry!</h3>
```

**Things to note:**

- The chain of directives have to be directly beside each other, there can't be other elements in between
- Vue will display the first in the chain that is truthy and ignore the rest
- The HTML elements have to be of the same type

## Where next?

Hopefully, you can see that your React knowledge can be leveraged in this new Vue journey. Saying that, these five areas are not going to allow you to build fully developed solutions for your clients.

- [The Vue documentation is outstanding](https://v3.vuejs.org/guide/introduction.html). I often judge a language or framework based on the quality of the documentation. I think there is a direct correlation between the quality of the on-boarding of new users and the strength of the programming community.
- There are some video platforms the focus solely on Vue, with [Vue Mastery being one](https://www.vuemastery.com/). I've learnt a lot from various courses that they have put out in the past few years.
- If video is your thing, then [the platform I contribute to (egghead.io) has a growing collection of Vue materials](https://egghead.io/q/vue). I have a course on the fundamentals of Vue 3 which is being released in the first week of June.

For me, there is nothing like getting your hands dirty. So, using these resources alongside building and diving into your target codebase is the way forward. I find I learn much better when I come to learning materials with questions.

* * *

If you'd like to get a lesson list for my upcoming course, sign up below and I'll send one your way.
