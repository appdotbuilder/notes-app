<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Folder;
use App\Models\Note;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FoldersTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_folder(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/folders', [
            'name' => 'Work Notes',
            'color' => '#007AFF',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('folders', [
            'name' => 'Work Notes',
            'color' => '#007AFF',
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_view_folder_creation_form(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/folders/create');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('folders/create')
        );
    }

    public function test_user_can_view_their_folder_with_notes(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $note = Note::factory()->create([
            'user_id' => $user->id,
            'folder_id' => $folder->id,
        ]);

        $response = $this->actingAs($user)->get("/folders/{$folder->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('folders/show')
                ->has('folder')
                ->has('notes')
                ->where('folder.id', $folder->id)
        );
    }

    public function test_user_cannot_view_others_folder(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->get("/folders/{$folder->id}");

        $response->assertStatus(403);
    }

    public function test_user_can_update_their_folder(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->put("/folders/{$folder->id}", [
            'name' => 'Updated Folder Name',
            'color' => '#34C759',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('folders', [
            'id' => $folder->id,
            'name' => 'Updated Folder Name',
            'color' => '#34C759',
        ]);
    }

    public function test_user_can_delete_their_folder(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete("/folders/{$folder->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('folders', [
            'id' => $folder->id,
        ]);
    }

    public function test_folder_validation_requires_name(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/folders', [
            'name' => '',
            'color' => '#007AFF',
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_folder_validation_requires_valid_color(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/folders', [
            'name' => 'Test Folder',
            'color' => 'invalid-color',
        ]);

        $response->assertSessionHasErrors(['color']);
    }
}