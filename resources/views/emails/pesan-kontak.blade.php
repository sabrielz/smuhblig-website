<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pesan Baru dari {{ $pesan->nama }}</title>
</head>

<body
    style="margin:0; padding:0; background-color:#f8f9fa; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#111111;">

    <!-- Outer wrapper -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8f9fa; padding:32px 16px;">
        <tr>
            <td align="center">

                <!-- Card Container -->
                <table cellpadding="0" cellspacing="0" border="0" width="600"
                    style="max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                    <!-- ===== HEADER ===== -->
                    <tr>
                        <td style="background-color:#001f4d; padding:32px 40px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <!-- School Name -->
                                        <p
                                            style="margin:0; font-size:12px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#c9a84c;">
                                            SMK MUHAMMADIYAH BLIGO
                                        </p>
                                        <h1
                                            style="margin:8px 0 0; font-size:22px; font-weight:700; color:#ffffff; line-height:1.3;">
                                            📩 Pesan Baru Masuk
                                        </h1>
                                        <p style="margin:6px 0 0; font-size:14px; color:rgba(255,255,255,0.65);">
                                            Seseorang telah mengisi form kontak di website Anda.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- ===== BODY ===== -->
                    <tr>
                        <td style="padding:32px 40px;">

                            <!-- Alert info -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%"
                                style="background-color:#eef5fc; border-left:4px solid #003f87; border-radius:0 8px 8px 0; margin-bottom:28px;">
                                <tr>
                                    <td style="padding:14px 18px;">
                                        <p style="margin:0; font-size:13px; color:#003f87; font-weight:600;">
                                            Pesan diterima pada: {{ $pesan->created_at->format('d M Y, H:i') }} WIB
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Detail Pengirim -->
                            <h2
                                style="margin:0 0 16px; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#636366;">
                                Informasi Pengirim
                            </h2>

                            <table cellpadding="0" cellspacing="0" border="0" width="100%"
                                style="border:1px solid #e5e5ea; border-radius:8px; overflow:hidden; margin-bottom:24px;">
                                <!-- Nama -->
                                <tr style="border-bottom:1px solid #e5e5ea;">
                                    <td
                                        style="padding:12px 16px; background-color:#f8f9fa; width:130px; font-size:13px; font-weight:600; color:#636366;">
                                        Nama
                                    </td>
                                    <td style="padding:12px 16px; font-size:14px; color:#111111; font-weight:500;">
                                        {{ $pesan->nama }}
                                    </td>
                                </tr>
                                <!-- Email -->
                                <tr style="border-bottom:1px solid #e5e5ea;">
                                    <td
                                        style="padding:12px 16px; background-color:#f8f9fa; font-size:13px; font-weight:600; color:#636366;">
                                        Email
                                    </td>
                                    <td style="padding:12px 16px; font-size:14px; color:#0050a8;">
                                        <a href="mailto:{{ $pesan->email }}"
                                            style="color:#0050a8; text-decoration:none;">{{ $pesan->email }}</a>
                                    </td>
                                </tr>
                                <!-- Telepon -->
                                <tr style="border-bottom:1px solid #e5e5ea;">
                                    <td
                                        style="padding:12px 16px; background-color:#f8f9fa; font-size:13px; font-weight:600; color:#636366;">
                                        Telepon
                                    </td>
                                    <td style="padding:12px 16px; font-size:14px; color:#111111;">
                                        {{ $pesan->nomor_telepon ?? '<span style="color:#aeaeb2; font-style:italic;">Tidak diisi</span>' }}
                                    </td>
                                </tr>
                                <!-- Subjek -->
                                <tr>
                                    <td
                                        style="padding:12px 16px; background-color:#f8f9fa; font-size:13px; font-weight:600; color:#636366;">
                                        Subjek
                                    </td>
                                    <td style="padding:12px 16px; font-size:14px; color:#111111; font-weight:600;">
                                        {{ $pesan->subjek }}
                                    </td>
                                </tr>
                            </table>

                            <!-- Isi Pesan -->
                            <h2
                                style="margin:0 0 12px; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#636366;">
                                Isi Pesan
                            </h2>

                            <table cellpadding="0" cellspacing="0" border="0" width="100%"
                                style="background-color:#f8f9fa; border:1px solid #e5e5ea; border-radius:8px; margin-bottom:32px;">
                                <tr>
                                    <td
                                        style="padding:20px 20px; font-size:15px; color:#111111; line-height:1.7; white-space:pre-wrap;">
                                        {{ $pesan->pesan }}</td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="{{ config('app.url') }}/admin/pesan/{{ $pesan->id }}"
                                            style="display:inline-block; background-color:#003f87; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; padding:14px 32px; border-radius:8px; letter-spacing:0.02em;">
                                            Lihat di Admin Panel →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- ===== FOOTER ===== -->
                    <tr>
                        <td
                            style="background-color:#f8f9fa; border-top:1px solid #e5e5ea; padding:20px 40px; text-align:center;">
                            <p style="margin:0; font-size:12px; color:#8e8e93; line-height:1.6;">
                                Email ini dikirim otomatis oleh sistem website<br>
                                <strong style="color:#003f87;">SMK Muhammadiyah Bligo</strong> — smkmuhbligo.sch.id<br>
                                IP Pengirim: {{ $pesan->ip_address }}
                            </p>
                        </td>
                    </tr>

                </table>
                <!-- End Card -->

            </td>
        </tr>
    </table>
    <!-- End Outer wrapper -->

</body>

</html>