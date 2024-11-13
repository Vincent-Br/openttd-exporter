const metrics = require("./metrics.cjs");
const { ottdConnection } = require("./connection.cjs");

ottdConnection.on("companyupdate", (data) =>
    metrics.companyName.set({ company_id: data.id, name: data.name }, 1)
);
ottdConnection.on("companyeconomy", (data) => {
    metrics.companyMoney.set({ company_id: data.id }, data.money);
    metrics.companyLoan.set({ company_id: data.id }, data.loan);
    metrics.companyIncome.set({ company_id: data.id }, data.income);
    metrics.companyCargo.set({ company_id: data.id }, data.cargo);
});
ottdConnection.on("companystats", (data) => {
    metrics.companyVehicles.set(
        { company_id: data.id, type: "trains" },
        data.vehicles.trains
    );
    metrics.companyVehicles.set(
        { company_id: data.id, type: "lorries" },
        data.vehicles.lorries
    );
    metrics.companyVehicles.set(
        { company_id: data.id, type: "busses" },
        data.vehicles.busses
    );
    metrics.companyVehicles.set(
        { company_id: data.id, type: "planes" },
        data.vehicles.planes
    );
    metrics.companyVehicles.set(
        { company_id: data.id, type: "ships" },
        data.vehicles.ships
    );
    metrics.companyStations.set(
        { company_id: data.id, type: "trains" },
        data.stations.trains
    );
    metrics.companyStations.set(
        { company_id: data.id, type: "lorries" },
        data.stations.lorries
    );
    metrics.companyStations.set(
        { company_id: data.id, type: "busses" },
        data.stations.busses
    );
    metrics.companyStations.set(
        { company_id: data.id, type: "planes" },
        data.stations.planes
    );
    metrics.companyStations.set(
        { company_id: data.id, type: "ships" },
        data.stations.ships
    );
});
ottdConnection.on("clientupdate", (data) => {
    metrics.userName.set({ user_id: data.id, name: data.name }, 1);
    metrics.userCompany.set({ user_id: data.id }, data.company);
});
ottdConnection.on("date", (data) => metrics.gameDays.set({}, data));
