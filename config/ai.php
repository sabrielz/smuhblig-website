<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Anthropic API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the Anthropic Claude API used by the AI features
    | in the CMS editor (generate, revise, correct, translate, SEO).
    |
    */

    'anthropic' => [
        'api_key' => env('ANTHROPIC_API_KEY'),
        'model' => env('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514'),
        'api_url' => env('ANTHROPIC_API_URL', 'https://api.anthropic.com/v1/messages'),
        'version' => env('ANTHROPIC_VERSION', '2023-06-01'),
    ],

    /*
    |--------------------------------------------------------------------------
    | AI Processing Defaults
    |--------------------------------------------------------------------------
    */

    'max_tokens' => (int) env('AI_MAX_TOKENS', 4096),
    'queue_connection' => env('AI_QUEUE_CONNECTION', 'redis'),
    'queue_name' => env('AI_QUEUE_NAME', 'ai'),

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Maximum number of AI requests per minute per authenticated user.
    |
    */

    'rate_limit_per_minute' => (int) env('AI_RATE_LIMIT', 20),

];
