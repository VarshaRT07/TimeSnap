const predefinedTasks = [
  "Working on sprint backlog items",
  "Optimizing database queries",
  "Analyzing system performance",
  "Pair programming session",
  "Team stand-up meeting",
  "Updating Jira board",
  "One-on-one with manager",
  "Debugging production issue",
  "Writing unit tests",
  "Attending tech talk",
  "Analyzing system performance"
];

export const getRandomTask = () => {
  return predefinedTasks[Math.floor(Math.random() * predefinedTasks.length)];
};

export const getRandomTime = (startHour: number, endHour: number) => {
  const randomHour =
    Math.floor(Math.random() * (endHour - startHour)) + startHour;
  const randomMinute = Math.random() < 0.5 ? "00" : "30"; // Randomly choose 00 or 30 for minutes
  return `${randomHour < 10 ? "0" + randomHour : randomHour}:${randomMinute}`;
};
