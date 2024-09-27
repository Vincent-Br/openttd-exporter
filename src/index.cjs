const express = require("express");
const prom = require("prom-client");
const ottd = require("node-openttd-admin");

const server = express();
const register = prom.register;
const Gauge = prom.Gauge;
const ottdConnection = new ottd.connection();

var ottdData = {
  game: {},
  players: [],
  companies: [],
};

// var ottdMetrics = {};

prom.collectDefaultMetrics({ gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5] }); // Collect default metrics

ottdConnection.connect("localhost", 3977); // Connect to OTTD Server

ottdConnection.on("connect", () =>
  ottdConnection.authenticate("OpenTTD-Exporter", "adminPWD")
);
ottdConnection.on("error", (data) => console.log(data));

const companyMoney = new Gauge({
  name: "company_money",
  help: "The amount of money a company has",
  labelNames: ["company"],
});
const companyLoan = new Gauge({
  name: "company_loan",
  help: "The amount of loan a company has",
  labelNames: ["company"],
});

// setInterval(() => {
//   requests.set({ method: "get", code: 200 }, Math.random());
//   requests.set(Math.random());
//   requests.labels("post", "300").inc();
// }, 100);

ottdConnection.on("welcome", (data) => {
  ottdData.game = data;

  ottdConnection.send_chat(
    ottd.enums.Actions.SERVER_MESSAGE,
    ottd.enums.DestTypes.BROADCAST,
    "",
    "OpenTTD-exporter started!"
  );

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
});

ottdConnection.on("companyinfo", (data) => updateCompany(data));
ottdConnection.on("companyupdate", (data) => updateCompany(data));
ottdConnection.on("companyeconomy", (data) => {
  updateCompany(data);
  companyMoney.set({ company: data.id }, data.money);
  companyLoan.set({ company: data.id }, data.loan);
});
ottdConnection.on("companystats", (data) => updateCompany(data));
ottdConnection.on("date", (data) => {
  // ottdData.companies.forEach((company) => {
  //   if (company.money) companyMoney.set({ company: company.id }, company.money);
  //   if (company.loan) companyLoan.set({ company: company.id }, company.loan);
  // });
});

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

server.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

server.listen(process.env.PORT || 3990, () => {
  console.log(`Server listening to 3990, metrics exposed on /metrics endpoint`);
});
