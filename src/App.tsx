import { useEffect, useState } from 'react';
import { SettingsOverlay } from '@/components/settings-overlay';
import { useApplyTheme } from '@/hooks/use-apply-theme';
import { formatLeft, isRipe } from '@/lib/hold';
import { useSoiStore } from '@/store/soi-store';

let idCounter = 0;
function newId(): string {
  idCounter += 1;
  return `i${Date.now()}-${idCounter}`;
}

export function App() {
  useApplyTheme();
  const { holdHrs, currency, theme } = useSoiStore((state) => state.settings);
  const items = useSoiStore((state) => state.items);
  const kept = useSoiStore((state) => state.kept);
  const addItem = useSoiStore((state) => state.addItem);
  const decide = useSoiStore((state) => state.decide);
  const setTheme = useSoiStore((state) => state.setTheme);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [why, setWhy] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  function add() {
    if (!name.trim()) {
      return;
    }
    addItem(name.trim(), parseFloat(price) || 0, why.trim(), Date.now(), newId());
    setName('');
    setPrice('');
    setWhy('');
  }

  return (
    <div className="app">
      <div className="col">
        <button
          className="corner corner-l"
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          ⚙
        </button>
        <button
          className="corner"
          type="button"
          onClick={() => setTheme(theme === 'calm' ? 'light' : 'calm')}
          aria-label="Theme"
        >
          {theme === 'calm' ? '☀' : '☾'}
        </button>

        <div className="head">
          <h1 className="word">Sleep On It</h1>
          {kept > 0 && (
            <span className="saved-pill">
              {currency}
              {kept.toFixed(0)} not spent
            </span>
          )}
        </div>
        <p className="tag">
          Want to buy something? Park it here for {holdHrs}h. If you still want it tomorrow,
          it&rsquo;s probably real.
        </p>

        <div className="add rise">
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What do you want to buy?"
            aria-label="What do you want to buy?"
          />
          <div className="row">
            <input
              className="field"
              style={{ flex: '0 0 110px' }}
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder={`${currency} price`}
              aria-label="Price"
              inputMode="decimal"
            />
            <input
              className="field"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Why do you want it?"
              aria-label="Why do you want it?"
            />
          </div>
          <button className="cta" type="button" onClick={add} disabled={!name.trim()}>
            Sleep on it
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <div className="label">On hold</div>
            {items.map((item) => {
              const ripe = isRipe(item, holdHrs, now);
              const left = formatLeft(item, holdHrs, now);
              return (
                <div key={item.id} className={'item rise' + (ripe ? ' ready' : '')}>
                  <div className="it-top">
                    <span className="it-name">{item.name}</span>
                    {item.price > 0 && (
                      <span className="it-price">
                        {currency}
                        {item.price.toFixed(0)}
                      </span>
                    )}
                  </div>
                  {item.why && <p className="it-why">&ldquo;{item.why}&rdquo;</p>}
                  {ripe ? (
                    <>
                      <div className="it-count" style={{ color: 'var(--accent)' }}>
                        The wait&rsquo;s over. Do you still want it?
                      </div>
                      <div className="it-acts">
                        <button
                          className="mini skip"
                          type="button"
                          onClick={() => decide(item.id, false)}
                        >
                          Let it go
                        </button>
                        <button
                          className="mini"
                          type="button"
                          onClick={() => decide(item.id, true)}
                        >
                          Buy it
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="it-count">⏳ {left} · sit with it</div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div className="empty">
            Nothing on hold. Next time you feel the urge to buy, bring it here first.
          </div>
        )}
      </div>

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
