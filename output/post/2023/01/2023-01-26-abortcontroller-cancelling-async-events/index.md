---
title: "AbortController - Cancelling Async Events"
date: "2023-01-26"
---

The AbortController global object has been available and stable in Node since v15.4.0. However, I still find myself working with teams that don't use it or haven't even heard of it.

## What problem does the AbortController solve?

In 2015, we got Promises - woohoo!

In 2017, we got the syntactic sugar of async/await - super woohoo! They are still promises but they look nicer!

Sometimes it turns out that an asynchronous operation doesn't need to occur after it has already started.

- A user might make a second request that supercedes the first

- A user might close their connection and you want to cancel the work that is being carried out for them

- A server might stop responding and you want to move on, close the connection and gain back those resources

The AbortController is going to help us in each of these situations.

## How do we handle this?

One solution is to not start the operation until it's definitely needed, but this would generally be the slowest implementation.

Another approach is to start the operation, and then cancel it if conditions change. A standardised approach to canceling asynchronous operations that can work with fire-and-forget, callback-based and promise-based APIs and in an async/await context would certainly be welcome. This is why Node core has embraced the **[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)** with **AbortSignal** Web APIs.

While AbortController with AbortSignal can be used for callback-based APIs, it's generally used in Node to solve for the fact that promise-based APIs return promises.

To use a very simple example, here's a traditional JavaScript timeout:

```
const timeout = setTimeout(() => {  
  console.log('will not be logged')  
}, 1000)

setImmediate(() => { clearTimeout(timeout) })
```

This code will output nothing. The timeout is cleared before its callback can be called.

How can we achieve the same thing with a promise-based timeout? Let's consider the following code. We're using ESM here to take advantage of Top-Level Await:

```
import { setTimeout } from 'timers/promises'

const timeout = setTimeout(1000, 'will be logged')

setImmediate(() => {  
  clearTimeout(timeout) // do not do this, it won't work  
})

console.log(await timeout)
```

This code outputs "**will be logged**" after one second.

Instead of using the global **setTimeout** function, we're using the **setTimeout** function exported from the core **timers/promises** module. This exported **setTimeout** function doesn't need a callback, instead it returns a promise that resolves after the specified delay. This means that the **timeout** constant is a promise, which is then passed to **clearTimeout**. Since it's a promise and not a timeout identifier, **clearTimeout** silently ignores it.

So the asynchronous timeout operation never gets canceled.

Below the **clearTimeout** we log the resolved promise of the value by passing **await timeout** to **console.log**.

This is where accepting an **AbortSignal** can provide a conventional escape-hatch for canceling a promisified asynchronous operation.

We can ensure the promisified timeout is canceled like so:

```
import { setTimeout } from 'timers/promises'

const ac = new AbortController()  
const { signal } = ac  
const timeout = setTimeout(1000, 'will NOT be logged', { signal })

setImmediate(() => {  
  ac.abort()  
})

try {  
  console.log(await timeout)  
} catch (err) {  
  // ignore abort errors:  
  if (err.code !== 'ABORT_ERR') throw err  
}
```

This now behaves as the typical timeout example, nothing is logged out because the timer is canceled before it can complete.

The **AbortController** constructor is a global, so we instantiate it and assign it to the **ac** constant. An **AbortController** instance has a **signal** property. We pass this via the options argument to **timers/promises setTimeout**.

Internally the API will listen for an abort event on the **signal** instance and then cancel the operation if it is triggered.

We trigger the abort event on the **signal** instance by calling the **abort** method on the **AbortController** instance, this causes the asynchronous operation to be canceled and the promise is fulfilled by rejecting with an **AbortError**.

An **AbortError** has a **code** property with the value **'ABORT\_ERR'**, so we wrap the **await timeout** in a **try/catch** and rethrow any errors that are not **AbortError** objects, effectively ignoring the **AbortError**.

Many parts of the Node core API accept a **signal** option, including **fs**, **net**, **http**, **events**, **child\_process**, **readline** and **stream**.

## How about you?

Are you using the AbortController throughout your Node code?
