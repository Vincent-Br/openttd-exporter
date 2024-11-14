const ottd = require('node-openttd-admin');

const ottdConnection = new ottd.connection();

function connect() {
    ottdConnection.connect(process.env.OTTD_HOST, process.env.OTTD_PORT);
}

ottdConnection.on('connect', () =>
    ottdConnection.authenticate('OpenTTD-Exporter', process.env.OTTD_PASSWORD),
);

ottdConnection.on('error', (data) => {
    console.log(data);

    if (data.includes("connectionclose")) {
        console.log('Connection lost. Retrying in 10 seconds...');
        ottdConnection.close();
        delay(10000).then(() => connect());
    }
});

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

ottdConnection.on('welcome', (data) => {
    console.log("Connected to the OpenTTD server!")
    sendChatMessage('+++-----------------------------------------------+++');
    sendChatMessage(
        'OpenTTD-exporter has been started! Game data is being logged!',
    );
    sendChatMessage('+++-----------------------------------------------+++');
    requestUpdateFrequency();
});

function sendChatMessage(message) {
    ottdConnection.send_chat(
        ottd.enums.Actions.SERVER_MESSAGE,
        ottd.enums.DestTypes.BROADCAST,
        '',
        message,
    );
}

function requestUpdateFrequency() {
    ottdConnection.send_update_frequency(
        ottd.enums.UpdateTypes.DATE,
        ottd.enums.UpdateFrequencies.WEEKLY,
    );

    ottdConnection.send_update_frequency(
        ottd.enums.UpdateTypes.COMPANY_INFO,
        ottd.enums.UpdateFrequencies.AUTOMATIC,
    );

    ottdConnection.send_update_frequency(
        ottd.enums.UpdateTypes.COMPANY_ECONOMY,
        ottd.enums.UpdateFrequencies.WEEKLY,
    );

    ottdConnection.send_update_frequency(
        ottd.enums.UpdateTypes.COMPANY_STATS,
        ottd.enums.UpdateFrequencies.WEEKLY,
    );

    ottdConnection.send_update_frequency(
        ottd.enums.UpdateTypes.CLIENT_INFO,
        ottd.enums.UpdateFrequencies.AUTOMATIC,
    );
}

module.exports = { ottdConnection, connect };
