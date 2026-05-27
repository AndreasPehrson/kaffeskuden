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
      'Morgenmøde, messe eller sommerfest på pladsen. Vi kører ind, sætter op, og kaffen er klar, når folk dukker op.',
  },
  {
    id: 'privat',
    label: 'Fest',
    title: 'Private dage',
    description:
      'Bryllup, konfirmation eller havefest. En god kop i nærheden - uden at stjæle opmærksomheden fra jer.',
  },
  {
    id: 'ude',
    label: 'Ude',
    title: 'Markeder og gader',
    description:
      'Festival, marked eller gadefest. Vi kan finde plads, holde ro i køen og stadig smile, når det bliver travlt.',
  },
]
