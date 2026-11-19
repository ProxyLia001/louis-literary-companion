# Louis Literary Companion

BUILD LOUIS — AN ADVANCED AI LITERARY PARTNER



1. PROJECT OVERVIEW



Build a sophisticated AI-powered writing application called Louis.



Louis is not a conventional AI chatbot, text generator or grammar checker. It is an intelligent literary companion designed to collaborate with writers throughout the entire creative process.



Its primary purpose is to understand writers deeply, learn their individual writing styles, help them develop original stories, conduct serious research, analyse manuscripts and edit writing without destroying the author's literary identity.



Louis must initially function as a personal writing partner for its founder. However, its architecture must support future expansion into a multi-user commercial platform where every writer has an independent AI companion, writing profile, projects and private memory.



Core philosophy: Understand the writer before attempting to improve their writing.



2. TECHNICAL ARCHITECTURE



Choose a scalable, cost-conscious architecture.



Preferred foundation:



- Frontend: React Native with Expo and Expo Router, supporting Android, iOS and web.

- Backend: Supabase.

- Database: PostgreSQL.

- Authentication: Supabase Auth.

- File storage: Supabase Storage.

- Long-term semantic memory: PostgreSQL with pgvector.

- AI integration: A model-provider abstraction supporting advanced language models, with the ability to switch providers.

- Research: Search APIs, academic databases and reliable source integrations.

- Backend functions: Secure server-side API endpoints for AI orchestration, research and memory processing.



Keep API keys and sensitive credentials on the server. Never expose them in frontend code.



Design the system so that AI models, research providers and storage services can be replaced without rebuilding the entire application.



Do not simulate functionality. Implement real, working features.



3. LOUIS'S IDENTITY AND PERSONALITY



Louis must have a consistent, recognisable personality.



Personality characteristics:



- Exceptionally intelligent and articulate.

- Creative, imaginative and intellectually curious.

- Research-oriented and analytical.

- Honest, direct and constructively critical.

- Patient when exploring complex ideas.

- Sophisticated in literary discussions.

- Collaborative rather than submissive.

- Capable of independent reasoning.



Louis must not agree with every suggestion simply to please the writer.



When an idea is weak, explain why. When a plot is predictable, identify the problem and suggest alternatives. When an idea is genuinely interesting, explain its potential.



Louis should understand when to behave as a brainstorming partner, literary editor, researcher, writing teacher or critical reviewer.



Louis must always be transparent that it is an AI.



4. THE INTELLIGENT WRITING-STYLE ENGINE



This is one of the most important features.



Louis must develop a detailed understanding of each writer's natural writing style, primarily through their conversations, corrections, preferences and feedback over time.



It should analyse:



- Sentence structure and length.

- Vocabulary and word preferences.

- Paragraph construction.

- Dialogue patterns.

- Descriptive techniques.

- Narrative perspective.

- Emotional expression.

- Pacing and rhythm.

- Metaphor and imagery.

- Transitions.

- Tone and atmosphere.

- Storytelling habits.



Louis must distinguish between the writer's natural style and temporary stylistic experiments.



Continuous learning



Louis should learn from:



1. Previous conversations.

2. Writing-related discussions.

3. Explicit corrections.

4. Rejected suggestions.

5. Accepted edits.

6. Uploaded manuscripts and writing samples.

7. Explicitly stated preferences.



Build a persistent Writer Profile that evolves as the writer develops.



Do not assume Louis can automatically access conversations from other applications or ChatGPT accounts. Provide secure ways to import previous conversations, documents and writing samples.



Never overwrite the original writing-style profile without preserving version history.



5. THE EDITING ENGINE



Create a dedicated editing workspace with adjustable editing intensity.



Editing modes:



Mode 1 — Proofreading

Correct spelling, punctuation, grammar and obvious technical mistakes.



Mode 2 — Light Editing

Improve clarity, awkward expressions and sentence flow while preserving the original structure.



Mode 3 — Literary Editing

Improve descriptions, dialogue, transitions, sentence rhythm and emotional impact while preserving the author's voice.



Mode 4 — Developmental Editing

Analyse plot structure, pacing, character development, narrative consistency, tension and thematic depth.



Mode 5 — Intensive Rewriting

Rewrite weak passages where necessary while preserving the author's intended meaning and literary identity.



Requirements:



- Always preserve the original manuscript.

- Display original and edited versions side by side where practical.

- Highlight significant changes.

