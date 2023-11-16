---
title: "Extracting notes and highlights from iBooks"
date: "2022-01-03"
tags: []
---

As much as possible, I like to work in plain text. This post is written in Markdown and I like the freedom and versatility that gives me.

I read a lot and on a variety of different devices. I feel that getting all of my notes and highlights into the same place is quite important - it helps with my note taking and allows me to make better connections.

The problem I find is that when I read on my laptop or iPad, the data is hard to get at. On my laptop, iBooks maintains two sqlite3 databases - one for the books and one for the annotations (notes and highlights). I wanted to get all of the data out of there and couldn’t find a tool to be able to manage it. So, I made one in JavaScript (and might migrate it TypeScript soon).

## Getting the data - sqlite3

I used the `sqlite3` package to access the databases. The data I need is in two separate files, so I had to use the attach command to be able to allow both databases to be accessed simultaneously.

```
import sqlite3 from "sqlite3";
import { ANNOTATION_PATH, BOOK_PATH } from "./config.js";

class bookDb {
  constructor() {
    this.db = new sqlite3.Database(ANNOTATION_PATH, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the annotation database.");
    });
    this.db.serialize(() => {
      this.db.run(`attach database '${BOOK_PATH}' as books`);
    });
  }
}
```

I found the documentation for `sqlite3` a little challenging, particularly for data retrieval. The package leans heavily on callbacks and all of the examples I could find `console.log` the data. This is fine to show that data is accessible but not immediately helpful in using the data in the program.

I ended up wrapping the database call in a Promise and then resolving or rejecting based on the query response.

```
  async getAnnotations() {
    const { db } = this;
    const sql = `select 
		ZANNOTATIONASSETID as asset_id,
		ZTITLE as title,
		ZAUTHOR as author,
		ZANNOTATIONSELECTEDTEXT as selected_text,
		ZANNOTATIONNOTE as note,
		ZANNOTATIONREPRESENTATIVETEXT as represent_text,
		ZFUTUREPROOFING5 as chapter,
		ZANNOTATIONSTYLE as style,
		ZANNOTATIONMODIFICATIONDATE as modified_date,
		ZANNOTATIONLOCATION as location
		from ZAEANNOTATION
		left join books.ZBKLIBRARYASSET
		on ZAEANNOTATION.ZANNOTATIONASSETID = books.ZBKLIBRARYASSET.ZASSETID
		order by ZANNOTATIONASSETID, ZPLLOCATIONRANGESTART
		;`;
    try {
      return new Promise((resolve, reject) => {
        db.all(sql, (err, results) => {
          if (err) {
            console.log(`Problem with Table? ${err}`);
            reject(`Problem with Table? ${err}`);
          }
          resolve(results);
        });
      });
    } catch (err) {
      console.log(err);
    }
  }
```

Now, I could initialise my class and get the annotations.

## Templating

I decided to use `mustache` to template my notes in Markdown format. The current version has a very simple template and doesn’t yet use all of the data I’ve queried:

```
# {{ title }}

By {{author}}

## My notes <a name="my_notes_dont_delete"></a>

{{#notes}}
- {{.}}
{{/notes}}
```

I needed to get the render method from mustache. Using ESM, I couldn’t destructure render from the import directly, so I had to do this in two steps:

```
import mustache from "mustache";
const { render } = mustache;
```

I then imported the template, shamelessly using a blocking synchronous function because I don’t have a lot of data.

```
import fs from "fs"
const knownTemplate = fs.readFileSync("./templates/known.md").toString();
```

Now it was time to wrangle my data into a format that was going to be useful. When you delete a book from the iBooks library, the entry is removed but the annotations remain. That means we can’t tell what the source of the highlight or note is. I decided I’d handle both of these cases separately.

First, for the known source:

```
  const sourceKnown = results.filter((item) => item.title);

  let currentResult = [];

  sourceKnown.forEach((result, index) => {
    if (sourceKnown[index - 1]?.title != result.title) { // 1
      if (currentResult.length > 0) { //2
        const formattedTitle = currentResult[0].title.split(" ").join(""); // 3
        const obj = { //4
          title: currentResult[0].title,
          author: currentResult[0].author,
          notes: currentResult.map(
            (result) =>
              `${result.note ? `*${result.note}* ` : ""}${result.selected_text}` 
          ),
        };
        const output = render(knownTemplate, obj); // 5
        fs.writeFileSync(`${NOTE_DIR}${formattedTitle}.md`, output); // 6
      }
      currentResult = [];
    }
    if (result.note || result.selected_text || result.represent_text) { // 7
      currentResult.push(result);
    }
  });
```

1. The annotations have been ordered by title and so, if the current annotation has a different book title from the previous then we have dealt with a full set of annotations.
2. However, there were some occasions where a book has no annotations so I needed to deal with that. Sorry for the nested if loops but I think it’s more readable here.
3. Just tidying up the title to make sure there are no spaces in the file name.
4. This is the object I’ll pass through to the render function. I’m getting the global values from the first item in the array. I’m combining the all of the notes and annotations into a single array that will then be templated.
5. I’m calling the render method with the template and the data.
6. Writing to the file system - again, shamelessly synchronous (maybe that could be a band name?) before clearing out the currentResult array.
7. If the annotation has a note or some selected\_text it should be pushed to the currentResult array.  
    

That only leaves dealing with the unknown sources, which is pretty similar:

```
const unknownTemplate = fs.readFileSync("./templates/unknown.md").toString();

const sourceUnknown = results.filter((item) => !item.title);
const unknownRendered = render(unknownTemplate, {
    notes: sourceUnknown
      .filter((item) => item.selected_text || item.note)
      .map(
        (result) =>
          `${result.note ? `*${result.note}* ` : ""}${result.selected_text}`
      ),
  });
fs.writeFileSync(`${NOTE_DIR}/source_unknown.md`, unknownRendered);
```

The only difference here is that we can wrangle and render the data in one step before writing to the file system.

## A decent first step

This has allowed me to get all of my highlights into Markdown files and add them into my note-taking process. It was a fun learning experience to get to know sqlite a bit more. I’ve extracted the configuration into a file so that other people could use it but there is more to do to allow this to be a more generally. Useable tool.

[Here’s the repo](https://github.com/doingandlearning/ibooks-highlights) if you’re interested :)
