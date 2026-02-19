
import React, { useState, useEffect, useMemo } from 'react';
import GiftBox from './GiftBox';
import { getPrizes, addHistory, getOpenedBoxes, saveOpenedBoxes } from '../utils/storage';
import { Prize } from '../types';
import { generateWinnerMessage } from '../services/gemini';

const DrawView: React.FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [openingBoxIndex, setOpeningBoxIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<{ prize: Prize; message: string; index: number } | null>(null);
  
  // Trạng thái các hộp đã mở trong phiên (mất khi F5)
  const [revealedBoxes, setRevealedBoxes] = useState<Record<number, Prize>>({});

  useEffect(() => {
    const loadedPrizes = getPrizes();
    const loadedOpenedBoxes = getOpenedBoxes();
    
    const openedPrizeCounts: Record<string, number> = {};
    Object.values(loadedOpenedBoxes).forEach(p => {
      openedPrizeCounts[p.id] = (openedPrizeCounts[p.id] || 0) + 1;
    });

    const currentPrizes = loadedPrizes.map(p => ({
      ...p,
      quantity: Math.max(0, p.quantity - (openedPrizeCounts[p.id] || 0))
    }));

    setPrizes(currentPrizes);
    setRevealedBoxes(loadedOpenedBoxes);
  }, []);

  const gridSize = useMemo(() => {
    const initialConfigPrizes = getPrizes();
    return initialConfigPrizes.reduce((sum, p) => sum + p.quantity, 0);
  }, []);

  const handleDraw = async (index: number) => {
    if (openingBoxIndex !== null || revealedBoxes[index]) return;

    const availablePrizes = prizes.filter(p => p.quantity > 0);
    if (availablePrizes.length === 0) {
      alert("Hết lộc rồi! Hãy refresh để quay lại từ đầu.");
      return;
    }

    setOpeningBoxIndex(index);

    const totalWeight = availablePrizes.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedPrize: Prize = availablePrizes[0];

    for (const p of availablePrizes) {
      if (random < p.weight) {
        selectedPrize = p;
        break;
      }
      random -= p.weight;
    }

    setTimeout(async () => {
      setPrizes(prev => prev.map(p => 
        p.id === selectedPrize.id ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p
      ));
      
      addHistory({
        timestamp: Date.now(),
        prizeId: selectedPrize.id,
        prizeName: selectedPrize.name
      });

      const msg = await generateWinnerMessage(selectedPrize.name);
      
      setWinner({ prize: selectedPrize, message: msg, index: index });
      setOpeningBoxIndex(null);
    }, 800);
  };

  const closeResult = () => {
    if (winner) {
      const newRevealed = { ...revealedBoxes, [winner.index]: winner.prize };
      setRevealedBoxes(newRevealed);
      saveOpenedBoxes(newRevealed); 
      setWinner(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[90vh]">
      <header className="text-center mb-16 relative">
        {/* Horses flanking the title */}
        <div className="hidden md:flex absolute -top-12 left-1/2 -translate-x-1/2 w-[120%] justify-between pointer-events-none px-12">
           <i className="fa-solid fa-horse text-yellow-500/40 text-6xl -rotate-12 animate-pulse"></i>
           <i className="fa-solid fa-horse text-yellow-500/40 text-6xl rotate-12 animate-pulse delay-500"></i>
        </div>

        <div className="inline-block relative mb-4">
           <span className="absolute -top-6 -left-6 text-4xl">🌸</span>
           <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-200 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] uppercase tracking-tight italic">
            Hái Lộc Đại Cát
          </h1>
          <span className="absolute -bottom-6 -right-6 text-4xl">🌸</span>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-px w-12 bg-yellow-500/50"></div>
          <h2 className="text-3xl md:text-4xl font-black text-yellow-400 tracking-[0.3em] uppercase">
            Bính Ngọ 2026
          </h2>
          <div className="h-px w-12 bg-yellow-500/50"></div>
        </div>
        
        <p className="mt-6 text-xl text-yellow-100/90 max-w-lg mx-auto font-medium bg-red-950/40 py-2 px-6 rounded-full border border-yellow-600/20 backdrop-blur-sm">
          Mã Đáo Thành Công - Vạn Sự Như Ý
        </p>
      </header>

      {/* Grid: Strictly 3 columns as requested */}
      <div className="grid grid-cols-3 gap-6 md:gap-14 lg:gap-20 max-w-5xl">
        {gridSize > 0 ? (
          [...Array(gridSize)].map((_, i) => (
            <GiftBox 
              key={i} 
              index={i}
              onClick={() => handleDraw(i)} 
              isOpening={openingBoxIndex === i}
              isOpen={openingBoxIndex === i || winner?.index === i} 
              revealedPrize={revealedBoxes[i]}
              disabled={openingBoxIndex !== null && openingBoxIndex !== i} 
            />
          ))
        ) : (
          <div className="col-span-full text-center p-16 bg-red-950/40 rounded-[3rem] backdrop-blur-md border-2 border-yellow-600/40 shadow-2xl">
            <i className="fa-solid fa-horse-head text-8xl text-yellow-500 mb-6 block animate-bounce"></i>
            <h3 className="text-3xl font-black text-yellow-400">ĐANG CHUẨN BỊ LỘC XUÂN</h3>
            <p className="mt-4 text-yellow-100 opacity-60">Vui lòng quay lại trang quản trị để thêm quà tặng.</p>
          </div>
        )}
      </div>

      {winner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-950/90 backdrop-blur-xl" onClick={closeResult}></div>
          <div className="relative bg-white text-gray-900 rounded-[2.5rem] shadow-[0_0_50px_rgba(234,179,8,0.5)] p-10 max-w-sm w-full text-center overflow-hidden animate-bounce-in border-[6px] border-yellow-500">
            {/* Horse watermark in modal */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <i className="fa-solid fa-horse text-8xl"></i>
            </div>
            
            <div className="mb-8 inline-block p-8 bg-red-50 rounded-full relative">
               <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
               <i className={`fa-solid fa-${winner.prize.icon} text-7xl text-red-600 relative z-10`}></i>
            </div>
            
            <h2 className="text-4xl font-black text-red-700 mb-2 uppercase italic tracking-tighter">MÃ ĐÁO THÀNH CÔNG!</h2>
            <p className="text-gray-400 mb-6 text-xs font-black tracking-[0.2em] uppercase">Bạn đã hái được lộc quý</p>
            
            <div className="bg-gradient-to-br from-red-50 via-yellow-50 to-red-50 p-8 rounded-[2rem] mb-8 border-2 border-yellow-200 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"></div>
              <h3 className="text-3xl font-black text-red-800 mb-2">{winner.prize.name}</h3>
              <p className="text-sm font-bold text-red-600/80">{winner.prize.description}</p>
            </div>
            
            <div className="italic text-gray-700 mb-10 px-6 text-base leading-relaxed border-l-8 border-yellow-500 pl-6 text-left font-semibold">
              {winner.message}
            </div>
            
            <button 
              onClick={closeResult}
              className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-[0_15px_30px_rgba(185,28,28,0.4)] active:scale-95 border-b-[6px] border-red-950 text-xl flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-horse"></i> TIẾP TỤC HÁI LỘC
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawView;
