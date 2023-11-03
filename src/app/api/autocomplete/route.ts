import { NextRequest } from "next/server";

import { User } from "@/components/GitHubTypeahead";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const query = searchParams.get("query");

  if (typeof query !== "string" || query.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid query parameter" }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${query}`
    );

    if (response.ok) {
      const data = await response.json();
      const logins = data.items.map((user: User) => ({
        login: user.login,
      }));
      return new Response(JSON.stringify({ suggestions: logins }), {
        status: 200,
      });
    } else {
      const error = await response.json();
      return new Response(JSON.stringify({ error: error.message }), {
        status: response.status,
      });
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
