// Research provider layer: free, keyless scholarly + reference sources.
// Swap or add providers here without touching the chat pipeline.
export type Source = {
  n: number;
  title: string;
  url: string;
  authors?: string;
  year?: number;
  venue?: string;
  doi?: string;
  provider: "Europe PMC" | "Crossref" | "Wikipedia";
  snippet?: string;
};

type Raw = Omit<Source, "n">;
const strip = (s = "") => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function getJson(url: string): Promise<any | null> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Louis-Literary-Companion/1.0 (mailto:research@louis.app)" }, signal: AbortSignal.timeout(8000) });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

export async function europePmc(q: string): Promise<Raw[]> {
  const j = await getJson(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&pageSize=4&resultType=core&query=${encodeURIComponent(q)}`);
  return (j?.resultList?.result ?? []).map((r: any) => ({
    title: strip(r.title),
    url: r.doi ? `https://doi.org/${r.doi}` : `https://europepmc.org/article/${r.source}/${r.id}`,
    authors: r.authorString,
    year: r.pubYear ? Number(r.pubYear) : undefined,
    venue: r.journalInfo?.journal?.title,
    doi: r.doi,
    provider: "Europe PMC" as const,
    snippet: strip(r.abstractText).slice(0, 700),
  }));
}

export async function crossref(q: string): Promise<Raw[]> {
  const j = await getJson(`https://api.crossref.org/works?rows=4&select=DOI,title,author,issued,container-title,abstract,URL&query=${encodeURIComponent(q)}`);
  return (j?.message?.items ?? []).filter((r: any) => r.title?.[0]).map((r: any) => ({
    title: strip(r.title[0]),
    url: r.DOI ? `https://doi.org/${r.DOI}` : r.URL,
    authors: (r.author ?? []).slice(0, 4).map((a: any) => [a.given, a.family].filter(Boolean).join(" ")).join(", "),
    year: r.issued?.["date-parts"]?.[0]?.[0],
    venue: r["container-title"]?.[0],
    doi: r.DOI,
    provider: "Crossref" as const,
    snippet: strip(r.abstract).slice(0, 700),
  }));
}

export async function wikipedia(q: string): Promise<Raw[]> {
  const j = await getJson(`https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=3&format=json&origin=*&srsearch=${encodeURIComponent(q)}`);
  const hits = j?.query?.search ?? [];
  const out: Raw[] = [];
  for (const h of hits) {
    const s = await getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(h.title.replace(/ /g, "_"))}`);
    out.push({
      title: h.title,
      url: s?.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(h.title)}`,
      provider: "Wikipedia",
      snippet: strip(s?.extract ?? h.snippet).slice(0, 700),
    });
  }
  return out;
}

export async function research(queries: string[], academic: boolean): Promise<Source[]> {
  const jobs = queries.slice(0, 3).flatMap((q) => (academic ? [europePmc(q), crossref(q), wikipedia(q)] : [wikipedia(q), crossref(q)]));
  const all = (await Promise.all(jobs)).flat();
  const seen = new Set<string>();
  return all
    .filter((s) => s.url && !seen.has(s.url) && seen.add(s.url))
    .slice(0, 12)
    .map((s, i) => ({ ...s, n: i + 1 }));
}
