<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['draft', 'pending_review', 'published', 'archived']);
        $isPublished = $status === 'published';

        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'status' => $status,
            'is_featured' => $this->faker->boolean(20),
            'view_count' => $this->faker->numberBetween(0, 1000),
            'published_at' => $isPublished ? $this->faker->dateTimeBetween('-1 year', 'now') : null,
            'meta_title' => $this->faker->sentence(),
            'meta_description' => $this->faker->paragraph(),
            'og_image' => null,
        ];
    }
}
