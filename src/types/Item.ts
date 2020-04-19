export const ItemTypes: Item[] = []
export const ITEM_WEIGHT = 10

export interface Item {
  equals (item: Item): boolean
  name: string
  asset: string
}
