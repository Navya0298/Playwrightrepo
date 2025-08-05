<<<<<<< HEAD
// import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { config } from 'mssql';

const dbConfig: config = {
   user: 'nm1612',
  password: 'Saibaba$1998',
  server: 'devis2k17',
  database: 'PlanData_rpt',
  options: {
    encrypt: true, // for Azure
    trustServerCertificate: true // change based on your environment
  }
};

export default dbConfig;
=======
// import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { config } from 'mssql';

const dbConfig: config = {
   user: 'nm1612',
  password: 'Saibaba$1998',
  server: 'devis2k17',
  database: 'PlanData_rpt',
  options: {
    encrypt: true, // for Azure
    trustServerCertificate: true // change based on your environment
  }
};

export default dbConfig;
>>>>>>> a67a02f0550e0280a363cd3858e542306a81b240
