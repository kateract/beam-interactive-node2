/* tslint:disable:no-console */
import * as WebSocket from 'ws';

import {
    GameClient,
    IButton,
    setWebSocket,
} from '../src';
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
    url: process.argv[3],
    versionId: parseInt(process.argv[4], 10),
});

// Now we can create the controls, We need to add them to a scene though.
// Every Interactive Experience has a "default" scene so we'll add them there there.
client.createControls({
    sceneID: 'default',
    controls: makeButtons(5),
}).then(controls => {

    // Now that the controls are created we can add some event listeners to them!
    controls.forEach((control: IButton) => {

        // mousedown here means that someone has clicked the button.
        control.on('mousedown', () => {
            //Five second cooldown
            control.setCooldown(5000);
        });
    });
    // Controls don't appear unless we tell Interactive that we are ready!
    client.ready(true);
});
/* tslint:enable:no-console */
