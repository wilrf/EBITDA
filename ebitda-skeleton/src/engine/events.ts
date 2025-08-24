import type { ActiveEvent, EventDeck, GameState } from './types'

export function spawnEventFromDeck(state: GameState, deck: EventDeck, eventId: string, dealId?: string) {
  const card = deck.events.find(e => e.id === eventId)
  if (!card) return
  state.activeEvents.push({
    id: `${eventId}_${state.day}`,
    card,
    endsOnDay: state.day + card.timer_days,
    dealId
  })
}

export function advanceEvents(state: GameState) {
  // remove expired for now (skeleton)
  state.activeEvents = state.activeEvents.filter(ev => ev.endsOnDay > state.day)
}
