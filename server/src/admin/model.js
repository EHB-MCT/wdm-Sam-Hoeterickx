/**
 * Get comprehensive statistics for admin dashboard
 * @param {Object} collections - All database collections
 * @returns {Promise<Object>} Statistics object containing user, session, and activity data
 */
const getAllStats = async(collections) => {
    const { userCollection, sessionCollection, answerCollection, browserCollection, geoLocationCollection } = collections;
    
    try {
        const [
            totalUsers,
            totalSessions,
            totalAnswers,
            totalBrowserData,
            totalGeoLocations,
            weekAgoUsers,
            dayAgoSessions
        ] = await Promise.all([
            userCollection.countDocuments(),
            sessionCollection.countDocuments(),
            answerCollection.countDocuments(),
            browserCollection.countDocuments(),
            geoLocationCollection.countDocuments(),
            userCollection.countDocuments({ 
                created_at: { 
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
                } 
            }),
            sessionCollection.countDocuments({ 
                created_at: { 
                    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
                } 
            })
        ]);

        // Get role distribution
        const userRoles = await userCollection.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        // Get activity by month for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const monthlyActivity = await sessionCollection.aggregate([
            {
                $match: {
                    created_at: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$created_at' },
                        month: { $month: '$created_at' }
                    },
                    sessions: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]).toArray();

        return {
            overview: {
                totalUsers,
                totalSessions,
                totalAnswers,
                totalBrowserData,
                totalGeoLocations,
                newUsersThisWeek: weekAgoUsers,
                activeSessionsToday: dayAgoSessions
            },
            userRoles: userRoles.reduce((acc, role) => {
                acc[role._id] = role.count;
                return acc;
            }, {}),
            monthlyActivity: monthlyActivity.map(item => ({
                month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
                sessions: item.sessions
            })),
            // Calculated metrics
            averageAnswersPerUser: totalUsers > 0 ? (totalAnswers / totalUsers).toFixed(2) : 0,
            averageSessionsPerUser: totalUsers > 0 ? (totalSessions / totalUsers).toFixed(2) : 0,
            userGrowthRate: weekAgoUsers > 0 ? ((weekAgoUsers / totalUsers) * 100).toFixed(2) : 0
        };
    } catch (error) {
        console.error('Error getting admin stats:', error);
        throw new Error('Failed to retrieve dashboard statistics');
    }
};

module.exports = {
    getAllStats
};