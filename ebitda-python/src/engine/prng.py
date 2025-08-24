"""Simple Mulberry32 PRNG implementation for deterministic random generation."""
from typing import List, TypeVar
import math

T = TypeVar('T')


class PRNG:
    """Deterministic pseudo-random number generator using Mulberry32 algorithm."""
    
    def __init__(self, seed: int):
        """Initialize PRNG with a seed value."""
        self._state = seed & 0xFFFFFFFF  # Ensure 32-bit unsigned
        
    def next(self) -> float:
        """Generate next random number in range [0, 1)."""
        # Mulberry32 algorithm implementation
        self._state = (self._state + 0x6D2B79F5) & 0xFFFFFFFF
        
        t = self._state
        t = self._multiply_uint32(t ^ (t >> 15), t | 1)
        t ^= t + self._multiply_uint32(t ^ (t >> 7), t | 61)
        
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    
    def _multiply_uint32(self, a: int, b: int) -> int:
        """Multiply two 32-bit unsigned integers."""
        # Math.imul equivalent for 32-bit signed multiplication
        return ((a * b) & 0xFFFFFFFF)
    
    def pick(self, arr: List[T]) -> T:
        """Pick a random element from the array."""
        if not arr:
            raise ValueError("Cannot pick from empty array")
        return arr[math.floor(self.next() * len(arr))]
    
    def range(self, min_val: float, max_val: float) -> float:
        """Generate random number in range [min_val, max_val)."""
        return min_val + (max_val - min_val) * self.next()