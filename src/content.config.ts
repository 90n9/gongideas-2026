import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ideas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ideas' }),
  schema: z.object({
    title: z.string(),
    ideaId: z.string(),
    summary: z.string(),
    category: z.enum(['ai-coding', 'ai-automation', 'ai-video', 'ai-image', 'game-dev', 'misc']),
    status: z.enum(['shipped', 'wip', 'queued']),
    difficulty: z.number().int().min(1).max(5),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    reads: z.number().int().nonnegative().optional(),
    progress: z.number().int().min(0).max(100).optional(),
    cover: z.string().optional(),
    repoUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    relatedIdea: z.string().optional(),
  }),
});

export const collections = { ideas, blog };
