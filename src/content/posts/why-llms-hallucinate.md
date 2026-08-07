---
title: "Why LLMs hallucinate"
date: "2026-08-06"
tags: []
updateDate: ""
description: ""
draft: false
---

Ask a question of an LLM and you'll get an answer. Sounds good but is the answer actually correct and valid? 

> How do I compare two passwords in a timing-safe way?

```
Use secureCompare(a, b) from `crypto.utils`. It is timing-safe and recommended.
```

This might be spot on but it's told with a level of confidence and specificity that makes it challenging to disagree with. The problem is that in Node, the function is actually `timingSafeEqual`. Where is the LLM getting the information from?

1. The training data

LLMs need *a lot* of data to train on. Thinking of any large amount of code and some of it is going to be excellent on every metric, some of it is going to be terrible on those same metrics and, statistically, most of it is going to be somewhere in the middle. 

That is true of security, performance, correctness or any other measure.

The other wringle in training data is that it has a cut-off date. As APIs change, software evolves and information updates the LLM doesn't 'know' things have changed. 

So, that's the first place.



2. The prompt

What you actually type to the LLM is key. The quality of the question (and there are many frameworks that are available to improve that) is going to greatly imapct the quality of that answer. Garbage in and garbage out. The slightly unnerving piece is that if your question is vague and unclear, the LLM will infer meaning. It will guess.  

3. The context

The other data that you provide with the prompt will also inform the LLM predictation of the answer. Snippets of code, information about your codebase, previous turns in a conversation - all of these will be used to help predict the next token. 

4. Tool call results

LLMs can call tools when they (non-deterministically) decide they need to. This could be web searches, MCPs with other information or grep/cat calls to your codebase. 


---

Given all of that information we'd hope that the response is going to be correct. LLMs are trained to give answers that look right but, inherently, they are not able to tell if the responses *are* correct. We need to be able to verify these responses. 

- Check that API/method names are right. Check official documentations rather than AI summaries.
- Package names. Are these real? Have they been made up?
- Version-specific claims. Claims like `as of x you should use y` are subject to change and are easily made up.
- Security, performance, correctness, style - all of the things that we need to stand behind should be checked and confirmed.

---

Confidence isn't correctness and hallucinated answers look right - that's what makes this kind of problem dangerous. 

The pattern we need to follow is pretty well-known by now but it's good to repeat.

Prompt + context => response

validateResponse(response) 

We are the ones responsbile for the finished product. It's our users and employers who will feel the impact of any problem and it will be us, not the LLM, who might lose our jobs or customers if it all goes wrong.


