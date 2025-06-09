import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching stats for user:', userId);

    // Get all problems
    const allProblems = await Problem.find();
    console.log('All problems:', allProblems.map(p => ({ id: p._id, title: p.title, difficulty: p.difficulty })));
    const totalProblems = allProblems.length;

    // Get user's submissions with populated problem details
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
    console.error('Error getting user stats:', error);
    res.status(500).json({ 
      message: 'Error getting user statistics',
      error: error.message 
    });
  }
}; 