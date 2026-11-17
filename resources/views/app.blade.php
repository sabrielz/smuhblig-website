<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#003f87">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Favicon --}}
    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    {{-- SEO defaults --}}
    {!! SEO::generate() !!}

    @php
        $cspNonce = request()->attributes->get('csp_nonce', '');
        $gaId = \App\Models\Pengaturan::get('seo_google_analytics');
    @endphp

    @if(!empty($gaId))
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ $gaId }}" nonce="{{ $cspNonce }}"></script>
        <script nonce="{{ $cspNonce }}">
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '{{ $gaId }}');
        </script>
    @endif

    @routes(null, $cspNonce)
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>

<body class="antialiased">
    @inertia
</body>

</html>
