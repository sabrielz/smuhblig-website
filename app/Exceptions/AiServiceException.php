<?php

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * Exception thrown when the AI service encounters an error.
 *
 * Covers: API call failures, invalid responses, rate-limit hits,
 * and JSON parse errors from AI output.
 */
class AiServiceException extends RuntimeException
{
    /**
     * Raw response body from the API (if available).
     */
    protected ?string $responseBody;

    /**
     * HTTP status code returned by the API (if available).
     */
    protected ?int $httpStatus;

    public function __construct(
        string $message = 'AI Service error',
        int $code = 0,
        ?Throwable $previous = null,
        ?string $responseBody = null,
        ?int $httpStatus = null,
    ) {
        parent::__construct($message, $code, $previous);

        $this->responseBody = $responseBody;
        $this->httpStatus   = $httpStatus;
    }

    /**
     * Create an instance from an API error response.
     */
    public static function apiError(string $message, int $httpStatus, string $responseBody): self
    {
        return new self(
            message: "Anthropic API error ({$httpStatus}): {$message}",
            httpStatus: $httpStatus,
            responseBody: $responseBody,
        );
    }

    /**
     * Create an instance for a JSON parse failure.
     */
    public static function invalidJson(string $rawResponse, ?Throwable $previous = null): self
    {
        return new self(
            message: 'AI response is not valid JSON.',
            previous: $previous,
            responseBody: $rawResponse,
        );
    }

    /**
     * Create an instance for a network / Guzzle transport error.
     */
    public static function networkError(Throwable $previous): self
    {
        return new self(
            message: 'Failed to reach Anthropic API: ' . $previous->getMessage(),
            previous: $previous,
        );
    }

    public function getResponseBody(): ?string
    {
        return $this->responseBody;
    }

    public function getHttpStatus(): ?int
    {
        return $this->httpStatus;
    }
}
