import { useEffect, useState } from "react";

//Hooks
import { useGetUserData } from "../../../shared/hooks";

//Routes
import { HOME_ROUTE } from '../../home/Home.route';

//Components
import { DashboardContainer } from '../components/DashboardContainer';

//Style
import '~styles/dashboard.css';

export const Dashboard = () => {
    const { getMyData, user, answerData, decisionData, isLoading, error } = useGetUserData();
    const [activeTab, setActiveTab] = useState('profile');
    const [analysisData, setAnalysisData] = useState(null);

    useEffect(() => {
        document.title = 'WDM | Dashboard';
        getMyData(); 
        
        localStorage.setItem('question_id', '1');
        localStorage.removeItem('quiz_completed');
    }, []);

    useEffect(() => {
        if (answerData && answerData.length > 0) {
            processAnalysisData(answerData, decisionData);
        }
    }, [answerData, decisionData]);

    const processAnalysisData = (answers, decisions) => {
        const questionCategories = {
            1: 'framing', 2: 'framing',
            3: 'risk', 4: 'risk', 5: 'risk',
            6: 'time_pressure', 7: 'time_pressure',
            8: 'consistency', 12: 'consistency',
            9: 'ethics', 10: 'ethics', 11: 'ethics',
            13: 'preference', 14: 'preference', 15: 'preference',
            16: 'impulsivity', 17: 'impulsivity',
            18: 'tradeoff', 19: 'tradeoff', 20: 'tradeoff'
        };

        const enrichedAnswers = answers.map(answer => ({
            ...answer,
            category: questionCategories[answer.question_id] || 'unknown'
        }));

        const scores = calculatePersonalityScores(enrichedAnswers);
        const categoryStats = calculateCategoryStats(enrichedAnswers);
        const scatterData = createScatterData(enrichedAnswers);
        const confidenceStats = calculateConfidenceStats(decisions);

        setAnalysisData({
            personalityScores: scores,
            categoryData: categoryStats,
            scatterData: scatterData,
            confidenceStats: confidenceStats
        });
    };

    const calculatePersonalityScores = (answers) => {
        const scores = {
            'Risicomijdend': 0,
            'Ethisch': 0,
            'Geduldig': 0,
            'Consistent': 0,
            'Besluitvaardig': 0
        };

        // Risk aversion
        const riskAnswers = answers.filter(a => a.category === 'risk');
        if (riskAnswers.length > 0) {
            const safeChoices = riskAnswers.filter(a => 
                a.selected_answer?.includes('Vaste') || 
                a.selected_answer?.includes('Veilige') || 
                a.selected_answer?.includes('€50 zeker')
            ).length;
            scores['Risicomijdend'] = (safeChoices / riskAnswers.length) * 100;
        }

        // Ethics
        const ethicsAnswers = answers.filter(a => a.category === 'ethics');
        if (ethicsAnswers.length > 0) {
            const ethicalChoices = ethicsAnswers.filter(a => {
                if (a.question_id === "9") return a.selected_answer === 'Nee';
                if (a.question_id === "10") return a.selected_answer === 'Breng terug';
                if (a.question_id === "11") return a.selected_answer === 'Ja';
                return false;
            }).length;
            scores['Ethisch'] = (ethicalChoices / ethicsAnswers.length) * 100;
        }

        // Patience
        const impulsivityAnswers = answers.filter(a => a.category === 'impulsivity');
        if (impulsivityAnswers.length > 0) {
            const patientChoices = impulsivityAnswers.filter(a => 
                a.selected_answer?.includes('maand') || 
                a.selected_answer === 'Leren'
            ).length;
            scores['Geduldig'] = (patientChoices / impulsivityAnswers.length) * 100;
        }

        // Consistency
        const q8Answers = answers.filter(a => a.question_id === "8");
        const q12Answers = answers.filter(a => a.question_id === "12");

        if (q8Answers.length > 0 && q12Answers.length > 0) {
            const maxPairs = Math.max(q8Answers.length, q12Answers.length);
            let consistentPairs = 0;
            let totalComparisons = 0;
            
            for (let i = 0; i < q8Answers.length; i++) {
                for (let j = 0; j < q12Answers.length; j++) {
                    totalComparisons++;
                    if (q8Answers[i].selected_answer === q12Answers[j].selected_answer) {
                        consistentPairs++;
                    }
                }
            }
            
            scores['Consistent'] = totalComparisons > 0 
                ? (consistentPairs / totalComparisons) * 100 
                : 0;
        }

        // Decisiveness
        const avgChangedMind = answers.reduce((sum, a) => {
            const changes = (a.changed_mind?.option1 || 0) + (a.changed_mind?.option2 || 0);
            return sum + changes;
        }, 0) / answers.length;
        scores['Besluitvaardig'] = Math.max(0, 100 - (avgChangedMind * 20));

        return Object.entries(scores).map(([trait, value]) => ({
            trait,
            value: Math.round(value)
        }));
    };

    const calculateCategoryStats = (answers) => {
        const categories = {};
        
        answers.forEach(a => {
            if (!categories[a.category]) {
                categories[a.category] = { times: [], changes: [] };
            }
            categories[a.category].times.push(a.decision_time || 0);
            const totalChanges = (a.changed_mind?.option1 || 0) + (a.changed_mind?.option2 || 0);
            categories[a.category].changes.push(totalChanges);
        });

        return Object.entries(categories).map(([category, data]) => ({
            category: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
            avgTime: parseFloat((data.times.reduce((a, b) => a + b, 0) / data.times.length).toFixed(2)),
            avgChanges: parseFloat((data.changes.reduce((a, b) => a + b, 0) / data.changes.length).toFixed(2))
        }));
    };

    const createScatterData = (answers) => {
        const categoryColors = {
            framing: '#8884d8',
            risk: '#82ca9d',
            time_pressure: '#ffc658',
            consistency: '#ff7c7c',
            ethics: '#a05195',
            preference: '#d45087',
            impulsivity: '#f95d6a',
            tradeoff: '#665191'
        };

        return answers.map(a => ({
            x: a.decision_time || 0,
            y: (a.changed_mind?.option1 || 0) + (a.changed_mind?.option2 || 0),
            z: a.question_id,
            category: a.category,
            color: categoryColors[a.category] || '#999999'
        }));
    };

    const calculateConfidenceStats = (decisions) => {
        if (!decisions || decisions.length === 0) {
            return {
                distribution: [
                    { name: 'Zeker', value: 0 },
                    { name: 'Onzeker', value: 0 }
                ],
                timeComparison: [
                    { type: 'Zeker', avgTime: 0 },
                    { type: 'Onzeker', avgTime: 0 }
                ],
                totalChecks: 0,
                confidencePercentage: 0,
                avgDecisionTime: 0
            };
        }

        // Count confident vs not confident
        const confidentCount = decisions.filter(d => d.isConfidence === true).length;
        const notConfidentCount = decisions.filter(d => d.isConfidence === false).length;
        
        // Calculate average decision times
        const confidentDecisions = decisions.filter(d => d.isConfidence === true);
        const notConfidentDecisions = decisions.filter(d => d.isConfidence === false);
        
        const avgConfidentTime = confidentDecisions.length > 0 
            ? (confidentDecisions.reduce((sum, d) => sum + (d.decision_time || 0), 0) / confidentDecisions.length)
            : 0;
            
        const avgNotConfidentTime = notConfidentDecisions.length > 0
            ? (notConfidentDecisions.reduce((sum, d) => sum + (d.decision_time || 0), 0) / notConfidentDecisions.length)
            : 0;

        // Overall average decision time
        const avgDecisionTime = decisions.reduce((sum, d) => sum + (d.decision_time || 0), 0) / decisions.length;

        return {
            distribution: [
                { name: 'Zeker', value: confidentCount },
                { name: 'Onzeker', value: notConfidentCount }
            ],
            timeComparison: [
                { type: 'Zeker', avgTime: parseFloat(avgConfidentTime.toFixed(2)) },
                { type: 'Onzeker', avgTime: parseFloat(avgNotConfidentTime.toFixed(2)) }
            ],
            totalChecks: decisions.length,
            confidencePercentage: Math.round((confidentCount / decisions.length) * 100),
            avgDecisionTime: parseFloat(avgDecisionTime.toFixed(2))
        };
    };

    return (
        <DashboardContainer 
            user={user}
            answerData={answerData}
            decisionData={decisionData}
            isLoading={isLoading}
            error={error}
            getMyData={getMyData}
            homeRoute={HOME_ROUTE}
            analysisData={analysisData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        />
    );
};