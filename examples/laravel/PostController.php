<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * List all posts (title + id only for performance).
     */
    public function index(): JsonResponse
    {
        $posts = Post::select('id', 'title', 'updated_at')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($posts);
    }

    /**
     * Store a new post with JSON content from verso-editor.
     *
     * Expected payload:
     * {
     *   "title": "My Post",
     *   "content": { "type": "doc", "content": [...] },
     *   "content_html": "<p>Rendered HTML</p>"
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|array',
            'content_html' => 'nullable|string',
        ]);

        $post = Post::create($validated);

        return response()->json($post, 201);
    }

    /**
     * Return a post with its JSON content for the editor to load.
     */
    public function show(Post $post): JsonResponse
    {
        return response()->json($post);
    }

    /**
     * Update a post's content.
     */
    public function update(Request $request, Post $post): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|array',
            'content_html' => 'nullable|string',
        ]);

        $post->update($validated);

        return response()->json($post);
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json(null, 204);
    }
}
