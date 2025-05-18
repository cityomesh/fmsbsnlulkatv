import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      "https://fms.bsnl.in/fmswebservices/rest/iptv/getiptvorders",
      {
        method: "POST", // External API request is POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorCode: "IPTV_CINESOFT",
          iptvStatus: "",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from the external API.");
    }

    const data = await response.json();
    return NextResponse.json(data); // Return the JSON data from the external API
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