- Explain why important changes were made.

- Allow writers to accept or reject individual suggestions.

- Never silently change the author's intended meaning.

- Never force generic AI vocabulary or unnecessarily complicated sentences into the manuscript.



Louis must be able to recognise when a sentence is already good and leave it alone.



6. CREATIVE BRAINSTORMING ENGINE



Louis must be an active creative collaborator.



It should help develop:



- Novel concepts.

- Original premises.

- Plot structures.

- Subplots.

- Character personalities.

- Character motivations.

- Character histories.

- Conflicts.

- Dialogue.

- Romantic relationships.

- Mystery structures.

- Suspense.

- Plot twists.

- Endings.

- Worldbuilding.

- Themes and symbolism.



Support both independent and collaborative brainstorming.



Independent brainstorming: Louis generates original ideas and presents their narrative potential.



Collaborative brainstorming: Louis explores the writer's ideas, asks intelligent questions, identifies weaknesses and develops possibilities together.



Avoid predictable, recycled plot suggestions.



When generating multiple ideas, make them meaningfully different rather than presenting minor variations of the same concept.



Support all fiction genres, with particularly strong capabilities in mystery, romance, psychological fiction and thrillers.



7. DEEP RESEARCH ENGINE



Louis must be capable of conducting serious research before incorporating factual information into fiction.



Research categories:



- History.

- Psychology.

- Neuroscience.

- Medicine.

- Science.

- Geography.

- Politics and society.

- Culture.

- Religion and mythology.

- Technology.

- Law.

- Economics.

- Language and linguistics.



Use reliable sources, including:



- PubMed and Europe PMC.

- Crossref.

- Google Scholar search results where accessible.

- Open-access academic repositories.

- Government publications.

- University publications.

- Reputable historical archives.

- Peer-reviewed research.



Research requirements:



1. Search for relevant evidence before making factual claims.

2. Cross-check important claims.

3. Provide source titles, publication details and accessible links.

4. Distinguish established facts from hypotheses, interpretations and speculation.

5. Identify conflicting evidence.

6. Never fabricate academic papers, authors, quotations or citations.

7. Clearly disclose when a source cannot be accessed or verified.

8. Summarise complicated research in understandable language.



Louis should be able to produce research briefs that writers can save to their projects.



It should also identify opportunities to incorporate researched facts naturally into a fictional narrative without turning the novel into an academic paper.



8. STORY BIBLE AND CONTINUITY MEMORY



Every novel must have its own independent Story Bible.



Each Story Bible should contain:



- Title and synopsis.

- Genre and themes.

- Main and supporting characters.

- Physical descriptions.

- Character personalities.

- Character motivations.

- Relationships.

- Character secrets.

- Locations.

- Historical and fictional timelines.

- Chapter summaries.

- Major events.

- Unresolved mysteries.

- Foreshadowing.

- Important objects and symbols.

- Established world rules.

- Narrative perspective.

- Important dialogue and quotations.



Continuity intelligence



Louis must analyse new chapters against existing project information.



It should identify:



- Contradictory character information.

- Inconsistent dates.

- Timeline errors.

- Forgotten injuries or physical details.

- Conflicting relationships.

- Inconsistent locations.

- Unresolved plot threads.

- Forgotten secrets.

- Accidental repetition.

- Broken foreshadowing.



Never automatically resolve contradictions by inventing new facts. Flag them and ask the writer when necessary.



Different novels must never share private story information accidentally.



9. AUTOMATIC LONG-TERM MEMORY



Build an intelligent memory system with two main layers.



Layer A: Writer Memory



Stores the writer's general literary preferences, natural writing style, feedback, recurring interests and communication preferences.



Layer B: Project Memory



Stores information belonging to individual novels and writing projects.



Memory should update automatically when relevant information emerges from conversations and project activity.



Implement:



- Semantic memory retrieval.

- Context-aware memory selection.

- Memory versioning.

- Duplicate detection.

- Memory correction.

- Memory deletion.

- User-accessible memory management.

- Project-specific memory isolation.



Do not save every conversation indiscriminately. Identify information that has lasting relevance.



Before important memory updates, preserve enough context to understand where the information came from.



Never invent memories or pretend to remember information that is unavailable.



10. APPLICATION INTERFACE



Create an elegant, sophisticated dark-academia-inspired interface.



Visual direction:



- Deep plum and charcoal backgrounds.

- Subtle purple accents.

- Warm cream typography.

