import { useMemo, useState } from 'react';
import './App.css';
import type { Basket, GroceryItem, UserPreferences } from './recommendation';
import { generateBasket, getAvailableStores } from './recommendation';

const dietaryOptions = ['Vegetarian', 'High fiber', 'Low sodium', 'Dairy-free'];
const cookingOptions = ['Beginner cook', 'Microwave only', '15-minute meals'];
const keyConsiderationOptions = ['No ultra-processed meals', 'Cook once, eat twice', 'Short lunch breaks'];
const avoidOptions = ['Pork', 'Tuna', 'Peanut butter', 'Eggs'];

const initialPreferences: UserPreferences = {
  zipCode: '30022',
  weeklyBudget: 55,
  householdSize: 2,
  days: 7,
  dietaryNeeds: [],
  dislikes: [],
  cookingLimitations: [],
  keyConsiderations: ['No ultra-processed meals'],
  preferredStore: 'ALDI',
};

const presetMealSets = [
  {
    title: 'Rice bowl week',
    promise: 'Beans, veg, eggs, salsa-ish pantry staples. Cheap, filling, real food.',
    sections: ['Produce', 'Protein', 'Pantry', 'Condiments'],
  },
  {
    title: 'Soup + leftovers',
    promise: 'One pot, two dinners, one lunch. Built around carrots, lentils, tomatoes.',
    sections: ['Produce', 'Dry goods', 'Spices'],
  },
  {
    title: 'Breakfast that cooks itself',
    promise: 'Oats, bananas, yogurt, peanut butter swaps. No breakfast bars required.',
    sections: ['Fruit', 'Breakfast', 'Protein'],
  },
];

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function aisleBuckets(items: GroceryItem[]) {
  return [
    {
      label: 'Produce section grab',
      emoji: '🥬',
      cue: 'Start here. Build color before buying boxes.',
      items: items.filter((item) => item.category === 'produce' || item.tags.includes('fruit')).slice(0, 4),
    },
    {
      label: 'Meat counter / protein grab',
      emoji: '🍳',
      cue: 'Flexible protein: eggs, beans, lentils, tuna, yogurt — based on preferences.',
      items: items.filter((item) => item.category === 'protein' || item.category === 'dairy').slice(0, 4),
    },
    {
      label: 'Condiments + spices',
      emoji: '🌶️',
      cue: 'Tiny flavor budget so staples do not taste like punishment.',
      items: [
        { id: 'hot-sauce', name: 'Hot sauce or salsa', quantity: '1 bottle/jar', estimatedPrice: 2.49, servings: 12, category: 'pantry' as const, tags: [], why: 'Makes rice, beans, eggs, and potatoes feel like meals.' },
        { id: 'garlic', name: 'Garlic powder', quantity: '1 shaker', estimatedPrice: 1.39, servings: 20, category: 'pantry' as const, tags: [], why: 'Cheap flavor multiplier.' },
        { id: 'oil', name: 'Olive or vegetable oil', quantity: '1 small bottle', estimatedPrice: 3.29, servings: 18, category: 'pantry' as const, tags: [], why: 'Needed for simple cooking.' },
      ],
    },
    {
      label: 'Pantry + staples grab',
      emoji: '🍚',
      cue: 'The base layer: cheap calories you can actually cook.',
      items: items.filter((item) => ['grain', 'pantry', 'breakfast'].includes(item.category)).slice(0, 5),
    },
  ];
}

