<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'title',
        'content',
        'content_html',
    ];

    protected function casts(): array
    {
        return [
            // Cast content to array for automatic JSON encode/decode
            'content' => 'array',
        ];
    }
}
