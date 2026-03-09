<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password – SMK Muhammadiyah Bligo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #f8f9fa;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Plus Jakarta Sans', sans-serif;
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

        p {
            font-size: 15px;
            line-height: 1.75;
            color: #333;
            margin-bottom: 16px;
        }

        .btn-wrapper {
            text-align: center;
            margin: 28px 0;
        }

        .btn {
            display: inline-block;
            background: #003f87;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 36px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.02em;
        }

        .link-fallback {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 16px 20px;
            font-size: 12px;
            color: #636366;
            word-break: break-all;
            margin-top: 20px;
        }

        .link-fallback strong {
            display: block;
            margin-bottom: 6px;
            color: #111;
            font-size: 13px;
        }

        .warning {
            background: #fef9ee;
            border: 1px solid #fde68a;
            border-radius: 10px;
            padding: 14px 18px;
            font-size: 13px;
            color: #92400e;
            margin-top: 20px;
            line-height: 1.6;
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
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <div class="logo-badge">
                    <span class="logo-text">SMK Muhammadiyah Bligo</span>
                </div>
                <h1>🔒 Reset Password</h1>
                <p>Permintaan pemulihan akses akun CMS Admin</p>
            </div>

            <div class="body">
                <p>Halo,</p>
                <p>
                    Kami menerima permintaan untuk mereset password akun Anda di panel CMS
                    <strong>SMK Muhammadiyah Bligo</strong>. Klik tombol di bawah untuk melanjutkan.
                </p>

                <div class="btn-wrapper">
                    <a href="{{ $actionUrl }}" class="btn">Reset Password Saya</a>
                </div>

                <div class="link-fallback">
                    <strong>Link tidak berfungsi? Salin URL berikut ke browser:</strong>
                    {{ $actionUrl }}
                </div>

                <div class="warning">
                    ⚠️ Link ini hanya berlaku selama <strong>{{ $count }} menit</strong>.
                    Jika Anda tidak meminta reset password, abaikan email ini — akun Anda aman.
                </div>
            </div>

            <div class="footer">
                <p>
                    © {{ date('Y') }} SMK Muhammadiyah Bligo<br>
                    <span style="color:#c9a84c;">smkmuhbligo.sch.id</span>
                </p>
            </div>
        </div>
    </div>
</body>

</html>