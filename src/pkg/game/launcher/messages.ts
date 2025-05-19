enum MMRS_Messages {
    MATCH_CONFIRM = "march_found", // when match was found by server
    MATCH_REJECT = "reject_match",   // when match was rejected by server by timeout
    MATCH_TIMEOUT = "match_timeout",
    MATCH_SEARCH_START = "waiting",
    MATCH_FOUND = "confirm_match",
}

export {
    MMRS_Messages,
}