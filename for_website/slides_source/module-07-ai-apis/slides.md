# Developing with AI APIs

**Module 7 — Harwell Prompt Engineering**

---

## Learning objectives

By the end of this module you will be able to:

- <span class="fragment">Explain the "delta" between standard REST APIs and LLM APIs: stateful vs. stateless, non-determinism, streaming</span>
- <span class="fragment">Describe why LLM APIs differ from typical REST: stateful conversations, non-deterministic responses</span>
- <span class="fragment">Control non-determinism: temperature and top-p; when to use low vs. high</span>
- <span class="fragment">Handle streaming responses and implications for UX (tokens/sec, buffering)</span>
- <span class="fragment">Understand cost drivers: token economics (input vs. output), and how to reason about cost when designing features</span>

---

## Bridge from Module 6

**What we learned last time:**

- <span class="fragment">**MCP** connects AI to live systems</span>
- <span class="fragment">MCP uses APIs under the hood</span>

---

**Frame explicitly:**

- <span class="fragment">This is the **delta** — what's different from standard REST APIs</span>
- <span class="fragment">Not a full SDK deep dive</span>
- <span class="fragment">Focus on understanding differences</span>

**Today:** Understand how LLM APIs work differently from standard REST.

---

## The problem: LLM APIs are different

**Standard REST expectations:**

- <span class="fragment">Stateless requests</span>
- <span class="fragment">Deterministic responses</span>
- <span class="fragment">Simple request/response</span>
- <span class="fragment">Predictable costs</span>

---

**LLM APIs break these:**

- <span class="fragment">❌ Stateful conversations vs. stateless</span>
- <span class="fragment">❌ Non-deterministic responses</span>
- <span class="fragment">❌ Streaming chunks vs. complete response</span>
- <span class="fragment">❌ Token-based costs vs. request-based</span>

---

**Why it matters:**

- <span class="fragment">❌ Expect stateless → conversations won't work</span>
- <span class="fragment">❌ Expect deterministic → confused by variation</span>
- <span class="fragment">❌ Don't handle streaming → poor UX</span>
- <span class="fragment">❌ Ignore cost → high bills</span>

---

## Stateful vs. stateless: conversations

**Standard REST:**

- <span class="fragment">**Stateless**: Each request is independent</span>
- <span class="fragment">Example: GET /users/123 → returns user data</span>
- <span class="fragment">No memory between requests</span>
- <span class="fragment">Simple, predictable</span>

---

**LLM APIs:**

- <span class="fragment">**Stateful**: Conversations maintain context</span>
- <span class="fragment">Example:</span>
  - Request 1: "What is Spring Boot?"
  - Request 2: "How do I use it?" (refers to previous)
- <span class="fragment">**Conversation ID or message list**: Maintains context</span>
- <span class="fragment">More complex, but enables natural conversations</span>

---

## How stateful works

**Option 1: Conversation ID**

- <span class="fragment">First request returns conversation_id</span>
- <span class="fragment">Subsequent requests include conversation_id</span>
- <span class="fragment">API maintains conversation state</span>
- <span class="fragment">✅ Simpler for client</span>

---

**Option 2: Message list**

- <span class="fragment">You maintain message history</span>
- <span class="fragment">Send full message list with each request</span>
- <span class="fragment">You control state</span>
- <span class="fragment">✅ More control</span>

---

**When to use:**

- <span class="fragment">**Stateless (one-off)**: Simple Q&A, no context needed</span>
- <span class="fragment">**Stateful (conversation)**: Multi-turn dialogue, follow-up questions</span>

---

## Non-determinism: the problem

**Same prompt → different answers**

- <span class="fragment">"Why is this happening?"</span>
- <span class="fragment">"How do I control it?"</span>

---

**Why non-deterministic?**

- <span class="fragment">LLMs are probabilistic, not deterministic</span>
- <span class="fragment">They sample from probability distributions</span>
- <span class="fragment">Same input can produce different outputs</span>
- <span class="fragment">This is by design (creativity, variety)</span>

---

## Controlling non-determinism

**Temperature**: Controls randomness

- <span class="fragment">**Low (0-0.3)**: More deterministic, focused</span>
- <span class="fragment">**Medium (0.5-0.7)**: Balanced</span>
- <span class="fragment">**High (0.8-1.0)**: More creative, varied</span>

---

**Top-P (nucleus sampling)**: Controls diversity

- <span class="fragment">**Low (0.1-0.3)**: Focused on most likely tokens</span>
- <span class="fragment">**High (0.9-1.0)**: More diverse options</span>

---

**When you need reproducibility:**

