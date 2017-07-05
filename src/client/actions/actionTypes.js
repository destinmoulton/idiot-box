// Define the constant action types for the redux actions and reducers
// Use ALL_CAPS

// General Socket IO Events
export const IO_EMIT_SETUP = 'IO_EMIT_SETUP';
export const IO_EMIT_SUCCESS = 'IO_EMIT_SUCCESS';
export const IO_EMIT_FAILURE = 'IO_EMIT_FAILURE';
export const IO_ON_SETUP = 'IO_ON_SETUP';
export const IO_ON_SUCCESS = 'IO_ON_SUCCESS';
export const IO_ON_FAILURE = 'IO_ON_FAILURE';

// error event
export const ERROR_RECEIVED = 'ERROR_RECEIVED';

// settings events
export const SETTINGS_LIST_RECEIVED = 'SETTINGS_LIST_RECEIVED';

// server events
export const SRV_CONNECT_RECEIVED = 'SRV_CONNECT_RECEIVED'
export const SRV_DISCONNECT_RECEIVED  = 'SRV_DISCONNECT_RECEIVED';
export const SRV_INFO_RECEIVED = 'SRV_INFO_RECEIVED';

