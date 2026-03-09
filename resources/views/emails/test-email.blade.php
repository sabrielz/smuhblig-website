<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Email – {{ $siteName }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #f8f9fa;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #111111;
        }

        .wrapper {
            max-width: 600px;
            margin: 40px auto;
            padding: 0 20px 40px;
        }

        .card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }

        .header {
            background: linear-gradient(135deg, #001f4d 0%, #003f87 100%);
            padding: 40px 36px;
            text-align: center;
        }

        .header .logo-badge {
            display: inline-block;
            background: rgba(201, 168, 76, 0.15);
            border: 1px solid rgba(201, 168, 76, 0.3);
            border-radius: 12px;
            padding: 10px 20px;
            margin-bottom: 16px;
        }

        .header .logo-text {
            color: #c9a84c;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            margin-top: 12px;
        }

        .header p {
            color: rgba(255, 255, 255, 0.65);
            font-size: 14px;
            margin-top: 8px;
        }

        .body {
            padding: 36px;
        }

        .success-banner {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 20px 24px;
            margin-bottom: 28px;
            display: flex;
            align-items: flex-start;
            gap: 14px;
        }

        .success-icon {
            font-size: 24px;
            flex-shrink: 0;
        }

        .success-title {
            font-size: 16px;
            font-weight: 700;
            color: #166534;
            margin-bottom: 4px;
        }

        .success-desc {
            font-size: 14px;
            color: #16a34a;
            line-height: 1.6;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }

        .info-table td {
            padding: 10px 0;
            font-size: 14px;
            border-bottom: 1px solid #f2f2f7;
        }

        .info-table td:first-child {
            color: #636366;
            width: 40%;
        }

        .info-table td:last-child {
            color: #111111;
            font-weight: 500;
        }

        .footer {
            text-align: center;
            padding: 24px;
            border-top: 1px solid #f2f2f7;
        }

        .footer p {
            font-size: 12px;
            color: #aeaeb2;
            line-height: 1.7;
        }

        .divider {
            height: 1px;
            background: #f2f2f7;
            margin: 24px 0;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="card">
            <!-- Header -->
            <div class="header">
                <div class="logo-badge">
                    <span class="logo-text">SMK Muhammadiyah Bligo</span>
                </div>
                <h1>✉ Konfigurasi Email Berhasil</h1>
                <p>Email test ini dikirim dari sistem CMS untuk memverifikasi konfigurasi SMTP.</p>
            </div>

            <!-- Body -->
            <div class="body">
                <div class="success-banner">
                    <div class="success-icon">✅</div>
                    <div>
                        <div class="success-title">Konfigurasi SMTP berfungsi dengan baik!</div>
                        <div class="success-desc">
                            Server email Anda berhasil mengirim pesan ini. Semua notifikasi, reset password,
                            dan email sistem akan terkirim dengan normal.
                        </div>
                    </div>
                </div>

                <h3
                    style="font-size:14px; font-weight:600; color:#636366; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">
                    Detail Pengiriman</h3>
                <table class="info-table">
                    <tr>
                        <td>Dari Sistem</td>
                        <td>{{ $siteName }}</td>
                    </tr>
                    <tr>
                        <td>Waktu Pengiriman</td>
                        <td>{{ $testedAt }} WIB</td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td style="color:#16a34a; font-weight:700;">✓ Terkirim Berhasil</td>
                    </tr>
                </table>

                <div class="divider"></div>

                <p style="font-size:13px; color:#636366; line-height:1.7;">
                    Email ini dikirim secara otomatis dari sistem CMS <strong>{{ $siteName }}</strong>.
                    Jika Anda tidak mengharapkan email ini, Anda dapat mengabaikannya.
                </p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>
                    © {{ date('Y') }} {{ $siteName }}<br>
                    <span style="color:#c9a84c;">smkmuhbligo.sch.id</span>
                </p>
            </div>
        </div>
    </div>
</body>

</html>