<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Peringatan Job Gagal</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f7f9fa; margin: 0; padding: 24px;">
    <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #dc2626; color: #ffffff; padding: 20px 24px;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700;">⚠️ Peringatan: Antrean Job Gagal Terdeteksi</h2>
            <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Sistem mendeteksi kegagalan pada antrean pekerjaan background.</p>
        </div>
        <div style="padding: 24px;">
            <p style="margin-top: 0;">Halo Administrator,</p>
            <p>Terdapat <strong>{{ $jobs->count() }}</strong> antrean job yang tercatat gagal di tabel <code>failed_jobs</code>:</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; font-size: 13px;">
                <thead>
                    <tr style="background-color: #f3f4f6; text-align: left;">
                        <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">ID</th>
                        <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Koneksi / Antrean</th>
                        <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Waktu Gagal</th>
                        <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Pesan Ringkas</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($jobs as $job)
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-mono; font-size: 12px;">{{ $job->id }}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;">{{ $job->connection }} / <strong>{{ $job->queue }}</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;">{{ $job->failed_at }}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; color: #b91c1c;">
                                {{ \Illuminate\Support\Str::limit($job->exception, 120) }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <p style="font-size: 13px; color: #6b7280;">
                Silakan lakukan inspeksi lebih lanjut melalui perintah:
                <br>
                <code>php artisan queue:failed</code> atau coba retry dengan <code>php artisan queue:retry all</code>.
            </p>
        </div>
        <div style="background-color: #f9fafb; padding: 16px 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
            Sistem Pemantauan Otomatis &bull; SMK Muhammadiyah Bligo
        </div>
    </div>
</body>
</html>
