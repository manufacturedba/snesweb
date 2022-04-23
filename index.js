import hapi from '@hapi/hapi';
import path from 'path';

const PORT = process.env.PORT || 616;

(async () => {

    const server = hapi.server({
        port: PORT,
        host: '0.0.0.0',
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'dist')
            }
        }
    });

    await server.start();

    console.log('Tepache Web running at', PORT);
})();