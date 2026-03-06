# Introduction to Retrieval-Augmented Generation (RAG)

**Module 5 — Harwell Prompt Engineering**

---

## Learning objectives

By the end of this module you will be able to:

- <span class="fragment">Explain the concept of RAG: moving beyond training data by connecting LLMs to your own documents/wiki</span>
- <span class="fragment">Describe how RAG works at a high level: embeddings, vector databases, retrieval, and generation</span>
- <span class="fragment">Compare when to use RAG vs. fine-tuning vs. long-context windows</span>
- <span class="fragment">Relate RAG to internal knowledge bases (e.g. searching internal documentation)</span>

---

## Bridge from Module 4

**What we learned last time:**

- <span class="fragment">**How** to use AI tools effectively</span>
- <span class="fragment">Sidecar and integrated workflows</span>

**The problem:**

- <span class="fragment">❌ AI doesn't know your internal policies</span>
- <span class="fragment">❌ AI doesn't know your codebase structure</span>
- <span class="fragment">❌ AI can't access your wiki or documentation</span>
- <span class="fragment">❌ You're pasting docs manually, which is slow and risky</span>

**Today:** Learn how to connect AI to your own knowledge with RAG.

---

## The problem: LLMs don't know your knowledge

**The limitation:**

- <span class="fragment">LLMs are trained on public data up to a cutoff date</span>
- <span class="fragment">❌ They don't know your internal documentation</span>
- <span class="fragment">❌ They don't know your proprietary codebase</span>
- <span class="fragment">❌ They don't know your organization's policies</span>
- <span class="fragment">❌ They can't access your wiki or knowledge base</span>

**The pain:**

- <span class="fragment">Query: "What's our company's policy on data retention?"</span>
- <span class="fragment">❌ AI gives generic answer (not your policy)</span>
- <span class="fragment">❌ You have to find and paste the policy manually</span>
- <span class="fragment">❌ Slow, error-prone, risky (data privacy)</span>

---

## The solution: RAG

**RAG = Retrieve, Augment, Generate**

- <span class="fragment">**Retrieve** relevant document chunks from your knowledge base</span>
- <span class="fragment">**Augment** the prompt with those chunks as context</span>
- <span class="fragment">**Generate** answer based on your actual documents</span>

---

**Result:**

- <span class="fragment">✅ AI can answer questions about your internal knowledge</span>
- <span class="fragment">✅ No manual copy-paste needed</span>
- <span class="fragment">✅ Safer, faster, more accurate</span>

---

## Without RAG vs. with RAG

**Without RAG:**

- <span class="fragment">Query: "What's our data retention policy?"</span>
- <span class="fragment">AI response: Generic answer based on training data</span>
- <span class="fragment">❌ Not your actual policy</span>
- <span class="fragment">❌ May be outdated or wrong</span>

---

**With RAG:**

- <span class="fragment">Query: "What's our data retention policy?"</span>
- <span class="fragment">**Step 1**: Retrieve relevant document chunks</span>
- <span class="fragment">**Step 2**: Add chunks to prompt as context</span>
- <span class="fragment">**Step 3**: Generate answer based on your documents</span>
- <span class="fragment">✅ Answer grounded in your real policy</span>
- <span class="fragment">✅ Accurate and specific</span>

---

## How RAG works: the flow

**Step 1: Document preparation**

- <span class="fragment">**Chunking**: Break documents into smaller pieces</span>
- <span class="fragment">Why? Documents too large for context window</span>
- <span class="fragment">Example: Policy document → 10 chunks of ~500 words each</span>

---

**Step 2: Embeddings**

- <span class="fragment">Convert text chunks to numerical representations (embeddings)</span>
- <span class="fragment">Why? Allows similarity search</span>
- <span class="fragment">Example: "data retention policy" embedding is similar to "data storage rules" embedding</span>

---

**Step 3: Vector database**

- <span class="fragment">Store embeddings in a vector database</span>
- <span class="fragment">Why? Fast similarity search</span>
- <span class="fragment">Examples: Pinecone, Weaviate, Chroma, PostgreSQL with pgvector</span>

---

## How RAG works: retrieval and generation

**Step 4: Query processing**

