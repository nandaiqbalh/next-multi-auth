import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GeneralResponse } from "@/lib/model/response";

/**
 * Server-side session validator used by multiple actions.
 * Returns a GeneralResponse with `data` containing user info and userId.
 * @returns {Promise<GeneralResponse>}
 */
export async function validateSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new GeneralResponse(false, "Session not found. Please log in again.", null);
  }
  return new GeneralResponse(true, "Session valid", {
    user: session.user,
    userId: session.user.id,
  });
}
