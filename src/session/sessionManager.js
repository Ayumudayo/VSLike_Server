// src/session/SessionManager.js

export class SessionManager {
    constructor() {
        this.sessions = [];
    }

    add(session) {
        this.sessions.push(session);
        return session;
    }

    remove(predicate) {
        const index = this.sessions.findIndex(predicate);
        if (index !== -1) {
            return this.sessions.splice(index, 1)[0];
        }
        return null;
    }

    find(predicate) {
        return this.sessions.find(predicate);
    }

    getAll() {
        return this.sessions;
    }
}
