import axios from 'axios';
import Student from '../models/Student';
import Contest from '../models/Contest';
import Problem from '../models/Problem';

const CODEFORCES_API_URL =  'https://codeforces.com/api';

export class CodeforcesService {
  private static async fetchUserInfo(handle: string) {
    try {
      const response = await axios.get(`${CODEFORCES_API_URL}/user.info`, {
        params: { handles: handle }
      });
      return response.data.result[0];
    } catch (error) {
      console.error(`Error fetching user info for ${handle}:`, error);
      throw error;
    }
  }

  private static async fetchUserRating(handle: string) {
    try {
      const response = await axios.get(`${CODEFORCES_API_URL}/user.rating`, {
        params: { handle }
      });
      return response.data.result;
    } catch (error) {
      console.error(`Error fetching user rating for ${handle}:`, error);
      throw error;
    }
  }

  private static async fetchUserSubmissions(handle: string) {
    try {
      const response = await axios.get(`${CODEFORCES_API_URL}/user.status`, {
        params: { handle }
      });
      return response.data.result;
    } catch (error) {
      console.error(`Error fetching user submissions for ${handle}:`, error);
      throw error;
    }
  }

  public static async updateStudentData(studentId: string) {
    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    try {
      const userInfo = await this.fetchUserInfo(student.codeforcesHandle);
      student.currentRating = userInfo.rating || 0;
      student.maxRating = userInfo.maxRating || 0;
      student.lastUpdated = new Date();
      await student.save();

      const ratingHistory = await this.fetchUserRating(student.codeforcesHandle);
      for (const contest of ratingHistory) {
        await Contest.findOneAndUpdate(
          { studentId, contestId: contest.contestId },
          {
            contestName: contest.contestName,
            rank: contest.rank,
            oldRating: contest.oldRating,
            newRating: contest.newRating,
            solvedProblems: contest.solvedProblems || 0,
            totalProblems: contest.totalProblems || 0,
            contestDate: new Date(contest.ratingUpdateTimeSeconds * 1000)
          },
          { upsert: true }
        );
      }

      const submissions = await this.fetchUserSubmissions(student.codeforcesHandle);
      for (const submission of submissions) {
        if (submission.verdict === 'OK') {
          await Problem.findOneAndUpdate(
            { studentId, problemId: submission.problem.contestId + submission.problem.index },
            {
              problemName: submission.problem.name,
              rating: submission.problem.rating || 0,
              tags: submission.problem.tags || [],
              solvedDate: new Date(submission.creationTimeSeconds * 1000),
              submissionId: submission.id,
              verdict: submission.verdict
            },
            { upsert: true }
          );
        }
      }

      return student;
    } catch (error) {
      console.error(`Error updating data for student ${studentId}:`, error);
      throw error;
    }
  }

  public static async checkInactivity(studentId: string) {
    const student = await Student.findById(studentId);
    if (!student || !student.emailNotificationsEnabled) return false;

    const lastSubmission = await Problem.findOne({ studentId })
      .sort({ solvedDate: -1 })
      .limit(1);

    if (!lastSubmission) return false;

    const daysSinceLastSubmission = Math.floor(
      (Date.now() - lastSubmission.solvedDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceLastSubmission >= 7;
  }
} 