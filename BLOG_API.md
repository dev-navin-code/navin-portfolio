# Blog API Documentation

## Overview

Complete type-safe REST API for blog operations using tRPC. All endpoints are automatically type-checked and validated with Zod schemas.

---

## API Endpoints

### Posts

#### List Published Posts
```typescript
// Query
trpc.blog.posts.list.useQuery({ limit: 10, offset: 0 })

// Response
Post[]
```

**Parameters:**
- `limit` (number, default: 10) - Posts per page
- `offset` (number, default: 0) - Pagination offset

**Example:**
```typescript
const { data: posts } = trpc.blog.posts.list.useQuery({ limit: 10, offset: 0 });
```

---

#### Get Post by Slug
```typescript
// Query
trpc.blog.posts.bySlug.useQuery({ slug: "my-first-post" })

// Response
Post | null
```

**Parameters:**
- `slug` (string, required) - URL-friendly post identifier

**Features:**
- Automatically tracks page view
- Returns full post content

**Example:**
```typescript
const { data: post } = trpc.blog.posts.bySlug.useQuery({ slug: "my-first-post" });
```

---

#### Get Post by ID
```typescript
// Query
trpc.blog.posts.byId.useQuery({ id: 1 })

// Response
Post | null
```

**Parameters:**
- `id` (number, required) - Post database ID

**Example:**
```typescript
const { data: post } = trpc.blog.posts.byId.useQuery({ id: 1 });
```

---

#### Search Posts
```typescript
// Query
trpc.blog.posts.search.useQuery({ query: "react" })

// Response
Post[]
```

**Parameters:**
- `query` (string, min: 1 char) - Search term (searches in titles)

**Example:**
```typescript
const { data: results } = trpc.blog.posts.search.useQuery({ query: "react" });
```

---

#### Create Post (Admin Only)
```typescript
// Mutation
trpc.blog.posts.create.useMutation()

// Input
{
  title: string (1-255 chars)
  content: string (required)
  excerpt?: string (max 500 chars)
  featuredImageUrl?: string (valid URL)
  categoryId?: number
}

// Response
{ insertId: number }
```

**Features:**
- Auto-generates URL-friendly slug from title
- Creates post as draft (not published)
- Requires admin role

**Example:**
```typescript
const mutation = trpc.blog.posts.create.useMutation();
await mutation.mutateAsync({
  title: "Getting Started with React",
  content: "# React Basics\n\nReact is a JavaScript library...",
  excerpt: "Learn the fundamentals of React",
  categoryId: 1
});
```

---

#### Update Post (Admin Only)
```typescript
// Mutation
trpc.blog.posts.update.useMutation()

// Input
{
  id: number (required)
  title?: string
  content?: string
  excerpt?: string
  featuredImageUrl?: string
  categoryId?: number
}

// Response
{ changedRows: number }
```

**Example:**
```typescript
await trpc.blog.posts.update.useMutation().mutateAsync({
  id: 1,
  title: "Updated Title",
  content: "Updated content..."
});
```

---

#### Publish Post (Admin Only)
```typescript
// Mutation
trpc.blog.posts.publish.useMutation()

// Input
{ id: number }

// Response
{ changedRows: number }
```

**Features:**
- Changes status from "draft" to "published"
- Sets `publishedAt` timestamp

**Example:**
```typescript
await trpc.blog.posts.publish.useMutation().mutateAsync({ id: 1 });
```

---

#### Delete Post (Admin Only)
```typescript
// Mutation
trpc.blog.posts.delete.useMutation()

// Input
{ id: number }

// Response
{ affectedRows: number }
```

**Example:**
```typescript
await trpc.blog.posts.delete.useMutation().mutateAsync({ id: 1 });
```

---

### Categories

#### List All Categories
```typescript
// Query
trpc.blog.categories.list.useQuery()

// Response
Category[]
```

**Example:**
```typescript
const { data: categories } = trpc.blog.categories.list.useQuery();
```

---

#### Get Posts in Category
```typescript
// Query
trpc.blog.categories.posts.useQuery({ slug: "web-dev" })

// Response
Post[]
```

