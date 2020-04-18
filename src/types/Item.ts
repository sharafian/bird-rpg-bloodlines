export const ItemTypes: Item[] = []
export const ITEM_WEIGHT = 10

export interface Item {
  equals (Item): boolean
  name: string
  asset: string
}
