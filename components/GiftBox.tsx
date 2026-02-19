
import React from 'react';
import { Prize } from '../types';

interface GiftBoxProps {
  index: number;
  onClick: () => void;
  disabled?: boolean;
  isOpening?: boolean;
  isOpen?: boolean;
  revealedPrize?: Prize | null;
}

const GiftBox: React.FC<GiftBoxProps> = ({ index, onClick, disabled, isOpening, isOpen, revealedPrize }) => {
  // Danh sách các màu sắc rực rỡ cho ngựa theo phong cách Tết
  const horseColors = [
    'text-yellow-400',   // Vàng kim
    'text-orange-400',   // Cam lộc
    'text-pink-400',     // Hồng thắm
    'text-emerald-400',  // Xanh ngọc
    'text-sky-400',      // Xanh lam
    'text-purple-400',   // Tím quý phái
    'text-amber-300',    // Vàng hổ phách
    'text-rose-400',     // Hồng lựu
    'text-lime-400',     // Xanh lộc non
  ];

  const getHorseColor = (idx: number) => horseColors[idx % horseColors.length];

  return (
    <div 
      onClick={!disabled && !isOpening && !isOpen && !revealedPrize ? onClick : undefined}
      className={`relative cursor-pointer group transition-all duration-300 
        ${!disabled && !isOpening && !isOpen && !revealedPrize ? 'hover:scale-110 active:scale-95' : ''} 
        ${disabled && !isOpening && !isOpen && !revealedPrize ? 'opacity-50 grayscale' : 'opacity-100'}
        ${isOpening ? 'z-50' : 'z-0'}`}
    >
      {/* Box Container */}
      <div className={`w-28 h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 relative flex items-center justify-center ${isOpening ? 'animate-shake' : (!isOpen && !revealedPrize ? 'animate-float' : '')}`}>
        {/* Glow burst effect when opening */}
        {isOpening && (
          <div className={`absolute inset-0 bg-yellow-400 rounded-full blur-2xl animate-glow-burst`} />
        )}
        
        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/40 blur-lg rounded-full" />
        
        {/* The Gift Box */}
        <div className="relative w-full h-full">
          {/* Main Box Body */}
          <div className={`absolute inset-0 rounded-2xl shadow-2xl border-2 transform-gpu overflow-hidden transition-colors duration-500
            ${isOpen || revealedPrize ? 'bg-yellow-50 border-yellow-300' : 'bg-red-700 border-yellow-500 shadow-red-950/50'}`}>
            
            {/* Ribbons/Decorations (Hidden when opened) */}
            {!(isOpen || revealedPrize) && (
              <>
                <div className="absolute left-1/2 top-0 bottom-0 w-5 bg-yellow-500 -translate-x-1/2 shadow-inner" />
                <div className="absolute top-1/2 left-0 right-0 h-5 bg-yellow-500 -translate-y-1/2 shadow-inner" />
                <div className="absolute inset-0 border-4 border-yellow-500/20 m-3 rounded-xl"></div>
              </>
            )}
            
            {/* Horse Emblem - Biểu tượng ngựa với màu sắc riêng biệt */}
            {!(isOpen || revealedPrize) && (
              <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none group-hover:scale-125 transition-transform duration-500">
                 <i className={`fa-solid fa-horse-head ${getHorseColor(index)} text-5xl md:text-7xl drop-shadow-lg`}></i>
              </div>
            )}

            {/* Nội dung phần quà khi đã mở và được tiết lộ */}
            {revealedPrize && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center animate-[fade-in_0.5s_ease-out]">
                <div className="bg-red-100 p-3 rounded-full mb-2">
                  <i className={`fa-solid fa-${revealedPrize.icon} text-3xl md:text-5xl text-red-600`}></i>
                </div>
                <span className="text-red-900 font-black text-xs md:text-sm uppercase leading-tight">{revealedPrize.name}</span>
              </div>
            )}

            {/* Trạng thái lấp lánh khi đang mở */}
            {isOpen && !revealedPrize && (
              <div className="absolute inset-0 flex items-center justify-center">
                <i className={`fa-solid fa-horse ${getHorseColor(index)} text-5xl animate-pulse`}></i>
              </div>
            )}
          </div>

          {/* Lid - Red with Gold Decorations */}
          {!(isOpen || revealedPrize) && (
            <div className={`absolute -top-2 left-0 right-0 h-12 bg-red-600 border-b-2 border-yellow-600 rounded-t-2xl z-10 transition-transform duration-500 shadow-lg
              ${!isOpening ? 'group-hover:-translate-y-3' : 'animate-lid-pop'}`}>
              
              {/* Ribbon on Lid */}
              <div className="absolute left-1/2 top-0 bottom-0 w-5 bg-yellow-500 -translate-x-1/2" />
              
              {/* Gold Coin or Bow */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                <i className="fa-solid fa-circle-dollar-to-slot text-4xl text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"></i>
              </div>
            </div>
          )}
          
          {/* Inner Mystery Text */}
          {!(isOpen || revealedPrize) && !isOpening && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
               <span className="text-yellow-400 font-black text-sm uppercase tracking-widest bg-red-900/80 px-4 py-2 rounded-full border border-yellow-500/50 shadow-xl">HÁI LỘC</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftBox;
