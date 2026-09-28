// Public details shown on the site. The personal email address is deliberately
// NOT published: enquiries arrive through the appointment form, which delivers
// to CONTACT_EMAIL (a private server setting), and replies are sent personally.
export const site = {
  url: 'https://drpakataridis.com',
  phone: null as string | null, // e.g. '+30 69X XXX XXXX' — leave null to keep private
};

export const PRACTICES = ['business', 'medicine', 'education'] as const;
export type Practice = (typeof PRACTICES)[number];

export const TOPICS = ['medical', 'academic', 'business', 'other'] as const;
export type Topic = (typeof TOPICS)[number];
