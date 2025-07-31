<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Folder;
use App\Models\Note;
use Illuminate\Database\Seeder;

class NotesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test user if one doesn't exist
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create some folders
        $workFolder = Folder::create([
            'name' => 'Work',
            'color' => '#007AFF',
            'user_id' => $user->id,
            'sort_order' => 1,
        ]);

        $personalFolder = Folder::create([
            'name' => 'Personal',
            'color' => '#34C759',
            'user_id' => $user->id,
            'sort_order' => 2,
        ]);

        $ideasFolder = Folder::create([
            'name' => 'Ideas',
            'color' => '#AF52DE',
            'user_id' => $user->id,
            'sort_order' => 3,
        ]);

        // Create some sample notes
        Note::create([
            'title' => 'Meeting Notes - Q4 Planning',
            'content' => '<h2>Q4 Planning Meeting</h2><p><strong>Date:</strong> Today</p><p><strong>Attendees:</strong> Team leads</p><h3>Agenda:</h3><ul><li>Review Q3 performance</li><li>Set Q4 goals</li><li>Budget allocation</li><li>Team restructuring</li></ul><p><em>Action items will be sent out by EOD.</em></p>',
            'user_id' => $user->id,
            'folder_id' => $workFolder->id,
            'is_pinned' => true,
        ]);

        Note::create([
            'title' => 'Project Ideas',
            'content' => '<h2>💡 New Project Ideas</h2><p>Some interesting concepts to explore:</p><ol><li><strong>AI-powered note organizer</strong><br>Automatically categorize and tag notes based on content</li><li><strong>Voice-to-text integration</strong><br>Record voice memos and convert to searchable text</li><li><strong>Collaborative notebooks</strong><br>Share folders with team members for real-time collaboration</li></ol><p>Need to research market demand and technical feasibility.</p>',
            'user_id' => $user->id,
            'folder_id' => $ideasFolder->id,
            'is_pinned' => false,
        ]);

        Note::create([
            'title' => 'Weekend Plans',
            'content' => '<h2>🏖️ Weekend To-Do</h2><h3>Saturday:</h3><ul><li>Grocery shopping</li><li>Visit the farmer\'s market</li><li>Movie night with friends</li></ul><h3>Sunday:</h3><ul><li>Brunch at the new café</li><li>Read a book in the park</li><li>Prepare for next week</li></ul><p><em>Weather forecast looks good! 🌞</em></p>',
            'user_id' => $user->id,
            'folder_id' => $personalFolder->id,
            'is_pinned' => false,
        ]);

        Note::create([
            'title' => 'Book Recommendations',
            'content' => '<h2>📚 Must-Read Books</h2><h3>Fiction:</h3><ul><li><strong>The Seven Husbands of Evelyn Hugo</strong> by Taylor Jenkins Reid</li><li><strong>Klara and the Sun</strong> by Kazuo Ishiguro</li><li><strong>The Midnight Library</strong> by Matt Haig</li></ul><h3>Non-Fiction:</h3><ul><li><strong>Atomic Habits</strong> by James Clear</li><li><strong>Educated</strong> by Tara Westover</li><li><strong>Sapiens</strong> by Yuval Noah Harari</li></ul><p>Added to reading list! 📖</p>',
            'user_id' => $user->id,
            'folder_id' => $personalFolder->id,
            'is_pinned' => false,
        ]);

        Note::create([
            'title' => 'Recipe: Chocolate Chip Cookies',
            'content' => '<h2>🍪 Perfect Chocolate Chip Cookies</h2><h3>Ingredients:</h3><ul><li>2¼ cups all-purpose flour</li><li>1 tsp baking soda</li><li>1 tsp salt</li><li>1 cup butter, softened</li><li>¾ cup granulated sugar</li><li>¾ cup brown sugar</li><li>2 large eggs</li><li>2 tsp vanilla extract</li><li>2 cups chocolate chips</li></ul><h3>Instructions:</h3><ol><li>Preheat oven to 375°F</li><li>Mix dry ingredients in a bowl</li><li>Cream butter and sugars</li><li>Add eggs and vanilla</li><li>Combine wet and dry ingredients</li><li>Fold in chocolate chips</li><li>Bake for 9-11 minutes</li></ol><p><em>Makes about 48 cookies. Perfect for sharing! 😋</em></p>',
            'user_id' => $user->id,
            'folder_id' => $personalFolder->id,
            'is_pinned' => false,
        ]);

        Note::create([
            'title' => '',
            'content' => 'Quick thought: Maybe we should implement dark mode for the entire application. Users seem to prefer it for note-taking apps.',
            'user_id' => $user->id,
            'folder_id' => null,
            'is_pinned' => false,
        ]);
    }
}