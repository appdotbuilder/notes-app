<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\NoteAttachment
 *
 * @property int $id
 * @property int $note_id
 * @property string $filename
 * @property string $original_filename
 * @property string $mime_type
 * @property int $file_size
 * @property string $file_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Note $note
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment query()
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment whereFilename($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment whereFileSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment whereMimeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment whereNoteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment whereOriginalFilename($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteAttachment whereUpdatedAt($value)
 * @method static \Database\Factories\NoteAttachmentFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class NoteAttachment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'note_id',
        'filename',
        'original_filename',
        'mime_type',
        'file_size',
        'file_path',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'note_id' => 'integer',
        'file_size' => 'integer',
    ];

    /**
     * Get the note that owns the attachment.
     */
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }
}