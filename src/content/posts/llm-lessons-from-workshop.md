---
title: "Unlocking the Potential of LLMs"
date: "2024-08-03"
tags: ["llm", "workshops"]
updateDate: ""
description: "Insights from recent workshops"
draft: false
---

# Unlocking the Potential of Large Language Models: Insights from Recent Workshops

I've delivered a few two-day workshops on “Prompt Engineering” now. When I was asked to prepare them, I was initially worried I wouldn’t find enough material to teach and explore. Could a workshop like this actually deliver value? Would people be interested? Could I create something that wasn’t just me talking for two days?

But as it turns out, Large Language Models (LLMs) have so much to offer, and I wanted to share a few interesting insights from the workshop.

## Not All Models Are Created Equally

If you’ve spent any time with Large Language Models (LLMs), you know the results can vary widely depending on the model you use. Different models can produce different outputs given the same prompt. This variability is due to differences in training data and model architecture, and it can also be impacted by the parameters we use and how the model has been fine-tuned to our context.

### Choosing the Right Model

Some models are optimized for specific tasks, like summarizing text or generating creative content. Selecting the right model for your specific task can make a huge difference. For example, a model trained on legal documents will perform better in legal text generation compared to a general-purpose model. These specialised models can also be smaller and faster, providing more efficient solutions tailored to specific needs.

### The Challenge of Bias

Different models can have inherent biases based on their training data. It's crucial to understand these biases and take steps to mitigate them, especially when deploying models in sensitive applications. By carefully selecting and fine-tuning models, you can ensure more accurate and fair outcomes.

## Chatbots Are Only the Tip of the Iceberg

If you ask most people how LLMs are being used in business, they’ll likely say chatbots. While providing an interface to interact with documentation or handle customer service interactions is a valuable application, it's only the beginning of what LLMs can achieve.

### Beyond Chatbots: Real-World Applications

One of my clients is using LLMs to process all their customer support transcripts, assessing them against various criteria. Previously, this task required a manager to sample individual calls and fill out lists. Now, every call can be checked to ensure compliance with strict regulatory standards, allowing for comprehensive monitoring without increasing the managerial burden.

This use case illustrates how well-crafted prompts enable engineers and front-line staff to collaborate effectively, delivering excellent results. It makes me wonder: What other tasks around inferring meaning and summarizing data might prompts be used for in your business?

## Unit Testing Prompts is an Unsolved Problem

As more business value is derived from applying prompts to live situations, ensuring that the replies are as expected is critical. How can you confidently update a model or deploy it against a new dataset without manually running through hundreds of deployed prompts? Especially in sensitive customer-facing or regulatory environments, the need for accuracy and reliability is crucial.

### Testing for Consistency and Quality

Having a test suite of running prompts against the previous model and the new one is likely part of the solution. For prompts extracting data in structured JSON, validating outputs is relatively straightforward. But some responses, especially those requiring creativity or nuanced understanding, can be subjective and difficult to validate against a single correct answer.

This will likely mean there should be humans involved in these testing environments, more so than in code unit tests. Peer reviews or user feedback (where appropriate) can help assess the quality of the responses. I haven’t seen much evidence that this problem is being solved systematically, but rather, individuals and teams are crafting their solutions to meet specific needs.

## LLMs Can Help Correct Their Own Hallucinations

The news has been filled with stories of LLMs getting it wrong—whether they have told people to put glue on their pizza, that no country in Africa starts with K (but Kenya starts with a K sound), or that strawberry only has 2 r’s in it (I know you just checked :)).

### Chain of Verification Prompting

One thing we can do to help reduce these kinds of hallucinations is to use prompts that force the LLM to share and “reflect” on its reasoning. The literature is growing and has more names for different strategies, but one is called chain of verification prompting.

Chain of verification prompting involves asking the model to break down its reasoning process into verifiable steps, ensuring each step is backed by evidence. By asking follow-up questions like “How do you know this?” and “How confident are you with this answer?”, we can encourage the model to acknowledge its limitations and avoid making unsupported claims.


## Conclusion

I love keeping up to date with where technology is going, and LLMs seem like they are here to stay. I don’t think they are going to take our jobs anytime soon, but I do think we can be more productive when we use them well.

This workshop showed that LLMs offer far more than basic chatbot functionality. They are powerful tools that can revolutionize various business processes, provided they are used thoughtfully and responsibly.

During the workshop, we worked with models locally and through APIs to create prompts that were reliable and helpful. We explored the various ways that we can apply LLMs to our workflows and how to meaningfully integrate them into our applications.

By selecting the right models, addressing biases, testing rigorously, and adopting innovative prompting techniques, businesses can unlock the full potential of LLMs. Whether you are looking to improve customer interactions, streamline operations, or enhance data analysis, LLMs hold the key to a more efficient and insightful future.

--- 

A version of this post first was delivered as a newsletter so if you found this interesting sign up below.

Equally, if you or your team would value this workshop adapted to your needs then reach out.