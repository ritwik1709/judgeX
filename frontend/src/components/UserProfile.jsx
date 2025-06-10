import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const UserProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    difficultyStats: {
      Easy: { total: 0, solved: 0, submissions: 0 },
      Medium: { total: 0, solved: 0, submissions: 0 },
      Hard: { total: 0, solved: 0, submissions: 0 }
    }
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/users/stats');
        console.log('Received user stats:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  console.log('Current stats state:', stats);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.username}</h1>
              <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Problems</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalProblems}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Solved Problems</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.solvedProblems}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.totalProblems ? Math.round((stats.solvedProblems / stats.totalProblems) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Difficulty-wise Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Solved Problems by Difficulty</h2>
          <div className="space-y-4">
            {/* Easy */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-600 dark:text-green-400 font-semibold">Easy</span>
                <div className="flex space-x-4">
                  <span className="text-gray-600 dark:text-gray-300">
                    Solved: {stats.difficultyStats.Easy.solved} / {stats.difficultyStats.Easy.total}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    Submissions: {stats.difficultyStats.Easy.submissions}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{
                    width: `${stats.difficultyStats.Easy.total ? (stats.difficultyStats.Easy.solved / stats.difficultyStats.Easy.total) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Medium</span>
                <div className="flex space-x-4">
                  <span className="text-gray-600 dark:text-gray-300">
                    Solved: {stats.difficultyStats.Medium.solved} / {stats.difficultyStats.Medium.total}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    Submissions: {stats.difficultyStats.Medium.submissions}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-yellow-500 h-2.5 rounded-full"
                  style={{
                    width: `${stats.difficultyStats.Medium.total ? (stats.difficultyStats.Medium.solved / stats.difficultyStats.Medium.total) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-600 dark:text-red-400 font-semibold">Hard</span>
                <div className="flex space-x-4">
                  <span className="text-gray-600 dark:text-gray-300">
                    Solved: {stats.difficultyStats.Hard.solved} / {stats.difficultyStats.Hard.total}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    Submissions: {stats.difficultyStats.Hard.submissions}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{
                    width: `${stats.difficultyStats.Hard.total ? (stats.difficultyStats.Hard.solved / stats.difficultyStats.Hard.total) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 