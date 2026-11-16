/**
 * This file contains client-side API error handling utilities.
 */

class ClientSideError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ClientSideError';
    }
}

/**
 * This function handles errors that occur during client-side API calls.
 *
 * @param error - The error object caught during the API call.
 * @returns A ClientSideError instance with a descriptive message.
 */
const handleErrorOnClientSideAPICalls = (error: unknown) => {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = JSON.stringify(error);
    }

    return new ClientSideError(errorMessage);
};

export { ClientSideError, handleErrorOnClientSideAPICalls };
