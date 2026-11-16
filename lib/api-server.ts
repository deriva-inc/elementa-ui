/**
 * This file contains server-side API error handling utilities.
 */
import { NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * This function handles errors that occur during server-side API calls.
 *
 * @param error
 * @param errorStatusMessage
 * @param errorStatusCode
 * @param apiRoute
 * @returns
 */
const handleErrorOnServerSideAPICalls = (
    error: unknown,
    errorStatusMessage: string,
    errorStatusCode: number,
    apiRoute: string
) => {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = JSON.stringify(error);
    }

    logger.error(`Error in API route ${apiRoute}: ${errorMessage}`);

    return NextResponse.json(
        { error: errorStatusMessage },
        { status: errorStatusCode }
    );
};

export { handleErrorOnServerSideAPICalls };
