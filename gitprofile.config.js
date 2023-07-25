// gitprofile.config.js

const config = {
  github: {
    username: 'triyatna', // Your GitHub org/user name. (Required)
    sortBy: 'updated', // stars | updated
    limit: 6, // How many projects to display.
    exclude: {
      forks: false, // Forked projects will not be displayed if set to true.
      projects: [], // These projects will not be displayed. example: ['my-project1', 'my-project2']
    },
  },
  social: {
    linkedin: 'triyatna',
    twitter: 'triyatna145',
    mastodon: '',
    facebook: '3yatna',
    instagram: 'triyatna_lesmana',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '21925119/tri-yatna', // format: userid/username
    skype: '',
    telegram: 'triyatna_lesmana',
    website: 'https://triyatna.com',
    phone: '',
    email: 'triyatna.com@gmail.com',
  },
  resume: {
    fileUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'PHP',
    'Codeigniter',
    'Laravel',
    'JavaScript',
    'Node.js',
    'Express',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Git',
    'CSS',
    'HTML',
    'Wordpress',
  ],
 /*  experiences: [
     {
      company: 'Company Name',
      position: 'Position',
      from: 'September 2021',
      to: 'Present',
      companyLink: 'https://example.com',
    },
    {
      company: 'Company Name',
      position: 'Position',
      from: 'July 2019',
      to: 'August 2021',
      companyLink: 'https://example.com',
    },
  ], */
  /* certifications: [
    {
      name: 'Lorem ipsum',
      body: 'Lorem ipsum dolor sit amet',
      year: 'March 2022',
      link: 'https://example.com'
    },
  ], */
  education: [
    {
      institution: 'Widyatama University',
      degree: 'S.M.',
      from: '2020',
      to: '2024',
    },
  ],

  // To hide the `My Projects` section, keep it empty.
  externalProjects: [
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
      imageUrl: 'https://panel.blastjet.biz.id/uploads/avatar/edcc4adf531cc758a046e6c16d219aae.png?v=3.3.3',
      link: 'https://blastjet.biz.id',
    },
  ],
  // Display blog posts from your medium or dev account. (Optional)
  // blog: {
  //   source: 'dev', // medium | dev
  //   username: 'arifszn', // to hide blog section, keep it empty
  //   limit: 2, // How many posts to display. Max is 10.
  // },
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: {
    id: '',
    snippetVersion: 6,
  },
  themeConfig: {
    defaultTheme: 'wireframe',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Hide the ring in Profile picture
    hideAvatarRing: false,

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
      'procyon',
    ],

    // Custom theme
    customTheme: {
      primary: '#fc055b',
      secondary: '#219aaf',
      accent: '#e8d03a',
      neutral: '#2A2730',
      'base-100': '#E3E3ED',
      '--rounded-box': '3rem',
      '--rounded-btn': '3rem',
    },
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Made with <a 
      class="text-primary" href="https://github.com/arifszn/gitprofile"
      target="_blank"
      rel="noreferrer"
    >GitProfile</a> and ❤️`,
};

export default config;
