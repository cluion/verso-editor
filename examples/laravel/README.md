# Laravel Integration Example

This example shows how to integrate verso-editor with a Laravel backend,
saving and loading content in JSON format for lossless round-tripping.

## Architecture

```
Frontend (verso-editor)  →  JSON  →  Laravel API  →  Database
Frontend (verso-editor)  ←  JSON  ←  Laravel API  ←  Database
```

JSON is the recommended storage format because it preserves the full
ProseMirror document structure (nodes, marks, attrs). Use HTML or Markdown
serializers when you need to render content outside the editor.

## Backend Setup

### 1. Migration

```bash
php artisan make:migration create_posts_table
```

See `migration.php` for the full migration.

### 2. Model

See `Post.php` for the Eloquent model with JSON casting.

### 3. Controller

See `PostController.php` for the API controller that handles
CRUD operations with JSON content.

### 4. Routes

Add to `routes/api.php`:

```php
use App\Http\Controllers\PostController;

Route::apiResource('posts', PostController::class);
```

## Frontend Setup

### 1. Install packages

```bash
pnpm add @verso-editor/core @verso-editor/serializer-json @verso-editor/serializer-html
```

### 2. Integration code

See `frontend.ts` for the full editor initialization with
auto-save and content loading from the Laravel API.

## Content Rendering (Server-Side)

When you need to render content outside the editor (e.g., in email templates
or RSS feeds), use the HTML serializer on the frontend to convert JSON to HTML
before sending, or use a server-side ProseMirror renderer.
