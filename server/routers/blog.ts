import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  getPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  publishPost,
  deletePost,
  searchPosts,
  incrementPostViews,
  getCategories,
  getCategoryBySlug,
  getPostsByCategory,
  createCategory,
  getTags,
  getTagBySlug,
  getPostsByTag,
  createTag,
  addTagToPost,
  getPostComments,
  createComment,
  approveComment,
  deleteComment,
  likeComment,
  trackPostView,
  getPostStats,
  generateSlug,
} from "../blog";

/**
 * Blog tRPC Router
 * All procedures are type-safe and auto-validated with Zod
 */

export const blogRouter = router({
  // ============= POSTS =============

  /**
   * Get published posts with pagination
   * @example
   * const { data } = trpc.blog.posts.list.useQuery({ limit: 10, offset: 0 });
   */
  posts: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().int().positive().default(10),
          offset: z.number().int().nonnegative().default(0),
        })
      )
      .query(async ({ input }) => {
        return getPosts(input.limit, input.offset);
      }),

    /**
     * Get single post by slug
     * @example
     * const { data } = trpc.blog.posts.bySlug.useQuery({ slug: "my-first-post" });
     */
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getPostBySlug(input.slug);
        if (!post) throw new Error("Post not found");
        
        // Track view
        await trackPostView(post.id, {
          userAgent: "web-client",
        });
        
        return post;
      }),

    /**
     * Get single post by ID
     * @example
     * const { data } = trpc.blog.posts.byId.useQuery({ id: 1 });
     */
    byId: publicProcedure
      .input(z.object({ id: z.number().int() }))
      .query(async ({ input }) => {
        const post = await getPostById(input.id);
        if (!post) throw new Error("Post not found");
        return post;
      }),

    /**
     * Search posts by title
     * @example
     * const { data } = trpc.blog.posts.search.useQuery({ query: "react" });
     */
    search: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        return searchPosts(input.query);
      }),

    /**
     * Create new blog post (admin only)
     * @example
     * await trpc.blog.posts.create.useMutation().mutateAsync({
     *   title: "My First Post",
     *   content: "...",
     *   authorId: 1
     * });
     */
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(255),
          content: z.string().min(1),
          excerpt: z.string().max(500).optional(),
          featuredImageUrl: z.string().url().optional(),
          categoryId: z.number().int().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can create posts");
        }

        const slug = await generateSlug(input.title);

        return createPost({
          ...input,
          slug,
          authorId: ctx.user.id,
        });
      }),

    /**
     * Update blog post (admin only)
     * @example
     * await trpc.blog.posts.update.useMutation().mutateAsync({
     *   id: 1,
     *   title: "Updated Title"
     * });
     */
    update: protectedProcedure
      .input(
        z.object({
          id: z.number().int(),
          title: z.string().optional(),
          content: z.string().optional(),
          excerpt: z.string().optional(),
          featuredImageUrl: z.string().optional(),
          categoryId: z.number().int().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can update posts");
        }

        const { id, ...updates } = input;
        return updatePost(id, updates);
      }),

    /**
     * Publish draft post (admin only)
     * @example
     * await trpc.blog.posts.publish.useMutation().mutateAsync({ id: 1 });
     */
    publish: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can publish posts");
        }

        return publishPost(input.id);
      }),

    /**
     * Delete blog post (admin only)
     * @example
     * await trpc.blog.posts.delete.useMutation().mutateAsync({ id: 1 });
     */
    delete: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can delete posts");
        }

        return deletePost(input.id);
      }),
  }),

  // ============= CATEGORIES =============

  categories: router({
    /**
     * Get all categories
     * @example
     * const { data } = trpc.blog.categories.list.useQuery();
     */
    list: publicProcedure.query(async () => {
      return getCategories();
    }),

    /**
     * Get posts in category
     * @example
     * const { data } = trpc.blog.categories.posts.useQuery({ slug: "web-dev" });
     */
    posts: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const category = await getCategoryBySlug(input.slug);
        if (!category) throw new Error("Category not found");

        return getPostsByCategory(category.id);
      }),

    /**
     * Create category (admin only)
     * @example
     * await trpc.blog.categories.create.useMutation().mutateAsync({
     *   name: "Web Development",
     *   slug: "web-dev"
     * });
     */
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(100),
          slug: z.string().min(1).max(100),
          description: z.string().optional(),
          color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
          icon: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can create categories");
        }

        return createCategory(input);
      }),
  }),

  // ============= TAGS =============

  tags: router({
    /**
     * Get all tags
     * @example
     * const { data } = trpc.blog.tags.list.useQuery();
     */
    list: publicProcedure.query(async () => {
      return getTags();
    }),

    /**
     * Get posts with tag
     * @example
     * const { data } = trpc.blog.tags.posts.useQuery({ slug: "react" });
     */
    posts: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const tag = await getTagBySlug(input.slug);
        if (!tag) throw new Error("Tag not found");

        return getPostsByTag(tag.id);
      }),

    /**
     * Create tag (admin only)
     * @example
     * await trpc.blog.tags.create.useMutation().mutateAsync({
     *   name: "React",
     *   slug: "react"
     * });
     */
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(50),
          slug: z.string().min(1).max(50),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can create tags");
        }

        return createTag(input);
      }),

    /**
     * Add tag to post (admin only)
     * @example
     * await trpc.blog.tags.addToPost.useMutation().mutateAsync({
     *   postId: 1,
     *   tagId: 5
     * });
     */
    addToPost: protectedProcedure
      .input(z.object({ postId: z.number().int(), tagId: z.number().int() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can add tags to posts");
        }

        return addTagToPost(input.postId, input.tagId);
      }),
  }),

  // ============= COMMENTS =============

  comments: router({
    /**
     * Get approved comments for post
     * @example
     * const { data } = trpc.blog.comments.list.useQuery({ postId: 1 });
     */
    list: publicProcedure
      .input(z.object({ postId: z.number().int() }))
      .query(async ({ input }) => {
        return getPostComments(input.postId);
      }),

    /**
     * Create comment on post
     * @example
     * await trpc.blog.comments.create.useMutation().mutateAsync({
     *   postId: 1,
     *   authorName: "John",
     *   authorEmail: "john@example.com",
     *   content: "Great post!"
     * });
     */
    create: publicProcedure
      .input(
        z.object({
          postId: z.number().int(),
          authorName: z.string().min(1).max(100),
          authorEmail: z.string().email(),
          content: z.string().min(1),
          parentCommentId: z.number().int().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createComment(input);
      }),

    /**
     * Approve comment (admin only)
     * @example
     * await trpc.blog.comments.approve.useMutation().mutateAsync({ id: 1 });
     */
    approve: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can approve comments");
        }

        return approveComment(input.id);
      }),

    /**
     * Delete comment (admin only)
     * @example
     * await trpc.blog.comments.delete.useMutation().mutateAsync({ id: 1 });
     */
    delete: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can delete comments");
        }

        return deleteComment(input.id);
      }),

    /**
     * Like comment
     * @example
     * await trpc.blog.comments.like.useMutation().mutateAsync({ id: 1 });
     */
    like: publicProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input }) => {
        return likeComment(input.id);
      }),
  }),

  // ============= ANALYTICS =============

  analytics: router({
    /**
     * Get post statistics (admin only)
     * @example
     * const { data } = trpc.blog.analytics.stats.useQuery({ postId: 1 });
     */
    stats: protectedProcedure
      .input(z.object({ postId: z.number().int() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can view analytics");
        }

        return getPostStats(input.postId);
      }),
  }),
});

export type BlogRouter = typeof blogRouter;