**Parameters:**
- `slug` (string) - Category URL slug

**Example:**
```typescript
const { data: posts } = trpc.blog.categories.posts.useQuery({ slug: "web-dev" });
```

---

#### Create Category (Admin Only)
```typescript
// Mutation
trpc.blog.categories.create.useMutation()

// Input
{
  name: string (1-100 chars, required)
  slug: string (1-100 chars, required)
  description?: string
  color?: string (hex format: #RRGGBB)
  icon?: string (emoji or icon name)
}

// Response
{ insertId: number }
```

**Example:**
```typescript
await trpc.blog.categories.create.useMutation().mutateAsync({
  name: "Web Development",
  slug: "web-dev",
  description: "Frontend and backend development tips",
  color: "#0066FF",
  icon: "💻"
});
```

---

### Tags

#### List All Tags
```typescript
// Query
trpc.blog.tags.list.useQuery()

// Response
Tag[]
```

**Example:**
```typescript
const { data: tags } = trpc.blog.tags.list.useQuery();
```

---

#### Get Posts with Tag
```typescript
// Query
trpc.blog.tags.posts.useQuery({ slug: "react" })

// Response
Post[]
```

**Parameters:**
- `slug` (string) - Tag URL slug

**Example:**
```typescript
const { data: posts } = trpc.blog.tags.posts.useQuery({ slug: "react" });
```

---

#### Create Tag (Admin Only)
```typescript
// Mutation
trpc.blog.tags.create.useMutation()

// Input
{
  name: string (1-50 chars, required)
  slug: string (1-50 chars, required)
}

// Response
{ insertId: number }
```

**Example:**
```typescript
await trpc.blog.tags.create.useMutation().mutateAsync({
  name: "React",
  slug: "react"
});
```

---

#### Add Tag to Post (Admin Only)
```typescript
// Mutation
trpc.blog.tags.addToPost.useMutation()

// Input
{
  postId: number
  tagId: number
}

// Response
{ affectedRows: number }
```

**Example:**
```typescript
await trpc.blog.tags.addToPost.useMutation().mutateAsync({
  postId: 1,
  tagId: 5
});
```

---

### Comments

#### Get Approved Comments
```typescript
// Query
trpc.blog.comments.list.useQuery({ postId: 1 })

// Response
Comment[]
```

**Parameters:**
- `postId` (number) - Post ID

**Features:**
- Only returns approved comments
- Sorted by newest first
- Includes nested replies

**Example:**
```typescript
const { data: comments } = trpc.blog.comments.list.useQuery({ postId: 1 });
```

---

#### Create Comment
```typescript
// Mutation
trpc.blog.comments.create.useMutation()

// Input
{
  postId: number (required)
  authorName: string (1-100 chars, required)
  authorEmail: string (valid email, required)
  content: string (required)
  parentCommentId?: number (for nested replies)
}

// Response
{ insertId: number }
```

**Features:**
- Comments start as "pending" (need admin approval)
- Supports nested replies
- No authentication required

**Example:**
```typescript
await trpc.blog.comments.create.useMutation().mutateAsync({
  postId: 1,
  authorName: "John Doe",
  authorEmail: "john@example.com",
  content: "Great article! Very helpful."
});
```

---

#### Approve Comment (Admin Only)
```typescript
// Mutation
trpc.blog.comments.approve.useMutation()

// Input
{ id: number }

// Response
{ changedRows: number }
```

**Example:**
```typescript
await trpc.blog.comments.approve.useMutation().mutateAsync({ id: 1 });
```

---

#### Delete Comment (Admin Only)
```typescript
// Mutation
trpc.blog.comments.delete.useMutation()

// Input
{ id: number }

// Response
{ affectedRows: number }
```

**Example:**
```typescript
await trpc.blog.comments.delete.useMutation().mutateAsync({ id: 1 });
```

---

#### Like Comment
```typescript
// Mutation
trpc.blog.comments.like.useMutation()

// Input
{ id: number }

// Response
{ changedRows: number }
```

