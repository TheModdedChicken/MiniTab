import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { TabType } from './utility/types';
import { getSuggestions, getTab, getTabs } from './utility/fetch';

const Routes = new Hono().basePath('/');

export const SearchArgsSchema = z.object({
  value: z.string().optional(),
  type: z.nativeEnum(TabType).optional(),
  page: z.number().optional(),
  //search_type: z.literal('title').default('title'),
  order: z.string().optional()
});

export default Routes
  .route('/tabs', new Hono()
    .on(
      'SEARCH', '/',

      zValidator('json', SearchArgsSchema),

      async (c) => {
        const body = c.req.valid('json');

        return c.json(
          await getTabs(body)
        );
      }
    )

    .get(
      '/:slug',

      async (c) => {
        const slug = c.req.param('slug');

        return c.json(
          await getTab(slug)
        );
      }
    )
  )

  .get(
    '/suggestions',

    zValidator('query', z.object({
      q: z.string()
    })),

    async (c) => {
      const { q } = c.req.valid('query');

      return c.json(
        await getSuggestions(q)
      );
    }
  );