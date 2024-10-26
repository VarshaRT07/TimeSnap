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

