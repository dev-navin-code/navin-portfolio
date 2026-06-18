import { eq, and, desc, like } from "drizzle-orm";
import { posts, categories, tags, comments, postTags, blogAnalytics, Post, Comment, Category, Tag } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Blog Database Helper Functions
 * All functions return raw Drizzle results for use in tRPC procedures
 */

// ============= POSTS =============

export async function getPosts(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createPost(post: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImageUrl?: string;
  authorId: number;
  categoryId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(posts).values({
    ...post,
    status: "draft",
  });

  return result;
}

export async function updatePost(id: number, updates: Partial<typeof posts.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(posts).set(updates).where(eq(posts.id, id));
}

export async function publishPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(posts)
    .set({
      status: "published",
      publishedAt: new Date(),
    })
    .where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(posts).where(eq(posts.id, id));
}

export async function searchPosts(query: string, limit = 10) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.status, "published"),
        like(posts.title, `%${query}%`)
      )
    )
    .limit(limit);
}

export async function incrementPostViews(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const post = await getPostById(id);
  if (!post) return null;

  return db
    .update(posts)
    .set({ viewsCount: (post.viewsCount || 0) + 1 })
    .where(eq(posts.id, id));
}

// ============= CATEGORIES =============

export async function getCategories() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getPostsByCategory(categoryId: number, limit = 10) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(posts)
    .where(and(eq(posts.categoryId, categoryId), eq(posts.status, "published")))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function createCategory(category: {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(categories).values(category);
}

// ============= TAGS =============

export async function getTags() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(tags).orderBy(tags.name);
}

export async function getTagBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getPostsByTag(tagId: number, limit = 10) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select({ post: posts })
    .from(postTags)
    .innerJoin(posts, eq(postTags.postId, posts.id))
    .where(and(eq(postTags.tagId, tagId), eq(posts.status, "published")))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function createTag(tag: { name: string; slug: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(tags).values(tag);
}

export async function addTagToPost(postId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(postTags).values({ postId, tagId });
}

// ============= COMMENTS =============

export async function getPostComments(postId: number, limit = 20) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.status, "approved")))
    .orderBy(desc(comments.createdAt))
    .limit(limit);
}

export async function createComment(comment: {
  postId: number;
  authorName: string;
  authorEmail: string;
  content: string;
  parentCommentId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(comments).values({
    ...comment,
    status: "pending",
  });
}

export async function approveComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(comments).set({ status: "approved" }).where(eq(comments.id, id));
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(comments).where(eq(comments.id, id));
}

export async function likeComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const comment = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
  if (comment.length === 0) return null;

  return db
    .update(comments)
    .set({ likesCount: (comment[0]!.likesCount || 0) + 1 })
    .where(eq(comments.id, id));
}

// ============= ANALYTICS =============

export async function trackPostView(postId: number, data: {
  visitorIp?: string;
  userAgent?: string;
  referrer?: string;
  timeSpentSeconds?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(blogAnalytics).values({
    postId,
    ...data,
  });
}

export async function getPostStats(postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const post = await getPostById(postId);
  if (!post) return null;

  const analytics = await db
    .select()
    .from(blogAnalytics)
    .where(eq(blogAnalytics.postId, postId));

  const avgTimeSpent = analytics.length > 0
    ? Math.round(
        analytics.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0) / analytics.length
      )
    : 0;

  return {
    post,
    totalViews: post.viewsCount,
    totalLikes: post.likesCount,
    analyticsCount: analytics.length,
    avgTimeSpentSeconds: avgTimeSpent,
  };
}

// ============= UTILITY =============

export async function generateSlug(title: string): Promise<string> {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
