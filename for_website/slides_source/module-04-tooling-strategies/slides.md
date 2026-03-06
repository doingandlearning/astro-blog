# Tooling Strategies (Mixed Environment)

**Module 4 — Harwell Prompt Engineering**

---

## Learning objectives

By the end of this module you will be able to:

- <span class="fragment">Apply the "sidecar" workflow: using browser-based AI effectively alongside an IDE without native AI plugins</span>
- <span class="fragment">Describe the "integrated" workflow: in-IDE features (context awareness, diff views) for teams using JetBrains or VS Code</span>
- <span class="fragment">Compare chat interfaces vs. inline code completion: pros, cons, and when to use each</span>
- <span class="fragment">Choose a workflow that fits your team's tools and constraints</span>

---

## Bridge from Module 3

**What we learned last time:**

- <span class="fragment">**What** to prompt for in Java development</span>
- <span class="fragment">Code generation, explanation, refactoring, testing</span>

**The problem:**

- <span class="fragment">❌ Your IDE doesn't have AI built-in</span>
- <span class="fragment">❌ You're switching between browser and IDE constantly</span>
- <span class="fragment">❌ You don't know when to use chat vs. inline completion</span>
- <span class="fragment">❌ Your team uses different tools</span>

**Today:** Learn **how** to use AI tools effectively in your environment.

---

## The problem: mixed environments

**The reality:**

- <span class="fragment">Teams use different IDEs: NetBeans, IntelliJ, VS Code, Eclipse</span>
- <span class="fragment">Some have AI plugins, some don't</span>
- <span class="fragment">Some have enterprise AI, some use public tools</span>
- <span class="fragment">❌ No one-size-fits-all solution</span>

**The pain points:**

- <span class="fragment">❌ Copy-paste between browser and IDE is slow</span>
- <span class="fragment">❌ Lose context when switching tools</span>
- <span class="fragment">❌ Don't know which tool to use for which task</span>
- <span class="fragment">❌ Inconsistent workflows across team</span>

---

## Two workflows

**Sidecar**: Browser + IDE (works everywhere)

**Integrated**: IDE plugins (requires tool support)

Both can be effective with the right approach.

---

## Sidecar workflow: the naive approach

**What happens:**

1. <span class="fragment">Open ChatGPT in browser</span>
2. <span class="fragment">Copy code from IDE</span>
3. <span class="fragment">Paste into chat</span>
4. <span class="fragment">Get answer</span>
5. <span class="fragment">Copy back to IDE</span>

---

**Problems:**

- <span class="fragment">❌ Loses context (file names, project structure)</span>
- <span class="fragment">❌ Generic answers that don't fit</span>
- <span class="fragment">❌ Slow context switching</span>

---

## Sidecar workflow: optimized

**Keep browser and IDE side-by-side**

**Context header** — always include:

```
I'm working in a Spring Boot 3 application, Java 17, using JPA.
Project structure: standard Maven layout.
```

**Benefits:**

- <span class="fragment">✅ AI understands your stack</span>
- <span class="fragment">✅ More relevant answers</span>
- <span class="fragment">✅ Faster iteration</span>

---

## Context header: progressive building

**Level 1**: Basic context (stack, version)

```
Spring Boot 3, Java 17, JPA
```

---

**Level 2**: Add file name and purpose

```
Spring Boot 3, Java 17, JPA
File: UserService.java — service layer for user management
```

---

**Level 3**: Include relevant dependencies

```
Spring Boot 3, Java 17, JPA, Spring Security
File: UserService.java — service layer
```

---

**Level 4**: Describe specific problem

```
Spring Boot 3, Java 17, JPA
File: UserService.java
Problem: Need to add validation for email format
```

---

## Sidecar: copy-paste best practices

