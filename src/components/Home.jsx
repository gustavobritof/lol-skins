export function Home({
    user,
    search,
    setSearch,
    laneFilter,
    setLaneFilter,
    skinFilter,
    setSkinFilter,
    visibleChampions,
    owned,
    ownedCount,
    totalChampions,
    completion,
    championsLoading,
    championsError,
    onToggleChampion,
    onSignOut,
}) {
    const photoUrl = user?.photoURL || user?.providerData?.[0]?.photoURL;
    const displayName = user?.displayName || user?.providerData?.[0]?.displayName || user?.email;

    return (
        <div className="container">
            <header className="header-main">
                <div>
                    <h1>LoL Skins Tracker</h1>
                    <div className="progress">
                        <div
                            title={`${ownedCount} / ${totalChampions} campeões com skin`}
                            className="progress-fill"
                            style={{
                                width: `${completion}%`,
                            }}
                        />
                    </div>
                    <div className="muted">
                        {completion.toFixed(1)}% de campeões com skins ({ownedCount} / {totalChampions})
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {user && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {photoUrl && (
                                <img
                                    src={photoUrl}
                                    alt={displayName || "Avatar"}
                                    style={{ width: 32, height: 32, borderRadius: "50%" }}
                                />
                            )}
                            <span className="muted" style={{ fontSize: 14 }}>
                                {displayName}
                            </span>
                        </div>
                    )}

                    <button className="secondary" onClick={onSignOut}>
                        Sair
                    </button>
                </div>
            </header>

            <div className="filters">
                <input
                    placeholder="Buscar campeão..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <div className="lanes">
                    {["All", "Top", "Mid", "Bot", "Support"].map((lane) => (
                        <button
                            key={lane}
                            className={laneFilter === lane ? "active" : ""}
                            onClick={() => setLaneFilter(lane)}
                        >
                            {lane}
                        </button>
                    ))}
                </div>

                <div className="skins-filter">
                    {[
                        { label: "Todos", value: "All" },
                        { label: "Com skin", value: "Owned" },
                        { label: "Sem skin", value: "Missing" },
                    ].map((option) => (
                        <button
                            key={option.value}
                            className={skinFilter === option.value ? "active" : ""}
                            onClick={() => setSkinFilter(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {championsLoading && (
                <p className="muted">Carregando lista de campeões...</p>
            )}
            {championsError && (
                <p className="muted" role="alert">{championsError}</p>
            )}

            <div className="grid">
                {visibleChampions.map((champion) => {
                    const hasSkin = owned[champion.id];

                    return (
                        <label
                            key={champion.id}
                            className={`champion ${hasSkin ? "owned" : ""}`}
                        >
                            <img src={champion.image} alt={champion.name} />
                            <div className="champion-footer">
                                <span>{champion.name}</span>
                                <input
                                    type="checkbox"
                                    checked={hasSkin || false}
                                    onChange={() => onToggleChampion(champion.id)}
                                />
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
