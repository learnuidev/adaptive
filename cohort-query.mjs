import { cohortQuery } from "adaptive.fyi";

console.log(cohortQuery().and("browser_name", "!=", "mac_os"));
