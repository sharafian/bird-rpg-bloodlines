export const ItemTypes: Item[] = [
  { name: 'rock', asset: 'assets/hatch.png', equals: (x) => x.name === 'rock' },
  { name: 'stick', asset: 'assets/hatch.png', equals: (x) => x.name === 'stick' }
]
export const ITEM_WEIGHT = 10

export interface Item {
  equals (item: Item): boolean
  name: string
  asset: string
}
