# Model Context Protocol (MCP) Principles

**Module 6 — Harwell Prompt Engineering**

---

## Learning objectives

By the end of this module you will be able to:

- <span class="fragment">Explain the "silo" problem: AI tools unable to access local files, repos, or databases directly</span>
- <span class="fragment">Describe the Model Context Protocol (MCP) as a standard for supplying context to AI</span>
- <span class="fragment">Outline how MCP works: standardized context servers connecting AI to git repos, databases, or local files</span>
- <span class="fragment">Discuss implications: how tools like Claude Desktop or IDEs can use MCP to "read" project structure without manually uploading code to the cloud</span>

---

## Bridge from Module 5

**What we learned last time:**

- <span class="fragment">**RAG** connects AI to documents</span>

**The connection:**

- <span class="fragment">RAG: Documents (static)</span>
- <span class="fragment">MCP: Files, repos, databases (live)</span>
- <span class="fragment">Both solve "AI doesn't know your context"</span>

**Frame explicitly:**

- <span class="fragment">This section is **orientation** — understanding what MCP is</span>
- <span class="fragment">Not adoption or rollout guidance</span>
- <span class="fragment">MCP is still early/evolving</span>

---

## The problem: the silo problem

**The limitation:**

- <span class="fragment">AI tools (browser, apps) can't see your local files, repos, or databases</span>
- <span class="fragment">❌ You have to manually copy-paste code</span>
- <span class="fragment">❌ AI doesn't know your project structure</span>
- <span class="fragment">❌ AI can't access your database schema</span>
- <span class="fragment">❌ Context switching is slow and error-prone</span>

---

**The pain:**

- <span class="fragment">Scenario: "Explain how this module works"</span>
- <span class="fragment">❌ You copy-paste files one by one</span>
- <span class="fragment">❌ Lose project structure context</span>
- <span class="fragment">❌ Can't reference related files</span>
- <span class="fragment">❌ Slow, manual, risky (data privacy)</span>

---

## The solution: MCP

**MCP = Model Context Protocol**

- <span class="fragment">Standardized protocol for context servers</span>
- <span class="fragment">✅ AI can request context through protocol</span>
- <span class="fragment">✅ Structured, safe access to files/repos/databases</span>
- <span class="fragment">✅ Less manual copy-paste</span>

---

**Key idea:**

- <span class="fragment">Context servers expose data (filesystem, git, database)</span>
- <span class="fragment">Clients (AI tools) request context through protocol</span>
- <span class="fragment">Standardized, interoperable</span>

---

## Without MCP vs. with MCP

**Without MCP:**

- <span class="fragment">AI tool can't see your files</span>
- <span class="fragment">❌ You paste code manually</span>
- <span class="fragment">❌ No project structure awareness</span>
- <span class="fragment">❌ Can't reference other files</span>
- <span class="fragment">❌ Context is lost</span>

---

**With MCP:**

- <span class="fragment">AI tool requests context through MCP protocol</span>
- <span class="fragment">Context server exposes files/repos/databases</span>
- <span class="fragment">✅ AI can "read" project structure</span>
- <span class="fragment">✅ Can reference specific files</span>
- <span class="fragment">✅ Structured, controlled access</span>

---

## How MCP works: the architecture

**Context servers:**

- <span class="fragment">Expose data sources (filesystem, git, database)</span>
- <span class="fragment">Examples: Filesystem server, Git server, Database server</span>
- <span class="fragment">Standardized way to access different data sources</span>

---

**Clients:**

- <span class="fragment">AI tools that request context</span>
- <span class="fragment">Examples: Claude Desktop, IDEs, AI applications</span>
- <span class="fragment">Request context through MCP protocol</span>

---

**The protocol:**

- <span class="fragment">Standardized request/response format</span>
- <span class="fragment">Any client can work with any server</span>
- <span class="fragment">Defines how to request files, list directories, query databases</span>

---

## Example flow

**User asks AI:** "Explain this module"

1. <span class="fragment">AI client requests: "List files in src/main/java/module1"</span>
2. <span class="fragment">Filesystem server responds: ["File1.java", "File2.java"]</span>
3. <span class="fragment">AI client requests: "Read File1.java"</span>
4. <span class="fragment">Filesystem server responds: File contents</span>
5. <span class="fragment">AI generates explanation based on retrieved files</span>

**Result:** AI understands your project structure without manual copy-paste.

---

## Simple analogy

**Think of MCP like a library API:**

- <span class="fragment">Client (AI tool) requests information</span>
- <span class="fragment">Server (context server) provides it</span>
- <span class="fragment">Protocol defines the request/response format</span>
- <span class="fragment">Standardized, structured, safe</span>

**MCP enables structured access to your systems.**

---

## Implications: what this means

**Implication 1: Safer access**

- <span class="fragment">✅ Structured, controlled access to files/repos</span>
- <span class="fragment">✅ Can limit what AI can see (e.g. "only this module")</span>
- <span class="fragment">✅ Less risky than manual copy-paste</span>

---

**Implication 2: Less copy-paste**

- <span class="fragment">✅ AI can request context automatically</span>
- <span class="fragment">✅ No manual file copying</span>
- <span class="fragment">✅ Faster iteration</span>

---

**Implication 3: Still early**

- <span class="fragment">⚠️ MCP is still evolving</span>
- <span class="fragment">⚠️ Not all tools support it yet</span>
- <span class="fragment">⚠️ Expect changes and improvements</span>
- <span class="fragment">⚠️ This is orientation, not adoption guidance</span>

---

## When to consider MCP

**Consider MCP when:**

- <span class="fragment">✅ You need AI to reason over many files</span>
- <span class="fragment">✅ You need structured access to repos/databases</span>
- <span class="fragment">✅ Manual copy-paste is too slow or risky</span>
- <span class="fragment">✅ Your tools support MCP</span>

**MCP is still early** — watch for adoption and tool support.

---

## Summary

1. <span class="fragment">**Problem**: AI tools can't access local files/repos/databases</span>
2. <span class="fragment">**Solution**: MCP provides standardized protocol for context servers</span>
3. <span class="fragment">**How it works**: Servers expose data, clients request through protocol</span>
4. <span class="fragment">**Implications**: Safer, structured access; less copy-paste; still early</span>
5. <span class="fragment">**Orientation only**: Understanding, not adoption guidance</span>

---

## Bridge to Module 7

**What we've learned:**

- <span class="fragment">**MCP** connects AI to live systems (files, repos, databases)</span>

**What's next:**

**Module 7**: AI APIs — the technical details of calling LLMs programmatically.

MCP uses APIs under the hood — let's understand how those APIs work.

---

# Questions?

*Module 6 — Model Context Protocol (MCP) Principles*
