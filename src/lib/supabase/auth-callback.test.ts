import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  verifyOtp: vi.fn(),
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: mocks.createSupabaseServerClient,
}));

import { finishEmailAuth } from "@/lib/supabase/auth-callback";

function request(query: string) {
  return new Request(`https://nazumo.example/auth/confirm${query}`) as never;
}

describe("finishEmailAuth", () => {
  it("exchanges the PKCE code for a session", async () => {
    mocks.exchangeCodeForSession.mockResolvedValue({ error: null });
    mocks.createSupabaseServerClient.mockResolvedValue({ auth: { exchangeCodeForSession: mocks.exchangeCodeForSession, verifyOtp: mocks.verifyOtp } });

    const response = await finishEmailAuth(request("?code=pkce-code"));

    expect(mocks.exchangeCodeForSession).toHaveBeenCalledWith("pkce-code");
    expect(mocks.verifyOtp).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toBe("https://nazumo.example/cuenta?auth=confirmed");
  });

  it("verifies a confirmation token hash", async () => {
    mocks.verifyOtp.mockResolvedValue({ error: null });
    mocks.createSupabaseServerClient.mockResolvedValue({ auth: { exchangeCodeForSession: mocks.exchangeCodeForSession, verifyOtp: mocks.verifyOtp } });

    const response = await finishEmailAuth(request("?token_hash=confirm-token&type=email"));

    expect(mocks.verifyOtp).toHaveBeenCalledWith({ token_hash: "confirm-token", type: "email" });
    expect(response.headers.get("location")).toBe("https://nazumo.example/cuenta?auth=confirmed");
  });

  it("verifies a recovery token hash and opens the password form", async () => {
    mocks.verifyOtp.mockResolvedValue({ error: null });
    mocks.createSupabaseServerClient.mockResolvedValue({ auth: { exchangeCodeForSession: mocks.exchangeCodeForSession, verifyOtp: mocks.verifyOtp } });

    const response = await finishEmailAuth(request("?token_hash=recovery-token&type=recovery"), true);

    expect(mocks.verifyOtp).toHaveBeenCalledWith({ token_hash: "recovery-token", type: "recovery" });
    expect(response.headers.get("location")).toBe("https://nazumo.example/cuenta?auth=reset-ready&mode=reset");
  });
});
