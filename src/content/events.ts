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
      'Morgenmøde, messe eller sommerfest. Vi sætter op, holder køen i gang og sørger for, at kaffen er klar, når folk dukker op.',
  },
  {
    id: 'privat',
    label: 'Fest',
    title: 'Private dage',
    description:
      'Bryllup, konfirmation eller havefest. God kaffe tæt på gæsterne - uden at stjæle showet.',
  },
  {
    id: 'ude',
    label: 'Ude',
    title: 'Markeder og gader',
    description:
      'Festival, marked eller gadefest. Vi finder pladsen og holder tempo, også når køen bliver lang.',
  },
]
