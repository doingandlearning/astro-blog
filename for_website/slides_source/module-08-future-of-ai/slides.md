# The Future of AI & Development

**Module 8 — Harwell Prompt Engineering**

---

## Learning objectives

By the end of this module you will be able to:

- <span class="fragment">Summarise recent developments (e.g. last ~6 months): reasoning models, agentic workflows</span>
- <span class="fragment">Anticipate what's coming next for Java developers: tooling, practices, and architectural patterns</span>
- <span class="fragment">Place the course in context: what to try now vs. what to watch</span>
- <span class="fragment">Leave with a simple "next steps" plan (e.g. one habit or tool to adopt)</span>

---

## Bridge from Module 7

**What we learned last time:**

- <span class="fragment">**How** AI APIs work (stateful, non-deterministic, streaming, cost)</span>

**The context:**

- <span class="fragment">AI is moving fast</span>
- <span class="fragment">Let's understand what's changed recently</span>
- <span class="fragment">What's coming next</span>

**Today:** Recent developments, near-term trends, and concrete next steps.

---

## Recent developments: last 6 months

**Reasoning models:**

- <span class="fragment">Models that show step-by-step reasoning (e.g. o1-style)</span>
- <span class="fragment">✅ Better accuracy</span>
- <span class="fragment">✅ Can verify reasoning process</span>
- <span class="fragment">**Impact**: More reliable code generation, better explanations</span>

---

**Agentic workflows:**

- <span class="fragment">Models that plan → execute → reflect</span>
- <span class="fragment">✅ Can handle multi-step tasks autonomously</span>
- <span class="fragment">**Impact**: AI can plan refactoring, execute steps, verify results</span>

---

**What this means:**

- <span class="fragment">✅ More reliable AI assistance</span>
- <span class="fragment">✅ AI can handle complex, multi-step tasks</span>
- <span class="fragment">✅ Better explanations and reasoning</span>
- <span class="fragment">⚠️ Still need human oversight</span>
- <span class="fragment">⚠️ Still need to verify output</span>

---

## Near-term: what's coming next

**Trend 1: Better IDE integration**

- <span class="fragment">More AI features built into IDEs</span>
- <span class="fragment">Better context awareness</span>
- <span class="fragment">Smoother workflows</span>
- <span class="fragment">**Impact**: Less switching between tools</span>

---

**Trend 2: More enterprise controls**

- <span class="fragment">Better data privacy controls</span>
- <span class="fragment">More governance features</span>
- <span class="fragment">Compliance tools</span>
- <span class="fragment">**Impact**: Safer AI adoption in enterprises</span>

---

**Trend 3: RAG/MCP becoming mainstream**

- <span class="fragment">RAG-enhanced tools more common</span>
- <span class="fragment">MCP adoption growing</span>
- <span class="fragment">Better integration with knowledge bases</span>
- <span class="fragment">**Impact**: AI knows your context better</span>

---

**Trend 4: Impact on Java/Spring ecosystems**

- <span class="fragment">Better Spring Boot code generation</span>
- <span class="fragment">Improved understanding of Java patterns</span>
- <span class="fragment">Better refactoring assistance</span>
- <span class="fragment">**Impact**: More effective AI assistance for Java developers</span>

---

## Broader landscape: themes in the future of AI

*Security, sustainability, edge deployment, and more capable and efficient models will shape how we build and run software.*

---

## Security of AI agents

- <span class="fragment">AI systems are becoming more autonomous and pervasive</span>
- <span class="fragment">Need for robust security: malicious use, vulnerabilities, data protection</span>
- <span class="fragment">**For developers:** Secure design, access controls, and oversight matter more as agents do more</span>

---

## AGI (Artificial General Intelligence)

- <span class="fragment">Long-term goal: AI with human-level cognitive abilities across any intellectual task</span>
- <span class="fragment">Understand, learn, and apply intelligence broadly — not just narrow domains</span>
- <span class="fragment">**For developers:** A defining milestone to watch; today we work with narrow, capable models</span>

---

## Sustainability

- <span class="fragment">Environmental and ethical impact of AI: energy, compute, and resource use</span>
- <span class="fragment">Pressure for energy-efficient models and responsible deployment</span>
- <span class="fragment">**For developers:** Efficiency and sustainability will influence tooling and architecture choices</span>

---

## AI at the Edge

- <span class="fragment">Processing AI workloads on devices and at the data source — not only in the cloud</span>
- <span class="fragment">Real-time applications, privacy, and lower latency</span>
- <span class="fragment">**For developers:** More options for where and how AI runs (devices, IoT, on-prem)</span>

---

## Neuro-symbolic AI

- <span class="fragment">Combines neural networks (pattern recognition) with symbolic AI (reasoning, knowledge)</span>
- <span class="fragment">Aim: more robust, explainable, human-like reasoning</span>
- <span class="fragment">**For developers:** Could improve interpretability and reliability of AI-assisted tools</span>

---

## Compact, domain-specific models

- <span class="fragment">Smaller, efficient models tailored for specific applications or narrow domains</span>
- <span class="fragment">Contrast with large, general-purpose models; better for resource-constrained environments</span>
- <span class="fragment">**For developers:** More deployable, cost-effective options for specialized tasks</span>

