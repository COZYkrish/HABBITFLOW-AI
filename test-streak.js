const logs = [
  { date: "2026-06-27", completed: true },
  { date: "2026-06-26", completed: true },
  { date: "2026-06-25", completed: true },
  { date: "2026-06-24", completed: true }
];

const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));

let streak = 0;
let prev = null;

for (const log of sorted) {
  if (!log.completed) break;
  const date = new Date(log.date);
  if (prev === null) {
    streak = 1;
    prev = date;
    continue;
  }
  const diffDays = Math.round((prev.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 1) {
    streak++;
    prev = date;
  } else {
    break;
  }
}
console.log("Streak:", streak);
