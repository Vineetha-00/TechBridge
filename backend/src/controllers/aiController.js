const aiService = require('../services/aiService');
const fallbackData = require('../utils/fallbackData');

/**
 * Handle AI Career Guidance Questions
 */
exports.getCareerGuidance = async (req, res) => {
    try {
        const {
            academicYear = req.user?.academic_year || 1,
            existingKnowledge = req.user?.skills?.join(', ') || '',
            interests = req.user?.interests?.join(', ') || '',
            careerGoals = '',
            question = '',
            history = []
        } = req.body;

        if (!question) {
            return res.status(400).json({ success: false, message: 'Please provide a question for the AI mentor.' });
        }

        // Gather relevant senior experiences from verified answers
        const seniorExperiences = fallbackData.answers
            .filter(a => a.is_helpful || a.is_accepted)
            .map(a => ({
                senior: a.author_name,
                company: a.author_company,
                advice: a.content.substring(0, 200) + '...'
            }));

        const response = await aiService.generateCareerGuidance({
            academicYear: Number(academicYear),
            existingKnowledge,
            interests,
            careerGoals,
            question,
            history,
            seniorExperiences
        });

        res.json(response);
    } catch (err) {
        console.error('getCareerGuidance error:', err);
        res.status(500).json({ success: false, message: 'AI Guidance service encountered an error.' });
    }
};

/**
 * Unique Feature: Compare and Synthesize Multiple Senior Advices
 */
exports.compareSeniorAdvices = async (req, res) => {
    try {
        const { question, studentYear = req.user?.academic_year || 1, studentInterests = '', seniorAdvices = [] } = req.body;

        if (!question || !Array.isArray(seniorAdvices) || seniorAdvices.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide the student question and at least 2 senior advice viewpoints.'
            });
        }

        const comparisonResult = await aiService.compareSeniorAdvices({
            question,
            studentYear: Number(studentYear),
            studentInterests,
            seniorAdvices
        });

        res.json(comparisonResult);
    } catch (err) {
        console.error('compareSeniorAdvices error:', err);
        res.status(500).json({ success: false, message: 'Failed to synthesize senior advice.' });
    }
};

/**
 * Get sample senior advice presets for comparison demonstration
 */
exports.getComparisonPresets = async (req, res) => {
    res.json({
        success: true,
        presets: [
            {
                id: 'preset-cpp-vs-java',
                title: 'C++ vs Java for DSA and Campus Placements',
                question: 'Should I focus entirely on C++ or Java in my initial years for DSA and job placements?',
                advices: [
                    {
                        senior_name: 'Aravind Sharma',
                        role: 'placed_graduate',
                        company: 'Google',
                        advice_text: 'Go with C++. The Standard Template Library (STL) is fast, syntax is lean for contests (Codeforces, LeetCode), and mastering pointers/memory in C++ makes learning any other language trivial.'
                    },
                    {
                        senior_name: 'Sneha Reddy',
                        role: 'placed_graduate',
                        company: 'Microsoft',
                        advice_text: 'I strongly recommend Java. Enterprise companies build microservices in Java/Spring Boot. Java enforces strict Object-Oriented principles, which helps immensely during Low-Level Design (LLD) interview rounds.'
                    }
                ]
            },
            {
                id: 'preset-webdev-vs-aiml',
                title: 'Web Development vs AI/ML in Second Year',
                question: 'Should 2nd year students learn full-stack web development or jump directly into AI & Deep Learning?',
                advices: [
                    {
                        senior_name: 'Rohit Verma',
                        role: 'final_year',
                        company: 'Amazon PPO',
                        advice_text: 'Build full-stack web apps first with React and Node.js. It gives you instant visual feedback, teaches databases, APIs, and hosting. Almost every startup and tech company hires full-stack interns.'
                    },
                    {
                        senior_name: 'Priya Patel',
                        role: 'third_year',
                        company: 'VIT AI Lab',
                        advice_text: 'Start AI/ML right away if you enjoy math, calculus, and research. Work on PyTorch models and Kaggle datasets. Publishing an IEEE student paper or building an innovative AI tool will make your profile stand out.'
                    }
                ]
            }
        ]
    });
};
