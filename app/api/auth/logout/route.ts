import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create response with redirect information
    const res = NextResponse.json({
      success: true,
      redirect: "/",
    });

    // Clear the session token cookie
    res.cookies.set({
      name: "session-token",
      value: "",
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Ensure cookie is actually removed by setting expired date
    res.cookies.set({
      name: "session-token",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
