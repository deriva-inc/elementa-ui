import { z } from 'zod';

// SECTION: Constants
const HTTP_STATUS_CODE = {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
} as const;
// !SECTION: Constants

// SECTION: Export Constants
export { HTTP_STATUS_CODE };
// !SECTION: Export Constants

// SECTION: Zod Schemas
const NETWORK_CALLS_ENUM = z.enum([
    'GET_AUTHN_ME',
    'GET_AUTHN_VALIDATE',
    'GET_AUTHN_USERS',
    'GET_AUTHZ_ROLES_ACCOUNT',
    'GET_ACC_MGMT_PROJECTS'
]);

const NETWORK_CALL_STATUS_ENUM = z.enum([
    'IDLE',
    'LOADING',
    'SUCCESS',
    'ERROR'
]);

const ClientSideNetworkErrorSchema = z.object({
    code: z.number(),
    message: z.string()
});

const ClientSideNetworkResponseSchema = z.object({
    data: z.object({}),
    code: z.number()
});

// This is used only for state management on UI pages.
const ClientSideNetworkDetailsSchema = z.object({
    status: NETWORK_CALL_STATUS_ENUM,
    data: z.object({}).optional(),
    error: z.object({}).optional()
});

// A good practice is to maintain a map of network call details for easier state management.
const ClientNetworkCallDetailsMapSchema = z.record(
    NETWORK_CALLS_ENUM,
    ClientSideNetworkDetailsSchema
);

const ServerSideNetworkErrorSchema = z.object({
    code: z.string(),
    message: z.string(),
    type: z.string().optional(),
    details: z.unknown().optional()
});

const ServerSideResponseSchema = z.object({
    api_version: z.number().optional(),
    success: z.boolean().optional(),
    data: z.object({}).optional(),
    meta: z.object({}).optional(),
    error: ServerSideNetworkErrorSchema.optional()
});
// !SECTION: Zod Schemas

// SECTION: Export Zod Schemas
export {
    NETWORK_CALLS_ENUM,
    NETWORK_CALL_STATUS_ENUM,
    ClientSideNetworkDetailsSchema,
    ClientSideNetworkErrorSchema,
    ClientSideNetworkResponseSchema,
    ClientNetworkCallDetailsMapSchema,
    ServerSideNetworkErrorSchema,
    ServerSideResponseSchema
};
// !SECTION: Export Zod Schemas

// SECTION: TypeScript Types
type NETWORK_CALLS = z.infer<typeof NETWORK_CALLS_ENUM>;
type NETWORK_CALL_STATUS = z.infer<typeof NETWORK_CALL_STATUS_ENUM>;
type ClientSideNetworkError = z.infer<typeof ClientSideNetworkErrorSchema>;
type ClientSideNetworkResponse = z.infer<
    typeof ClientSideNetworkResponseSchema
>;
type ClientNetworkCallDetails = z.infer<typeof ClientSideNetworkDetailsSchema>;
type ClientNetworkCallDetailsMap = z.infer<
    typeof ClientNetworkCallDetailsMapSchema
>;
type ServerSideNetworkError = z.infer<typeof ServerSideNetworkErrorSchema>;
type ServerSideResponse = z.infer<typeof ServerSideResponseSchema>;
// !SECTION: TypeScript Types

// SECTION: Export TypeScript Types
export type {
    NETWORK_CALLS,
    NETWORK_CALL_STATUS,
    ClientSideNetworkError,
    ClientSideNetworkResponse,
    ClientNetworkCallDetails,
    ClientNetworkCallDetailsMap,
    ServerSideNetworkError,
    ServerSideResponse
};
// !SECTION: Export TypeScript Types

export enum ENERGY {
    'VAPORWAVE' = 'vaporwave',
    'ELECTRIC_SHOCK' = 'electric-shock',
    'CYBER_MIST' = 'cyber-mist',
    'SUMMER_FRUIT' = 'summer-fruit',
    'BUBBLEGUM_ICE' = 'bubblegum-ice'
}

export enum THEME {
    'AMBER' = 'light',
    'GUN_METAL' = 'dark'
}

export enum UI_STATE {
    'LOADING',
    'ERROR',
    'SUCCESS',
    'IDLE'
}
