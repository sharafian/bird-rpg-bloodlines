
import { Traits, MAX_VALUE } from '../types/Traits'
import { Desires } from '../types/Desires'
import { Item, ITEM_WEIGHT, ItemTypes } from '../types/Item'

const MARGIN_OF_VARIATION = MAX_VALUE / 8

function randInt (min: number, max: number): number {
  const min = Math.ceil(min)
  const max = Math.floor(max)
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min
}

export function generateDesires (traits: Traits): Desires {
  // int of maximum number of items that are possible to carry
  const maxDesiredItemsPossible = Math.floor(MAX_VALUE / ITEM_WEIGHT)
  // random variation is +/- rand <= MARGIN_OF_VARIATION
  const beautyVariation = randInt(
    -1 * MARGIN_OF_VARIATION,
    MARGIN_OF_VARIATION + 1
  )
  // float between (0, 1]
  const normalizedBeautyScore = traits.beauty + beautyVariation / MAX_VALUE
  const numDesiredItems = Math.floor(
    maxDesiredItemsPossible * normalizedBeautyScore
  )
  const desiredItems = [...Array(numDesiredItems)].map(() => {
    return ItemTypes[randInt(0, ItemTypes.length)]
  })

  const speedVariation = randInt(
    -1 * MARGIN_OF_VARIATION,
    MARGIN_OF_VARIATION + 1
  )
  const desiredBeautyScore = traits.speed + speedVariation

  return {
    items: desiredItems,
    minBeauty: desiredBeautyScore
  }
}

// takes the traits of the character and generates a bird with 
export function generateTraits (traits: )
