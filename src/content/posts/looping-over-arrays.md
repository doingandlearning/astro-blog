---
title: "Looping over arrays"
date: "2022-12-12"
tags: []
---

If I had to pick my favourite data type in JavaScript, it would definitely be the array. I love the power and versatility that an array offers and appreciate the many methods that are available.

There are lots of ways to loop over an array.

## 1\. map - loop and transform

If you want to get a new array of the same length as the current one but with modified contents, then `map` is for you.

```
const names = ["Mary", "Martha", "Morgan", "Matthew"]

const upperCasenames = names.map((value, index, wholeArray) => value.toUpperCase())
```

The map method takes a callback function that receives three arguments - the current value, the current index and the whole array. If I ignore the one's I don't need, I could just have:

```
const upperCasenames = names.map(value => value.toUpperCase())
```

The method works through each of the elements and returns a new element based on the callback.

```
console.log(upperCasenames) // Prints ["MARY", "MARTHA", "MORGAN", "MATTHEW"]
```

This method is a powerful way of transforming the contents of the array, maybe creating HTML elements or altering the text in some way. If these were objects, we could be picking out particular properties. We could be using the whole array to add more detail or the index to give more context.

What if wanted to do something like count the number of "a"s in the array.

## 2\. forEach - loop and do something

The forEach method doesn't return anything but receives a callback that is invoked once for each element of the array.

```
let aCount = 0

names.forEach(name => aCount += name.match(/a/gi).length)
```

Here, I have set up a counter and then looped over each of the names. I'm using a regular expression to match all the "a"s in a case-insensitive way. That returns an array whose length gets added to my count.

In December, I often find myself working through the Advent of Code challenges and I often stream some of my efforts. A challenge from one of those might have been which name contains the 3rd letter a.

I didn't know that you can't break from a forEach, so I'll need to fall back to the standard for loop.

## 3\. for loop - loop however you want!

The 3 part for loop is present in lots of languages having been inherited from C.

```
let aCount = 0

for(let idx = 0; idx < names.length; idx ++) {
  aCount += names[idx].match(/a/gi).length
  if(aCount >= 3) {
    console.log(`The name at index ${idx}, ${names[idx]} contains the 3rd a`)
    break
  }

}
```

Here, we manually keep track of the index as we iterate through the array. Then, when we reach our target, we log and break.
