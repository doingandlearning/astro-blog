---
title: "Adding Toast Notifications to Next Apps"
date: "2020-05-27"
tags: ["next"]
---

Toast notifications are an awesome way to inform your users of events without moving them off the page and disturbing their flow.

These messages can be positive or negative, communicating success or failure. There are a number of excellent libraries in React to allow this to happen. A lot of them require using a specific context provider around the mounting component which is a bit of an issue with Next. By default, we don't have access to that component, so we need to use a custom app component to allow this to be possible.

I'll assume that you have a Next application already and are enhancing it.

1. The first thing to do is to add the `react-toast-notifications` library with your package manager of choice (other libraries are available but I've had a lot of success with this one).
2. Now, we need to add a custom app component. Head over to the [Next docs](https://nextjs.org/docs/advanced-features/custom-app) and copy the content of the block there. Create a `./pages/_app.js` and paste the content as is.

```
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
export default MyApp
```

3. Import the ToastProvider from `react-toast-notifications` and wrap the component with it.

```
import { ToastProvider } from 'react-toast-notifications'
function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  )
}
export default MyApp
```

Every page will have access to the Provider and be able to share the context with it.

4. On any page you'd like to use a toast, you need to use the useToasts() hook, destructure the addToast() function from it. After that you can use it.

```
import {useToasts} from 'react-toast-notifications'

export default PageComponent() {
  const {addToast} = useToasts();
  return (
    <div>
      <button onClick={()=> addToast('This is a message',
                                    {appearance: "success"})}>
    </div>
  )
}
```

You pass in a string for the Toast and then an options object. The only required property is the appearance - there are 4 possible values for this (success, warning, info, error). These come with default styles but you can override these to suit your application needs.

5. You'll probably want these to auto-dismiss in a period of time for the users. By default, this isn't active but you can set this up in the provider which will then be inherited by all of the toast messages. Hovering over the toast message will interrupt the notifications dismissal.

```
import { ToastProvider } from 'react-toast-notifications'
function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider autoDismiss={true} autoDismissTimeout="2000">
      <Component {...pageProps} />
    </ToastProvider>
  )
}
export default MyApp
```

The timeout is in milliseconds. You can also declare where you want the notifications to appear and a variety of other things. The [full documentation is here](https://github.com/jossmac/react-toast-notifications).

If video is more your jam, I've got a lesson here which works through the same things above.

Use react-toast-notifications to add toast notifications to a Next App
