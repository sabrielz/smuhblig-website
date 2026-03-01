<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleTranslation extends Model
{
    protected $fillable = [
        'article_id',
        'locale',
        'title',
        'excerpt',
        'content',
        'ai_translated',
        'reviewed',
    ];

    protected $casts = [
        'ai_translated' => 'boolean',
        'reviewed' => 'boolean',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
}
