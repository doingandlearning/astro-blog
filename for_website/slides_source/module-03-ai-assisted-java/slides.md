# AI-Assisted Java Development

**Module 3 — Harwell Prompt Engineering**

---

## Learning objectives

By the end of this module you will be able to:

- <span class="fragment">Use AI to generate boilerplate, entities, and service layers in Spring Boot 3</span>
- <span class="fragment">Use AI to explain legacy code and unfamiliar codebases</span>
- <span class="fragment">Apply refactoring strategies with AI: modernizing code safely</span>
- <span class="fragment">Generate unit tests (JUnit 5/Mockito) with AI assistance</span>
- <span class="fragment">Evaluate AI output for correctness, style, and fit before applying</span>

---

## Bridge from Module 2

**What we learned last time:**

- <span class="fragment">**How** to prompt effectively (clarity, context, constraints)</span>
- <span class="fragment">Zero-shot, few-shot, chain-of-thought techniques</span>
- <span class="fragment">Iterative refinement</span>

---

**The problem:**

- <span class="fragment">❌ You know how to prompt, but what should you ask for?</span>
- <span class="fragment">❌ How do I explain legacy code I don't understand?</span>
- <span class="fragment">❌ Can AI help me refactor safely?</span>
- <span class="fragment">❌ How do I generate tests that actually work?</span>

**Today:** Learn **what** to prompt for in Java development.

---

## Code generation: the problem

**Scenario:** You need a Book entity with JPA annotations, repository, and service method

**Manual approach:**

- <span class="fragment">❌ Write entity, add annotations, create repository interface, write service method</span>
- <span class="fragment">❌ Time-consuming: 15-20 minutes for boilerplate</span>
- <span class="fragment">❌ Error-prone: Easy to miss annotations, wrong return types</span>

**Result:** Slow, repetitive, error-prone

---

## Code generation: the solution

**AI approach:**

- <span class="fragment">✅ Generate complete entity with proper annotations</span>
- <span class="fragment">✅ Fast: 30 seconds vs. 15 minutes</span>
- <span class="fragment">✅ Consistent: Follows Spring Boot patterns</span>

---

**Prompt example:**

> "Generate a Spring Boot 3 JPA entity for a Book with fields: id (Long, primary key), title (String), author (String), isbn (String, unique), publishedYear (Integer). Use Java 17."

---

## Code generation: progressive building

**Start simple:**

1. <span class="fragment">Entity only</span>
2. <span class="fragment">Add repository interface</span>
3. <span class="fragment">Add service class with constructor injection</span>
4. <span class="fragment">Add controller with REST endpoint</span>

**Build incrementally** — don't ask for everything at once.

---

## Code generation: refinement

**Initial output** (maybe uses @Autowired):

```java
@Autowired
private BookRepository repository;
```

**Refine prompt:**

> "Use constructor injection, not @Autowired"

---

**Improved output:**

```java
private final BookRepository repository;

public BookService(BookRepository repository) {
    this.repository = repository;
}
```

**Key point:** Review and refine iteratively.

---

## When to generate vs. write manually

| Generate with AI | Review carefully | Write manually |
|-----------------|------------------|----------------|
| Boilerplate (entities, DTOs) | Business logic | Security/auth |
| CRUD operations | Complex algorithms | Payment processing |
| Repository interfaces | Performance-critical code | Compliance code |
| Service stubs | | |

---

## Code explanation: the problem

**Scenario:** You inherited a JSF/GWT component you don't understand

**Problems:**

- <span class="fragment">❌ Hard to read: Old patterns, verbose syntax</span>
- <span class="fragment">❌ No documentation: Why was it written this way?</span>
- <span class="fragment">❌ Risk: Don't know what it does or what breaks if changed</span>

**Result:** Fear of touching legacy code

---

## Code explanation: the solution

**Prompt example:**

> "Explain what this code does step by step. Why might it have been written this way? What are the dependencies?"

**AI provides:**

- <span class="fragment">✅ Functional explanation</span>
- <span class="fragment">✅ Historical context</span>
- <span class="fragment">✅ Dependency analysis</span>
- <span class="fragment">✅ Modern equivalent suggestions</span>

---

## Code explanation: layers of understanding

**Layer 1:** "What does this do?" (functional explanation)

**Layer 2:** "Why was it written this way?" (historical context)

**Layer 3:** "What's the modern equivalent?" (migration path)

**Layer 4:** "What are the risks if I change it?" (dependency analysis)

**Progressive building:** Start with "what," build to "how to modernize."

---

## Refactoring: the problem

**Example:** Procedural method with loops, null checks, verbose logic

**Problems:**

- <span class="fragment">❌ Hard to read: Nested loops, multiple null checks</span>
- <span class="fragment">❌ Not modern: Java 8+ features not used</span>
- <span class="fragment">❌ Error-prone: Easy to introduce bugs</span>

**Result:** Code that works but is hard to maintain

---

## Refactoring: the solution

**Prompt example:**

> "Refactor this method to use Java 17 Streams API. Extract null checks into filters. Improve readability while maintaining the same behavior."

**AI suggests:**

- <span class="fragment">✅ Stream-based refactor</span>
- <span class="fragment">✅ More readable: Functional style</span>
- <span class="fragment">✅ Modern: Uses Java 17 features</span>

---

## Refactoring strategies

**Strategy 1:** Extract method (break down large methods)

**Strategy 2:** Replace loops with Streams

