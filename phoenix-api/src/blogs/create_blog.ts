import { uuidv7 } from "@phoenix/uuidv7";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput } from "../utils";
import { CreateBlogInputValidator, convertToApiResponse } from "@phoenix/core/api";
import { Blog } from "@phoenix/core/entities";
import { Context } from "../hono_bindings";

export async function createBlog(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);

  const apiInput = await parseAndValidateApiInput(ctx, CreateBlogInputValidator);

  const now = new Date();
  const blog: Blog = {
    id: uuidv7(),
    created_at: now,
    updated_at: now,
    name: apiInput.name,
    slug: apiInput.slug,
    navigation: {},
    description_html: '',
  };

  await ctx.var.db.query(`INSERT INTO blogs
    (id, created_at, updated_at, name, slug, navigation, description_html)
    VALUES($1, $2, $3, $4, $5, $6, $7)`,
    [blog.id, blog.created_at, blog.updated_at, blog.name, blog.slug, blog.navigation, blog.description_html],
  );

  return ctx.json(convertToApiResponse(blog));
}
