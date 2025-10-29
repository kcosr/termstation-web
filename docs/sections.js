const TERMSTATION_SECTIONS = [
  {
    id: 'overview',
    eyebrow: 'Introducing TermStation',
    title: 'Take control of your terminal sessions',
    description:
      'One workspace, accessible from all of your devices. Self-hosted. Programmable web API. Secure container support. Build for everyday terminal use or AI workflows.',
    actions: [
      { label: 'View FAQ', href: 'faq.html', variant: 'primary' },
    ],
    media: [
      {
        type: 'image',
        src: 'assets/termstation-interface.png',
        alt: 'TermStation terminal interface showing multiple persistent sessions.',
      },
      {
        type: 'image',
        src: 'assets/termstation-mobile.png',
        alt: 'TermStation mobile interface.',
      },
    ],
  },
];

if (typeof window !== 'undefined') {
  window.TERMSTATION_SECTIONS = TERMSTATION_SECTIONS;
}
