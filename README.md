# OpenTTD-Exporter

Prometheus exporter for OpenTTD. Exposes metrics on `hostname:3990/metrics`.

**Exported metrics:**

- `COMPANY_MONEY{company="id"}` Amount of money each company currently has.
- `COMPANY_LOAN{company="id"}` Amount of money a company is in debt.

_All currency is exported as British Pound. To convert to other currencies please refer to [the OpenTTD Docs](https://wiki.openttd.org/en/Archive/Manual/Settings/Currency)_

### Prometheus config

The program polls information about the state of the game at the start of each in-game week. An in-game week is about 14 seconds. To avoid saving duplicate data it is recommended to keep the default prometheus settings and thereby query the metrics at most every 15 seconds.