- <span class="fragment">Set temperature=0</span>
- <span class="fragment">Use same seed</span>
- <span class="fragment">More deterministic (not perfect)</span>

---

## When to use what temperature

**Low temperature (0-0.3):**

- <span class="fragment">✅ Code generation</span>
- <span class="fragment">✅ Factual answers</span>
- <span class="fragment">✅ Tests</span>
- <span class="fragment">✅ When you need consistency</span>

---

**Medium temperature (0.5-0.7):**

- <span class="fragment">✅ General use</span>
- <span class="fragment">✅ Balanced responses</span>

**High temperature (0.8-1.0):**

- <span class="fragment">✅ Creative writing</span>
- <span class="fragment">✅ Brainstorming</span>
- <span class="fragment">✅ Varied responses</span>

---

## Streaming: chunked responses

**The problem:**

- <span class="fragment">Without streaming: Wait for full response</span>
- <span class="fragment">❌ Slow perceived performance</span>
- <span class="fragment">❌ User sees nothing until complete</span>
- <span class="fragment">❌ Poor UX for long responses</span>

---

**The solution:**

- <span class="fragment">**Streaming**: Responses come in chunks (tokens)</span>
- <span class="fragment">✅ User sees progress immediately</span>
- <span class="fragment">✅ Better perceived performance</span>
- <span class="fragment">✅ Can cancel if needed</span>

---

## How streaming works

**Server-Sent Events (SSE) or WebSocket**

- <span class="fragment">Tokens arrive incrementally</span>
- <span class="fragment">Client buffers and displays as received</span>
- <span class="fragment">**Tokens/sec**: Measure of streaming speed</span>
- <span class="fragment">**Buffering**: Client may buffer before displaying</span>

---

**Implementation considerations:**

- <span class="fragment">Handle partial responses</span>
- <span class="fragment">Display incrementally</span>
- <span class="fragment">Handle errors mid-stream</span>
- <span class="fragment">Buffer for smooth display</span>

---

## Cost: token economics

**The problem:**

- <span class="fragment">Standard APIs: Cost per request (simple)</span>
- <span class="fragment">LLM APIs: Cost per token (complex)</span>
- <span class="fragment">❌ Easy to underestimate costs</span>
- <span class="fragment">❌ Costs scale with usage</span>

---

**Token economics:**

- <span class="fragment">**Input tokens**: What you send (prompt + context)</span>
- <span class="fragment">**Output tokens**: What you receive (response)</span>
- <span class="fragment">**Pricing**: Usually per 1K tokens</span>
- <span class="fragment">**Input vs. output**: Output often more expensive</span>

---

## Cost drivers

**What affects cost:**

- <span class="fragment">**Length**: Longer prompts/responses = more tokens</span>
- <span class="fragment">**Frequency**: More requests = higher cost</span>
- <span class="fragment">**Model**: Different models have different prices</span>
- <span class="fragment">**Context**: Including context increases input tokens</span>

---

**Cost optimization:**

- <span class="fragment">✅ Shorter prompts (remove unnecessary context)</span>
- <span class="fragment">✅ Cache responses when possible</span>
- <span class="fragment">✅ Use cheaper models when appropriate</span>
- <span class="fragment">✅ Monitor token usage</span>
- <span class="fragment">✅ Set usage limits</span>

---

## Rough cost estimates

**Examples:**

- <span class="fragment">1000 tokens ≈ 750 words</span>
- <span class="fragment">Example pricing: $0.01 per 1K input, $0.03 per 1K output</span>
- <span class="fragment">Typical request: 500 input + 500 output = ~$0.02</span>
- <span class="fragment">Scale: 1000 requests/day = ~$20/day = ~$600/month</span>

---

**Monitor and adjust:**

- <span class="fragment">Track actual token usage</span>
- <span class="fragment">Set usage limits</span>
- <span class="fragment">Optimize prompts</span>
- <span class="fragment">Choose models wisely</span>

---

## Summary

1. <span class="fragment">**Stateful vs. stateless**: Conversations need state management</span>
2. <span class="fragment">**Non-determinism**: Control with temperature/top-p</span>
3. <span class="fragment">**Streaming**: Better UX, handle chunks incrementally</span>
4. <span class="fragment">**Cost**: Token-based, monitor usage, optimize prompts</span>

---

## Bridge to Module 8

**What we've learned:**

- <span class="fragment">**How** LLM APIs work differently from standard REST</span>

**What's next:**

**Module 8**: The Future of AI & Development — what's coming next.

---

# Questions?

*Module 7 — Developing with AI APIs (Condensed)*
