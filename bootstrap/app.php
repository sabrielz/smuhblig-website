<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\ContentSecurityPolicy::class,
            \App\Http\Middleware\SetLocale::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $exception, \Illuminate\Http\Request $request) {
            if ($request->expectsJson()) {
                return $response;
            }

            $status = $response->getStatusCode();

            if (app()->hasDebugModeEnabled() && $status === 500) {
                return $response;
            }

            if (in_array($status, [403, 404, 500])) {
                return \Inertia\Inertia::render('Errors/' . $status, ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            } elseif ($status >= 400 && $status < 600) {
                return \Inertia\Inertia::render('Errors/Generic', ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            return $response;
        });
    })->create();
