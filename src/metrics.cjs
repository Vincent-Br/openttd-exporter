const Gauge = require("prom-client").Gauge;

module.exports.gameDays = new Gauge({
    name: "ottd_game_days",
    help: "Current date in days since 0 AD",
});
module.exports.companyName = new Gauge({
    name: "ottd_company_name",
    help: "Name of the company by id",
    labelNames: ["company_id", "name"],
});
module.exports.companyMoney = new Gauge({
    name: "ottd_company_total_money",
    help: "Amount of money a company currently has",
    labelNames: ["company_id"],
});
module.exports.companyLoan = new Gauge({
    name: "ottd_company_loan_money",
    help: "Amount of money a company is in debt",
    labelNames: ["company_id"],
});
module.exports.companyIncome = new Gauge({
    name: "ottd_company_income_money",
    help: "Income of a company, value currently unknown",
    labelNames: ["company_id"],
});
module.exports.companyCargo = new Gauge({
    name: "ottd_company_quarter_cargo",
    help: "Amount of cargo a company has delivered since beginning of the quarter",
    labelNames: ["company_id"],
});
module.exports.companyVehicles = new Gauge({
    name: "ottd_company_total_vehicles",
    help: "Number of vehicles by type a company currently owns",
    labelNames: ["company_id", "type"],
});
module.exports.companyStations = new Gauge({
    name: "ottd_company_total_stations",
    help: "Number of stations by type a company currently owns",
    labelNames: ["company_id", "type"],
});
module.exports.userName = new Gauge({
    name: "ottd_user_name",
    help: "The name of the user by id",
    labelNames: ["user_id", "name"],
});
module.exports.userCompany = new Gauge({
    name: "ottd_user_company_id",
    help: "The id of the company where the user is currently apart of",
    labelNames: ["user_id"],
});