/* tslint:disable:no-console */
import * as WebSocket from 'ws';

import {
    GameClient,
    IButton,
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

// These can be un-commented to see the raw JSON messages under the hood
client.on('message', (err: any) => console.log('<<<', err));
client.on('send', (err: any) => console.log('>>>', err));
// client.on('error', (err: any) => console.log(err));

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
        control.on('mousedown', (inputEvent, participant) => {

            // Let's tell the user who they are, and what they pushed.
            console.log(`${participant.username} pushed, ${inputEvent.input.controlID}`);

            // Did this push involve a spark cost?
            if (inputEvent.transactionID) {

                // Unless you capture the transaction the sparks are not deducted.
                client.captureTransaction(inputEvent.transactionID)
                .then(() => {
                    console.log(`Charged ${participant.username} ${control.cost} sparks!`);
                });
            }
        });
    });
    // Controls don't appear unless we tell Interactive that we are ready!
    client.ready(true);
});

client.state.on('participantJoin', participant => {
    console.log(`${participant.username}(${participant.sessionID}) Joined`);
});
client.state.on('participantLeave', (participant: string ) => {
    console.log(`${participant} Left`);
});
/* tslint:enable:no-console */
