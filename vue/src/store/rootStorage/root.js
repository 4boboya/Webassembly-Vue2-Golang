export default {
    namespaced: true,
    state: {
        ApiUrl: document.querySelectorAll("meta[name='api-url']")[0].content,
        DevType: document.querySelectorAll("meta[name='api-url']")[0].content == 'http://localhost:5000/api' ? "Local" : "PRD",
        ForumService: document.querySelectorAll("meta[name='forum-service']")[0].content,
        Host: document.querySelectorAll("meta[name='host']")[0].content,
        WebSocket: document.querySelectorAll("meta[name='websocket']")[0].content,
        Chat: document.querySelectorAll("meta[name='chat']")[0].content,
    },
    actions: {},
    mutations: {},
    getters: {},
}
