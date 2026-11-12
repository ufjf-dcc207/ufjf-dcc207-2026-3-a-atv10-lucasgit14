import { createContext, useContext, type Dispatch } from 'react'
import type { GameAction, GameState } from './game'

interface GameContextValue {
  state: GameState
  dispatch: Dispatch<GameAction>
}

export const GameContext = createContext<GameContextValue | null>(null)

export function useGame() {
  const context = useContext(GameContext)

  if (context === null) {
    throw new Error('useGame deve ser usado dentro de GameProvider')
  }

  return context
}
