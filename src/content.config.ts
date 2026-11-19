import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const meta = z.object({ title: z.string(), description: z.string() });
const link = z.object({ label: z.string(), href: z.string() });
const eyebrowHeadline = z.object({ eyebrow: z.string(), headline: z.string() });

const lines = z.union([z.string(), z.array(z.string()).nonempty()]);

const pageLoader =(file: string) => glob({ pattern: file, base: './src/content/pages' });

const site = defineCollection({
  loader: pageLoader('site.yaml'),
  schema: z.object({
    name: z.string(),
    legalName: z.string(),
    description: z.string(),
    email: z.string(),
    linkedin: z.url(),
    nav: z.array(link),
    contactCta: link,
    statusLabels: z.object({ live: z.string(), 'in-development': z.string() }),
    footer: z.object({ copyright: z.string(), links: z.array(link) }),
    notFound: z
      .object({ headline: lines, intro: z.string().optional(), linkLabel: z.string().optional() })
      .optional(),
  }),
});

const doorway = z.object({
  label: z.string(),
  headline: z.string(),
  points: z.array(z.string()).optional(),
  linkLabel: z.string(),
});

const home = defineCollection({
  loader: pageLoader('home.yaml'),
  schema: z.object({
    meta,
    eyebrow: z.string(),
    headline: lines,
    intro: z.string(),
    primaryCta: link,
    secondaryCta: link,
    stats: z.array(z.object({ value: z.string(), label: z.string() })),
    doorways: z.object({
      consulting: doorway,
      apps: doorway,
    }),
    work: eyebrowHeadline.extend({ linkLabel: z.string() }),
    writing: eyebrowHeadline.extend({ intro: z.string(), linkLabel: z.string() }),
    contactBand: z.object({
      eyebrow: z.string().optional(),
      headline: lines,
      body: z.string(),
      linkedinLabel: z.string(),
    }),
  }),
});

const consulting = defineCollection({
  loader: pageLoader('consulting.yaml'),
  schema: z.object({
    meta,
    eyebrow: z.string(),
    headline: lines,
    intro: z.string(),
    services: eyebrowHeadline,
    engagementsLabel: z.string(),
    casesLabel: z.string(),
    caseLabels: z.object({ situation: z.string(), did: z.string(), result: z.string() }),
    models: eyebrowHeadline.extend({
      items: z.array(z.object({ name: z.string(), body: z.string() })),
    }),
    contactBand: z.object({
      eyebrow: z.string().optional(),
      headline: lines,
      body: z.string(),
    }),
  }),
});

const aiGovernance = defineCollection({
  loader: pageLoader('ai-governance.yaml'),
  schema: z.object({
    meta,
    eyebrow: z.string(),
    headline: lines,
    intro: z.array(z.string()),
    featured: z.object({ eyebrow: z.string() }),
    library: z.object({ headline: z.string(), note: z.string().optional() }),
    readLabel: z.string(),
    discussLabel: z.string(),
    backLabel: z.string(),
  }),
});

const appsPage = defineCollection({
  loader: pageLoader('apps.yaml'),
  schema: z.object({ meta, eyebrow: z.string(), headline: lines, intro: z.string() }),
});

const about = defineCollection({
  loader: pageLoader('about.yaml'),
  schema: ({ image }) =>
  z.object({
    meta,
    eyebrow: z.string(),
    headline: lines,
    intro: z.string(),
    linkedinLabel: z.string(),
    emailLabel: z.string(),
    headshot: image().optional(),
    headshotAlt: z.string().optional(),
    path: eyebrowHeadline.extend({
      items: z.array(z.object({ org: z.string(), when: z.string(), body: z.string() })),
    }),
    whyBuild: eyebrowHeadline.extend({ body: z.string() }),
    rules: eyebrowHeadline.extend({
      items: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    education: z.string(),
  }),
});

const legal = defineCollection({
  loader: pageLoader('legal.yaml'),
  schema: z.object({
    meta,
    headline: lines,
    sections: z.array(
      z.object({
        heading: z.string(),
        paragraphs: z.array(z.string()).default([]),
        links: z.array(link).default([]),
      }),
    ),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    order: z.number(),
    engagements: z.array(z.string()),
    showWriting: z.boolean().default(false),
    writingLinkLabel: z.string().optional(),
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    service: z.string(),
    situation: z.string(),
    did: z.string(),
    result: z.string(),
    metric: z.string().optional(),
    metricLabel: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

const apps = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    status: z.enum(['live', 'in-development', 'hidden']),
    initial: z.string(),
    tile: z.enum(['accent', 'navy']),
    order: z.number(),
    links: z
      .array(z.object({ label: z.string(), href: z.string(), primary: z.boolean().default(false) }))
      .default([]),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['Framework', 'Article', 'Talk', 'Press']),
    typeDetail: z.string().optional(),
    date: z.coerce.date().optional(),
    summary: z.string(),
    url: z.url().optional(),
    linkedin: z.url().optional(),
    featured: z.boolean().default(false),
    highlight: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

export const collections = {
  site,
  home,
  consulting,
  aiGovernance,
  appsPage,
  about,
  legal,
  services,
  cases,
  apps,
  writing,
};
