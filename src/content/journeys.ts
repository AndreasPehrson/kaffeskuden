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

/** Placeholder chapters – replace with real stories as trips are documented. */
export const journeyChapters: JourneyChapter[] = [
  {
    id: 'origine',
    step: '01',
    title: 'Der hvor det begynder',
    lead: 'Farm, høst og hånden, der plukker første gang.',
    body:
      'Vi starter med jord, højde og årstid – og med folk, der kan fortælle, hvordan bønnen blev til. Det er grunden til, at vi rejser, og det er det, I smager senere.',
    image: images.beans,
    imageAlt: 'Rå kaffebønner i hånden',
  },
  {
    id: 'smag',
    step: '02',
    title: 'Smag først',
    lead: 'Cupping, noter og et roligt nej.',
    body:
      'Vi smager mange lotter og vælger få. Det skal passe til espresso på hjul: balanceret, tydeligt og stadig godt, når dagen er lang.',
    image: images.gallery.tasting,
    imageAlt: 'Smagning af kaffe',
  },
  {
    id: 'relationer',
    step: '03',
    title: 'Folk vi vender tilbage til',
    lead: 'Producenter og risterier i øjenhøjde.',
    body:
      'Vi arbejder med mennesker, vi kender – og kan stå inde for. Så kan vi fortælle jer, hvem der står bag koppen, uden at pynte på det.',
    image: images.gallery.barista,
    imageAlt: 'Barista ved Kaffeskuden',
  },
  {
    id: 'vejen-hjem',
    step: '04',
    title: 'Hjem til skuden',
    lead: 'Fra risteri til kop foran jer.',
    body:
      'Når bønnerne lander hos os, handler det om friskhed, kværn og ro i serveringen. Samme omhu som på rejsen – bare med musik og gæster foran.',
    image: images.gallery.truck,
    imageAlt: 'Kaffeskuden på lokation',
  },
]
