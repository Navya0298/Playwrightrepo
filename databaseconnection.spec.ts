import sql from 'mssql';
import dbConfig from '../dbConfig';

async function getPaidServiceSummary(memberId: string) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      DECLARE @MemberId VARCHAR(50) = '${memberId}';

      DECLARE @ServiceCategory TABLE (
        [ServiceCategory] VARCHAR(500),
        [servcode] VARCHAR(6) COLLATE SQL_Latin1_General_Pref_CP1_CI_AS,
        [revcode] VARCHAR(6) COLLATE SQL_Latin1_General_Pref_CP1_CI_AS,
        [modcode] VARCHAR(2) COLLATE SQL_Latin1_General_Pref_CP1_CI_AS,
        [modcode2] VARCHAR(2) COLLATE SQL_Latin1_General_Pref_CP1_CI_AS,
        [modcode3] VARCHAR(2) COLLATE SQL_Latin1_General_Pref_CP1_CI_AS,
        [modcode4] VARCHAR(2) COLLATE SQL_Latin1_General_Pref_CP1_CI_AS 
      );

      -- INSERT statements for @ServiceCategory go here...
      -- Tip: you can refactor those long values into a helper string or external script if it's too lengthy

      WITH ServiceLine AS (
        SELECT DISTINCT
          orgclaimid = CASE WHEN C.orgclaimid = '' THEN C.claimid ELSE C.orgclaimid END,
          CD.claimid,
          claimStatus = C.status,
          CD.claimline,
          serviceStatus = CD.status,
          dosfrom = CAST(ISNULL(CD.dosfrom, C.startdate) AS DATE),
          CD.servcode,
          CD.revcode,
          CD.modcode,
          CD.modcode2,
          CD.modcode3,
          CD.modcode4,
          CD.amountpaid
        FROM
          PlanData_rpt.dbo.enrollkeys EK WITH(NOLOCK)
          INNER JOIN PlanData_rpt.dbo.claim C ON C.enrollid = EK.enrollid
          INNER JOIN PlanData_rpt.dbo.claimdetail CD ON CD.claimid = C.claimid
          INNER JOIN PlanData_rpt.dbo.payvoucher PV ON PV.claimid = C.claimid
          INNER JOIN PlanData_rpt.dbo.payment PY ON PY.paymentid = PV.paymentid AND PY.status = 'PAIDREMIT'
        WHERE
          EK.carriermemid = @MemberId
      )

      SELECT
        S.orgclaimid,
        S.claimline,
        S.dosfrom,
        S.servcode,
        S.revcode,
        S.modcode,
        S.modcode2,
        S.modcode3,
        S.modcode4,
        amountpaid = SUM(ISNULL(S.amountpaid, 0)),
        C.ServiceCategory
      FROM
        ServiceLine S
        LEFT JOIN @ServiceCategory C ON
          C.servcode = S.servcode AND
          C.revcode = S.revcode AND
          C.modcode = S.modcode AND
          C.modcode2 = S.modcode2 AND
          C.modcode3 = S.modcode3 AND
          C.modcode4 = S.modcode4
      GROUP BY
        S.orgclaimid,
        S.claimline,
        S.dosfrom,
        S.servcode,
        S.revcode,
        S.modcode,
        S.modcode2,
        S.modcode3,
        S.modcode4,
        C.ServiceCategory
      ORDER BY
        S.orgclaimid,
        S.claimline;
    `);

    console.log('Results:', result.recordset);
  } catch (err) {
    console.error('Error executing query:', err);
  }
}



getPaidServiceSummary('527829859');