**Strategy 3:** Add null-safety (Optional, null checks)

**Strategy 4:** Improve naming and structure

**Progressive building:** Start with one strategy, add more as needed.

---

## Refactoring: safety first

**Always:**

- <span class="fragment">⚠️ Run tests before and after</span>
- <span class="fragment">⚠️ Review the diff carefully</span>
- <span class="fragment">⚠️ Verify behavior hasn't changed</span>

**Example:** Refactor that breaks a test → fix it → tests pass

**Key point:** Refactoring is safe when you have tests.

---

## When to refactor with AI

| Good for AI refactoring | Be careful | Don't use AI |
|------------------------|------------|--------------|
| Readability improvements | Performance-critical code | Security-sensitive logic |
| Modernizing syntax | | |
| Extracting methods | | |
| Reducing duplication | | |

---

## Unit testing: the problem

**Scenario:** You need tests for a service method

**Manual approach:**

- <span class="fragment">❌ Write test class, set up mocks, write assertions</span>
- <span class="fragment">❌ Time-consuming: 10-15 minutes per test method</span>
- <span class="fragment">❌ Easy to miss: Edge cases, null handling</span>

**Result:** Tests are written slowly or skipped

---

## Unit testing: the solution

**Prompt example:**

> "Generate JUnit 5 and Mockito tests for this service method. Cover happy path, null input, and empty list scenarios. Use Java 17."

**AI generates:**

- <span class="fragment">✅ Complete test class</span>
- <span class="fragment">✅ Includes mocks setup</span>
- <span class="fragment">✅ Covers multiple scenarios</span>

---

## Unit testing: progressive quality

**Level 1:** Basic test (happy path only)

**Level 2:** Add edge cases (null, empty, exceptions)

**Level 3:** Add parameterized tests

**Level 4:** Add integration test suggestions

**Build from basic to comprehensive.**

---

## Unit testing: running and fixing

**Generated test** → Run it → One test fails

**Diagnosis:** What's wrong? (maybe mock not set up correctly)

**Refine prompt:**

> "Fix the mock setup for the repository"

**Re-run** → Tests pass

**Key point:** Tests are iterative too — generate, run, refine.

---

## Test best practices

**Cover:**

- <span class="fragment">✅ Happy path</span>
- <span class="fragment">✅ Edge cases (null, empty, exceptions)</span>
- <span class="fragment">✅ Proper mocking (Mockito)</span>
- <span class="fragment">✅ Clear assertions</span>

**Verify:**

- <span class="fragment">⚠️ Tests actually test the right thing</span>
- <span class="fragment">⚠️ Don't trust tests without running them</span>

---

## Review before paste: the problem

**Example:** AI generates code with wrong API

**Problems:**

- <span class="fragment">❌ Wrong version: Uses Spring Boot 2 instead of 3</span>
- <span class="fragment">❌ Wrong patterns: Doesn't match team style</span>
- <span class="fragment">❌ Security issue: Missing validation</span>

**Result:** Code that doesn't work or introduces bugs

---

## Review before paste: evaluation checklist

**Before applying AI output, check:**

- <span class="fragment">✅ **Correctness:** Does it compile? Does it work?</span>
- <span class="fragment">✅ **Version:** Right Spring Boot/Java version?</span>
- <span class="fragment">✅ **Style:** Matches team conventions?</span>
- <span class="fragment">✅ **Security:** No obvious vulnerabilities?</span>
- <span class="fragment">✅ **Tests:** Can I test this?</span>

---

## Common issues to spot

**Wrong API versions:**

- <span class="fragment">Spring Boot 2 vs. 3 APIs</span>
- <span class="fragment">Java 8 vs. Java 17 features</span>

---

**Deprecated patterns:**

- <span class="fragment">@Autowired vs. constructor injection</span>
- <span class="fragment">Old exception handling</span>

---

**Security issues:**

- <span class="fragment">SQL injection risks</span>
- <span class="fragment">Missing validation</span>
- <span class="fragment">XSS vulnerabilities</span>

---

**Performance problems:**

- <span class="fragment">N+1 queries</span>
- <span class="fragment">Inefficient algorithms</span>

---

## When to reject AI output

**Reject if:**

- <span class="fragment">❌ Wrong version or API</span>
- <span class="fragment">❌ Doesn't match team style</span>
- <span class="fragment">❌ Security concerns</span>
- <span class="fragment">❌ Too complex or unclear</span>
- <span class="fragment">❌ Better to write manually</span>

**Remember:** AI assists, but you're responsible for the code.

---

## Summary

1. <span class="fragment">**Generation:** Boilerplate, entities, services — fast and consistent</span>
2. <span class="fragment">**Explanation:** Legacy code, unfamiliar patterns — understand before changing</span>
3. <span class="fragment">**Refactoring:** Modernize safely — always test before/after</span>
4. <span class="fragment">**Testing:** Generate tests — run and refine iteratively</span>
5. <span class="fragment">**Review:** Always evaluate before applying — correctness, version, style, security</span>

---

## Bridge to Module 4

**What we've learned:**

- <span class="fragment">**What** to prompt for in Java development (generation, explanation, refactoring, testing)</span>

**What's next:**

**Module 4:** Tooling Strategies — IDE integrations, chat tools, workflow optimization.

Apply generation, explanation, refactoring, and testing throughout.

---

# Questions?

*Module 3 — AI-Assisted Java Development*
