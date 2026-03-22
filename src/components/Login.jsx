export function Login({ onLogin }) {
    return (
        <div className="center">
            <div className="card">
                <h1>LoL Skins Tracker</h1>
                <p className="muted">Marque os campeões que você tem skin</p>
                <button onClick={onLogin}>Entrar com Google</button>
            </div>
        </div>
    );
}
