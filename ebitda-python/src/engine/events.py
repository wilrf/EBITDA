"""Event system for game events."""
from typing import List
from .models import GameState, ActiveEvent, EventDeck
from .prng import PRNG


def spawn_event_from_deck(prng: PRNG, deck: EventDeck, current_day: int) -> ActiveEvent:
    """Spawn a random event from an event deck.
    
    Args:
        prng: Random number generator
        deck: Event deck to choose from
        current_day: Current game day
        
    Returns:
        ActiveEvent instance
    """
    if not deck.events:
        raise ValueError("Cannot spawn event from empty deck")
    
    # Simple random selection for now
    card = prng.pick(deck.events)
    
    return ActiveEvent(
        id=f"evt_{current_day}_{card.id}",
        card=card,
        ends_on_day=current_day + card.timer_days
    )


def advance_events(state: GameState) -> None:
    """Advance all active events by one day.
    
    Args:
        state: Game state to modify
    """
    # Remove expired events
    state.active_events = [
        event for event in state.active_events
        if event.ends_on_day > state.day
    ]