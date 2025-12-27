import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//Hooks
import { useGetUserData } from "../../../shared/hooks";

//Routes
import { HOME_ROUTE } from '../../home/Home.route';

//Components
import { DashboardContainer } from '../components/DashboardContainer';

//Style
import '~styles/dashboard.css';


/**
 * Dashboard page component displaying user profile information and personality analysis.
 * Shows welcome message, personality visualizations, and navigation to restart the quiz.
 * 
 * @returns {React.ReactNode} - Dashboard JSX with user data, analytics and navigation
 */
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
            processAnalysisData(answerData);
        }
    }, [answerData]);

    const processAnalysisData = (answers) => {
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

        setAnalysisData({
            personalityScores: scores,
            categoryData: categoryStats,
            scatterData: scatterData
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

        //Ethics
        const ethicsAnswers = answers.filter(a => a.category === 'ethics');
        if (ethicsAnswers.length > 0) {
            // Debug: log alle ethics vragen
            console.log('🔍 Ethics vragen:', ethicsAnswers.map(a => ({
                id: a.question_id,
                answer: a.selected_answer
            })));

            const ethicalChoices = ethicsAnswers.filter(a => {
                if (a.question_id === "9") return a.selected_answer === 'Nee';
                if (a.question_id === "10") return a.selected_answer === 'Breng terug';
                if (a.question_id === "11") return a.selected_answer === 'Ja';
                
                return false;
            }).length;
            
            console.log('✅ Ethische keuzes:', ethicalChoices, '/', ethicsAnswers.length);
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
        const q8 = answers.find(a => a.question_id === "8");
        const q12 = answers.find(a => a.question_id === "12");
        if (q8 && q12) {
            scores['Consistent'] = (q8.selected_answer === q12.selected_answer) ? 100 : 0;
            console.log(q8.selected_answer, q12.selected_answer)
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
    )
}