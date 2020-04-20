export const ItemTypes: Item[] = [
  { name: 'rock', asset: 'assets/items/rock.png' },
  { name: 'stick', asset: 'assets/items/stick.png' },
  { name: 'berry', asset: 'assets/items/berry.png' },
  { name: 'worm', asset: 'assets/items/worm.png' }
]
export const ITEM_WEIGHT = 10

export interface Item {
  name: string
  asset: string
}
