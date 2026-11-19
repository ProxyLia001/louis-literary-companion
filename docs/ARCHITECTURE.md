# Louis — Architecture

## Stack (and why)
- **TanStack Start (React 19) web app**, responsive for phone/tablet/desktop. Expo/React Native isn't supported on this platform; one responsive web app (installable later) covers Android, iOS and web.
- **Lovable Cloud** (Postgres + Auth + Storage + pgvector). Row-level security on every table: `user_id = auth.uid()`.
- **AI**: server-side only, via the Lovable AI Gateway behind a provider module (Phase 2) so models can be swapped.
- **Research**: provider adapters (PubMed/Europe PMC, Crossref, web search) behind one interface (Phase 4).

## Data model
profiles · writer_profile_versions (append-only) · projects · chapters · conversations · messages (full-text index) · memories (writer|project layer, source excerpt, version/supersedes, 768-d embedding) · bible_entries · continuity_issues · edit_sessions · edit_suggestions · research_briefs · research_sources (verified flag). Project-scoped tables cascade from projects so novels never share information.

## AI orchestration (Phase 2+)
1. Detect role needed (partner, editor, researcher, teacher, critic).
2. Retrieve: current writer-profile version, top-k writer memories, and only the active project's memories + Story Bible.
3. Generate with Louis's persona (honest, non-sycophantic, discloses being AI).
4. Post-turn extractor proposes durable memories → dedupe via embeddings → insert or supersede (never overwrite), keeping the source.

## Roadmap
1. Foundation — auth, schema, interface, projects/chapters (done)
2. Writing Room, writer profile, memory, retrieval
3. Editor (5 modes, accept/reject), brainstorming, Story Bible, continuity checks
4. Research Lab with real, verified citations
5. Uploads, exports, long-manuscript analysis, multi-user/subscriptions
