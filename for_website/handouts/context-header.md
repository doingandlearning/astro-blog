# Context header for sidecar AI — Harwell Prompt Engineering

When you use a **browser-based AI** (e.g. ChatGPT, Copilot) alongside an IDE that doesn’t have AI built in, paste this header **above** your code so the model knows your environment. Then paste your code and ask your question.

---

## Copy-paste template

```
Context:
- Framework: Spring Boot 3
- Java version: 17
- Style: Constructor injection (no @Autowired)
- Testing: JUnit 5, Mockito
- Database: JPA/Hibernate

Code:
[Paste your code here]

Question: [Your question]
```

---

## Customise for your project

- Change **Framework** and **Java version** to match your stack.
- Add **Style** rules (e.g. "No Optional in public API", "Use records for DTOs").
- Add **Testing** (e.g. "JUnit 5, AssertJ").
- Add **Database** or other tech (e.g. "PostgreSQL", "MongoDB").

---

## Why use it?

- Without context, the AI gives **generic** answers that may not match your codebase.
- With this header, you get answers that respect your stack and style and reduce back-and-forth.

---

*From the Harwell Prompt Engineering course (Module 4 — Tooling strategies).*
