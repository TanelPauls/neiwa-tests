import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

test("Test Case ID 6", async ({ request }) => {
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
  const accessToken = accessCookie.split(";")[0]; // "NEIWA_ACCESS=<value>"

  // POST /elair/sessions
  const elairRes = await request.post(process.env.API_LINK, {
    headers: {
      "Content-Type": "application/json",
      "Cookie": accessToken,
    },
    data: {
      started_at: "2026-05-27T12:00:00Z",
      actual_seconds: 240,
      planned_seconds: 300,
      completed: true,
      inhale: 4,
      hold: 2147483647,
      exhale: 6,
      pause: 2,
    },
  });

  expect(elairRes.status()).toBe(201);
  const body = await elairRes.json();
  expect(body).toHaveProperty("id");
  expect(typeof body.id).toBe("string");
  //console.log(body);
});