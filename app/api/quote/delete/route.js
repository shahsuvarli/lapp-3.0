import { prisma } from "@/utils/_prisma";
import { connection } from "@/utils/db";
import moment from "moment";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { id, user_id, quote_version, quote_id, project_id } = await req.json();

  try {
    const request = connection.request();

    await request.query(
      `
        UPDATE quote SET is_active=0, deleted_by=${user_id}, deleted_date=getdate()
        WHERE id=${id} AND is_active=1

        UPDATE material_quoted SET is_active=0 WHERE permanent_quote_id=${quote_id} AND quote_version=${quote_version} AND is_active=1

        DECLARE @margin float, @value float, @cost float;

        WITH
            RankedRows
            AS
            (
                SELECT quote_value, quote_margin, quote_cost, ROW_NUMBER() OVER (PARTITION BY quote_id ORDER BY quote_version DESC) AS VersionRank
                FROM quote
                WHERE is_active=1 AND project_id=${project_id}
            )
        SELECT @margin=avg(coalesce(quote_margin, 0)), @value=sum(quote_value), @cost=sum(quote_cost)
        FROM RankedRows
        WHERE VersionRank = 1

        UPDATE project SET total_value=@value, total_cost=@cost, total_margin=@margin WHERE project_id=${project_id}
      `
    );

    request.cancel();

    return NextResponse.json({ message: "Quote was deleted successfully!" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete quote!" });
  }
}