function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [basket, setBasket] = useState<Basket>(() => generateBasket(initialPreferences));
  const availableStores = useMemo(() => getAvailableStores(preferences.zipCode), [preferences.zipCode]);
  const buckets = useMemo(() => aisleBuckets(basket.items), [basket.items]);

  function updatePreference<Key extends keyof UserPreferences>(key: Key, value: UserPreferences[Key]) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function buildBasket() {
    setBasket(generateBasket(preferences));
  }

  return (
    <main className="app-shell">
      <section className="teaser-hero" aria-labelledby="app-title">
        <div className="hero-copy-block">
          <p className="eyebrow">grocery concierge</p>
          <h1 id="app-title">An app that turns real ingredients into healthy meals.</h1>
          <p className="hero-copy">
            find what to cook with ingredients available in your local grocery store, built around your budget
          </p>
          <div className="manifesto-card">
            <strong>Walk in with a plan:</strong>
            <span>Produce grab → protein grab → pantry staples → simple meals.</span>
          </div>
          <div className="trust-strip" aria-label="What this helper does">
            <span>Preset healthy meal lists</span>
            <span>Ingredient-by-aisle guidance</span>
            <span>Less ultra-processed defaulting</span>
          </div>
        </div>

        <aside className="x-shot" aria-label="Shareable preview card for X">
          <div className="x-shot-top">
            <span>Grocery OS</span>
            <b>{basket.store.split(' - ')[0]}</b>
          </div>
          <h2>What are we cooking this week?</h2>
          <div className="route-line">
            {['Produce', 'Protein', 'Spices', 'Staples'].map((stop) => <span key={stop}>{stop}</span>)}
          </div>
          <div className="mini-list">
            <p><b>Tonight:</b> Rice & bean bowl</p>
            <p><b>Tomorrow:</b> Tomato pasta + veg</p>
            <p><b>Breakfast:</b> Oats, banana, yogurt</p>
          </div>
          <small>Real food, less guesswork, under ${basket.budget.toFixed(0)}/week.</small>
        </aside>
      </section>

      <section className="concept-grid" aria-label="Product concept">
        <article className="why-card">
          <p className="eyebrow">The wedge</p>
          <h2>People do not need another premium grocery aesthetic.</h2>
          <p>
            They need a store layer that says: grab these ingredients, cook these meals, avoid turning hunger into a cart full of ultra-processed shortcuts.
          </p>
        </article>
        <article className="why-card dark">
          <p className="eyebrow">MVP behavior</p>
          <h2>Preset meal kits without the meal-kit markup.</h2>
          <p>Choose a weekly cooking path. The app maps it to sections of the store, budget guardrails, and beginner-simple instructions.</p>
        </article>
      </section>

      <section className="workspace-grid">
        <section className="planner-card" aria-labelledby="planner-title">
          <div className="section-heading">
            <p className="eyebrow">Build a teaser basket</p>
            <h2 id="planner-title">Pick constraints, then get a store route.</h2>
            <p>Tap options instead of typing. The UI should feel useful in an aisle, not like homework.</p>
          </div>

          <div className="form-grid">
            <label>
              ZIP code
              <input value={preferences.zipCode} onChange={(event) => updatePreference('zipCode', event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Weekly budget
              <input value={preferences.weeklyBudget} onChange={(event) => updatePreference('weeklyBudget', Number(event.target.value) || 0)} type="number" min="1" />
            </label>
            <label>
              Household size
              <input value={preferences.householdSize} onChange={(event) => updatePreference('householdSize', Number(event.target.value) || 1)} type="number" min="1" />
            </label>
            <label>
              Preferred store
              <select value={preferences.preferredStore} onChange={(event) => updatePreference('preferredStore', event.target.value)}>
                {availableStores.map((store) => <option key={store.id} value={store.brand}>{store.name}</option>)}
              </select>
            </label>
          </div>

          <fieldset className="chip-group">
            <legend>Preset cooking lanes</legend>
            {presetMealSets.map((mealSet) => (
              <button key={mealSet.title} className="meal-preset" type="button" onClick={() => updatePreference('keyConsiderations', toggleValue(preferences.keyConsiderations, mealSet.title))}>
                <strong>{mealSet.title}</strong>
                <span>{mealSet.promise}</span>
              </button>
            ))}
          </fieldset>

          <fieldset className="chip-group compact">
            <legend>Food preferences</legend>
            {[...dietaryOptions, ...cookingOptions, ...keyConsiderationOptions].map((option) => {
              const target = dietaryOptions.includes(option) ? 'dietaryNeeds' : cookingOptions.includes(option) ? 'cookingLimitations' : 'keyConsiderations';
              const selected = preferences[target].includes(option);
              return (
                <button key={option} className={selected ? 'chip selected' : 'chip'} type="button" onClick={() => updatePreference(target, toggleValue(preferences[target], option))}>
                  {option}
                </button>
              );
            })}
          </fieldset>

          <fieldset className="chip-group compact">
            <legend>Foods to avoid</legend>
            {avoidOptions.map((option) => (
              <button key={option} className={preferences.dislikes.includes(option) ? 'chip selected warning' : 'chip'} type="button" onClick={() => updatePreference('dislikes', toggleValue(preferences.dislikes, option))}>
                {option}
              </button>
            ))}
          </fieldset>

          <button className="primary-button" type="button" onClick={buildBasket}>Build my store route</button>
        </section>

        <aside className="store-card" aria-label="Pilot stores">
          <p className="eyebrow">Pilot shelf map</p>
          <h2>30022 stores</h2>
          <div className="store-stack">
            {basket.nearbyStores.slice(0, 4).map((store) => (
              <article key={store.id} className={store.name === basket.store ? 'store-row active' : 'store-row'}>
                <div><strong>{store.name}</strong><span>{store.notes}</span></div>
                <b>{store.distanceMiles.toFixed(1)} mi</b>
              </article>
            ))}
          </div>
          <small>{basket.dataFreshness}</small>
        </aside>
      </section>

      <section className="route-board" aria-live="polite">
        <div className="route-header">
          <div>
            <p className="eyebrow">Aisle-by-aisle answer</p>
            <h2>Grab this. Cook that.</h2>
          </div>
          <div className="budget-pill">${basket.estimatedTotal.toFixed(2)} estimate · ${basket.budgetBuffer.toFixed(2)} buffer</div>
        </div>
        <div className="aisle-grid">
          {buckets.map((bucket, index) => (
            <article key={bucket.label} className="aisle-card">
              <div className="aisle-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="aisle-title"><span>{bucket.emoji}</span><h3>{bucket.label}</h3></div>
              <p>{bucket.cue}</p>
              <ul>
                {bucket.items.map((item) => <li key={item.id}><strong>{item.name}</strong><span>{item.quantity}</span></li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="results-grid">
        <article className="list-card meals-feature">
          <p className="eyebrow">Preset meals</p>
          <h2>Healthy cooking paths, not random recipes.</h2>
          <div className="meal-stack">
            {basket.meals.map((meal, index) => (
              <section key={meal.title} className="meal-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{meal.title}</h3>
                <p>{meal.timeMinutes} minutes · uses {meal.ingredients.slice(0, 3).join(', ')}</p>
                <ol>{meal.steps.map((step) => <li key={step}>{step}</li>)}</ol>
              </section>
            ))}
          </div>
        </article>

        <article className="list-card">
          <p className="eyebrow">Positioning copy</p>
          <h2>Teaseable one-liners</h2>
          <ul className="plain-list">
            <li>“What if the grocery store helped you cook instead of just sell?”</li>
            <li>“Meal kits without the markup: aisle-by-aisle real food guidance.”</li>
            <li>“Less ultra-processed defaulting. More: grab this, cook that.”</li>
            {basket.explanation.slice(0, 2).map((line) => <li key={line}>{line}</li>)}
          </ul>
        </article>
      </section>
    </main>
  );
}

export default App;
