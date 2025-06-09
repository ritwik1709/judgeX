import User from '../models/User.js';
import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Submission.deleteMany({ userId: req.params.id }); // clean up
    res.json({ message: 'User and submissions deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all submissions (with optional filtering)
export const getAllSubmissions = async (req, res) => {
  try {
    const { userId, problemId } = req.query;

    const query = {};
    if (userId) query.userId = userId;
    if (problemId) query.problemId = problemId;

    const submissions = await Submission.find(query)
      .populate('userId', 'username')
      .populate('problemId', 'title');

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a submission
export const deleteSubmission = async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching stats for admin:', userId);

    // Get all problems
    const allProblems = await Problem.find();
    console.log('All problems:', allProblems.map(p => ({ id: p._id, title: p.title, difficulty: p.difficulty })));
    const totalProblems = allProblems.length;

    // Get admin's submissions with populated problem details
    const submissions = await Submission.find({ userId: userId })
      .populate('problemId', 'title difficulty');
    console.log('All submissions:', submissions.map(s => ({ 
      id: s._id, 
      problemId: s.problemId?._id, 
      problemTitle: s.problemId?.title,
      problemDifficulty: s.problemId?.difficulty,
      verdict: s.verdict 
    })));

    // Get difficulty-wise stats
    const difficultyStats = {
      Easy: { total: 0, solved: 0, submissions: 0 },
      Medium: { total: 0, solved: 0, submissions: 0 },
      Hard: { total: 0, solved: 0, submissions: 0 }
    };

    // Count total problems by difficulty
    allProblems.forEach(problem => {
      const difficulty = problem.difficulty;
      console.log('Processing total problem:', { id: problem._id, difficulty });
      if (difficultyStats[difficulty]) {
        difficultyStats[difficulty].total++;
      }
    });

    // Count solved problems and submissions by difficulty
    const solvedProblemsByDifficulty = {
      Easy: new Set(),
      Medium: new Set(),
      Hard: new Set()
    };

    submissions.forEach(submission => {
      const difficulty = submission.problemId.difficulty;
      if (difficultyStats[difficulty]) {
        difficultyStats[difficulty].submissions++;
        if (submission.verdict === 'Accepted') {
          solvedProblemsByDifficulty[difficulty].add(submission.problemId._id.toString());
        }
      }
    });

    // Update solved counts from unique solved problems
    Object.keys(difficultyStats).forEach(difficulty => {
      difficultyStats[difficulty].solved = solvedProblemsByDifficulty[difficulty].size;
    });

    console.log('Final difficulty stats:', difficultyStats);

    const response = {
      totalProblems,
      solvedProblems: Object.keys(solvedProblemsByDifficulty).reduce((total, difficulty) => total + solvedProblemsByDifficulty[difficulty].size, 0),
      difficultyStats,
      totalSubmissions: submissions.length
    };
    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ 
      message: 'Error getting admin statistics',
      error: error.message 
    });
  }
};
