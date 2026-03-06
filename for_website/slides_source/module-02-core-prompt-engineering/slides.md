# Core Prompt Engineering Principles

**Module 2 — Harwell Prompt Engineering**

---

## Learning objectives

By the end of this module you will be able to:

- <span class="fragment">Write developer-focused prompts that are clear, contextual, and constrained</span>
- <span class="fragment">Apply zero-shot, few-shot, and chain-of-thought prompting appropriately</span>
- <span class="fragment">Iteratively refine prompts when output is wrong or incomplete</span>
- <span class="fragment">Use these techniques for technical problem-solving in chat tools</span>

---

## Bridge from Module 1

**What we learned last time:**

- <span class="fragment">**Where** to use AI (public vs. enterprise)</span>
- <span class="fragment">**When** to trust vs. verify</span>

**The problem:**

- <span class="fragment">❌ You've tried asking AI for help, but the answer was too vague</span>
- <span class="fragment">❌ It didn't understand your context</span>
- <span class="fragment">❌ It gave you something that doesn't fit your codebase</span>
- <span class="fragment">❌ You don't know how to fix it</span>

**Today:** Learn **how** to prompt effectively.

---

## The developer's prompt: the problem

**Bad prompt example:**

> "Write some code for Spring Boot"

**Problems:**

- <span class="fragment">❌ Too vague — what kind of code?</span>
- <span class="fragment">❌ No context — which version? What's the task?</span>
- <span class="fragment">❌ No constraints — what style? What patterns?</span>

**Result:** Generic, unusable output

---

## The developer's prompt: three Cs

---

**Clarity** — What do you want?

- <span class="fragment">Task: generate, explain, refactor, test</span>
- <span class="fragment">Format: code block, inline, with comments</span>

---

**Context** — What does the model need to know?

- <span class="fragment">Stack: Spring Boot 3, Java 17, JPA</span>
- <span class="fragment">File: "In the UserController class"</span>
- <span class="fragment">Current state: "This method already exists"</span>

---

**Constraints** — What are the rules?

- <span class="fragment">Language: Java 17 style</span>
- <span class="fragment">Style: Follow Spring Boot best practices</span>
- <span class="fragment">Don'ts: "Don't use @Autowired"</span>

---

## Clarity: task and format

**Example — vague:**

> "Write a controller"

---

**Example — clear:**

> "Generate a Spring Boot REST controller with one GET endpoint that returns a list of users"


**Better:**

- <span class="fragment">✅ Task: Generate</span>
- <span class="fragment">✅ What: REST controller</span>
- <span class="fragment">✅ Format: GET endpoint, returns list</span>

---

## Context: stack, file, constraints

**Example — no context:**

> "Generate a controller"

---

**Example — with context:**

> "Generate a Spring Boot 3 REST controller using Java 17. The endpoint should return ResponseEntity<User>. I'm working in the UserController class."

**Better:**

- <span class="fragment">✅ Stack: Spring Boot 3, Java 17</span>
- <span class="fragment">✅ File: UserController</span>
- <span class="fragment">✅ Return type: ResponseEntity<User></span>

---

## Constraints: language, style, don'ts

**Example — no constraints:**

> "Generate a Spring Boot controller"

---

**Example — with constraints:**

> "Generate a Spring Boot 3 REST controller using Java 17. Use constructor injection (not @Autowired), return ResponseEntity<User>, and include proper error handling. Don't use Optional for return types."

**Better:**

- <span class="fragment">✅ Style: Constructor injection</span>
- <span class="fragment">✅ Patterns: ResponseEntity, error handling</span>
- <span class="fragment">✅ Don'ts: No Optional returns</span>

---

## Zero-shot prompting

**What is zero-shot?**

Just ask, no examples.

---

**Example:**

> "Explain what @RestController does in Spring Boot"

**When to use:**

- <span class="fragment">✅ Well-known concepts</span>
- <span class="fragment">✅ Quick answers</span>
- <span class="fragment">✅ Standard patterns</span>

---

**Limitation:**

- <span class="fragment">❌ May not match your style or needs</span>

---

## Few-shot prompting

**What is few-shot?**

Add 1–2 examples to guide style.

**Example:**

> "Generate a controller like this:
> ```java
> @RestController
> public class ProductController {
>     private final ProductService service;
>     public ProductController(ProductService service) {
>         this.service = service;
>     }
> }
> ```
> Now generate another one for User."

---

**When to use:**

- <span class="fragment">✅ When you want specific style</span>
- <span class="fragment">✅ When format matters</span>
- <span class="fragment">✅ One example can change everything</span>

---

## Chain-of-thought prompting

**What is chain-of-thought?**

Ask for step-by-step reasoning.

---

**Example:**

> "Refactor this method. First explain what it does, then suggest improvements step by step, then show the refactored code."

**When to use:**

- <span class="fragment">✅ Complex tasks</span>
- <span class="fragment">✅ When accuracy matters</span>
- <span class="fragment">✅ Debugging or design decisions</span>

---

## When to use which technique

| Technique | Use when |
|-----------|----------|
| Zero-shot | Well-known patterns, quick answers |
| Few-shot | You want specific style or format |
| Chain-of-thought | Complex refactoring, debugging, design |

**Progressive building:** Start simple (zero-shot), add complexity as needed.

---

## Iterative refinement: the problem

**Demo:** Run a vague prompt, show poor output

**Problems:**

- <span class="fragment">❌ Output doesn't match your needs</span>
- <span class="fragment">❌ Missing context or constraints</span>
- <span class="fragment">❌ Wrong style or patterns</span>

**Question:** How do you fix it?

---

## Iterative refinement: read the output

**Diagnosis:**

1. <span class="fragment">**What's missing?** — Identify gaps</span>
2. <span class="fragment">**What's wrong?** — Spot issues</span>
3. <span class="fragment">**What would make this better?** — Think about improvements</span>

---

**Example:**

- <span class="fragment">Output uses @Autowired → Missing constraint</span>
- <span class="fragment">Output uses Spring Boot 2 → Missing context (we use Spring Boot 3)</span>
- <span class="fragment">Output doesn't match our style → Need few-shot example</span>

---

## Iterative refinement: refine the prompt

**Add missing context:**

> "I'm using Spring Boot 3, not 2"

**Tighten instructions:**

> "Use constructor injection, not @Autowired"

---

**Add examples:**

> "Like this: [example]"

**Add constraints:**

> "Don't use Optional for return types"

---

## Iterative refinement: re-run and compare

**Before:** Vague prompt → Generic output

**After:** Clear prompt with context and constraints → Targeted output

**Key point:**

Prompting is iterative, not one-shot.

**Practice:** Refine based on output until it works.

---

## Summary

1. <span class="fragment">**Clarity**: Task + format</span>
2. <span class="fragment">**Context**: Stack + file + constraints</span>
3. <span class="fragment">**Constraints**: Language + style + don'ts</span>
4. <span class="fragment">**Techniques**: Zero-shot, few-shot, chain-of-thought</span>
5. <span class="fragment">**Iterative**: Refine based on output</span>

---

## Bridge to Module 3

**What we've learned:**

- <span class="fragment">**How** to prompt effectively (3Cs, techniques, iteration)</span>

**What's next:**

**Module 3**: AI-Assisted Java Development — **what** to prompt for (code generation, explanation, refactoring, testing).

Apply the 3Cs and iterative refinement throughout.

---

# Questions?

*Module 2 — Core Prompt Engineering Principles*
