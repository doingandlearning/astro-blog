// Shared-password gate for the CSOB course materials.
// Set CSOB_PASSWORD in Netlify (Site configuration > Environment variables).
// If it is not set, the materials stay locked (fail closed).

const REALM = "CSOB course materials";

function unauthorised(status = 401): Response {
  return new Response("Authentication required", {
    status,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  // @ts-ignore Netlify global is available in the edge runtime
  const expected: string | undefined = Netlify.env.get("CSOB_PASSWORD");
  if (!expected) return unauthorised(503);

  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return unauthorised();

  let supplied = "";
  try {
    const decoded = atob(header.slice(6));
    supplied = decoded.slice(decoded.indexOf(":") + 1); // username is ignored
  } catch {
    return unauthorised();
  }

  if (!safeEqual(supplied, expected)) return unauthorised();

  const response = await context.next();
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
};

export const config = { path: ["/courses/csob", "/courses/csob/*"] };
