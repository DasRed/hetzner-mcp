#!/usr/bin/env node
import {loadConfig} from './config.ts';
import {createHttpServer} from './http.ts';
import {createMcpServer, listToolNames, packageInfo} from './server.ts';

function main(): void {
    const config     = loadConfig();
    const toolCount  = listToolNames(createMcpServer(config)).length;
    const httpServer = createHttpServer(config);

    httpServer.listen(config.port, config.host, () => console.log(`${packageInfo.name} v${packageInfo.version} listening on http://${config.host}:${config.port}${config.path} (splits: ${config.splits.join(', ')}; read-only: ${config.readOnly}; tools: ${toolCount})`));

    const shutdown = (signal: string): void => {
        console.log(`Received ${signal}, shutting down`);
        httpServer.close(() => process.exit(0));
        setTimeout(() => process.exit(0), 5000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

try {
    main();
}
catch (error) {
    console.error(`Startup failed: ${(error as Error).message}`);
    process.exit(1);
}
