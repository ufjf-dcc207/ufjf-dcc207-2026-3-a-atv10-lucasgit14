import { useGame } from './GameContext'
import { GameProvider } from './GameProvider'
import { COLORS, TUBE_CAPACITY } from './game'
import './App.css'

function MagicSortGame() {
  const { state, dispatch } = useGame()
  const isWon = state.message.startsWith('Parabéns!')

  return (
    <main className="game-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Magic Sort, início">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>magic<span className="brand-light">sort</span></span>
        </a>
        <span className="topbar-note">um intervalo para a mente</span>
      </header>

      <section className="game-content" id="inicio">
        <div className="intro">
          <span className="eyebrow"><span aria-hidden="true">✳</span> ORGANIZE AS CORES</span>
          <h1>Um tubo de cada vez.</h1>
          <p>Separe as cores até deixar cada tubo completo com uma só cor.</p>
        </div>

        <section className="game-card" aria-label="Jogo Magic Sort">
          <div className="game-toolbar">
            <div className="game-stats" aria-label={`Movimentos: ${state.moves}`}>
              <span className="stat-label">MOVIMENTOS</span>
              <span className="stat-value">{String(state.moves).padStart(2, '0')}</span>
            </div>
            <div className="toolbar-actions">
              <button
                className="icon-button"
                type="button"
                onClick={() => dispatch({ type: 'undo' })}
                disabled={state.history.length === 0}
                aria-label="Desfazer último movimento"
                title="Desfazer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-2" />
                </svg>
              </button>
              <button
                className="text-button"
                type="button"
                onClick={() => dispatch({ type: 'restart' })}
              >
                Reiniciar
              </button>
              <button
                className="new-game-button"
                type="button"
                onClick={() => dispatch({ type: 'new-game' })}
              >
                <span aria-hidden="true">＋</span> Novo jogo
              </button>
            </div>
          </div>

          <div className={`game-message${isWon ? ' game-message-won' : ''}`} role="status" aria-live="polite">
            <span className="message-sparkle" aria-hidden="true">{isWon ? '✦' : '✳'}</span>
            {state.message}
          </div>

          <div className="board" aria-label="Tabuleiro com seis tubos">
            {state.board.map((tube, tubeIndex) => (
              <button
                aria-label={`Tubo ${tubeIndex + 1}, ${tube.length} de ${TUBE_CAPACITY} bolas${state.selectedTube === tubeIndex ? ', selecionado' : ''}`}
                aria-pressed={state.selectedTube === tubeIndex}
                className={`tube${state.selectedTube === tubeIndex ? ' tube-selected' : ''}${tube.length === TUBE_CAPACITY ? ' tube-full' : ''}`}
                key={tubeIndex}
                onClick={() => dispatch({ type: 'select-tube', index: tubeIndex })}
                type="button"
              >
                <span className="tube-neck" aria-hidden="true" />
                <span className="tube-glass">
                  {Array.from({ length: TUBE_CAPACITY }, (_, slotIndex) => {
                    const color = tube[slotIndex]

                    return (
                      <span
                        aria-hidden="true"
                        className={`ball-slot${color === undefined ? ' ball-slot-empty' : ''}`}
                        key={slotIndex}
                        style={color === undefined ? undefined : { backgroundColor: COLORS[color].value }}
                      />
                    )
                  })}
                </span>
                <span className="tube-number">{String(tubeIndex + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <div className="game-footer">
            <div className="color-key" aria-label="Cores do jogo">
              {Object.entries(COLORS).map(([color, details]) => (
                <span className="color-key-item" key={color}>
                  <span className="color-dot" style={{ backgroundColor: details.value }} />
                  {details.label}
                </span>
              ))}
            </div>
            <p><kbd>CLIQUE</kbd> em dois tubos para mover uma bola</p>
          </div>
        </section>

        <footer className="page-footer">
          <span>Respire fundo. Encontre seu ritmo.</span>
          <span className="footer-decoration" aria-hidden="true">✳</span>
        </footer>
      </section>
    </main>
  )
}

function App() {
  return (
    <GameProvider>
      <MagicSortGame />
    </GameProvider>
  )
}

export default App
