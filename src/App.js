import React, { useState, useEffect } from "react";
// CORRECCIÓN: Eliminado 'Stars' que causaba el error y reemplazado por 'Sparkles'
import {
  Heart,
  Sparkles,
  Gift,
  Trophy,
  RefreshCw,
  Music,
  Brain,
  Camera,
  Cat,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";

const App = () => {
  // --- AUTO-CORRECCIÓN DE ESTILOS ---
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://cdn.tailwindcss.com"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const [scene, setScene] = useState("start");
  const [score, setScore] = useState(0);
  const [selectedReward, setSelectedReward] = useState(null);

  // --- TUS FOTOS (LOCALES) ---
  // Ahora apuntan a los archivos que subiste a la carpeta 'public'
  const TUS_FOTOS = {
    fase1: "/fase1.jpeg",
    fase2: "/fase2.jpeg", // Nota: El espacio en el nombre es importante
    fase3: "/fase3.jpeg",
    final: "/final.jpeg",
  };

  // Fotos para el juego de memoria (Se mantienen externas porque no vi que subieras 6 fotos extra)
  const MEMORY_PHOTOS = [
    "https://i.postimg.cc/5X4Hxnh9/11.jpg",
    "https://i.postimg.cc/hXDJSpkP/12.jpg",
    "https://i.postimg.cc/Yvr4pb5C/13.jpg",
    "https://i.postimg.cc/SnSXyDBK/14.jpg",
    "https://i.postimg.cc/1fcnhLj3/2.jpg",
    "https://i.postimg.cc/sv9QdtNX/5.jpg",
  ];

  const [fallingItems, setFallingItems] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [rhythmCount, setRhythmCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [revelationProgress, setRevelationProgress] = useState(0);

  // --- LÓGICA FASE 1 (Gatos) ---
  useEffect(() => {
    if (scene === "p1_game" && gameActive) {
      const interval = setInterval(() => {
        const isCat = Math.random() > 0.6;
        setFallingItems((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            type: isCat ? "cat" : "heart",
            left: Math.random() * 85,
            size: isCat ? 48 : 40,
            duration: isCat ? 2 : 3,
          },
        ]);
      }, 750);
      return () => clearInterval(interval);
    }
  }, [scene, gameActive]);

  const collectItem = (id) => {
    setScore((s) => s + 1);
    setFallingItems((prev) => prev.filter((i) => i.id !== id));
    if (score >= 9) {
      setGameActive(false);
      setScene("p1_photo");
    }
  };

  // --- LÓGICA FASE 2 (Memoria) ---
  const initMemoryGame = () => {
    const deck = [...MEMORY_PHOTOS, ...MEMORY_PHOTOS]
      .sort(() => Math.random() - 0.5)
      .map((imgUrl, index) => ({ id: index, img: imgUrl }));
    setCards(deck);
    setFlipped([]);
    setSolved([]);
    setScene("p2_game");
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || solved.includes(id) || flipped.includes(id))
      return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]].img === cards[newFlipped[1]].img) {
        setSolved((s) => [...s, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  useEffect(() => {
    if (solved.length === 12 && scene === "p2_game") {
      setTimeout(() => setScene("p2_photo"), 800);
    }
  }, [solved, scene]);

  // --- LÓGICA FASE 3 (Ritmo) ---
  const handleRhythmTap = (e) => {
    if (e) e.preventDefault();
    setIsPulsing(true);
    setRhythmCount((c) => c + 1);
    setTimeout(() => setIsPulsing(false), 150);
    if (rhythmCount >= 14) setScene("p3_photo");
  };

  // --- LÓGICA FASE 4 (Revelación) ---
  const handleReveal = () => {
    if (revelationProgress < 100) setRevelationProgress((p) => p + 3);
  };

  // --- COMPONENTES VISUALES ---

  const PhotoCard = ({ url, title, sub, nextScene }) => (
    <div className="flex flex-col items-center justify-center space-y-5 animate-in zoom-in duration-500 p-6 text-center h-full w-full">
      <div className="bg-pink-100 px-4 py-1 rounded-full text-pink-600 text-[10px] font-bold flex items-center gap-1 shadow-sm border border-pink-200">
        <Camera size={14} /> RECUERDO DESBLOQUEADO
      </div>

      {/* Marco de Foto Mejorado: Fondo Borroso + Imagen Nítida */}
      <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-[2rem] overflow-hidden border-[6px] border-white shadow-xl bg-gray-100 group">
        {/* Fondo borroso */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-md opacity-60 scale-110"
          style={{ backgroundImage: `url("${url}")` }}
        ></div>

        {/* Imagen principal (Nítida) */}
        <img
          src={url}
          alt={title}
          className="relative z-10 w-full h-full object-contain transition-transform duration-700"
        />
      </div>

      <div className="space-y-1 w-full max-w-[280px]">
        <h3 className="text-2xl font-black text-pink-700 leading-tight">
          {title}
        </h3>
        <p className="text-gray-500 italic text-sm leading-tight px-2">{sub}</p>
      </div>

      <button
        onClick={() => setScene(nextScene)}
        className="w-full max-w-[200px] py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
      >
        Continuar ❤️
      </button>
    </div>
  );

  const ModalPremio = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pink-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center space-y-6 border-4 border-pink-100 transform transition-all scale-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-pink-600 uppercase">
            ¡Premio Validado!
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Has elegido:
          </p>
          <div className="py-4 px-4 bg-pink-50 rounded-xl border-2 border-dashed border-pink-300">
            <span className="text-xl font-bold text-pink-700">
              {selectedReward}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 italic">
          Haz una captura de pantalla y envíamela para canjearlo.
        </p>
        <button
          onClick={() => setSelectedReward(null)}
          className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl font-bold active:scale-95 transition-transform"
        >
          Cerrar
        </button>
      </div>
    </div>
  );

  const renderScene = () => {
    switch (scene) {
      case "start":
        return (
          <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-700 p-8 text-center h-full">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-400 blur-3xl opacity-20 animate-pulse"></div>
              <HeartHandshake className="w-24 h-24 text-pink-500 relative z-10 drop-shadow-md" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-pink-400 italic">
                Para: María Falcón
              </h2>
              <h1 className="text-4xl font-black text-pink-600 leading-none italic tracking-tight">
                Destino: <br />
                Nuestro Amor
              </h1>
            </div>
            <button
              onClick={() => setScene("p1_intro")}
              className="w-full max-w-[260px] py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
            >
              Comenzar Aventura <Sparkles size={20} />
            </button>
          </div>
        );

      case "p1_intro":
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom p-8 text-center flex flex-col items-center justify-center h-full">
            <div className="bg-pink-50 w-24 h-24 rounded-full flex items-center justify-center shadow-inner border-2 border-pink-100">
              <Cat className="text-pink-500 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 italic uppercase">
              Fase 1: Agilidad
            </h2>
            <p className="text-gray-500 text-sm px-4">
              Demuestra tus reflejos atrapando los corazones y los gatitos
              mágicos.
            </p>
            <button
              onClick={() => {
                setScene("p1_game");
                setGameActive(true);
              }}
              className="w-full max-w-[200px] py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg active:scale-95"
            >
              ¡Jugar!
            </button>
          </div>
        );

      case "p1_game":
        return (
          <div className="relative w-full h-[600px] bg-gradient-to-b from-pink-50 to-white rounded-[3rem] overflow-hidden touch-none shadow-inner border-4 border-white">
            <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 rounded-full font-bold text-pink-500 shadow-md z-20 flex items-center gap-2 border border-pink-100">
              <Sparkles size={16} /> {score} / 10
            </div>
            {fallingItems.map((item) => (
              <button
                key={item.id}
                onPointerDown={(e) => {
                  e.preventDefault();
                  collectItem(item.id);
                }}
                className="absolute animate-fall outline-none select-none active:scale-125 transition-transform touch-manipulation"
                style={{
                  left: `${item.left}%`,
                  top: "-70px",
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                  animationDuration: `${item.duration}s`,
                }}
              >
                {item.type === "cat" ? (
                  <Cat
                    fill="#fbcfe8"
                    className="text-pink-400 w-full h-full drop-shadow-md"
                  />
                ) : (
                  <Heart
                    fill="#ec4899"
                    className="text-pink-500 w-full h-full drop-shadow-md"
                  />
                )}
              </button>
            ))}
          </div>
        );

      case "p1_photo":
        return (
          <PhotoCard
            url={TUS_FOTOS.fase1}
            title="Pura Ternura"
            sub="Admiro tu fuerza, tu inteligencia y esa forma tan hermosa y única que tienes de querer."
            nextScene="p2_intro"
          />
        );

      case "p2_intro":
        return (
          <div className="space-y-6 animate-in slide-in-from-right p-8 text-center flex flex-col items-center justify-center h-full">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center shadow-inner border-2 border-blue-100">
              <Brain className="text-blue-500 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 italic uppercase">
              Fase 2: Recuerdos
            </h2>
            <p className="text-gray-500 text-sm px-4">
              Encuentra las parejas de fotos que forman nuestra historia.
            </p>
            <button
              onClick={initMemoryGame}
              className="w-full max-w-[200px] py-4 bg-blue-500 text-white rounded-2xl font-bold shadow-lg active:scale-95"
            >
              Emparejar
            </button>
          </div>
        );

      case "p2_game":
        return (
          <div className="p-4 w-full max-w-[360px] mx-auto flex flex-col justify-center h-full">
            <div className="grid grid-cols-3 gap-2">
              {cards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`aspect-square rounded-xl flex items-center justify-center overflow-hidden border-2 bg-white ${
                    flipped.includes(idx) || solved.includes(idx)
                      ? "border-blue-300"
                      : "bg-blue-500 border-blue-500 shadow-md active:scale-90"
                  }`}
                >
                  {flipped.includes(idx) || solved.includes(idx) ? (
                    <img
                      src={card.img}
                      alt="memory"
                      className="w-full h-full object-cover select-none"
                    />
                  ) : (
                    <span className="text-2xl">❓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case "p2_photo":
        return (
          <PhotoCard
            url={TUS_FOTOS.fase2}
            title="Momentos Juntos"
            sub="Cada pieza de nuestra vida encaja perfectamente."
            nextScene="p3_intro"
          />
        );

      case "p3_intro":
        return (
          <div className="space-y-6 animate-in slide-in-from-left p-8 text-center flex flex-col items-center justify-center h-full">
            <div className="bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center shadow-inner border-2 border-rose-100">
              <Music className="text-rose-500 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 italic uppercase">
              Fase 3: Sincronía
            </h2>
            <p className="text-gray-500 text-sm px-4">
              Toca el corazón repetidamente para sincronizar nuestros latidos.
            </p>
            <button
              onClick={() => setScene("p3_game")}
              className="w-full max-w-[200px] py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg active:scale-95"
            >
              Conectar
            </button>
          </div>
        );

      case "p3_game":
        return (
          <div className="flex flex-col items-center justify-center space-y-12 p-6 h-[500px]">
            <button
              onPointerDown={handleRhythmTap}
              className={`relative z-10 w-40 h-40 rounded-full bg-rose-500 flex items-center justify-center text-white transition-all shadow-2xl active:scale-90 touch-manipulation ${
                isPulsing ? "scale-90 ring-8 ring-rose-200" : "scale-100"
              }`}
            >
              <Heart size={80} fill="currentColor" />
            </button>
            <div className="w-full max-w-[240px] bg-gray-100 rounded-full h-5 overflow-hidden border-2 border-white shadow-inner">
              <div
                className="bg-rose-500 h-full transition-all duration-200"
                style={{ width: `${(rhythmCount / 15) * 100}%` }}
              ></div>
            </div>
            <p className="text-rose-400 font-bold animate-pulse text-xs uppercase tracking-widest">
              ¡Siente el ritmo!
            </p>
          </div>
        );

      case "p3_photo":
        return (
          <PhotoCard
            url={TUS_FOTOS.fase3}
            title="Conexión Única"
            sub="El mundo se detiene cuando estamos así de cerca."
            nextScene="p4_intro"
          />
        );

      case "p4_intro":
        return (
          <div className="space-y-6 animate-in zoom-in p-8 text-center flex flex-col items-center justify-center h-full">
            <div className="bg-purple-50 w-24 h-24 rounded-full flex items-center justify-center shadow-inner border-2 border-purple-100">
              {/* Uso de Sparkles en lugar de Stars para evitar el error */}
              <Sparkles className="text-purple-500 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 italic uppercase">
              Fase Final: Destino
            </h2>
            <p className="text-gray-500 text-sm px-4">
              Limpia la niebla del tiempo para ver nuestro mensaje secreto.
            </p>
            <button
              onClick={() => setScene("p4_game")}
              className="w-full max-w-[200px] py-4 bg-purple-500 text-white rounded-2xl font-bold shadow-lg active:scale-95"
            >
              Revelar
            </button>
          </div>
        );

      case "p4_game":
        return (
          <div className="space-y-8 p-6 text-center h-[600px] flex flex-col justify-center animate-in fade-in">
            <div
              className="relative w-full max-w-[300px] aspect-[4/5] mx-auto rounded-[3rem] border-8 border-purple-100 overflow-hidden shadow-2xl touch-none bg-purple-50"
              onPointerMove={handleReveal}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white text-center">
                <div className="absolute inset-0 z-0 opacity-40">
                  {/* NOTA: Usando foto final local */}
                  <img
                    src={TUS_FOTOS.final}
                    className="w-full h-full object-cover"
                    alt="Final"
                  />
                </div>

                <div className="relative z-10 space-y-3 bg-white/85 p-4 rounded-3xl backdrop-blur-sm shadow-sm">
                  <Sparkles className="text-purple-600 mx-auto w-6 h-6 animate-pulse" />
                  <div className="space-y-2">
                    <p className="text-purple-900 font-black text-lg leading-tight">
                      "Eres mi lugar favorito en el mundo, María Falcón."
                    </p>
                    <p className="text-purple-800 font-medium text-xs leading-relaxed italic">
                      "Ud es mi concierto favorito, pero como dijo Lasso en
                      aquel que compartimos... Tú al final sí eras la más
                      especial..."
                    </p>
                    <p className="text-purple-700 font-bold text-xs mt-1">
                      "Por esa razón, te tengo unas propuestas..."
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-0 bg-gray-300 flex flex-col items-center justify-center transition-opacity duration-200 z-20 pointer-events-none"
                style={{ opacity: Math.max(0, 1 - revelationProgress / 100) }}
              >
                <div className="bg-white/80 px-6 py-4 rounded-2xl text-gray-600 font-black text-[10px] tracking-[0.2em] animate-pulse uppercase">
                  Frota la pantalla
                </div>
              </div>
            </div>

            {revelationProgress >= 100 && (
              <button
                onClick={() => setScene("final")}
                className="w-full max-w-[260px] mx-auto py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-[2rem] font-bold animate-bounce shadow-xl"
              >
                RECLAMAR REGALO 🎁
              </button>
            )}
          </div>
        );

      case "final":
        return (
          <div className="space-y-6 animate-in zoom-in p-6 text-center h-full flex flex-col justify-center relative">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-pink-600 italic uppercase tracking-tighter">
                ¡Misión Cumplida!
              </h2>
              <div className="flex justify-center gap-3 pt-1">
                <Trophy className="text-yellow-500 w-8 h-8 drop-shadow-lg" />
                <Trophy className="text-yellow-500 w-8 h-8 drop-shadow-lg" />
                <Trophy className="text-yellow-500 w-8 h-8 drop-shadow-lg" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-[3rem] shadow-xl border-4 border-pink-50 overflow-hidden">
              <p className="text-gray-600 italic mb-6 text-sm">
                "Felicidades, María. Has completado tu aventura de San Valentín.
                Elige tu recompensa:"
              </p>
              <div className="space-y-3">
                {[
                  "Cena Especial 🍴",
                  "Bowling y Maratón VIP 🎳",
                  "Pasar juntos el resto de nuestra vida",
                ].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedReward(r)}
                    className="w-full p-4 bg-pink-50 border-2 border-pink-100 rounded-2xl text-pink-700 font-bold active:scale-95 transition-transform flex items-center justify-center gap-2 uppercase tracking-wider text-xs shadow-sm"
                  >
                    <Gift size={16} /> {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setScene("start");
                setScore(0);
                setRevelationProgress(0);
                setRhythmCount(0);
                setSelectedReward(null);
              }}
              className="text-pink-300 text-[10px] font-bold uppercase tracking-widest active:underline"
            >
              <RefreshCw size={12} className="inline mr-1" /> Reiniciar
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5f5] flex items-center justify-center p-2 sm:p-4 font-sans overflow-hidden select-none">
      {/* Modal de Premio */}
      {selectedReward && <ModalPremio />}

      <div className="w-full max-w-[420px] h-[750px] bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(251,113,133,0.4)] border-[10px] sm:border-[16px] border-white overflow-hidden relative">
        <style>{`
          @keyframes fall {
            0% { transform: translateY(-80px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(720px) rotate(360deg); opacity: 0; }
          }
          .animate-fall { animation-name: fall; animation-timing-function: linear; animation-fill-mode: forwards; }
          .rotate-y-180 { transform: rotateY(180deg); }
        `}</style>
        {renderScene()}
      </div>
    </div>
  );
};

export default App;
