/* tslint:disable:no-console */
import * as faker from 'faker';
import * as WebSocket from 'ws';

import {
    delay,
    GameClient,
    setWebSocket,
} from '../lib';
import { makeButtons } from './util';

if (process.argv.length < 5) {
    console.log('Usage gameClient.exe <token> <url> <experienceId>');
    process.exit();
}
// We need to tell the interactive client what type of websocket we are using.
setWebSocket(WebSocket);

// As we're on the Streamer's side we need a "GameClient" instance
const client = new GameClient();

// Log when we're connected to interactive
client.on('open', () => console.log('Connected to interactive'));

// Now we open the connection passing in our authentication details and an experienceId.
client.open({
    authToken: process.argv[2],
    url: process.argv[3] || 'wss://interactive1-dal.beam.pro',
    versionId: parseInt(process.argv[4], 10),
});

const delayTime = 2000;

/* Loop creates 5 controls and adds them to the default scene.
 * It then waits delayTime milliseconds and then deletes them,
 * before calling itself again.
*/
function loop() {
    const scene = client.state.getScene('default');
    scene.createControls(makeButtons(5, () => faker.name.firstName()))
        .then(() => delay(delayTime))
        .then(() => scene.deleteAllControls())
        .then(() => delay(delayTime))
        .then(() => loop());
}

/* Pull in the scenes stored on the server
 * then call ready so our controls show up.
 * then call loop() to begin our loop.
*/
client.synchronizeScenes()
    .then(() => client.ready(true))
    .then(() => loop());
/* tslint:enable:no-console */
