const ottd = require("node-openttd-admin");

const ottdConnection = new ottd.connection();
ottdConnection.connect(process.env.OTTD_HOST, process.env.OTTD_PORT);

ottdConnection.on("connect", () =>
  ottdConnection.authenticate("OpenTTD-Exporter", process.env.OTTD_PASSWORD)
);
ottdConnection.on("error", (data) => console.log(data));

ottdConnection.on("welcome", (data) => {
  sendChatMessage("+++-----------------------------------------------+++");
  sendChatMessage(
    "OpenTTD-exporter has been started! Game data is being logged!"
  );
  sendChatMessage("+++-----------------------------------------------+++");
  requestUpdateFrequency();
});

function sendChatMessage(message) {
  ottdConnection.send_chat(
    ottd.enums.Actions.SERVER_MESSAGE,
    ottd.enums.DestTypes.BROADCAST,
    "",
    message
  );
}

function requestUpdateFrequency() {
  ottdConnection.send_update_frequency(
    ottd.enums.UpdateTypes.DATE,
    ottd.enums.UpdateFrequencies.WEEKLY
  );

  ottdConnection.send_update_frequency(
    ottd.enums.UpdateTypes.COMPANY_INFO,
    ottd.enums.UpdateFrequencies.AUTOMATIC
  );

  ottdConnection.send_update_frequency(
    ottd.enums.UpdateTypes.COMPANY_ECONOMY,
    ottd.enums.UpdateFrequencies.WEEKLY
  );

  ottdConnection.send_update_frequency(
    ottd.enums.UpdateTypes.COMPANY_STATS,
    ottd.enums.UpdateFrequencies.WEEKLY
  );

  ottdConnection.send_update_frequency(
    ottd.enums.UpdateTypes.CLIENT_INFO,
    ottd.enums.UpdateFrequencies.AUTOMATIC
  );
}

module.exports = { ottdConnection };
