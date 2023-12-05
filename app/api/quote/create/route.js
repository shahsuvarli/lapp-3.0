import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    project_id,
    sap_customer_id,
    created_by,
    modified_by,
    quote_version,
  } = await req.json();

  try {
    const request = connection.request();
    const result = await request.query(
      `
      DECLARE @lastId INT
      SET @lastId = (SELECT MAX(quote_id) FROM quote) + 1

      INSERT INTO quote(quote_id, project_id, sap_customer_id, created_by, modified_by, quote_version, created_date, modified_date)
      OUTPUT inserted.id
      VALUES (@lastId, ${project_id}, ${sap_customer_id}, ${created_by}, ${modified_by}, ${quote_version}, getdate(), getdate())

      DECLARE @projectMargin float;

      WITH
          RankedRows
          AS
          (
              SELECT quote_margin, ROW_NUMBER() OVER (PARTITION BY quote_id ORDER BY quote_version DESC) AS VersionRank
              FROM quote
              WHERE is_active=1 AND project_id=10078
          )
      SELECT @projectMargin = avg(coalesce(quote_margin, 0))
      FROM RankedRows
      WHERE VersionRank = 1

      UPDATE project SET total_margin=@projectMargin WHERE project_id=${project_id}
    `
    );

    return NextResponse.json({
      data: result.recordset[0].id,
      message: "New quote created successfully!",
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create new quote!" });
  }
}
