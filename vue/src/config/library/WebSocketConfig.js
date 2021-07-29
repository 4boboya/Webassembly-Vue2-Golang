import store from '@/store';
export const WSConfig = {
    LiveServer: {
        server_host: store.state.Root.WebSocket,
        invoke_key: "AZYGo2j3yVk7qDjt",
    },
    HotGame: {
        server_host: store.state.Root.WebSocket,
        invoke_key: "AZYGo2j3yVk7qDjt",
    },
    Chat: {
        server_host: store.state.Root.Chat,
        invoke_key: "",
    }
}
