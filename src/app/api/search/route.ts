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
      `https://api.github.com/search/users?q=${query}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from GitHub");
    }

    const data = await response.json();
    const users = data.items.map(({ id, login, avatar_url }: User) => ({
      id,
      login,
      avatar_url,
    }));

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
