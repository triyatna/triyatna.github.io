// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'triyatna', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/portfolio/',
  projects: {
    github: {
      display: true, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'stars', // Sort projects by 'stars' or 'updated'
        limit: 8, // How many projects to display.
        exclude: {
          forks: false, // Forked projects will not be displayed if set to true.
          projects: [], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['triyatna/ci4-authro'], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    external: {
      header: 'My Projects',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
      title: 'MyPortfolio',
      description:
        'A personal portfolio website that showcases my work and projects. Built with Laravel 11',
      imageUrl: 'https://tri-yatna.my.id/build/images/logo-icon.svg',
      link: 'https://tri-yatna.my.id',
    },
    {
      title: 'SisEntra',
      description:
        'Sentra UTama Organization membership management website. Contains meeting attendance, project lists, cash management as well as cash payments, membership lists, and more. using PHP Native',
      imageUrl: 'https://i.ibb.co/qB7cJQ4/S.png',
      link: 'https://sentrawidyatama.my.id',
    },
    {
      title: 'Bot WhatsApp (BlastJET)',
      description:
        'BlastJET is a web application with a mass messaging system that allows users to send messages in the form of Text, Media, Button. In addition, there is a useful bot feature to automatically reply to messages.',
      imageUrl:
        'https://panel.blastjet.biz.id/uploads/avatar/edcc4adf531cc758a046e6c16d219aae.png?v=3.3.3',
      link: 'https://blastjet.biz.id',
    },
    {
      title: 'News Portal sEntra (PKM sEntra UTAMA)',
      description:
        'Center student press organization news sEntra Widyatama University, developed with WordPress CMS',
      imageUrl: 'https://pkmsentra.com/wp-content/uploads/2023/02/Logo1.png',
      link: 'https://pkmsentra.com',
    },
      ],
    },
  },
  seo: { title: 'Tri Yatna', description: 'Portfolio of Tri Yatna, showcasing skills and projects', imageURL: '' },
  social: {
    linkedin: 'triyatna',
    x: 'triyatna145',
    mastodon: '',
    researchGate: '',
    facebook: '3yatna',
    instagram: 'triyatna_lesmana',
    reddit: '',
    threads: '',
    youtube: 'TyatnaYT',
    udemy: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    discord: '',
    telegram: '',
    website: 'https://www.tri-yatna.my.id',
    phone: '',
    email: 'triyatna.dev@gmail.com',
  },
  resume: {
    fileUrl:
      '', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
  'PHP',
    'Codeigniter',
    'Laravel',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'React',
    'Vue',
    'Bootstrap',
    'Tailwind',
    'Express',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Git',
    'CSS',
    'HTML',
    'Wordpress',
  ],
  // experiences: [
  //   {
  //     company: 'Company Name',
  //     position: 'Position',
  //     from: 'September 2021',
  //     to: 'Present',
  //     companyLink: 'https://example.com',
  //   },
  //   {
  //     company: 'Company Name',
  //     position: 'Position',
  //     from: 'July 2019',
  //     to: 'August 2021',
  //     companyLink: 'https://example.com',
  //   },
  // ],
  // certifications: [
  //   {
  //     name: 'Lorem ipsum',
  //     body: 'Lorem ipsum dolor sit amet',
  //     year: 'March 2022',
  //     link: 'https://example.com',
  //   },
  // ],
  educations: [
   {
      institution: 'Widyatama University',
      degree: 'Bachelor (Management)',
      from: '2020',
      to: '2024',
    },
    {
      institution: 'SMAN 1 Lemahabang',
      degree: 'Social',
      from: '2017',
      to: '2020',
    },
  ],
  // publications: [
  //   {
  //     title: 'Publication Title',
  //     conferenceName: '',
  //     journalName: 'Journal Name',
  //     authors: 'John Doe, Jane Smith',
  //     link: 'https://example.com',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  //   },
  //   {
  //     title: 'Publication Title',
  //     conferenceName: 'Conference Name',
  //     journalName: '',
  //     authors: 'John Doe, Jane Smith',
  //     link: 'https://example.com',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  //   },
  // ],
  // Display articles from your medium or dev account. (Optional)
  // blog: {
  //   source: 'dev', // medium | dev
  //   username: 'arifszn', // to hide blog section, keep it empty
  //   limit: 2, // How many articles to display. Max is 10.
  // },
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: { id: '', snippetVersion: 6 },
  themeConfig: {
    defaultTheme: 'lofi',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'caramellatte',
      'abyss',
      'silk',
      'procyon',
    ],
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Made with <a 
      class="text-primary" href="https://github.com/arifszn/gitprofile"
      target="_blank"
      rel="noreferrer"
    >GitProfile</a> and ❤️`,

  enablePWA: true,
};

export default CONFIG;
