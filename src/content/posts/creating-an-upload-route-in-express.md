---
title: "Creating an upload route in Express"
date: "2020-10-02"
tags: ["express"]
---

When uploading files to a server, there are common tasks you will want to carry out. Check the file type, move the file to a final location, check the filesize and file name.

You could use the filesystem module (fs) and write some helper functions to do this. Instead, you could use a middleware available on npm.

I'm going to take that approach in this tutorial.

```
npm install express-fileupload
```

I won't go through setting up an Express server here. You should have it setup and configured for the rest of this tutorial. If you need some help with that, I've got (https://egghead.io/playlists/building-an-api-with-express-f1ea).

Head to your server file and import the new middleware. Somewhere after you declare your app, tell it to use this new middleware.

```
const fileUpload = require("express-fileupload")
const app = express()
app.use(fileUpload())
```

What is this doing? It is adding `express-fileupload` to the middleware chain. Each middleware accepts the request, response and the next function. They will each interact with the request and the response. In our instance, `express-fileupload` will interact with the request. The middleware validates each file and adds extra properties and helper functions.

Let's setup a POST route that we'll use to upload an image.

```
app.post("/upload-image", (req,res) => {})
```

Within our function, we'll use a try/catch to handle our code.

I'll deal with the unhappy path first. In the catch, we'll accept the error and log it to the console. Then, we'll return the response - but not before we change the status and send the error.

```
app.post("/upload-image", (req,res) => {
  try {

  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})
```

To use this route, we are going to send a multipart form. These form objects attach any file to the `files` property of the request object.

We're going to see if that property exists and then, if it does exist, make sure that it isn't empty. If either of those things are true then we will throw an error. This will be picked up by our catch and sent back to the user.

```
app.post("/upload-image", (req,res) => {
  try {
    if(!req.files || Object.keys(req.files).length === 0) {
      throw {msg: "No image uploaded."}
    }

  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})
```

Finally, we'll get the file we are expecting from the object. This will correspond to the id in the form or the key we set in the request.

The middleware has added a `mv` or move function to each of the files. We're going to use that function to move the file to it's final location. It takes two arguments, the final path and a callback function.

After the file is uploaded, I want it to be available to my front end. That means I'm uploading to my public directory, using the filename set by the user in my directory.

The callback function accepts any error and throws if it is present. Otherwise, we send a message back to our client to let them know it has succeeded.

```
app.post("/upload-image", (req,res) => {
try {
    if(!req.files || Object.keys(req.files).length === 0) {
      throw {msg: "No image uploaded."}
    }

    let image = req.files.imageFile

    image.mv(`./public/${image.name}`, (err) => {
      if (err) {
        throw err
      }
      res.send({msg: "File uploaded."})
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})
```

## Testing

I use [Insomnia](https://insomnia.rest/) on the Mac as my API client of choice. I've used Postman before and it's pretty good. It has a lot of functionality I don't need though, so I stick with the simplier Insomnia.

First, let's make sure that we get an error if we don't send a file.

![Screenshot 2020-10-02 at 16.25.19.png](/images/9bjG-TQzv.png)

Now, we'll set the body type to multi-part form,  
![Screenshot 2020-10-02 at 16.25.29.png](/images/Tnjdr0WXq.png)

attach our file and send.  
![Screenshot 2020-10-02 at 16.26.15.png](/images/nG9Ah3uGq.png)

Awesome! It all worked!

I've made a video lesson showing the same thing if that's more your speed :)

Enjoy!

Follow me on [Twitter](https://www.twitter.com/dolearning) and signup below for my newsletter.
