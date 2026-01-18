import { pool } from './connection.js';

async function seedDatabase() {
  try {
    // Insert profile
    const profileResult = await pool.query(
      `INSERT INTO profile (name, email, education, github_link, linkedin_link, portfolio_link)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        'Ayush Karn',
        '(ayushkarn169003@gmail.com)',
        'Bachelor of Technology in Computer Science - National Institute Of Technology Delhi',
        'https://github.com/AyushKarn69',
        'https://www.linkedin.com/in/ayushkarn01/',
        'https://ayushkarn-portfolio.com',
      ]
    );

    const profileId = profileResult.rows[0].id;

    // Insert skills
    const skills = [
      { name: 'JavaScript', proficiency: 'Advanced' },
      { name: 'React-Native', proficiency: 'Advanced' },
      { name: 'React', proficiency: 'Advanced' },
      { name: 'Node.js', proficiency: 'Advanced' },
      { name: 'PostgreSQL', proficiency: 'Intermediate' },
      { name: 'MongoDB', proficiency: 'Intermediate' },
      { name: 'Python', proficiency: 'Intermediate' },
      { name: 'Docker', proficiency: 'Beginner' },
      { name: 'TypeScript', proficiency: 'Intermediate' },
    ];

    for (const skill of skills) {
      await pool.query(
        `INSERT INTO skills (profile_id, skill_name, proficiency)
         VALUES ($1, $2, $3)`,
        [profileId, skill.name, skill.proficiency]
      );
    }

    // Insert projects
    const projects = [
      {
        title: 'Hypespace',
        description: 'Full-stack real-time event check-in application built with Expo (React Native) for the frontend and Node.js/Express/GraphQL/Prisma for the backend.',
        github: 'https://github.com/AyushKarn69/hypespace',
        live: 'https://hypespace-demo.com',
        skills: ['React-Native', 'Node.js', 'PostgreSQL','TypeScript'],
      },
      {
        title: 'VocaAI',
        description: 'AI-powered customer service platform that provides businesses with a smart, always-on voice agent. Built with Next.js, it integrates seamlessly with the OpenAI-Realtime-API backend for real-time voice interactions',
        github: 'https://github.com/AyushKarn69/voca-ai',
        live: 'https://voca-ai.vercel.app/',
        skills: ['Next.js', 'React', 'OpenAI API', 'MongoDB'],
      },
      {
        title: 'Grinch Bot Project',
        description: ' modular automation toolkit designed for tasks such as automated carting, checkout, captcha handling, and proxy management.',
        github: 'https://github.com/AyushKarn69/grinch-bot',
        live: 'https://api-grinch-demo.com',
        skills: ["Python", "JavaScript", "Docker"],
      },
    ];

    for (const project of projects) {
      const projectResult = await pool.query(
        `INSERT INTO projects (profile_id, title, description, github_link, live_link)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [profileId, project.title, project.description, project.github, project.live]
      );

      const projectId = projectResult.rows[0].id;

      for (const skill of project.skills) {
        await pool.query(
          `INSERT INTO project_skills (project_id, skill_name)
           VALUES ($1, $2)`,
          [projectId, skill]
        );
      }
    }

    // Insert work experience
    const workExperience = [
      {
        company: 'Croatia Technologies',
        position: 'Intern App Developer',
        startDate: '2024-06-1',
        endDate: '2024-08-31',
        description: 'Engineered Android apps with Kotlin + Jetpack Compose, reducing UI load time by 15%.Integrated Firebase Authentication, Firestore, Cloud Messaging for 500+ active users.',
      },
      {
        company: 'StartUp Inc',
        position: 'Full-Stack Developer',
        startDate: '2021-06-01',
        endDate: '2022-12-31',
        description: 'Built and maintained React and Node.js applications for IoT platform',
      },
      {
        company: 'Digital Agency',
        position: 'Junior Developer',
        startDate: '2020-07-01',
        endDate: '2021-05-31',
        description: 'Developed responsive web applications using React and maintained legacy systems',
      },
    ];

    for (const work of workExperience) {
      await pool.query(
        `INSERT INTO work_experience (profile_id, company, position, start_date, end_date, description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [profileId, work.company, work.position, work.startDate, work.endDate, work.description]
      );
    }

    console.log('✓ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
