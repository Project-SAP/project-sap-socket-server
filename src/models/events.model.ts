
// The events declared in the ServerToClientEvents interface are used when sending and broadcasting events
export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

// The events declared in the ClientToServerEvents interface are used when receiving events
export interface ClientToServerEvents {
    message: (data: any) => void;
    disconnect: () => void;
}