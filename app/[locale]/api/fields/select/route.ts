import { getFieldsSelect } from "@/services/fields";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const data = await getFieldsSelect();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};