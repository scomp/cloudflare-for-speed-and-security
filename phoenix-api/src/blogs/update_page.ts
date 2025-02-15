import { Context } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput } from "../utils";
import { NotFoundError } from "@phoenix/core/errors";
import { UpdatePageInputValidator, convertToApiResponse } from "@phoenix/core/api";
import { Page } from "@phoenix/core/entities";

export async function updatePage(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);

  const apiInput = await parseAndValidateApiInput(ctx, UpdatePageInputValidator);

  const pageRes = await ctx.var.db.query('SELECT * FROM pages WHERE id = $1', [apiInput.page_id]);
  if (pageRes.rowCount !== 1) {
    throw new NotFoundError('page not found');
  }
  const page: Page = pageRes.rows[0];

  const now = new Date();
  page.updated_at = now;
  page.slug = apiInput.slug ?? page.slug;
  page.title = apiInput.title ?? page.title;
  page.content_html = apiInput.content_html ?? page.content_html;

  await ctx.var.db.query(`UPDATE pages SET
    updated_at = $1, slug = $2, title = $3, content_html = $4
    WHERE id = $5`,
    [page.updated_at, page.slug, page.title, page.content_html, page.id],
  );

  return ctx.json(convertToApiResponse(page));
}
