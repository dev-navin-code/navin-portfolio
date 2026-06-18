# Blog Database Schema for Navin's Portfolio

## Overview
A comprehensive blog system database schema supporting posts, categories, tags, comments, and analytics.

---

## Database Tables

### 1. **posts** (Blog Posts)
Stores all blog post content and metadata.

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  featured_image_url VARCHAR(500),
  author_id INTEGER NOT NULL,
  category_id INTEGER,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

**Fields:**
- `id`: Unique identifier
- `title`: Post title (max 255 chars)
- `slug`: URL-friendly identifier (auto-generated from title)
- `content`: Full post content (supports markdown)
- `excerpt`: Short preview text
- `featured_image_url`: Hero image for the post
- `author_id`: Reference to author (you)
- `category_id`: Reference to category
- `status`: Publication status
- `views_count`: Track post popularity
- `likes_count`: User engagement metric
- `created_at`, `updated_at`, `published_at`: Timestamps

---

### 2. **categories** (Blog Categories)
Organize posts into categories.

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7), -- Hex color code for UI
  icon VARCHAR(50), -- Icon name or emoji
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Example Categories:**
- Web Development
- Problem Solving
- Tutorials
- Project Showcase
- Career Tips

---

### 3. **tags** (Blog Tags)
Flexible tagging system for better content discovery.

```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Example Tags:**
- React, JavaScript, HTML, CSS
- Algorithms, Data Structures
- Web Design, Performance
- Career, Learning

---

### 4. **post_tags** (Many-to-Many: Posts ↔ Tags)
Links posts to multiple tags.

```sql
CREATE TABLE post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

---

### 5. **comments** (Blog Comments)
Store reader comments on blog posts.

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'spam'
  likes_count INTEGER DEFAULT 0,
  parent_comment_id INTEGER, -- For nested replies
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);
```

**Features:**
- Comment moderation (pending/approved/spam)
- Nested replies support
- Like/engagement tracking

---

### 6. **users** (Authors)
Store author information.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'author', -- 'admin', 'author', 'viewer'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 7. **blog_analytics** (Analytics & Metrics)
Track blog performance and user engagement.

```sql
CREATE TABLE blog_analytics (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  visitor_ip VARCHAR(45),
  user_agent TEXT,
  referrer VARCHAR(500),
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  time_spent_seconds INTEGER,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
```

**Tracks:**
- View count per post
- Visitor information
- Time spent on post
- Referrer source

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    users    │
│ (Authors)   │
└──────┬──────┘
       │
       │ author_id
       ▼
┌─────────────────────────┐
│       posts             │
│  (Blog Posts)           │
└──────┬────────┬─────────┘
       │        │
       │        │ category_id
       │        ▼
       │   ┌──────────────┐
       │   │  categories  │
       │   └──────────────┘
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌──────────────┐      ┌──────────────┐
│ comments     │      │ post_tags    │
│ (Nested)     │      │ (M-to-M)     │
└──────────────┘      └──────┬───────┘
                             │
                             ▼
                        ┌──────────┐
                        │   tags   │
                        └──────────┘

┌──────────────────┐
│ blog_analytics   │
│ (Metrics)        │
└────────┬─────────┘
         │ post_id
         ▼
      posts
```

---

## Sample Data

### Categories
```sql
INSERT INTO categories (name, slug, description, color, icon) VALUES
('Web Development', 'web-development', 'Frontend and backend development tips', '#0066FF', '💻'),
('Problem Solving', 'problem-solving', 'Algorithms and coding challenges', '#FF6B35', '🧩'),
('Tutorials', 'tutorials', 'Step-by-step guides and how-tos', '#00B4D8', '📚'),
('Project Showcase', 'projects', 'Featured projects and case studies', '#06D6A0', '🚀');
```

### Tags
```sql
INSERT INTO tags (name, slug) VALUES
('JavaScript', 'javascript'),
('React', 'react'),
('HTML', 'html'),
('CSS', 'css'),
('Algorithms', 'algorithms'),
('Data Structures', 'data-structures'),
('Web Design', 'web-design'),
('Performance', 'performance');
```

### Users (Author)
```sql
INSERT INTO users (name, email, bio, role) VALUES
('Mohd. Navin Sarvr Ansari', 'navinsarvr2006@gmail.com', 
 'Diploma in Computer Science & Engineering. Passionate about clean code and elegant design.', 
 'admin');
```

---

## API Endpoints (To Be Implemented)

### Blog Posts
- `GET /api/blog/posts` - List all published posts (with pagination)
- `GET /api/blog/posts/:slug` - Get single post by slug
- `POST /api/blog/posts` - Create new post (admin only)
- `PUT /api/blog/posts/:id` - Update post (admin only)
- `DELETE /api/blog/posts/:id` - Delete post (admin only)

### Categories
- `GET /api/blog/categories` - List all categories
- `GET /api/blog/categories/:slug` - Get posts in category

### Tags
- `GET /api/blog/tags` - List all tags
- `GET /api/blog/tags/:slug` - Get posts with tag

### Comments
- `GET /api/blog/posts/:postId/comments` - Get comments for post
- `POST /api/blog/posts/:postId/comments` - Add new comment
- `PUT /api/blog/comments/:id` - Update comment (admin only)
- `DELETE /api/blog/comments/:id` - Delete comment (admin only)

### Analytics
- `POST /api/blog/analytics` - Track post view
- `GET /api/blog/posts/:id/stats` - Get post statistics (admin only)

---

## Features Supported

✅ **Content Management**
- Create, read, update, delete blog posts
- Draft and publish workflow
- Rich content with markdown support

✅ **Organization**
- Multiple categories
- Flexible tagging system
- URL-friendly slugs

✅ **Engagement**
- Reader comments with moderation
- Nested comment replies
- Like/engagement tracking

✅ **Analytics**
- View count tracking
- Visitor information
- Time spent metrics
- Referrer source tracking

✅ **Performance**
- Indexed queries for fast retrieval
- Pagination support
- Efficient filtering and search

---

## Implementation Notes

1. **Slug Generation**: Auto-generate URL-friendly slugs from titles
2. **Timestamps**: Use UTC for all timestamps
3. **Status Workflow**: draft → published → archived
4. **Comment Moderation**: Require admin approval for comments
5. **Analytics**: Track anonymously (no user accounts required)
6. **Soft Deletes**: Consider implementing soft deletes for posts
7. **Search**: Implement full-text search on titles and content
8. **Caching**: Cache popular posts and category lists

---

## Next Steps

1. ✅ Schema design (complete)
2. ⏳ Upgrade project to web-db-user
3. ⏳ Create database tables
4. ⏳ Build backend API
5. ⏳ Create blog UI components
6. ⏳ Integrate frontend with API
