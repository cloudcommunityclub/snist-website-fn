import { PositionCategory } from '@/types/recruitment';

export const RECRUITMENT_CATEGORIES: PositionCategory[] = [
    {
        id: 'designing',
        title: 'Designing',
        description: 'Create stunning visuals and user experiences for our community.',
        problems: [
            {
                id: 'des-001',
                title: 'Redesign the Events Page Banner',
                description: 'Create a more engaging hero section for the events page with modern aesthetics.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/1',
                categoryId: 'designing',
            },
            {
                id: 'des-002',
                title: 'Design Social Media Templates',
                description: 'Create reusable Instagram and LinkedIn post templates for event announcements.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/2',
                categoryId: 'designing',
            },
            {
                id: 'des-003',
                title: 'Create Icon Set for Activities',
                description: 'Design a cohesive set of icons representing different club activities.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/3',
                categoryId: 'designing',
            },
        ],
    },
    {
        id: 'development',
        title: 'Development',
        description: 'Build and maintain the technical infrastructure of C³.',
        problems: [
            {
                id: 'dev-001',
                title: 'Implement Dark Mode Toggle',
                description: 'Add a theme switcher component with persistent user preference.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/4',
                categoryId: 'development',
            },
            {
                id: 'dev-002',
                title: 'Add Event Registration Form',
                description: 'Create a reusable form component for event sign-ups with validation.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/5',
                categoryId: 'development',
            },
            {
                id: 'dev-003',
                title: 'Build Member Directory API',
                description: 'Design and implement a RESTful API for fetching member profiles.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/6',
                categoryId: 'development',
            },
            {
                id: 'dev-004',
                title: 'Optimize Image Loading',
                description: 'Implement lazy loading and blur placeholders for all images.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/7',
                categoryId: 'development',
            },
        ],
    },
    {
        id: 'marketing',
        title: 'Marketing',
        description: 'Spread the word and grow our community reach.',
        problems: [
            {
                id: 'mkt-001',
                title: 'Draft Monthly Newsletter Template',
                description: 'Create an engaging email template for monthly community updates.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/8',
                categoryId: 'marketing',
            },
            {
                id: 'mkt-002',
                title: 'Write SEO-Optimized Blog Post',
                description: 'Author a blog post about cloud computing trends for beginners.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/9',
                categoryId: 'marketing',
            },
            {
                id: 'mkt-003',
                title: 'Plan Social Media Campaign',
                description: 'Develop a week-long campaign strategy for the upcoming hackathon.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/10',
                categoryId: 'marketing',
            },
        ],
    },
    {
        id: 'operations',
        title: 'Operations',
        description: 'Keep the club running smoothly behind the scenes.',
        problems: [
            {
                id: 'ops-001',
                title: 'Create Event Planning Checklist',
                description: 'Document a reusable checklist for organizing workshops and events.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/11',
                categoryId: 'operations',
            },
            {
                id: 'ops-002',
                title: 'Set Up Feedback Collection System',
                description: 'Implement a system to collect and analyze post-event feedback.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/12',
                categoryId: 'operations',
            },
            {
                id: 'ops-003',
                title: 'Draft Sponsorship Outreach Email',
                description: 'Write a professional email template for reaching out to potential sponsors.',
                githubIssueUrl: 'https://github.com/prem22k/cloudcommunityclub-c3-/issues/13',
                categoryId: 'operations',
            },
        ],
    },
];
