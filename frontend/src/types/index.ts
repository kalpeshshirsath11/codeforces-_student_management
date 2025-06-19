export interface Student {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastUpdated: Date;
  emailNotificationsEnabled: boolean;
  reminderEmailCount: number;
  lastReminderSent?: Date;
}

export interface Contest {
  _id: string;
  studentId: string;
  contestId: number;
  contestName: string;
  rank: number;
  oldRating: number;
  newRating: number;
  solvedProblems: number;
  totalProblems: number;
  contestDate: Date;
}

export interface Problem {
  _id: string;
  studentId: string;
  problemId: string;
  problemName: string;
  rating: number;
  tags: string[];
  solvedDate: Date;
  submissionId: number;
  verdict: string;
}

export interface ProblemStats {
  totalProblems: number;
  averageRating: number;
  problemsPerDay: number;
  hardestProblem: Problem;
  ratingDistribution: { [key: number]: number };
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
} 