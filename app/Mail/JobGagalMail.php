<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class JobGagalMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    /**
     * Create a new message instance.
     *
     * @param  Collection<int, mixed>  $failedJobs
     */
    public function __construct(
        public Collection $failedJobs,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $count = $this->failedJobs->count();

        return new Envelope(
            subject: "[Peringatan Sistem] {$count} Antrean Job Gagal di SMK Muhammadiyah Bligo",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.job-gagal',
            with: [
                'jobs' => $this->failedJobs,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