- <span class="fragment">User asks: "What's our data retention policy?"</span>
- <span class="fragment">**Embed query**: Convert to embedding</span>
- <span class="fragment">**Retrieve**: Find top 3-5 most similar chunks from vector DB</span>
- <span class="fragment">**Augment prompt**: Add chunks to prompt as context</span>
- <span class="fragment">**Generate**: LLM generates answer based on retrieved chunks</span>

---

**The complete flow:**

Documents → Chunks → Embeddings → Vector DB → Retrieve → Augment → Generate

---

## Simple analogy

**Think of RAG like a librarian:**

1. <span class="fragment">You ask a question</span>
2. <span class="fragment">Librarian searches the catalog (retrieval)</span>
3. <span class="fragment">Librarian brings relevant books (chunks)</span>
4. <span class="fragment">Librarian reads from those books to answer (generation)</span>

**RAG does this automatically with your documents.**

---

## RAG vs. fine-tuning vs. long context

**RAG** — use when:

- <span class="fragment">✅ You have documents that change frequently</span>
- <span class="fragment">✅ You need to cite sources (which document?)</span>
- <span class="fragment">✅ Documents are too large for context window</span>
- <span class="fragment">✅ You want to add knowledge without retraining</span>

---

**Fine-tuning** — use when:

- <span class="fragment">✅ You need model to learn specific style or format</span>
- <span class="fragment">✅ You have large dataset of examples</span>
- <span class="fragment">✅ You want model behavior to change permanently</span>
- <span class="fragment">⚠️ Expensive, requires retraining for updates</span>

---

**Long context windows** — use when:

- <span class="fragment">✅ You have a few large documents</span>
- <span class="fragment">✅ Documents don't change often</span>
- <span class="fragment">✅ You need full document context</span>
- <span class="fragment">⚠️ Expensive, slower, limited by model's context window</span>

---

## Decision framework

| Solution | Use when |
|----------|----------|
| **RAG** | Multiple docs, frequent updates, need citations |
| **Fine-tuning** | Need style/behavior change, large example dataset |
| **Long context** | Few large documents, need full context |

**Choose based on your needs.**

---

## Use cases: when RAG helps

**Use case 1: Internal documentation search**

- <span class="fragment">Problem: "Where's the API documentation for our payment service?"</span>
- <span class="fragment">RAG: Search internal docs, retrieve relevant sections, answer with citations</span>
- <span class="fragment">✅ Faster than manual search</span>
- <span class="fragment">✅ Answers grounded in actual docs</span>


---

**Use case 2: Q&A over policies**

- <span class="fragment">Problem: "What's our policy on remote work?"</span>
- <span class="fragment">RAG: Retrieve policy document, answer based on actual policy</span>
- <span class="fragment">✅ Accurate, cites source</span>
- <span class="fragment">✅ No manual lookup needed</span>


---

**Use case 3: Codebase Q&A**

- <span class="fragment">Problem: "How does our authentication system work?"</span>
- <span class="fragment">RAG: Retrieve relevant code files, explain based on actual code</span>
- <span class="fragment">✅ Understands your codebase</span>
- <span class="fragment">✅ Can reference specific files</span>

---

## Relevance to this audience

**RAG helps with:**

- <span class="fragment">Internal knowledge bases</span>
- <span class="fragment">Governance and compliance</span>
- <span class="fragment">"Search then answer" workflows</span>
- <span class="fragment">Codebase understanding</span>
- <span class="fragment">Policy Q&A</span>

**You can use RAG-enhanced AI tools** without building RAG yourself.

---

## Summary

1. <span class="fragment">**Problem**: LLMs don't know your internal knowledge</span>
2. <span class="fragment">**Solution**: RAG retrieves relevant docs and adds to prompt</span>
3. <span class="fragment">**Architecture**: Documents → Chunks → Embeddings → Vector DB → Retrieve → Generate</span>
4. <span class="fragment">**When to use**: Multiple docs, frequent updates, need citations</span>
5. <span class="fragment">**Use cases**: Internal docs, policies, codebase Q&A</span>

---

## Bridge to Module 6

**What we've learned:**

- <span class="fragment">**RAG** connects AI to documents</span>

**What's next:**

**Module 6**: MCP (Model Context Protocol) — connects AI to live systems (files, repos, databases).

Both solve the "AI doesn't know your context" problem.

---

# Questions?

*Module 5 — Introduction to Retrieval-Augmented Generation (RAG)*
