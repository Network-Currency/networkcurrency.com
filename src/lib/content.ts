import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;
export type Case = CollectionEntry<'cases'>;
export type App = CollectionEntry<'apps'>;
export type Writing = CollectionEntry<'writing'>;

type PageCollection = 'site' | 'home' | 'consulting' | 'aiGovernance' | 'appsPage' | 'about' | 'legal';

async function page<K extends PageCollection>(collection: K, id: string): Promise<CollectionEntry<K>['data']> {
  const lookup = getEntry as (collection: string, id: string) => Promise<unknown>;
  const entry = (await lookup(collection, id)) as CollectionEntry<K> | undefined;
  if (!entry) {
    throw new Error(`Missing content file src/content/pages/${id}.yaml`);
  }
  return entry.data;
}

export const getSite = () => page('site', 'site');
export const getHome = () => page('home', 'home');
export const getConsulting = () => page('consulting', 'consulting');
export const getAiGovernance = () => page('aiGovernance', 'ai-governance');
export const getAppsPage = () => page('appsPage', 'apps');
export const getAbout = () => page('about', 'about');
export const getLegal = () => page('legal', 'legal');

export async function getServices(): Promise<Service[]> {
  const services = await getCollection('services');
  return services.sort((a, b) => a.data.order - b.data.order);
}

/** Cases sorted by order. Fails the build when a case names a service that does not exist. */
export async function getCases(): Promise<Case[]> {
  const [cases, services] = await Promise.all([getCollection('cases'), getCollection('services')]);
  const names = new Set(services.map((s) => s.data.name));
  for (const c of cases) {
    if (!names.has(c.data.service)) {
      throw new Error(
        `src/content/cases/${c.id}.yaml: service "${c.data.service}" does not match any service name. ` +
          `Valid names: ${[...names].join(', ')}`,
      );
    }
  }
  return cases.sort((a, b) => a.data.order - b.data.order);
}

export async function getVisibleApps(): Promise<App[]> {
  const apps = await getCollection('apps', (a) => a.data.status !== 'hidden');
  return apps.sort((a, b) => a.data.order - b.data.order);
}

/** Writing newest first, then by order. Items without a date follow dated ones. */
export async function getWriting(): Promise<Writing[]> {
  const items = await getCollection('writing');
  for (const w of items) {
    if (!hasBody(w) && !w.data.url) {
      throw new Error(`src/content/writing/${w.id}.md: needs either a body or a url`);
    }
  }
  return items.sort((a, b) => {
    const da = a.data.date?.getTime();
    const db = b.data.date?.getTime();
    if (da !== undefined && db !== undefined && da !== db) return db - da;
    if (da !== undefined && db === undefined) return -1;
    if (da === undefined && db !== undefined) return 1;
    return (a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER);
  });
}

export const hasBody = (w: Writing) => (w.body ?? '').trim().length > 0;

export function writingLink(w: Writing): { href: string; external: boolean } {
  if (hasBody(w)) return { href: `/ai-governance/${w.id}/`, external: false };
  return { href: w.data.url as string, external: true };
}

export function writingKind(w: Writing): string {
  return w.data.typeDetail ? `${w.data.type} · ${w.data.typeDetail}` : w.data.type;
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (d: Date) => dateFormat.format(d);

/** The label for an app's status, from site.yaml. Hidden apps are never shown. */
export function statusLabelFor(site: Awaited<ReturnType<typeof getSite>>, app: App): string {
  if (app.data.status === 'hidden') {
    throw new Error(`src/content/apps/${app.id}.yaml: hidden apps have no status label`);
  }
  return site.statusLabels[app.data.status];
}
