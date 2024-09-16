import { parse } from 'node-html-parser';
import { formatTabType, ScrapedTab, SearchArgs, Tab, TabType, UGChordCollection } from './types';
import { searchArgsToWeb } from './web';

export async function getPage(url: URL, details: boolean = false) {
  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch page");

  const html = parse(await res.text());

  return {
    html,
    details: details ? getPageDetails(html) : undefined
  }
}

export function getPageDetails(html: ReturnType<typeof parse>) {
  // Get data element
  const element = html.querySelector('.js-store[data-content]');
  if (!element) return null;

  // Get store data
  const raw = element.getAttribute('data-content');
  if (!raw) return null;

  // Remove HTML entities
  const flattened = parse(raw).innerText;
  // Convert to JSON
  const parsed = JSON.parse(flattened);

  return parsed;
}

export async function getSuggestions(search: string) {
  const keyword: string = search.toLowerCase().split(' ')[0];

  const res = await fetch(
    "https://www.ultimate-guitar.com/static/article/suggestions" +
    `/${keyword[0]}` + // Alphabetical category
    `/${keyword.substring(0, 5)}.js`,
  );

  try {
    const data = await res.json();

    if (data.suggestions)
      return (data.suggestions as string[])
        .filter(v => v.includes(keyword.toLowerCase()))
        .splice(0, 5);
  } catch (e) { }

  return [];
}

export async function getTabs(search: SearchArgs) {
  const { details } = await getPage(new URL('https://www.ultimate-guitar.com/search.php?' + searchArgsToWeb(search).toString()), true);

  const data = details.store.page.data;
  let results: ScrapedTab[] = [
    ...(data?.other_tabs || []),
    ...(data?.results || []),
  ];

  const pagination: {
    current: number
    total: number
  } = data.pagination;

  const tabs: Tab[] = results
    .filter( // Remove unwanted results (Promotional, paid, and/or irrelevant)
      (result) =>
        !result.marketing_type
        && Object.keys(TabType).includes(formatTabType(result.type)),
    )
    .map((result) => ({
      artist: result.artist_name,
      name: result.song_name,
      url: result.tab_url,
      slug: result.tab_url.split('/').splice(-2).join('/'),
      rating: parseFloat(result.rating.toFixed(2)),
      numberRates: result.votes,
      type: formatTabType(result.type)
    }));

  return { results: tabs, pagination };
}

export async function getTab(slug: string): Promise<Tab> {
  const { details } = await getPage(new URL(`https://tabs.ultimate-guitar.com/tab/${slug}`), true);
  const { tab_view } = details.store.page.data;

  const {
    tab_url,
    artist_name,
    song_name,
    rating,
    votes,
    type,
  }: ScrapedTab = details.store.page.data.tab

  const tuning: string[] =
    tab_view?.meta?.tuning?.value?.split(' ')
    ||
    ['E', 'A', 'D', 'G', 'B', 'E'];

  const difficulty: string = tab_view?.ug_difficulty || 'unknown';
  const raw_tabs: string = tab_view?.wiki_tab?.content || '';
  const chordsDiagrams: UGChordCollection[] = tab_view?.applicature || [];

  const versions: ScrapedTab[] =
    tab_view?.versions.filter((tab: ScrapedTab) => tab.type !== 'Official') || [];

  let versionsFormatted: Tab[] = versions.map((tabScrapped) => {
    return {
      artist: tabScrapped.artist_name,
      name: tabScrapped.song_name,
      url: tabScrapped.tab_url,
      difficulty: tabScrapped.difficulty,
      numberRates: tabScrapped.votes,
      type: tabScrapped.type,
      slug: tabScrapped.tab_url.split('/').splice(-2).join('/'),
      rating: parseFloat(tabScrapped.rating.toFixed(2)),
    }
  });

  if (Array.isArray(versionsFormatted)) {
    versionsFormatted = versionsFormatted.sort(function (elem1, elem2) {
      return (
        elem2.rating * elem2.numberRates - elem1.rating * elem1.numberRates
      )
    })
  }

  return {
    artist: artist_name,
    name: song_name,
    url: tab_url,
    difficulty,
    tuning,
    raw_tabs,
    numberRates: votes,
    type: type,
    slug: tab_url.split('/').splice(-2).join('/'),
    rating: parseFloat(rating.toFixed(2)),
    versions: versionsFormatted,
    chordsDiagrams,
    htmlTab: `<pre>${tab_view.wiki_tab.content}</pre>`
      // Parse chords
      .replaceAll('[ch]', '<span class="text-chord">')
      .replaceAll('[/ch]', '</span>')
      // Parse tabs
      .replaceAll('[tab]', '<span>')
      .replaceAll('[/tab]', '</span>')
  }
}