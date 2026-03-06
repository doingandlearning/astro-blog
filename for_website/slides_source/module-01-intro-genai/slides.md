# Introduction to GenAI for Developers

**Module 1 — Harwell Prompt Engineering**

---

## The problem we're solving

You've heard AI can help with coding, but...

- <span class="fragment">❌ Which tool should I use?</span>
- <span class="fragment">❌ Is it safe to paste my code?</span>
- <span class="fragment">❌ Can I trust what it tells me?</span>
- <span class="fragment">❌ What if it's wrong?</span>

**Today**: Answer these questions so you can use AI confidently and safely.

---

## The LLM landscape: too many choices

**The confusion:**

- <span class="fragment">Multiple models: GPT-4, Claude, Gemini, Llama...</span>
- <span class="fragment">Multiple providers: OpenAI, Anthropic, Google, Microsoft...</span>
- <span class="fragment">**Problem**: "Which one do I use?"</span>


---

**The reality:**

- <span class="fragment">No single "best" model</span>
- <span class="fragment">Different strengths: code vs. reasoning vs. speed vs. cost</span>
- <span class="fragment">**Solution**: Choose by task and policy</span>

---

## The LLM landscape

- <span class="fragment">Multiple **model families**: GPT-4, Claude, Gemini, Llama, etc.</span>
- <span class="fragment">Multiple **providers**: OpenAI, Anthropic, Google, Meta, Microsoft, open-source</span>
- <span class="fragment">Different **strengths**: code, reasoning, long context, speed, cost</span>
- <span class="fragment">Key question: **which tool for which job?**</span>

---

## Model families and providers

| Dimension    | Examples                          |
| ------------ | --------------------------------- |
| Generalist   | GPT-4, Claude, Gemini             |
| Code-focused | Copilot models, Codex lineage     |
| Open / local | Llama, Mistral, Codestral         |
| Enterprise   | Azure OpenAI, MS Copilot, AWS Bedrock |

No single “best” model — fit depends on task, data policy, and environment.

---

## Which tool for which job?

- <span class="fragment">**Daily coding**: IDE integration (Copilot, Cursor) or chat (Copilot, ChatGPT)</span>
- <span class="fragment">**Design / architecture**: Models with strong reasoning and long context</span>
- <span class="fragment">**Sensitive or internal data**: Enterprise / in-tenant instances only</span>
- <span class="fragment">**Experimentation**: Public chat OK for synthetic examples only</span>

---

## Data privacy and security: the problem

**Scenario**: Developer pastes internal API spec into public ChatGPT

- <span class="fragment">❌ Data may be used for training</span>
- <span class="fragment">❌ Data may be retained by provider</span>
- <span class="fragment">❌ Compliance risk</span>
- <span class="fragment">❌ Security risk</span>

---

**The critical distinction:**

- <span class="fragment">**Public AI**: Provider policy controls data; not for proprietary/personal data</span>
- <span class="fragment">**Enterprise AI**: Your tenant/contract; designed for internal use</span>

**What you send and where it is processed determines risk.**

---

## Public vs. enterprise AI

|                  | Public (e.g. ChatGPT) | Enterprise (e.g. MS Copilot) |
| ---------------- | --------------------- | ---------------------------- |
| Data handling    | Provider policy       | Your tenant / contract       |
| Training use     | Often allowed         | Typically excluded           |
| Internal docs    | ❌ Do not use          | ✅ When policy allows        |
| Proprietary code | ❌ Do not paste        | ✅ Per governance            |

---

## MS Copilot in context

- <span class="fragment">**With internal datasets**: Use only when your organisation has approved Copilot for that data classification</span>
- <span class="fragment">**With generic coding**: Fine for public APIs, patterns, and synthetic examples</span>
- <span class="fragment">**What to avoid**: Pasting proprietary code or internal APIs into public or unapproved tools</span>
- <span class="fragment">When in doubt: **enterprise instance or don’t send**</span>

---

## Capabilities and limitations

- <span class="fragment">**Hallucinations**: Plausible but wrong answers; models don’t “know” they’re wrong</span>
- <span class="fragment">**Knowledge cut-offs**: Training data has a date; no live knowledge after that</span>
- <span class="fragment">**Bias**: Reflecting biases in training data or prompts</span>
- <span class="fragment">**No guarantee**: Output is probabilistic, not certified</span>

---

## Hallucinations, cut-offs, and bias

- <span class="fragment">**Hallucination**: Invented APIs, wrong library versions, fake citations</span>
- <span class="fragment">**Cut-off**: “What’s new in Spring Boot 3.2?” may be incomplete or wrong</span>
- <span class="fragment">**Bias**: Stereotypes in descriptions or uneven treatment of options</span>
- <span class="fragment">**Mitigation**: Verify critical facts; use enterprise + internal docs where it matters</span>

---

## Trust but verify

- <span class="fragment">**Do trust** (with verification): Boilerplate, common patterns, explanations of public docs</span>
- <span class="fragment">**Verify always**: API signatures, versions, security-sensitive code, compliance</span>
- <span class="fragment">**Don’t trust blindly**: Numbers, dates, “it said so” for internal or proprietary context</span>
- <span class="fragment">**Escalate**: When output affects production, security, or legal/compliance</span>

---

## When to rely on AI vs. when to check

| Rely (with light check)     | Double-check or avoid        |
| --------------------------- | ---------------------------- |
| Syntax and style            | Security and auth            |
| Well-documented public APIs | Internal / proprietary APIs  |
| Refactors with tests        | Legal / compliance wording   |
| Explanations of your code   | Facts and figures            |

---

## Summary

1. <span class="fragment">**Landscape**: Many models and providers — choose by task and policy.</span>
2. <span class="fragment">**Privacy**: Public vs. enterprise is non-negotiable; keep internal data in-house.</span>
3. <span class="fragment">**Limitations**: Hallucinations, cut-offs, bias — verify critical output.</span>
4. <span class="fragment">**Practice**: Trust but verify; know when to rely and when to escalate.</span>

---

## Bridge to Module 2

**What we've learned:**

- <span class="fragment">**Where** to use AI (public vs. enterprise)</span>
- <span class="fragment">**When** to trust vs. verify</span>

**What's next:**

- <span class="fragment">**Module 2**: Core prompt engineering — **how** to prompt effectively (clarity, context, constraints, iterative refinement).</span>

The safety principles from Module 1 apply throughout the course.

---

# Questions?

*Module 1 — Introduction to GenAI for Developers*
