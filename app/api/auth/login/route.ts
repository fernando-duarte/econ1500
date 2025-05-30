import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      "Name can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .refine(
      (value) => {
        // Check for excessive whitespace
        return !value.includes("  ") && !value.startsWith(" ") && !value.endsWith(" ");
      },
      {
        message: "Too many spaces",
      }
    )
    .refine(
      (value) => {
        // Simple profanity check
        const profanityList = ["badword", "profanity", "inappropriate"];
        return !profanityList.some((word) => value.toLowerCase().includes(word.toLowerCase()));
      },
      {
        message: "Inappropriate language",
      }
    ),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = loginSchema.parse(body);

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      username,
    });

    response.cookies.set({
      name: "session-token",
      value: username,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true, // Prevent JavaScript access
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
