# OpenTTD-Exporter

Prometheus exporter for OpenTTD. Exposes metrics on `hostname:3990/metrics`.

**Exported metrics:**

- `ottd_game_days` Current date in days since 0 AD.
- `ottd_company_name{company_id, name}` Name of the company by company ID
- `ottd_company_total_money{company_id}` Amount of money a company currently has.
- `ottd_company_loan_money{company_id}` Amount of money a company is in debt.
- `ottd_company_income_money{company_id}` Income of a company, value currently unknown.
- `ottd_company_quarter_cargo{company_id}` Amount of cargo a company has delivered since beginning of the quarter.
- `ottd_company_total_vehicles{company_id, type}` Number of vehicles by type a company currently owns.
- `ottd_company_total_stations{company_id, type}` Number of stations by type a company currently owns.
- `ottd_user_name{user_id, name}` The name of the user by id.
- `ottd_user_company_id{user_id}` The id of the company where the user is currently apart of.

_All currency metrics are exported as British Pound. For the conversion rates to other currencies please refer to [the OpenTTD Docs](https://wiki.openttd.org/en/Archive/Manual/Settings/Currency)_

## Configuration

OpenTTD-Exporter requires an connection to the OpenTTD admin port. To be able to connect there are a couple of things you need to have done.

1. Set the `server_admin_port` in `Openttd.cfg`. This can be any number between `0` and `65535` but must be **NOT** in use by any other programs.
2. Make sure an admin password has been set. The `admin_password` can be found in `secrets.cfg`.
3. Rename or copy the file `.env.example` to `.env` and change the variables to your desired values.
4. Install the required dependencies with `npm install` and run the project with `node .`.

### Prometheus

The program polls information about the state of the game at the start of each in-game week. An in-game week is about 14 seconds. To avoid saving duplicate data it is recommended to keep the default prometheus settings and thereby query the metrics at most every 15 seconds.

## Contributing

To contribute, please create a pull request. Pull requests should adhere to the formatting standard set in `prettierrc.json`. This is easiest done using the [Prettier extension](https://prettier.io/) in an code editor of your choice.

For feature requests and bug reports, please create an issue using the appropriate tag.

**Feature Roadmap**  
[ ] Automatic reconnect  
[ ] Docker container

---
Copyright &copy; 2024 Vincent-Br  
_OpenTTD-exporter is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0-standalone.html) and comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions._
