const ottd = require("node-openttd-admin");
const ottdConnection = new ottd.connection();

var ottdData = {
  game: {},
  players: [],
  companies: [],
};

ottdConnection.connect("localhost", 3977);

ottdConnection.on("connect", () => {
  ottdConnection.authenticate("MyBot", "adminPWD");
});
ottdConnection.on("error", (data) => {
  console.log(data);
});

ottdConnection.on("welcome", (data) => {
  ottdData.game = data;

  ottdConnection.send_chat(
    ottd.enums.Actions.SERVER_MESSAGE,
    ottd.enums.DestTypes.BROADCAST,
    "",
    "OpenTTD-exporter started!"
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
});

ottdConnection.on("companyinfo", (data) => updateCompany(data));
ottdConnection.on("companyupdate", (data) => updateCompany(data));
ottdConnection.on("companyeconomy", (data) => updateCompany(data));
ottdConnection.on("companystats", (data) => updateCompany(data));
ottdConnection.on("date", (data) => console.log(data));

ottdConnection.on("clientinfo", (data) => {
  let dataIndex = ottdData.players.findIndex((e) => e.id == data.id);

  if (dataIndex < 0) {
    ottdData.players.push(data);
    return;
  }

  ottdData.players[dataIndex] = { ...ottdData.players[dataIndex], ...data };
});

function updateCompany(data) {
  let dataIndex = ottdData.companies.findIndex((e) => e.id == data.id);

  if (dataIndex < 0) {
    ottdData.companies.push(data);
    return;
  }

  ottdData.companies[dataIndex] = { ...ottdData.companies[dataIndex], ...data };
}

let i = 0;

function interval() {
    //TODO: Reliably update company info
//   if (i > 0) {
//     var bufs = Buffers();
//     bufs.push(
//       put().word8("ADMIN_UPDATE_DATE").buffer()
//     );

//     ottdConnection.sendpacket(ottd.enums.AdminPackets.ADMIN_POLL, bufs);
//     i += 1;
//   }

  console.log(ottdData);
  setTimeout(interval, 10000);
}
interval();