- <span class="fragment">Copy code with line numbers or file context</span>
- <span class="fragment">Paste back with review (don't blindly accept)</span>
- <span class="fragment">Use diff view if possible</span>
- <span class="fragment">Test immediately after pasting</span>

---

**When sidecar works well:**

- <span class="fragment">✅ No IDE plugin available</span>
- <span class="fragment">✅ Need to explore multiple solutions</span>
- <span class="fragment">✅ Working with documentation or examples</span>
- <span class="fragment">✅ Team uses different IDEs</span>

---

## Integrated workflow: IDE plugins

**What integrated means:**

- <span class="fragment">AI features built into IDE (JetBrains AI Assistant, GitHub Copilot, VS Code Copilot)</span>
- <span class="fragment">Context-aware: IDE knows your project structure</span>
- <span class="fragment">Inline completion: Suggestions as you type</span>
- <span class="fragment">Chat within IDE: No browser switching</span>

---

**Benefits:**

- <span class="fragment">✅ Project context automatically included</span>
- <span class="fragment">✅ No copy-paste needed</span>
- <span class="fragment">✅ Diff views for applying changes</span>
- <span class="fragment">✅ Faster iteration cycle</span>

---

## Integrated workflow: features

**Feature 1: Inline code completion**

- <span class="fragment">Shows suggestions as you type</span>
- <span class="fragment">Accept/reject individual suggestions</span>

---

**Feature 2: Chat with project context**

- <span class="fragment">IDE includes file structure automatically</span>
- <span class="fragment">Can reference specific files</span>

---

**Feature 3: Diff views**

- <span class="fragment">See proposed changes before applying</span>
- <span class="fragment">Review line-by-line</span>
- <span class="fragment">Apply selectively</span>

---

## Integrated workflow: limitations

- <span class="fragment">⚠️ May not have access to all project files</span>
- <span class="fragment">⚠️ Context window limits</span>
- <span class="fragment">⚠️ May require enterprise license</span>
- <span class="fragment">⚠️ Different features across IDEs</span>

---

**When integrated works well:**

- <span class="fragment">✅ Team standardizes on one IDE</span>
- <span class="fragment">✅ Enterprise AI available</span>
- <span class="fragment">✅ Need fast, local edits</span>
- <span class="fragment">✅ Working within single file or module</span>

---

## Chat vs. inline completion

**The confusion:**

- <span class="fragment">When do I use chat?</span>
- <span class="fragment">When do I use inline completion?</span>
- <span class="fragment">Can I use both?</span>

**Answer:** Use the right tool for each task.

---

## Chat interfaces: when to use

**Use chat for:**

- <span class="fragment">✅ **Exploration**: "How do I implement X?"</span>
- <span class="fragment">✅ **Multi-file tasks**: "Refactor this across 3 files"</span>
- <span class="fragment">✅ **Design decisions**: "Should I use strategy or factory pattern?"</span>
- <span class="fragment">✅ **Explanation**: "What does this legacy code do?"</span>
- <span class="fragment">✅ **Learning**: "Explain Spring Boot dependency injection"</span>

**Chat is for exploration and design.**

---

## Inline completion: when to use

**Use inline for:**

- <span class="fragment">✅ **Boilerplate**: Entity classes, DTOs</span>
- <span class="fragment">✅ **Simple edits**: Add validation, fix syntax</span>
- <span class="fragment">✅ **Completions**: Method signatures, imports</span>
- <span class="fragment">✅ **Quick fixes**: Error corrections</span>

**Inline is for localized edits.**

---

## Decision framework

**Use chat when:**

- <span class="fragment">Exploring solutions</span>
- <span class="fragment">Designing architecture</span>
- <span class="fragment">Multi-file refactoring</span>
- <span class="fragment">Explaining code</span>
- <span class="fragment">Learning concepts</span>

---

**Use inline when:**

- <span class="fragment">Local edits</span>
- <span class="fragment">Boilerplate generation</span>
- <span class="fragment">Quick completions</span>
- <span class="fragment">Simple fixes</span>

**Use both:** Chat to design, inline to implement.

---

## Mixed environments: making it work

**The reality:**

- <span class="fragment">Team members use different IDEs</span>
- <span class="fragment">Some have enterprise AI, some don't</span>
- <span class="fragment">Need consistent workflows</span>

---

**Strategies:**

- <span class="fragment">**Shared prompt templates**: Team maintains context headers</span>
- <span class="fragment">**Documentation**: Share effective prompts</span>
- <span class="fragment">**Pair programming**: Cross-train on different tools</span>
- <span class="fragment">**Policy alignment**: Ensure everyone follows data privacy rules</span>

---

## Mixed environments: best practices

- <span class="fragment">✅ Standardize on prompt style, not tools</span>
- <span class="fragment">✅ Share effective prompts in team wiki</span>
- <span class="fragment">✅ Review code regardless of tool used</span>
- <span class="fragment">✅ Test AI-generated code thoroughly</span>

**Focus on consistency in approach, not tools.**

---

## Summary

1. <span class="fragment">**Sidecar workflow**: Browser + IDE with context headers — works in any environment</span>
2. <span class="fragment">**Integrated workflow**: IDE plugins with project context — faster but requires tool support</span>
3. <span class="fragment">**Chat vs. inline**: Chat for exploration/design, inline for localized edits</span>
4. <span class="fragment">**Mixed environments**: Standardize on prompt style, not tools</span>

---

## Bridge to Module 5

**What we've learned:**

- <span class="fragment">**How** to use AI tools effectively (sidecar or integrated)</span>
- <span class="fragment">**When** to use chat vs. inline completion</span>

**What's next:**

**Module 5**: RAG — connecting AI to your own knowledge base.

Tool workflows apply whether using public AI or RAG-enhanced systems.

---

# Questions?

*Module 4 — Tooling Strategies (Mixed Environment)*
