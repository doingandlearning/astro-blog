---
title: "Creating calendar events from a Google form"
date: "2020-10-28"
categories: 
  - "low-code"
---

I think being able to code is a super power. I also think that we are often too quick to use this super power.

https://twitter.com/dolearning/status/1319262958279643137

  
A week ago, a friend who works for a charity approached me. They were using a Google form to collect details for meetings and then manually creating calendar events.

> Is it possible to automate the creation of the calendar events?

This seemed like a good use of coding super-powers so I dove in.

Since we were already in Google, I thought I'd leverage their APIs rather than trying to do something more bespoke or complicated.

![Selecting script editor in Google](images/oabVol0qz.png)

The documentation for Google Scripts is [here](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app). The two services we are most interested in this case are `SpreadsheetApp` and `CalendarApp`.

```
function createNewEvents() {
 const sheet = SpreadsheetApp.getActiveSheet();
 const range = sheet.getDataRange();
 const data = range.getValues();
 ...
}
```

I created a function, grabbed the current active sheet and then extracted the data. Using the data in this way can be pretty brittle. It's necessary that the columns of target Google Sheet are the same as I'm expecting to be.

I added a column at the end of the form data to track whether we had booked this row already. If we have, we pass over this row and start again.

```
 for (let i = 1; i < data.length; i++) {
   const bookedCell = range.getCell(i + 1, 11);
   const bookedCellContent = bookedCell.getValue();

   if (bookedCell.getValue() === true) continue;
```

The sheet is zero-indexed and, since the people are in the second and third row we extract them like this.

```
   const person1 = data[i][1];
   const person2 = data[i][2];
```

Then, we have two entries from the form. First, the date and secondly the time. So, we extract these

```
   const date = new Date(data[i][3]);
   const time = new Date(data[i][4]);
```

and then construct a booking date by combining both of these fields.

```
   const bookingDate = new Date(
     date.getFullYear(),
     date.getMonth(),
     date.getDate(),
     time.getHours(),
     time.getMinutes(),
     time.getSeconds()
   );
```

Each meeting is going to last an hour, so we add an hour and create an endTime date object.

```
   const endTime = new Date(
     date.getFullYear(),
     date.getMonth(),
     date.getDate(),
     time.getHours() + 1,
     time.getMinutes(),
     time.getSeconds()
   );
```

Now, we have almost everything we need to create a new calendar event. The last thing we need is the calendar id.

You can get this in the Google calendar settings.

![Screenshot 2020-10-28 at 08.08.36.png](images/bZoUHHUFH.png)

Let's create the event

```
  CalendarApp
    .getCalendarById("kev.cunningham@gmail.com")
    .createEvent(
      `Meeting between ${person1} and ${person2}`,
      bookingDate,
      endTime
    );
```

and then mark this row as booked.

```
    bookedCell.setValue(true);
```

Back in the form, we can create drawing and assign our script to the button.

![Screenshot 2020-10-28 at 08.22.21.png](images/2J37pAkVA.png)

The first time this runs, Google will request permissions for the Calendar and Sheet, and then will process the sheet and add the events.

* * *

This is saving time at my friend's charity already. Not only that, now anyone with permission to the calendar can press that button and book the events. For now, they don't want to trigger it automatically but that is definitely a good next step.

Are there ways you could use these "lower" code approaches to speed up your processes? Let me know if this is helpful and sign up to my newsletter below for more content like this.
