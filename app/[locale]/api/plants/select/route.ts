import { getPlantsSelect } from "@/services/plants";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const data = await getPlantsSelect();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