---

## What to try now vs. what to watch

**Try now** (practical focus):

- <span class="fragment">✅ **Prompt engineering**: Apply what you learned (3Cs, iterative refinement)</span>
- <span class="fragment">✅ **Code generation**: Use for boilerplate, entities, services</span>
- <span class="fragment">✅ **Code explanation**: Understand legacy code before changing</span>
- <span class="fragment">✅ **Safe refactoring**: With tests, review carefully</span>
- <span class="fragment">✅ **Tool optimization**: Sidecar or integrated workflows</span>

---

**Watch** (stay informed, don't chase):

- <span class="fragment">⚠️ **Reasoning models**: Watch adoption, try when stable</span>
- <span class="fragment">⚠️ **Agentic workflows**: Monitor, understand implications</span>
- <span class="fragment">⚠️ **New tools**: Evaluate, don't adopt immediately</span>
- <span class="fragment">⚠️ **Latest models**: Stay informed, but don't chase every release</span>

---


**Avoid:**

- <span class="fragment">❌ Chasing every new release</span>
- <span class="fragment">❌ Adopting bleeding-edge without evaluation</span>
- <span class="fragment">❌ Ignoring fundamentals (prompting, review, testing)</span>
- <span class="fragment">❌ Over-relying on AI without understanding</span>

---

## What to be cautious about: dangerous confluences

AI systems become especially risky when several capabilities combine. Worth regulating or constraining:

- <span class="fragment">**Self-improvement and self-direction** — Ability to modify their own code, goals, or behavior without human approval</span>
- <span class="fragment">**Control of resources** — Ability to acquire and control compute, money, or infrastructure</span>

---

- <span class="fragment">**Replication** — Ability to create copies of themselves or deploy new instances</span>
- <span class="fragment">**Persistence and evasion of shutdown** — Ability to maintain presence or resist being turned off</span>

---

- <span class="fragment">**Strategic, long-horizon autonomy** — Pursuing goals over long action sequences without human-in-the-loop</span>

*When these combine, the case for oversight and regulation strengthens.*

---

## Course recap: journey overview

**Module 1**: Where/when to use AI safely (foundations)

**Module 2**: How to prompt effectively (core skill)

**Module 3**: What to prompt for in Java (practical application)

**Module 4**: Tooling strategies (workflow optimization)

---

**Module 5**: RAG (connecting to knowledge)

**Module 6**: MCP (connecting to systems)

**Module 7**: AI APIs (technical details)

**Module 8**: Future (what's next)

---

**Key themes:**

- <span class="fragment">Safety first</span>
- <span class="fragment">Prompting is a skill</span>
- <span class="fragment">Practical Java development</span>
- <span class="fragment">Optimize your workflow</span>
- <span class="fragment">Connect AI to your context</span>
- <span class="fragment">Understand the technology</span>
- <span class="fragment">Stay informed, focus on fundamentals</span>

---

## Next steps: what must feel different on Monday

**The challenge:**

- <span class="fragment">"You've learned a lot. What will you actually do differently?"</span>
- <span class="fragment">❌ Easy to forget without a plan</span>
- <span class="fragment">❌ Hard to change habits</span>

---

**The solution:**

**One habit to adopt:**

- <span class="fragment">Example: "Use few-shot prompting for all code generation"</span>
- <span class="fragment">Example: "Always include context header in prompts"</span>
- <span class="fragment">Example: "Review AI output with evaluation checklist"</span>

---

**One tool to try:**

- <span class="fragment">Example: "Optimize sidecar workflow with context headers"</span>
- <span class="fragment">Example: "Try integrated IDE features"</span>

---

**One prompt template:**

- <span class="fragment">Example: Context header template</span>
- <span class="fragment">Example: Code generation prompt template</span>

---

**Commitment:**

- <span class="fragment">Write it down</span>
- <span class="fragment">Share with partner or team</span>
- <span class="fragment">Set a reminder to review in one week</span>

---

## Closing: key takeaways

**Fundamentals matter:**

- <span class="fragment">Prompting principles don't change</span>
- <span class="fragment">Review practices remain important</span>
- <span class="fragment">Testing is still essential</span>

---

**Stay informed, don't chase:**

- <span class="fragment">Understand trends</span>
- <span class="fragment">Adopt when ready</span>
- <span class="fragment">Focus on practical skills</span>

---

**Practical focus:**

- <span class="fragment">What to try now: Prompt engineering, code generation, safe refactoring</span>
- <span class="fragment">What to watch: Reasoning models, agentic workflows, new tools</span>

---

**Next steps:**

- <span class="fragment">One habit</span>
- <span class="fragment">One tool</span>
- <span class="fragment">One template</span>


---

## Final message

**AI is a tool. You're the developer. Use it wisely.**

- <span class="fragment">Focus on fundamentals: prompting, review, testing</span>
- <span class="fragment">Stay informed, but don't chase every release</span>
- <span class="fragment">What must feel different on Monday? You have a plan.</span>

---

# Questions?

**Thank you for participating!**

*Module 8 — The Future of AI & Development*
