import logoUrl from './logo.svg';

// Edit these to personalise the site.
export const site = {
  name: 'CyberAware',
  tagline: 'Stay informed. Stay secure.',
  logo: logoUrl,
  email: 'contact@cyberaware.example', // reserved demo domain: looks real, can never reach anyone
  phone: '+94 01234567',
  location: '',                       // e.g. 'Colombo, Sri Lanka' (hidden while empty)
  // Paste your Formspree form ID (e.g. 'xyzabcde') so the contact form sends real emails.
  // While empty, the form opens the visitor's email app addressed to `email`.
  formspreeId: '',
  social: {
    github: '',     // e.g. 'https://github.com/your-username'
    linkedin: '',   // e.g. 'https://www.linkedin.com/in/your-name'
    x: '',
    instagram: '',
    youtube: '',
  },
};

export const formatDate = (s) =>
  new Date(s).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export const readingTime = (text) => Math.max(1, Math.round(text.split(/\s+/).length / 200));
