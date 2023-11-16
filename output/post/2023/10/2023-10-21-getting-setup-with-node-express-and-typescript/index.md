---
title: "Getting setup with Express and TypeScript"
date: "2023-10-21"
---

Setting up a Node.js and Express backend with TypeScript can seem intimidating, but it's quite straightforward once you break it down. Here's a step-by-step guide to get you started:

1. **Initialize a New Node Project**:

```
   mkdir node-ts-backend
   cd node-ts-backend
   npm init -y
```

2. **Install Required Packages**:

```
   npm install express
   npm install --save-dev typescript @types/node @types/express ts-node nodemon
```

- `typescript` is the TypeScript compiler.

- `@types/node` and `@types/express` provide TypeScript type definitions for Node.js and Express, respectively.

- `ts-node` lets you run TypeScript directly without compiling it to JavaScript first.

- `nodemon` watches for file changes and restarts your server. You can use Node's built in watch mode flag (`--watch`) but check your version of Node first.

3\. **Initialize TypeScript Configuration**:

```
   tsc --init
```

This will create a `tsconfig.json` file. Adjust the following settings in this file:

```
   {
     "target": "es6",
     "module": "commonjs",
     "outDir": "./dist",
     "rootDir": "./src",
     "strict": true,
     "esModuleInterop": true,
     "skipLibCheck": true,
     "forceConsistentCasingInFileNames": true
   }
```

These settings specify that:

- Your TypeScript code uses ES6 features and CommonJS modules.

- The compiled JavaScript will be output to a `dist` directory.

- Your source TypeScript files will be inside a `src` directory.

4\. **Setup Nodemon for Development**:  
In your `package.json`, add the following scripts:

```
   "scripts": {
     "start": "nodemon --watch 'src/**/*' -e ts,tsx --exec ts-node src/index.ts"
   }
```

5. **Write Your TypeScript Express App**: Create a `src` directory and inside it, create `index.ts`:

```
   import express, { Request, Response } from 'express';

   const app = express();
   const PORT = 3000;

   app.get('/', (req: Request, res: Response) => {
       res.send('Hello from TypeScript backend!');
   });

   app.listen(PORT, () => {
       console.log(`Server is running on http://localhost:${PORT}`);
   });
```

6. **Run Your App**:

```
   npm start
```

Now, if you visit `http://localhost:3000/`, you should see the message "Hello from TypeScript backend!".

7. **Production Build**:  
    If you want to compile your TypeScript code for production, you can add a build script to your `package.json`:

```
   "scripts": {
     "build": "tsc",
     "start": "nodemon --watch 'src/**/*' -e ts,tsx --exec ts-node src/index.ts"
   }
```

Running `npm run build` will now compile your TypeScript code to JavaScript in the `dist` directory.

With these steps, you should have a basic setup for a Node.js, Express, and TypeScript backend. As your application grows, you might want to add additional tooling, middleware, and types to further enhance your development experience.
