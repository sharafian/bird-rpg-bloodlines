export interface Entity {
  preload (): void
  create (): void
  update (): void
  getPosition (): void
}