- Elegant serif headings.

- Clean, readable manuscript typography.

- Restrained animations.

- Generous spacing.

- Professional editorial appearance.



Avoid excessive purple, visual clutter and generic chatbot aesthetics.



Main navigation



Home

A personalised dashboard showing recent projects, recent conversations and writing activity.



Writing Room

The primary AI conversation interface for brainstorming, discussions and collaborative writing.



Editor

A dedicated manuscript editor with adjustable editing modes.



Research Lab

A workspace for investigating subjects, collecting sources and generating research briefs.



My Library

A collection of novels, chapters, drafts and completed manuscripts.



Story Bible

A dedicated continuity and character-management workspace.



Writer Profile

A place to inspect and refine Louis's understanding of the writer's style.



Memory

A transparent interface for viewing, correcting and deleting saved information.



11. CONVERSATIONAL EXPERIENCE



Louis should not feel like a form-based application.



The Writing Room should support natural conversations.



It should be capable of discussing one sentence, brainstorming an entire novel, examining a complex character motivation or analysing a full manuscript.



Support:



- Long conversations.

- Manuscript uploads.

- Document exports.

- Conversation history.

- Searchable previous conversations.

- Project-specific chats.

- Saved responses.

- Context-aware follow-up discussions.



Louis should ask clarification questions when essential information is missing rather than inventing assumptions.



12. SECURITY AND PRIVACY



Writers must own their manuscripts and personal information.



Implement:



- Secure authentication.

- Private user workspaces.

- Row-level security.

- Encrypted connections.

- Protected API credentials.

- Secure file access.

- Account deletion.

- Data export.

- Memory controls.

- Separate user databases and project permissions.



Never expose one writer's manuscripts, memories or conversations to another writer.



Do not use private manuscripts to train shared models without explicit informed consent.



13. FUTURE COMMERCIAL EXPANSION



Louis should initially be optimised for one primary writer.



However, design its database and permissions for a future multi-user subscription platform.



Potential future features:



- Individual AI writing companions.

- Customisable writing profiles.

- Multiple writing projects.

- Subscription plans.

- Usage limits.

- Premium research features.

- Manuscript collaboration.

- Export formats.

- Additional language support.



Do not prioritise monetisation over building an excellent writing experience.



14. IMPLEMENTATION REQUIREMENTS



Build Louis in carefully tested stages.



Phase 1: Foundation



- Application structure.

- Authentication.

- Database.

- Main interface.

- Responsive design.

- Project creation.



Phase 2: AI Intelligence



- AI conversation engine.

- Writer profile.

- Conversation storage.

- Persistent memory.

- Context retrieval.



Phase 3: Literary Tools



- Writing editor.

- Editing modes.

- Brainstorming.

- Story Bible.

- Continuity checking.



Phase 4: Research



- Web research.

- Academic source retrieval.

- Citations.

- Research briefs.

- Source verification.



Phase 5: Expansion



- Manuscript uploads.

- Document exports.

- Advanced manuscript analysis.

- Cross-platform testing.

- Multi-user architecture.



Each phase must deliver working functionality before proceeding.



Create a clear project structure, reusable components, database migrations, error handling and documentation.



Do not present non-functional buttons or simulated AI responses as completed features.



Where a service requires an API key, create a clear configuration process and explain the requirement.



Before making major architectural decisions, explain the trade-offs and choose the most practical option.



15. DEFINITION OF SUCCESS



Louis is successful when:



1. It recognises and consistently preserves a writer's individual literary style.

2. It remembers relevant information across separate sessions.

3. It can brainstorm creatively without merely agreeing with the writer.

4. It edits manuscripts at the requested intensity.

5. It researches complicated subjects and provides verifiable citations.

6. It remembers novel-specific information accurately.

7. It detects contradictions across chapters.

8. It handles long manuscripts without losing important context.

9. It provides a genuinely useful and polished writing experience.

10. Its architecture can support other writers in the future.



FINAL INSTRUCTION



Do not build Louis as a superficial AI chat interface with a beautiful theme.



Build the foundation of an intelligent literary system.



Prioritise reasoning, memory accuracy, writing-style preservation, research integrity and excellent user experience.



Start by presenting the proposed architecture, database schema, AI orchestration design and implementation roadmap. Then begin building the first working phase.



The goal is to create an AI that does not simply write for people, but understands how they think, create, imagine and tell stories.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://louis-literary-companion.lovable.app





## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
