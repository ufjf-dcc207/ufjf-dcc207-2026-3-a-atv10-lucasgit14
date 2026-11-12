export const TUBE_CAPACITY = 4
export const TUBE_COUNT = 6

export const COLORS = {
  coral: { label: 'coral', value: '#ff6b5f' },
  yellow: { label: 'amarelo', value: '#ffc857' },
  blue: { label: 'azul', value: '#4d9de0' },
  purple: { label: 'roxo', value: '#9b72cf' },
} as const

export type ColorId = keyof typeof COLORS
export type Tube = ColorId[]
export type Board = Tube[]

export interface GameSnapshot {
  board: Board
  moves: number
}

export interface GameState {
  board: Board
  initialBoard: Board
  selectedTube: number | null
  moves: number
  history: GameSnapshot[]
  message: string
}

export type GameAction =
  | { type: 'select-tube'; index: number }
  | { type: 'undo' }
  | { type: 'restart' }
  | { type: 'new-game' }

const shuffle = <T,>(items: T[]): T[] => {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

export const createBoard = (): Board => {
  const balls = shuffle<ColorId>([
    'coral',
    'coral',
    'coral',
    'coral',
    'yellow',
    'yellow',
    'yellow',
    'yellow',
    'blue',
    'blue',
    'blue',
    'blue',
    'purple',
    'purple',
    'purple',
    'purple',
  ])
  const board: Board = Array.from({ length: TUBE_COUNT }, () => [])

  balls.forEach((color, index) => {
    board[Math.floor(index / TUBE_CAPACITY)].push(color)
  })

  return board
}

export const isBoardSolved = (board: Board): boolean =>
  board.every(
    (tube) =>
      tube.length === 0 ||
      (tube.length === TUBE_CAPACITY &&
        tube.every((color) => color === tube[0])),
  )

export const createInitialState = (): GameState => {
  const board = createBoard()

  return {
    board,
    initialBoard: board.map((tube) => [...tube]),
    selectedTube: null,
    moves: 0,
    history: [],
    message: 'Escolha um tubo para começar',
  }
}

const copyBoard = (board: Board): Board => board.map((tube) => [...tube])

const selectTube = (state: GameState, index: number): GameState => {
  if (isBoardSolved(state.board)) {
    return state
  }

  const clickedTube = state.board[index]
  const selectedIndex = state.selectedTube

  if (selectedIndex === null) {
    if (clickedTube.length === 0) {
      return { ...state, message: 'Escolha primeiro um tubo com bolas' }
    }

    return {
      ...state,
      selectedTube: index,
      message: 'Agora escolha um tubo da mesma cor ou vazio',
    }
  }

  if (selectedIndex === index) {
    return { ...state, selectedTube: null, message: 'Seleção cancelada' }
  }

  const sourceTube = state.board[selectedIndex]
  const targetTube = clickedTube
  const movingColor = sourceTube[sourceTube.length - 1]
  const targetColor = targetTube[targetTube.length - 1]

  if (
    movingColor === undefined ||
    targetTube.length >= TUBE_CAPACITY ||
    (targetColor !== undefined && targetColor !== movingColor)
  ) {
    return {
      ...state,
      message: 'Só pode mover para um tubo vazio ou com a mesma cor',
    }
  }

  const board = copyBoard(state.board)
  board[selectedIndex].pop()
  board[index].push(movingColor)

  const moves = state.moves + 1
  const won = isBoardSolved(board)

  return {
    ...state,
    board,
    selectedTube: null,
    moves,
    history: [...state.history, { board: copyBoard(state.board), moves: state.moves }],
    message: won ? 'Parabéns! Você organizou todas as cores!' : 'Boa! Continue assim',
  }
}

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'select-tube':
      return selectTube(state, action.index)
    case 'undo': {
      const previous = state.history[state.history.length - 1]
      if (previous === undefined) {
        return state
      }

      return {
        ...state,
        board: copyBoard(previous.board),
        selectedTube: null,
        moves: previous.moves,
        history: state.history.slice(0, -1),
        message: 'Último movimento desfeito',
      }
    }
    case 'restart':
      return {
        ...state,
        board: copyBoard(state.initialBoard),
        selectedTube: null,
        moves: 0,
        history: [],
        message: 'Partida reiniciada',
      }
    case 'new-game':
      return createInitialState()
  }
}
