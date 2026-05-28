export type EventType = {
  id: string
  label: string
  title: string
  description: string
}

export const eventTypes: EventType[] = [
  {
    id: 'firma',
    label: 'Firma',
    title: 'På arbejdet',
    description:
      'Morgenmøde, messe eller sommerfest. Vi sætter op, holder flow i køen og sørger for, at kaffen er klar, når folk kommer.',
  },
  {
    id: 'privat',
    label: 'Fest',
    title: 'Private dage',
    description:
      'Bryllup, konfirmation eller havefest. God kaffe tæt på – uden at overdøve dagen.',
  },
  {
    id: 'ude',
    label: 'Ude',
    title: 'Markeder og gader',
    description:
      'Festival, marked eller gadefest. Vi finder pladsen, holder tempo og smiler stadig, når det bliver travlt.',
  },
]
