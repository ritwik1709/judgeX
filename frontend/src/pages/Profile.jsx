import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setError('Failed to load user statistics');
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
      <div className="container mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Profile</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">User Information</h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Username</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {stats && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSubmissions}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.solvedProblems}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalSubmissions > 0 
                      ? `${Math.round((stats.solvedProblems / stats.totalSubmissions) * 100)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 