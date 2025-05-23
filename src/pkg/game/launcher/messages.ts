enum MMRS_Server_Messages {
    MATCH_REJECT = "reject_match",   // when match was rejected by server by timeout
    MATCH_TIMEOUT = "match_timeout",
    MATCH_SEARCH = "searching",
    MATCH_FOUND = "match_found",
    MATCH_READY = "match_ready",
}

enum MMRS_Client_Messages {
    JOIN = "join",
}

export {
    MMRS_Server_Messages,
    MMRS_Client_Messages,
}