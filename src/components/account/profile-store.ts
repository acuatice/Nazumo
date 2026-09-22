"use client";

import { useEffect, useState } from "react";

const KEY = "nazumo:learner-profile";
const EVENT = "nazumo-profile-change";
export type LearnerProfile = { name: string; email: string; createdAt: string };

function readProfile(): LearnerProfile | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (typeof value === "object" && value !== null && "name" in value && "email" in value && typeof value.name === "string" && typeof value.email === "string") return value as LearnerProfile;
  } catch { /* Storage can be unavailable in private browsing. */ }
  return null;
}

function emit() { window.dispatchEvent(new Event(EVENT)); }
export function saveLearnerProfile(name: string, email: string) {
  const profile = { name: name.trim(), email: email.trim().toLowerCase(), createdAt: new Date().toISOString() };
  try { window.localStorage.setItem(KEY, JSON.stringify(profile)); } catch { return false; }
  emit(); return true;
}
export function clearLearnerProfile() { try { window.localStorage.removeItem(KEY); } catch { /* best effort */ } emit(); }
export function useLearnerProfile() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  useEffect(() => {
    const refresh = () => setProfile(readProfile());
    refresh(); window.addEventListener(EVENT, refresh); window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return profile;
}
