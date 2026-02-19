import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPrizes, savePrizes, getHistory, clearHistory, clearOpenedBoxes } from '../utils/storage';
import { Prize, DrawRecord } from '../types';

const AdminPanel: React.FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [history, setHistory] = useState<DrawRecord[]>([]);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);

  useEffect(() => {
    setPrizes(getPrizes());
    setHistory(getHistory());
  }, []);

  const handleSavePrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrize) return;

    let newPrizes;
    if (editingPrize.id) {
       newPrizes = prizes.map(p => p.id === editingPrize.id ? editingPrize : p);
    } else {
       newPrizes = [...prizes, { ...editingPrize, id: Date.now().toString() }];
    }

    setPrizes(newPrizes);
    savePrizes(newPrizes);
    setEditingPrize(null);
  };

  const removePrize = (id: string) => {
    const newPrizes = prizes.filter(p => p.id !== id);
    setPrizes(newPrizes);
    savePrizes(newPrizes);
  };

  const startAdd = () => {
    setEditingPrize({
      id: '',
      name: '',
      description: '',
      quantity: 1,
      weight: 1,
      icon: 'horse'
    });
  };

  const handleResetEverything = () => {
    if (confirm("Bạn có chắc chắn muốn XÓA TOÀN BỘ lịch sử và ĐÓNG LẠI các hộp quà đã mở không?")) {
      clearHistory();
      clearOpenedBoxes();
      setHistory([]);
      alert("Đã reset phiên thành công!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-red-900/40 p-8 rounded-[2rem] backdrop-blur-lg border border-yellow-600/30">
        <div>
          <h1 className="text-4xl font-black text-yellow-400 flex items-center gap-3">
            <i className="fa-solid fa-horse"></i> Quản Trị Tết 2026
          </h1>
          <p className="text-yellow-100/60 text-sm mt-1 uppercase tracking-widest font-bold">Cài đặt bao lì xì Bính Ngọ</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleResetEverything}
            className="px-6 py-3 bg-red-600/20 text-red-200 border border-red-500/50 rounded-full font-black text-sm hover:bg-red-600 hover:text-white transition flex items-center gap-2"
          >
            <i className="fa-solid fa-rotate-right"></i> Reset Phiên
          </button>
          <Link to="/" className="px-8 py-3 bg-yellow-500 text-red-900 rounded-full font-black text-sm hover:bg-yellow-400 transition shadow-xl border-b-4 border-yellow-700">
            Về Trang Chủ
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-2 text-white">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <i className="fa-solid fa-trophy text-yellow-400"></i> Danh Sách Lộc Xuân
            </h2>
            <button 
              onClick={startAdd}
              className="px-6 py-3 bg-yellow-600 text-white rounded-2xl hover:bg-yellow-700 transition font-black flex items-center gap-2 shadow-xl"
            >
              <i className="fa-solid fa-plus"></i> Thêm Lộc Mới
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {prizes.map((prize) => (
              <div key={prize.id} className="bg-red-950/40 border border-yellow-600/20 p-5 rounded-[1.5rem] flex items-center gap-6 hover:bg-red-900/40 transition text-white">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                  <i className={`fa-solid fa-${prize.icon} text-yellow-400 text-2xl`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-xl text-yellow-100 uppercase italic truncate">{prize.name}</div>
                  <div className="text-sm opacity-50 truncate font-medium">{prize.description}</div>
                </div>
                <div className="text-right px-6 border-x border-yellow-600/10">
                  <div className="text-[10px] opacity-50 uppercase tracking-tighter font-bold">Số lượng</div>
                  <div className="font-black text-2xl text-white">{prize.quantity}</div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => setEditingPrize(prize)} className="p-3 bg-yellow-500/10 hover:bg-yellow-500 hover:text-red-900 text-yellow-400 rounded-xl transition"><i className="fa-solid fa-edit"></i></button>
                  <button onClick={() => removePrize(prize.id)} className="p-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            ))}
            {prizes.length === 0 && (
              <div className="text-center py-20 bg-red-950/40 rounded-[2rem] border-2 border-dashed border-yellow-600/30 opacity-50 text-white">
                <i className="fa-solid fa-horse text-5xl mb-4 block"></i>
                <span className="font-black uppercase tracking-widest">Chưa có quà Tết nào được tạo.</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2 text-white">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-yellow-400"></i> Lịch Sử Hái Lộc
            </h2>
          </div>
          <div className="bg-red-950/60 rounded-[2rem] p-6 max-h-[700px] overflow-y-auto space-y-4 custom-scrollbar border border-yellow-600/10">
            {history.length > 0 ? history.map((h, i) => (
              <div key={i} className="flex justify-between items-center text-sm bg-white/5 p-4 rounded-2xl border-l-8 border-yellow-500 text-white animate-fade-in">
                <div className="min-w-0">
                  <div className="font-black text-yellow-300 truncate uppercase text-base">{h.prizeName}</div>
                  <div className="text-[10px] opacity-40 font-bold">{new Date(h.timestamp).toLocaleString()}</div>
                </div>
                <i className="fa-solid fa-check-double text-yellow-500 text-xl"></i>
              </div>
            )) : (
              <div className="text-center py-20 opacity-30 italic text-white flex flex-col items-center gap-4">
                <i className="fa-solid fa-horse-head text-4xl"></i>
                <span className="text-sm font-bold uppercase tracking-widest">Đang chờ người may mắn</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingPrize && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md">
          <div className="bg-red-900 border-4 border-yellow-500 w-full max-w-md p-10 rounded-[3rem] shadow-2xl text-white">
            <h3 className="text-3xl font-black mb-8 flex items-center gap-3 text-yellow-400 uppercase italic">
              <i className="fa-solid fa-horse"></i>
              {editingPrize.id ? 'Sửa Lộc Xuân' : 'Thêm Lộc Mới'}
            </h3>
            <form onSubmit={handleSavePrize} className="space-y-6">
              <div>
                <label className="block text-xs uppercase font-black text-yellow-500/70 mb-2 ml-2">Tên Quà / Lì Xì</label>
                <input 
                  required
                  placeholder="VD: Lì xì 500k Vàng"
                  value={editingPrize.name}
                  onChange={e => setEditingPrize({...editingPrize, name: e.target.value})}
                  className="w-full bg-red-950/50 border-2 border-yellow-600/30 p-5 rounded-2xl focus:border-yellow-400 outline-none transition font-bold"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-black text-yellow-500/70 mb-2 ml-2">Lời chúc (Gợi ý)</label>
                <input 
                  placeholder="VD: Chúc bạn vạn sự như ý"
                  value={editingPrize.description}
                  onChange={e => setEditingPrize({...editingPrize, description: e.target.value})}
                  className="w-full bg-red-950/50 border-2 border-yellow-600/30 p-5 rounded-2xl focus:border-yellow-400 outline-none transition font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-black text-yellow-500/70 mb-2 ml-2">Số lượng</label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={editingPrize.quantity}
                    onChange={e => setEditingPrize({...editingPrize, quantity: parseInt(e.target.value) || 0})}
                    className="w-full bg-red-950/50 border-2 border-yellow-600/30 p-5 rounded-2xl focus:border-yellow-400 outline-none transition font-black text-xl"
                  />
                </div>
                <div>
                   <label className="block text-xs uppercase font-black text-yellow-500/70 mb-2 ml-2">Icon</label>
                   <select 
                      value={editingPrize.icon}
                      onChange={e => setEditingPrize({...editingPrize, icon: e.target.value})}
                      className="w-full bg-red-950/50 border-2 border-yellow-600/30 p-5 rounded-2xl focus:border-yellow-400 outline-none transition appearance-none cursor-pointer font-bold"
                    >
                      <option value="horse" className="bg-red-900">🐎 Ngựa</option>
                      <option value="horse-head" className="bg-red-900">🐴 Đầu Ngựa</option>
                      <option value="money-bill-1" className="bg-red-900">💵 Tiền mặt</option>
                      <option value="gift" className="bg-red-900">🎁 Hộp quà</option>
                      <option value="crown" className="bg-red-900">👑 Vương miện</option>
                      <option value="gem" className="bg-red-900">💎 Đá quý</option>
                   </select>
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setEditingPrize(null)} className="flex-1 py-5 border-2 border-yellow-600/30 rounded-2xl hover:bg-red-800 transition text-white font-black uppercase text-sm">Hủy</button>
                <button type="submit" className="flex-1 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-red-950 rounded-2xl font-black hover:scale-[1.05] transition shadow-[0_10px_20px_rgba(234,179,8,0.3)] text-lg uppercase italic border-b-4 border-yellow-800">LƯU LỘC</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;