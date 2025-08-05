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
