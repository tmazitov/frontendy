enum MMRS_Server_Messages {
    MATCH_REJECT = "reject_match",
    MATCH_TIMEOUT = "match_timeout",
    MATCH_SEARCH = "searching",
    MATCH_FOUND = "match_found",
    MATCH_READY = "match_ready",
    UNAUTHORIZED = "unauthorized",
    JOINED = "joined",
}

enum MMRS_Client_Messages {
    JOIN = "join",
    CONFIRM = "match_confirmed",
    // REJECT = "reject_match",
}

export {
    MMRS_Server_Messages,
    MMRS_Client_Messages,
}