"use client";

export function Timestamp({ date }: { date: string }) {
  return (
      <>
        {new Date(date).toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </>
  );
}

export function DateOnly({ date }: { date: string }) {
  return <>{new Date(date).toLocaleDateString()}</>;
}
