import { test, expect } from "@playwright/test";
import dotenv from 'dotenv';

dotenv.config();


test("Test Case ID 3", async ({ request }) => {
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

  expect(cookies.some((c) => c.startsWith("NEIWA_ACCESS="))).toBeTruthy();
  expect(cookies.some((c) => c.startsWith("NEIWA_REFRESH="))).toBeTruthy();
});