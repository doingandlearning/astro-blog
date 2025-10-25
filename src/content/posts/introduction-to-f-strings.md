---
title: "Introduction to f-strings"
date: "2025-10-24"
tags: ["python", "tutorial"]
updateDate: ""
description: "A brief introduction to f-strings in Python"
draft: false
---

# Introduction to f-strings

When you're working with strings in Python, you'll often want to join them together. The technical term for this is concatenation.

```python
first_name = "Kevin"
last_name = "Cunningham"
full_name = first_name + last_name
```

This works great, until you want to add in variables that aren't strings.

```python
favorite_number = 42
response = full_name + "'s favorite number is " + favorite_number
```

That code will throw an error because Python doesn't concatenate integers with strings. You can fix it by converting the number to a string first.

```python
response = full_name + "'s favorite number is " + str(favorite_number)
```

That approach works, but it looks a bit clunky. That's not the only problem. A really common issue with this kind of concatenation is forgetting spaces at the beginning and end of strings. This can lead to outputs like "Kevin Cunningham's favorite number is42" with no space before the number.

For a long time, Python has had other ways for you to construct this string. One way is the string `format` method:

```python
response = "{}'s favorite number is {}".format(full_name, favorite_number)
print(response)
# Kevin Cunningham's favorite number is 42
```

With this string method, you add curly braces as placeholders for variables and invoke the `format` method on the string. The arguments of the format method are the variables that need to be substituted in the order that they appear.

This has the advantage that you are less likely to forget spaces or add them in the wrong place. The problem it creates though is remembering to keep the variables in the right order, especially as the number of variables grows.

In Python 3.6, f-strings were introduced and they are a great way to solve all of these problems.

Here's how you could achieve the response above with f-strings:

```python
response = f"{full_name}'s favorite number is {favorite_number}"
```

Notice the "f" character before the opening quote and the curly braces that surround the variables. Any string can become an f-string by preceding it with an f. Wherever you use curly braces in an f-string, Python interpolates - it replaces the expression with its string value. That means you can reference variables like you've done before. More than that though, you can call functions, include calculations, show timestamps, or pull values from APIs directly inside your strings.

```python
shout = f"{first_name.upper()} COME HERE!"
math_sum = f"1 + 1 = {1 + 1}"
```

This makes our code much more readable. It improves your code in three ways at once: 

- you reference the variables where they're needed, 
- let f-strings handle type conversion automatically
- keep spacing and layout clear


On top of all that, this is actually a more performant way to construct strings that include variables. 

There’s also a wide range of formatting options you can use to make your output clearer.

```python
value_of_items = 19.99
quantity_of_items = 3
value_of_single_item = value_of_items / quantity_of_items

print(f"The cost of one item is {value_of_single_item:.2f}")
# The cost of one item is 6.66
```

That `:.2f` will correctly round the number to two decimal places which is likely what you’d want in your output. There are other arguments you can use after the colon to help with spacing, formatting numbers, dates and many other data types.


f-strings allow you to create readable templates for webpages, maintainable dynamic messages for your users and well-formatted output to files and databases.

This tutorial only scratches the surface of f-strings, but it should give you a solid start and the curiosity to explore further.