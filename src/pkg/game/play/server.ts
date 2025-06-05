enum SERVER_ACTION {
    
    // Authorization actions
    Authorized = 'authorized',
    Unauthorized = 'unauthorized',
    
    // Match actions
    Sync = 'sync',
    MatchStart = 'match_start',
    MatchOpponentDisconnected = 'match_opponent_disconnected',
    MatchOpponentReconected = 'match_opponent_reconnected',
}

export default SERVER_ACTION;