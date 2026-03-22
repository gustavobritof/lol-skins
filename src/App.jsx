import { useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, provider, db } from "./firebase";
import { Login } from "./components/Login";
import { Home } from "./components/Home";

const DATA_DRAGON_VERSION = "14.2.1";
const CHAMPION_LIST_URL = `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/data/pt_BR/champion.json`;
const CHAMPION_IMAGE_URL = (id) =>
  `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img/champion/${id}.png`;

const TAG_TO_LANE = {
  Mage: "Mid",
  Assassin: "Mid",
  Marksman: "Bot",
  Support: "Support",
  Tank: "Top",
  Fighter: "Top",
};

export default function App() {
  const [user, setUser] = useState(null);
  const [owned, setOwned] = useState({});
  const [authLoading, setAuthLoading] = useState(true);
  const [champions, setChampions] = useState([]);
  const [championsLoading, setChampionsLoading] = useState(true);
  const [championsError, setChampionsError] = useState("");
  const [search, setSearch] = useState("");
  const [laneFilter, setLaneFilter] = useState("All");
  const [skinFilter, setSkinFilter] = useState("All");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);

        if (!currentUser) {
          setOwned({});
          return;
        }

        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setOwned(snap.data().champions || {});
        } else {
          await setDoc(ref, { champions: {} });
          setOwned({});
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    async function loadChampions() {
      try {
        setChampionsLoading(true);
        setChampionsError("");

        const response = await fetch(CHAMPION_LIST_URL);
        if (!response.ok) {
          throw new Error("Não foi possível carregar os campeões.");
        }

        const data = await response.json();
        const list = Object.values(data.data).map((champion) => {
          const lanes = champion.tags
            .map((tag) => TAG_TO_LANE[tag])
            .filter(Boolean);

          return {
            id: champion.id,
            name: champion.name,
            image: CHAMPION_IMAGE_URL(champion.id),
            lanes: [...new Set(lanes)],
          };
        });

        setChampions(list);
      } catch (error) {
        console.error(error);
        setChampionsError("Ocorreu um erro ao carregar a lista de campeões.");
      } finally {
        setChampionsLoading(false);
      }
    }

    loadChampions();
  }, []);

  async function toggleChampion(id) {
    const updated = { ...owned, [id]: !owned[id] };
    setOwned(updated);

    try {
      await setDoc(
        doc(db, "users", user.uid),
        { champions: updated },
        { merge: true }
      );
    } catch (error) {
      console.error("Erro ao atualizar campeões do usuário:", error);
    }
  }

  async function handleLogin() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  }

  const totalChampions = champions.length;
  const ownedCount = Object.values(owned).filter(Boolean).length;
  const completion = totalChampions
    ? (ownedCount / totalChampions) * 100
    : 0;

  if (authLoading) {
    return <p style={{ padding: 40 }}>Carregando...</p>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const visible = champions.filter((champion) => {
    const hasSkin = !!owned[champion.id];

    const matchName = champion.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchLane =
      laneFilter === "All" || champion.lanes.includes(laneFilter);

    const matchSkin =
      skinFilter === "All" ||
      (skinFilter === "Owned" && hasSkin) ||
      (skinFilter === "Missing" && !hasSkin);

    return matchName && matchLane && matchSkin;
  });

  return (
    <Home
      user={user}
      search={search}
      setSearch={setSearch}
      laneFilter={laneFilter}
      setLaneFilter={setLaneFilter}
      skinFilter={skinFilter}
      setSkinFilter={setSkinFilter}
      visibleChampions={visible}
      owned={owned}
      ownedCount={ownedCount}
      totalChampions={totalChampions}
      completion={completion}
      championsLoading={championsLoading}
      championsError={championsError}
      onToggleChampion={toggleChampion}
      onSignOut={handleSignOut}
    />
  );
}