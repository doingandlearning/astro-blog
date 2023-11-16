---
title: "XState & Vue: Traffic Light Example"
date: "2021-06-23"
tags: []
---

I love that we live in a world of rapid innovation, one in which there is always something new to learn. I also love that we have access to the shared wisdom of creators, thinkers and innovators of the past.

I've been participating in a "Portfolio Club" focused on state management. This club is facilitated by the excellent [Lauro Silva](https://twitter.com/laurosilvacom) from egghead.io. The objective is to design, build and document a business-oriented portfolio project that demonstrates and understanding of state management. I love this as well (apparently I love a lot of things)! A tangible outcome over a short period of time, a creation of some artifact that shows understanding, a concrete representation of learning.

State management is not a new topic but it is a really important one. There are new ideas around but the thing I've appreciated most is how a lot of the work and thinking around this topic is decades old. I've been drawn particularly to XState, [David Khoursid](https://twitter.com/DavidKPiano)'s JavaScript library that enables finite state machines and statecharts for the modern web. These ideas are not new - as David talks about often - but they are so helpful with our current problems.

## What problems do state machines solve?

State machines are a well-known tool in lots of different fields - from embedded systems to compilers, to system design and, most relevant to my thinking, UI design. They are a way of modelling a system and describing explicitly how and when to move from one known state to another.

If you've ever found yourself testing multiple boolean values to decide if a UI component should be displayed then these might have something to offer you. For every individual boolean we add to model our state, we double the number of possible states. That means if we have (1) a user, who has (2) toggled a switch which will only display information if they are (3) authorized to see the underlying data and there is (4) data that has happened in the past 7 days, then there are 16 possible combinations of state there. There are several states that we would never want to allow our systems to get into and this is where state machines help us.

## Traffic Lights

I've heard traffic lights be used as a state machine example a few times and thought it would be fun to build it. The lights always follow the same sequence and there are states you never want to get into (red and green simultaneously for example). I spun up a new Vue 3 project and imported [xstate](https://www.npmjs.com/package/xstate) and [@xstate/vue](https://www.npmjs.com/package/@xstate/vue) and got started.

```
<template>
</template>
<script>
import { createMachine } from "xstate";

export const trafficLights = createMachine({
  id: "traffic",
  initial: "red",
  states: {
    red: {
      on: { PROGRESS: "redamber" },
    },
    redamber: {
      on: { PROGRESS: "green" },
    },
    green: {
      on: { PROGRESS: "amber" },
    },
    amber: {
      on: { PROGRESS: "red" },
    },
  },
});
</script>
```

Here I have created an XState Machine called trafficLights. I've declared an id and initial state, then I've passed all of the possible states. There are a [shed-load of possible ways to expand and develop these states](https://xstate.js.org/docs/guides/states.html#state-methods-and-properties) but for this use case I declare each state as a property and then declare which state should be next following a defined event. This is a lot like a useReducer pattern in React or an action in Vuex. When I send the event `PROGRESS`, the state machine will proceed to the next state. You can follow the logic and see it loops around: red->redamber->green->amber->red-> ...

```
import { useMachine } from "@xstate/vue";

export default {
  setup() {
    const { state, send } = useMachine(trafficLights);
    return {
      state,
      send,
    };
  }
};
```

Next, I've used Vue's composition API to use that machine and expose two values to the component - state (which is the currently state of the machine) and send (which is the mechanism to send events to the machine). The composition API is a lot like React hooks and allow us to group logic in more helpful ways.

```
<template>
  <div class="home flex text-center flex-col">
    <p>Traffic Lights</p>
    <div class="text-center">
      <button
        @click="send('PROGRESS')"
        class="border rounded-xl p-4 bg-gray-200 w-1/6 text-center"
      >
        {{ state.value }}
      </button>
    </div>
  </div>
</template>
```

I now have enough to wire up my template. I add a button that send a `PROGRESS` event on click and then interpolate the current value of the state as the button label. Job done! Except, it would be nice to actually see the traffic lights.

```
<template>
  <div :style="style"></div>
</template>

<script>
export default {
  props: {
    color: String,
    active: Boolean,
  },
  computed: {
    style() {
      return `background-color: ${this.color}; opacity: ${
        this.active ? 1 : 0.2
      }`;
    },
  },
};
</script>

<style scoped>
div {
  background: lightblue;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  text-align: center;
  margin: 12px;
}
</style>
```

I made a Circle component that accepts a color and active property. These are both used the compute the style property and this then is applied to an empty div.

```
<template>
...
      <div class="mx-auto w-1/2">
        <Circle color="red" :active="isActive('red')" />
        <Circle color="yellow" :active="isActive('amber')" />
        <Circle color="green" :active="isActive('green')" />
      </div>
...
</template>

<script>
...
import Circle from "../components/Circle";
...
export default {
  components: {
    Circle,
  },
...
  methods: {
    isActive(color) {
      return this.state.value.includes(color);
    },
  },
};
</script>
```

The last step is to use the Circle component. I pass in the color based on the traffic light and isActive checks the current state machine value to see if the light color is included.

You can check out the code in full and play with the result here:

<iframe src="https://codesandbox.io/embed/dank-fire-627pp?fontsize=14&amp;hidenavigation=1&amp;module=%2Fsrc%2Fcomponents%2FTrafficLights.vue&amp;theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="dank-fire-627pp" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

## What's next?

The project I've been working on for the Portfolio Club is called Adventures in Learning. So far, I've been building it with Vuex as the store but once I've finished the basic feature set, I'm keen to explore what doing this with XState might look like. [You can follow along here](https://github.com/doingandlearning/adventures-in-learning) or sign up to my newsletter below where I share about how you can level up as a developer at whatever stage you are in your career.
