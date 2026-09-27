function HomePage({ tests, onStart }) {
  return (
    <div className="home-wrap">
      <h1 className="home-title serif-display">Учене на български език</h1>
      <p className="home-invite">Избери тест и започни.</p>

      <ul className="home-list">
        {tests.map((test) => (
          <li key={test.id} className="sentence-card home-card">
            <h2 className="home-test-title serif-display">{test.title}</h2>
            <button type="button" className="btn btn-restart" onClick={() => onStart(test.id)}>
              Започни
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { HomePage };
