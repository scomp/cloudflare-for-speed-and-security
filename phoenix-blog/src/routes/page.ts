import { sha256Sum } from "@phoenix/core/crypto";
import { Context } from "../context";
import { getBlog, getPage, maxTime } from "../utils";
import templatesHash from '../templates_tsx/templates_sha256.txt';
import { PageTemplate } from "../templates_tsx/page";
import { handleCaching } from "../caching";

export async function page(ctx: Context): Promise<Response> {
  const reqUrl = new URL(ctx.req.url);

  const domain = 'blog.cloudflarebook.net';
  const [blog, page] = await Promise.all([
    getBlog(ctx, domain),
    getPage(ctx, domain, reqUrl.pathname),
  ]);

  const updatedAt = maxTime(blog.updated_at, page.updated_at);
  const etag = await sha256Sum(`${templatesHash}|${updatedAt.toISOString()}`)
  const cacheHit = handleCaching(ctx, 'public, max-age=60, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  const html = PageTemplate({ blog, page });

  return ctx.html(html);
}
