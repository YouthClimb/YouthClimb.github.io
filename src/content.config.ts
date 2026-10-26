import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const segment = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => !/[/?#%\\]/.test(value) && value !== '.' && value !== '..',
    'Use a name without URL separators',
  );
const entries = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/entries' }),
  schema: z
    .object({
      title: z.string().min(1),
      section: z.enum(['memories', 'novels', 'legacy']).default('memories'),
      novel: segment.optional(),
      chapter: z.number().int().positive().optional(),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      description: z.string().optional(),
      author: z.string().default('Climbing & Playing'),
      categories: z.array(segment).default([]),
      tags: z.array(segment).default([]),
      cover: z.string().startsWith('/media/').optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      permalink: z
        .string()
        .refine(
          (value) =>
            value.startsWith('/') &&
            value.endsWith('/') &&
            !/[?#%\\]/.test(value) &&
            !value.includes('//') &&
            !value.split('/').some((segment) => segment === '.' || segment === '..'),
          'permalink must be an absolute, unencoded directory URL without query or traversal segments',
        )
        .optional(),
    })
    .superRefine((data, context) => {
      if (data.section === 'novels' && (!data.novel || !data.chapter))
        context.addIssue({ code: 'custom', message: '小说章节必须填写 novel 和 chapter。' });
      if (
        data.section !== 'novels' &&
        (data.novel || data.chapter || data.categories[0] === '小说')
      )
        context.addIssue({
          code: 'custom',
          message: '小说内容须设置 section: novels，不归入共同经历。',
        });
    }),
});

const novels = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/novels' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().default('寄放在这里的原创小说。'),
    order: z.number().default(0),
  }),
});

export const collections = { entries, novels };
