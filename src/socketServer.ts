import dotenv from 'dotenv';
import cors from 'cors';
import express, { Express } from 'express';
import { createServer, Server as HTTPServer } from "http";
import { ClientToServerEvents, ServerToClientEvents } from './models/events.model';
import { Server as SocketServer } from 'socket.io';

/**
 * Keeps track of application lifecycle and maintains a testable server context.
 *
 * Not all fields or methods should be exposed as the application context. If a field is not marked as `private`, document the reason.
 */
export class ApplicationSocketServer {
    private readonly serverContext: HTTPServer;

    private readonly port: string;

    constructor() {
        // Load environment variables
        dotenv.config({ path: `${__dirname}/../config/.env` });
        this.port = process.env.SOCKET_SERVER_PORT || "8900";

        const expressApp: Express = express();
        expressApp.use(cors());

        this.serverContext = createServer(expressApp);

        this.socketServerInit(this.serverContext);

        this.serverContext.listen(this.port, async () => {
            // tslint:disable-next-line:no-console
            console.log(`started server at http://localhost:${this.port}`);
        });
    }

    /**
     * Not private since tests will be required to confiugre their own instance of a @type {ApplicationSocketServer}
     * @param httpServer HTTP server where socket server will be attached
     * @returns HTTP Server context
     */
    socketServerInit(httpServer: HTTPServer): SocketServer {
        const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

        const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
            cors: {
                origin: FRONTEND_URL
            }
        });
        
        // Setup and configure socket routes and events

        io.on("connection", (socket) => {

            // tslint:disable-next-line:no-console
            console.log("Connection Established");

            socket.on("message", (data) => {
                // tslint:disable-next-line:no-console
                console.log(`Received Data ${data}`);
            })

            socket.on("disconnect", () => {
                // tslint:disable-next-line:no-console
                console.log("Socket Disconnected");
            });

        });

        return io;
    }
}