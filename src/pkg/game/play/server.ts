enum SERVER_ACTION {
    
    // Authorization actions
    Authorized = 'authorized',
    Unauthorized = 'unauthorized',
    
    // Match actions
    Sync = 'sync',
    MatchStart = 'match_start',
    MatchOpponentConnected= 'match_opponent_connected',
    MatchOpponentDisconnected = 'match_opponent_disconnected',
}

export default SERVER_ACTION;