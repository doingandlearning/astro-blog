# Prompt template — Harwell Prompt Engineering

Use this structure to get consistent, useful answers from AI when writing or reviewing code.

---

## 1. Context (role + environment)

- **Role:** e.g. "You are a senior Java developer..."
- **Stack:** e.g. "Spring Boot 3, Java 17, JUnit 5, Mockito."
- **Style:** e.g. "Use constructor injection, no @Autowired. Prefer immutable DTOs."

---

## 2. Clarity (one clear ask)

- State the **task** in one sentence.
- Specify **input** (e.g. "Here is the method..." or "Given the entity below...").
- Specify **output** (e.g. "Return only the refactored method" or "List the steps, then the code").

---

## 3. Constraints (what to avoid)

- e.g. "Do not use deprecated APIs."
- e.g. "Do not add dependencies we don't already have."
- e.g. "Keep the same method signature."

---

## Example (paste into your AI tool)

```
Context:
- Role: Senior Java developer
- Stack: Spring Boot 3, Java 17, JUnit 5, Mockito
- Style: Constructor injection, no @Autowired

Task: Generate a JPA repository interface and a service method that returns all books by author. Return ResponseEntity<List<Book>>.

Constraints:
- Use the existing Book entity. Do not add new dependencies.
- Include error handling for empty results.
```

---

*From the Harwell Prompt Engineering course. Replace placeholders with your own context.*
