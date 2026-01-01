"use client";

export function Timestamp({ date }: { date: string }) {
  return <>{new Date(date).toLocaleString()}</>;
}

export function DateOnly({ date }: { date: string }) {
  return <>{new Date(date).toLocaleDateString()}</>;
}

