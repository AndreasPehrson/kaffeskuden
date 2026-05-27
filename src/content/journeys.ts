import { images } from './assets'

export type JourneyChapter = {
  id: string
  step: string
  title: string
  lead: string
  body: string
  image: string
  imageAlt: string
}

/** Placeholder chapters - replace copy as journeys are documented. */
export const journeyChapters: JourneyChapter[] = [
  {
    id: 'origine',
    step: '01',
    title: 'Der hvor det begynder',
    lead: 'Farme, høst og første hånd på bønnen.',
    body:
      'Vi starter ikke med emner på en pose. Vi starter med mennesker, højde, jord og årstid. Her kommer historien om, hvordan vi finder de steder, vi vil rejse tilbage til.',
    image: images.beans,
    imageAlt: 'Rå kaffebønner i hånden',
  },
  {
    id: 'smag',
    step: '02',
    title: 'Smag først',
    lead: 'Cupping, noter og et roligt nej.',
    body:
      'Vi smager os frem uden stress. Nogle lotter falder fra med det samme. Andre bliver hængende, fordi de er behagelige at brygge på og stadig smager af noget dagen efter.',
    image: images.gallery.tasting,
    imageAlt: 'Smagning af kaffe',
  },
  {
    id: 'relationer',
    step: '03',
    title: 'Folk vi stoler på',
    lead: 'Producenter og risterier vi kender i øjenhøjde.',
    body:
      'Langsigtede relationer betyder mere end et smart label. Vi vil vide, hvem der står bag, og hvordan arbejdet fordeler sig - så vi kan fortælle det videre uden at overdrive.',
    image: images.gallery.barista,
    imageAlt: 'Barista ved Kaffeskuden',
  },
  {
    id: 'vejen-hjem',
    step: '04',
    title: 'Vejen hjem til skuden',
    lead: 'Fra risteri til espressomaskine på hjul.',
    body:
      'Når bønnerne lander hos os, handler det om friskhed, kværn og ro i serveringen. Samme respekt som på rejsen - bare med musik og gæster foran.',
    image: images.gallery.truck,
    imageAlt: 'Kaffeskuden på lokation',
  },
]
