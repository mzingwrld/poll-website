import { io, Socket } from 'socket.io-client';

export interface IPollUpdatedInfo {
    poll_id: string;
}

class WebSocketService {
    private _socket: Socket | null;

    private _token: string | null;

    constructor(
    ) {
        this._socket = null;
        this._token = null;
    }

    private _init(callback: (data: IPollUpdatedInfo) => void): void {
        if (this._socket === null) {
            this._socket = io({
                extraHeaders: {
                    token: this._token || '',
                },
            });

            /**
             * On every updated vote at backend we receive poll identifier \
             * If an identifier equals an identifier of poll that user is viewing, \
             * callback should re-fetch answers for a poll
             */
            this._socket.on('poll-updated', callback);
        }
    }

    public on = (
        token: string,
        callback: (data: IPollUpdatedInfo) => void,
    ): void => {
        this._token = token;
        this.off();
        this._init(callback);
    }

    public off = (): void => {
        if (this._socket !== null) {
            this._socket.disconnect();
            this._socket = null;
        }
    }
}

export default WebSocketService;
