// Simple in-memory user tracking for active sessions
const activeSessions = new Map();

// Track a user login
function trackUserLogin(username) {
  if (!activeSessions.has(username)) {
    activeSessions.set(username, {
      username,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    });
  } else {
    const session = activeSessions.get(username);
    session.lastActivity = new Date().toISOString();
  }
  return activeSessions.get(username);
}

// Track user activity (called on each request)
function trackUserActivity(username) {
  if (activeSessions.has(username)) {
    activeSessions.get(username).lastActivity = new Date().toISOString();
  }
}

// Get all active sessions
function getActiveSessions() {
  return Array.from(activeSessions.values());
}

// Get count of active sessions
function getActiveSessionCount() {
  return activeSessions.size;
}

// Remove inactive sessions (older than 30 minutes)
function cleanupInactiveSessions() {
  const now = new Date();
  const timeout = 30 * 60 * 1000; // 30 minutes

  activeSessions.forEach((session, username) => {
    const lastActivity = new Date(session.lastActivity);
    if (now - lastActivity > timeout) {
      activeSessions.delete(username);
    }
  });
}

// Clear a user session (logout)
function clearUserSession(username) {
  activeSessions.delete(username);
}

module.exports = {
  trackUserLogin,
  trackUserActivity,
  getActiveSessions,
  getActiveSessionCount,
  cleanupInactiveSessions,
  clearUserSession
};
