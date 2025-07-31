<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Note;
use App\Models\Folder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotesTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_notes_home_page(): void
    {
        $user = User::factory()->create();
        $note = Note::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('home')
                ->has('notes')
                ->has('folders')
                ->has('stats')
        );
    }

    public function test_unauthenticated_user_sees_welcome_page(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
        );
    }

    public function test_user_can_create_note(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/notes', [
            'title' => 'Test Note',
            'content' => 'This is a test note',
            'is_pinned' => false,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('notes', [
            'title' => 'Test Note',
            'content' => 'This is a test note',
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_view_their_note(): void
    {
        $user = User::factory()->create();
        $note = Note::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get("/notes/{$note->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('notes/show')
                ->has('note')
                ->where('note.id', $note->id)
        );
    }

    public function test_user_cannot_view_others_note(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $note = Note::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->get("/notes/{$note->id}");

        $response->assertStatus(403);
    }

    public function test_user_can_update_their_note(): void
    {
        $user = User::factory()->create();
        $note = Note::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->put("/notes/{$note->id}", [
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'is_pinned' => true,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('notes', [
            'id' => $note->id,
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'is_pinned' => true,
        ]);
    }

    public function test_user_can_delete_their_note(): void
    {
        $user = User::factory()->create();
        $note = Note::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete("/notes/{$note->id}");

        $response->assertRedirect();
        $this->assertDatabaseHas('notes', [
            'id' => $note->id,
            'is_deleted' => true,
        ]);
    }

    public function test_user_can_search_notes(): void
    {
        $user = User::factory()->create();
        Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Meeting Notes',
            'content' => 'Important meeting discussion',
        ]);
        Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Personal Thoughts',
            'content' => 'Random ideas and thoughts',
        ]);

        $response = $this->actingAs($user)->get('/?search=meeting');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('home')
                ->has('notes', 1)
                ->where('filters.search', 'meeting')
        );
    }
}