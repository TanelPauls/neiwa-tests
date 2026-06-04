import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

test("Test Case ID 5", async ({ request }) => {
  // Login
  const firebaseRes = await request.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      data: {
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
        returnSecureToken: true,
      },
    }
  );
  expect(firebaseRes.ok()).toBeTruthy();
  const { idToken } = await firebaseRes.json();

  const sessionRes = await request.post(`${process.env.LOGIN_URL}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    form: { token: idToken, redirect: "https://tannu.neiwa.eu" },
  });
  expect(sessionRes.status()).toBe(200);

  const cookies = sessionRes.headersArray()
    .filter((h) => h.name.toLowerCase() === "set-cookie")
    .map((h) => h.value);

  const accessCookie = cookies.find((c) => c.startsWith("NEIWA_ACCESS="));
  expect(accessCookie).toBeTruthy();
  const accessToken = accessCookie.split(";")[0];

  const elairRes = await request.get(process.env.API_LINK, {
    headers: { "Cookie": accessToken },
  });

  expect(elairRes.status()).toBe(200);
  const body = await elairRes.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
  expect(body[0]).toHaveProperty("id");
});