**Features:**
- Increments like count
- No authentication required
- Can be called multiple times

**Example:**
```typescript
await trpc.blog.comments.like.useMutation().mutateAsync({ id: 1 });
```

---

### Analytics

#### Get Post Statistics (Admin Only)
```typescript
// Query
trpc.blog.analytics.stats.useQuery({ postId: 1 })

// Response
{
  post: Post
  totalViews: number
  totalLikes: number
  analyticsCount: number
  avgTimeSpentSeconds: number
}
```

**Features:**
- Requires admin role
- Calculates average time spent
- Includes view and like counts

**Example:**
```typescript
const { data: stats } = trpc.blog.analytics.stats.useQuery({ postId: 1 });
console.log(`Post views: ${stats.totalViews}`);
console.log(`Avg time spent: ${stats.avgTimeSpentSeconds}s`);
```

---

## Type Definitions

### Post
```typescript
{
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImageUrl?: string
  authorId: number
  categoryId?: number
  status: "draft" | "published" | "archived"
  viewsCount: number
  likesCount: number
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}
```

### Category
```typescript
{
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  createdAt: Date
}
```

### Tag
```typescript
{
  id: number
  name: string
  slug: string
  createdAt: Date
}
```

### Comment
```typescript
{
  id: number
  postId: number
  authorName: string
  authorEmail: string
  content: string
  status: "pending" | "approved" | "spam"
  likesCount: number
  parentCommentId?: number
  createdAt: Date
}
```

---

## Error Handling

All endpoints throw errors with descriptive messages:

```typescript
try {
  await trpc.blog.posts.publish.useMutation().mutateAsync({ id: 1 });
} catch (error) {
  console.error(error.message);
  // "Only admins can publish posts"
  // "Post not found"
  // etc.
}
```

---

## Authentication

- **Public endpoints:** No authentication required
  - `posts.list`, `posts.bySlug`, `posts.byId`, `posts.search`
  - `categories.list`, `categories.posts`
  - `tags.list`, `tags.posts`
  - `comments.list`, `comments.create`, `comments.like`

- **Admin endpoints:** Requires `role === "admin"`
  - `posts.create`, `posts.update`, `posts.publish`, `posts.delete`
  - `categories.create`
  - `tags.create`, `tags.addToPost`
  - `comments.approve`, `comments.delete`
  - `analytics.stats`

---

## Usage Examples

### Display Blog Homepage
```typescript
import { trpc } from "@/lib/trpc";

export function BlogHome() {
  const { data: posts, isLoading } = trpc.blog.posts.list.useQuery({ limit: 10 });
  const { data: categories } = trpc.blog.categories.list.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Latest Posts</h1>
      {posts?.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Display Single Post with Comments
```typescript
export function BlogPost({ slug }: { slug: string }) {
  const { data: post } = trpc.blog.posts.bySlug.useQuery({ slug });
  const { data: comments } = trpc.blog.comments.list.useQuery(
    { postId: post?.id || 0 },
    { enabled: !!post }
  );

  if (!post) return <div>Post not found</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
      
      <section>
        <h2>Comments ({comments?.length || 0})</h2>
        {comments?.map(comment => (
          <div key={comment.id}>
            <strong>{comment.authorName}</strong>
            <p>{comment.content}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
```

### Create New Post (Admin)
```typescript
export function CreatePostForm() {
  const mutation = trpc.blog.posts.create.useMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      await mutation.mutateAsync({
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        excerpt: formData.get("excerpt") as string,
      });
      alert("Post created successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={e => {
      e.preventDefault();
      handleSubmit(new FormData(e.currentTarget));
    }}>
      <input name="title" placeholder="Post title" required />
      <textarea name="content" placeholder="Post content" required />
      <input name="excerpt" placeholder="Excerpt" />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
```

---

## Next Steps

1. ✅ Database schema created
2. ✅ API endpoints implemented
3. ⏳ Build blog UI components
4. ⏳ Create blog section on homepage
5. ⏳ Add admin panel for post management
