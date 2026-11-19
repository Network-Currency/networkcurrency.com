import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const meta = z.object({ title: z.string(), description: z.string() });
const link = z.object({ label: z.string(), href: z.string() });
const eyebrowHeadline = z.object({ eyebrow: z.string(), headline: z.string() });

/** Paragraph-style text. Trimmed so block-scalar YAML does not add a trailing blank line. */
const text = z.string().trim();

const lines = z.union([z.string(), z.array(z.string()).nonempty()]);

const pageLoader = (file: string) => glob({ pattern: file, base: './src/content/pages' });

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
    statusLabels: z.object({
      live: z.string(),
      'in-development': z.string(),
      'coming soon!': z.string().optional(),
    }),
    footer: z.object({ copyright: z.string(), links: z.array(link) }),
    notFound: z
      .object({ headline: lines, intro: text.optional(), linkLabel: z.string().optional() })
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
    intro: text,
    primaryCta: link,
    secondaryCta: link,
    stats: z.array(z.object({ value: z.string(), label: z.string() })),
    doorways: z.object({
      consulting: doorway,
      apps: doorway,
    }),
    work: eyebrowHeadline.extend({ linkLabel: z.string() }),
    writing: eyebrowHeadline.extend({ intro: text, linkLabel: z.string() }),
    contactBand: z.object({
      eyebrow: z.string().optional(),
      headline: lines,
      body: text,
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
    intro: text,
    services: eyebrowHeadline,
    engagementsLabel: z.string(),
    casesLabel: z.string(),
    caseLabels: z.object({ situation: z.string(), did: z.string(), result: z.string() }),
    models: eyebrowHeadline.extend({
      items: z.array(z.object({ name: z.string(), body: text })),
    }),
    contactBand: z.object({
      eyebrow: z.string().optional(),
      headline: lines,
      body: text,
    }),
  }),
});

const aiGovernance = defineCollection({
  loader: pageLoader('ai-governance.yaml'),
  schema: z.object({
    meta,
    eyebrow: z.string(),
    headline: lines,
    intro: z.array(text),
    featured: z.object({ eyebrow: z.string() }),
    library: z.object({ headline: z.string(), note: text.optional() }),
    readLabel: z.string(),
    discussLabel: z.string(),
    backLabel: z.string(),
  }),
});

const appsPage = defineCollection({
  loader: pageLoader('apps.yaml'),
  schema: z.object({ meta, eyebrow: z.string(), headline: lines, intro: text }),
});

const about = defineCollection({
  loader: pageLoader('about.yaml'),
  schema: ({ image }) =>
    z.object({
      meta,
      eyebrow: z.string(),
      headline: lines,
      intro: text,
      linkedinLabel: z.string(),
      emailLabel: z.string(),
      headshot: image().optional(),
      headshotAlt: z.string().optional(),
      path: eyebrowHeadline.extend({
        items: z.array(z.object({ org: z.string(), when: z.string(), body: text })),
      }),
      whyBuild: eyebrowHeadline.extend({ body: text }),
      rules: eyebrowHeadline.extend({
        items: z.array(z.object({ title: z.string(), body: text })),
      }),
      education: text,
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
        paragraphs: z.array(text).default([]),
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
    situation: text,
    did: text,
    result: text,
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
    description: text,
    status: z.enum(['live', 'in-development', 'hidden', 'coming soon!']),
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
    type: z.enum(['Framework', 'Article', 'Talk', 'Press', 'Written for Altimetrik']),
    typeDetail: z.string().optional(),
    date: z.coerce.date().optional(),
    summary: text,
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
