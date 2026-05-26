import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  Baby, 
  FileText, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  Search, 
  Share2, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Info
} from "lucide-react";
import { INITIAL_HOSPITAL_BAG_ITEMS, HospitalBagItem } from "../data/hospitalBag";

export default function HospitalBagChecklist() {
  // --- States ---
  const [items, setItems] = useState<HospitalBagItem[]>(() => {
    try {
      const stored = localStorage.getItem("babicare_hospital_bag_items");
      return stored ? JSON.parse(stored) : INITIAL_HOSPITAL_BAG_ITEMS;
    } catch {
      return INITIAL_HOSPITAL_BAG_ITEMS;
    }
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("babicare_hospital_bag_checked");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [activeFilter, setActiveFilter] = useState<"all" | "crucial" | "document" | "mother" | "baby">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom item adder state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"document" | "mother" | "baby">("mother");
  const [newQty, setNewQty] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Expand rationale view state
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // Alert/Notification box state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Sync Effects ---
  useEffect(() => {
    localStorage.setItem("babicare_hospital_bag_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("babicare_hospital_bag_checked", JSON.stringify(checkedItems));
  }, [checkedItems]);

  // Show auto-dismiss toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Handlers ---
  const toggleCheck = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast("Vui lòng nhập tên món đồ cần chuẩn bị!");
      return;
    }

    const newItem: HospitalBagItem = {
      id: "custom_" + Date.now(),
      category: newCategory,
      name: newName.trim(),
      isCrucial: false, // Custom items defaults to standard, user can customize
      qty: newQty.trim() || "1",
      desc: newDesc.trim() || "Mẹ lưu ý chuẩn bị phù hợp hoàn cảnh riêng."
    };

    setItems(prev => [newItem, ...prev]);
    setNewName("");
    setNewQty("");
    setNewDesc("");
    setIsAdding(false);
    showToast(`Đã thêm "${newItem.name}" vào giỏ đồ!`);
  };

  const handleDeleteItem = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Mẹ có chắc chắn muốn xóa "${name}" khỏi giỏ đồ không?`)) {
      setItems(prev => prev.filter(it => it.id !== id));
      setCheckedItems(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      showToast(`Đã xóa món đồ khỏi danh sách.`);
    }
  };

  const handleResetChecks = () => {
    if (window.confirm("Bố mẹ có muốn xóa toàn bộ đánh dấu tích để kiểm đếm lại từ đầu?")) {
      setCheckedItems({});
      showToast("Đã thiết lập lại giỏ đồ!");
    }
  };

  const handleRestoreDefaults = () => {
    if (window.confirm("Mẹ có muốn khôi phục danh sách đồ dùng đi sinh chuẩn của y khoa ban đầu? (Các ghi chú tự thêm của bố mẹ sẽ bị xóa)")) {
      setItems(INITIAL_HOSPITAL_BAG_ITEMS);
      setCheckedItems({});
      setExpandedIds({});
      showToast("Đã khôi phục giỏ đồ y khoa tiêu chuẩn!");
    }
  };

  // Copy list to share with Husband / Family
  const handleCopyChecklist = () => {
    const categoriesMap = {
      document: "🗂️ GIẤY TỜ BẮT BUỘC/CẦN THIẾT",
      mother: "👩 ĐỒ DÙNG CHO MẸ BẦU",
      baby: "👶 ĐỒ DÙNG CHO CON YÊU"
    };

    let shareText = `🎒 BABICARE GIỎ ĐỒ ĐI SINH CỦA GIA ĐÌNH CHÚNG TA 💕\n`;
    shareText += `Cập nhật ngày: ${new Date().toLocaleDateString("vi-VN")}\n`;
    shareText += `===================================\n\n`;

    const docItems = items.filter(it => it.category === "document");
    const momItems = items.filter(it => it.category === "mother");
    const babyItems = items.filter(it => it.category === "baby");

    const appendCategoryText = (title: string, catItems: HospitalBagItem[]) => {
      let segment = `${title}:\n`;
      catItems.forEach(it => {
        const isChecked = !!checkedItems[it.id];
        const status = isChecked ? "[ x ] Đã Chuẩn Bị" : "[   ] Chưa Có";
        const crucialTag = it.isCrucial ? " (⭐️ CẦN THIẾT!)" : "";
        segment += `${status} - ${it.name} (${it.qty})${crucialTag}\n`;
      });
      segment += `\n`;
      return segment;
    };

    shareText += appendCategoryText(categoriesMap.document, docItems);
    shareText += appendCategoryText(categoriesMap.mother, momItems);
    shareText += appendCategoryText(categoriesMap.baby, babyItems);

    const totalCount = items.length;
    const completedCount = items.filter(it => checkedItems[it.id]).length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 105) : 0;
    shareText += `📊 Tiến độ chuẩn bị: ${completedCount}/${totalCount} món đồ (${pct > 100 ? 100 : pct}% hoàn thành)\n`;
    shareText += `Chúc bố mẹ cán đích thành công đón thiên thần nhỏ thượng lộ bình an! 🌸`;

    navigator.clipboard.writeText(shareText);
    showToast("Đã sao chép danh sách giỏ đồ vào bộ nhớ tạm! Lúc này bố mẹ có thể gửi ngay qua Zalo/Messenger cho người thân rồi đó.");
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Filtering & Calculations ---
  const filteredItems = items.filter(it => {
    // Category match
    if (activeFilter === "crucial" && !it.isCrucial) return false;
    if (activeFilter !== "all" && activeFilter !== "crucial" && it.category !== activeFilter) return false;
    
    // Search query match
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        it.name.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q) ||
        it.qty.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate general stats
  const totalCount = items.length;
  const completedCount = items.filter(it => checkedItems[it.id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Crucial stats
  const crucialItems = items.filter(it => it.isCrucial);
  const totalCrucialCount = crucialItems.length;
  const completedCrucialCount = crucialItems.filter(it => checkedItems[it.id]).length;

  return (
    <div className="bg-slate-50/50 rounded-3xl p-1.5 sm:p-2 space-y-4">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-3xl p-4 shadow-md relative overflow-hidden select-none">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-6 translate-y-6">
          <Briefcase className="w-48 h-48" />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-white/20 font-black px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-205" /> Toàn diện cho ngày sinh bồn chồn
          </span>
        </div>

        <h3 className="font-extrabold text-sm sm:text-base mt-2 flex items-center gap-2 tracking-tight">
          🎒 Giỏ Đồ Đi Sinh Y Khoa Babicare
        </h3>
        <p className="text-[10.5px] text-white/90 font-medium leading-relaxed mt-1 max-w-md">
          Danh mục chuẩn bị được nghiên cứu kỹ lưỡng từ các cố vấn sản phụ khoa, chia làm các đồ dùng <strong className="text-amber-205">Tuyên quyết - Cấp thiết</strong> và hướng dẫn kinh nghiệm khoa học chi tiết.
        </p>

        {/* PROGRESS TRACKER */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 mt-4 border border-white/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-rose-50 tracking-wide flex items-center gap-1.5">
              📈 Tỷ lệ hoàn tất giỏ đồ của mẹ:
            </span>
            <span className="text-xs font-black text-white bg-white/20 px-2 py-0.5 rounded-full">
              {completedCount}/{totalCount} món ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar container */}
          <div className="w-full bg-black/15 rounded-full h-3.5 overflow-hidden relative border border-white/5 flex items-center">
            <div 
              style={{ width: `${progressPercent}%` }}
              className="bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1 shadow-sm"
            />
            {progressPercent > 0 && (
              <span className="absolute left-1/2 transform -translate-x-1/2 text-[9px] font-extrabold text-white tracking-widest pointer-events-none drop-shadow-sm">
                {progressPercent === 100 ? "💕 ĐÃ SẴN SÀNG ĐÓN BÉ CHÀO ĐỜI!" : "MẸ ĐANG CHUẨN BỊ..."}
              </span>
            )}
          </div>

          {/* Crucial status pill */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9.5px] text-rose-500 font-bold bg-white/5 px-2 py-1 rounded-lg">
            <div className="flex items-center gap-1 text-rose-100">
              <AlertTriangle className="w-3 h-3 text-yellow-300 shrink-0" />
              <span>Sản vật quyết định quyết chiến:</span>
            </div>
            <span className="font-extrabold text-amber-205">
              {completedCrucialCount === totalCrucialCount ? (
                "🎉 Đầy đủ 100% tài liệu & đồ cấp thiết!"
              ) : (
                `Mới chuẩn bị ${completedCrucialCount}/${totalCrucialCount} đồ cực gấp!`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* QUICK FLOATING TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[11px] font-bold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-1.5 z-50 border border-slate-700/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH AND ACTION CONTROLS */}
      <div className="grid grid-cols-1 sm:flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm vật dụng (VD: bỉm, tã, sữa, căn cước...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-205 rounded-full py-2 pl-9 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-rose-300 placeholder-slate-400 shadow-xs transition-all"
          />
        </div>

        {/* Action button grouping */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Add custom Button */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`cursor-pointer py-2 px-3 text-xs font-black rounded-full flex items-center gap-1 border transition-all active:scale-95 shadow-xs ${
              isAdding 
                ? "bg-slate-850 border-slate-850 text-white" 
                : "bg-white border-slate-205 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm đồ riêng</span>
          </button>

          {/* Copy List Button */}
          <button
            onClick={handleCopyChecklist}
            className="cursor-pointer py-2 px-3 text-xs font-black rounded-full bg-white border border-slate-205 text-rose-600 hover:bg-rose-50 flex items-center gap-1 transition-all active:scale-95 shadow-xs"
            title="Chia sẻ danh sách cho chồng hoặc gia đình"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gửi gia đình</span>
          </button>

          {/* Print checklist */}
          <button
            onClick={handlePrint}
            className="cursor-pointer py-2 px-3 text-xs font-black rounded-full bg-white border border-slate-205 text-slate-650 hover:bg-slate-50 flex items-center gap-1 transition-all active:scale-95 shadow-xs"
            title="In ra giấy hoặc lưu PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* COLLAPSIBLE ADD CUSTOM ITEM CARD */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddNewItem}
            className="bg-white overflow-hidden rounded-3xl border border-rose-100 p-4 space-y-4 shadow-sm"
          >
            <div className="border-b border-rose-50 pb-2">
              <h4 className="font-extrabold text-xs text-rose-800 flex items-center gap-1.5">
                📝 Thêm Vật Dụng Tự Chọn Của Bố Mẹ
              </h4>
              <p className="text-[10px] text-slate-400">Tự ghi chép thêm đồ riêng chỉ áp dụng cho tài khoản máy này của mẹ.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Item Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Tên Đồ dùng / Vật dụng (*)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tai nghe chống ồn, Son dưỡng moi..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-205 rounded-xl px-3 py-2 text-xs outline-none focus:border-rose-300 font-bold"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Phân nhóm giỏ đồ</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-50/50 border border-slate-205 rounded-xl px-3 py-2 text-xs outline-none focus:border-rose-300 font-bold"
                >
                  <option value="mother">🤰 Đồ dùng cho Mẹ</option>
                  <option value="baby">👶 Đồ dùng cho Bé</option>
                  <option value="document">🗂️ Giấy tờ chuẩn bị</option>
                </select>
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Số lượng khuyên dùng</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 1-2 cái, 2 đôi..."
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-205 rounded-xl px-3 py-2 text-xs outline-none focus:border-rose-300 font-bold"
                />
              </div>

              {/* Detail desc */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Lý do chuẩn bị / Lưu ý</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giúp giải trí giảm bớt đau đẻ khi chờ..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-205 rounded-xl px-3 py-2 text-xs outline-none focus:border-rose-300 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="cursor-pointer py-1.5 px-3 rounded-lg text-slate-550 border border-slate-200 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="cursor-pointer py-1.5 px-3.5 rounded-lg bg-rose-500 text-white border border-rose-550 text-xs font-black hover:bg-rose-600 active:scale-95 shadow-xs transition-all"
              >
                Lưu vào giỏ đồ
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FILTER BUTTON TABS */}
      <div className="flex gap-1 overflow-x-auto flex-nowrap pb-1.5 pt-1 no-scrollbar border-b border-slate-100 bg-white p-1 rounded-2xl shadow-2xs">
        {[
          { key: "all", label: "🎒 Tất Cả", count: items.length },
          { key: "crucial", label: "🚨 Cấp Thiết", count: items.filter(it => it.isCrucial).length, color: "text-red-700 border-red-100 bg-red-50" },
          { key: "document", label: "🗂️ Giấy Tờ", count: items.filter(it => it.category === "document").length },
          { key: "mother", label: "🤰 Cho Mẹ", count: items.filter(it => it.category === "mother").length },
          { key: "baby", label: "👶 Cho Bé", count: items.filter(it => it.category === "baby").length }
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActiveFilter(btn.key as any)}
            className={`py-1.5 px-3 text-[10px] sm:text-xs font-black rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 transition-all border ${
              activeFilter === btn.key
                ? btn.key === "crucial"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-rose-500 text-white border-rose-500"
                : btn.key === "crucial" && btn.count > 0
                  ? "bg-red-50 border-red-200 text-red-650"
                  : "bg-white border-slate-200 text-slate-550"
            }`}
          >
            <span>{btn.label}</span>
            <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full border ${
              activeFilter === btn.key 
                ? "bg-white/20 text-white border-white/10" 
                : "bg-slate-100 text-slate-500 border-slate-200"
            }`}>
              {btn.count}
            </span>
          </button>
        ))}
      </div>

      {/* THE MAIN INTERACTIVE LIST ROWS */}
      <div className="space-y-2 mt-2">
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200 p-6 space-y-2"
            >
              <div className="text-3xl">🧩</div>
              <p className="text-[11px] font-black text-slate-700">Không tìm thấy vật dụng phù hợp!</p>
              <p className="text-[10px] text-slate-400">Mẹ hãy kiểm tra lại từ gõ tìm kiếm hoặc nhấp "Thêm đồ riêng" để bổ sung món này mẹ nhé.</p>
              {activeFilter !== "all" && (
                <button 
                  onClick={() => setActiveFilter("all")} 
                  className="mt-2 text-[10px] font-bold text-rose-500 underline cursor-pointer"
                >
                  Quay lại xem Toàn bộ
                </button>
              )}
            </motion.div>
          ) : (
            filteredItems.map((it) => {
              const isChecked = !!checkedItems[it.id];
              const isExpanded = !!expandedIds[it.id];
              
              return (
                <motion.div
                  layout
                  key={it.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                  onClick={(e) => toggleCheck(it.id, e)}
                  className={`border rounded-2xl cursor-pointer p-3 sm:p-3.5 flex flex-col transition-all active:scale-99 relative select-none ${
                    isChecked
                      ? "bg-emerald-50/20 border-emerald-100/55 shadow-3xs text-slate-400"
                      : "bg-white border-rose-50/70 hover:border-rose-150 shadow-2xs hover:shadow-xs text-slate-850"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox circle indicator */}
                    <div className="pt-0.5 shrink-0">
                      <div 
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isChecked 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-slate-300 hover:border-rose-400 bg-slate-50"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </div>
                    </div>

                    {/* Content text */}
                    <div className="flex-1 space-y-1 minimum-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Crucial / Tuyên quyết badge */}
                        {it.isCrucial && (
                          <span className={`text-[8.5px] uppercase font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border ${
                            isChecked
                              ? "bg-slate-100 border-slate-200 text-slate-400"
                              : "bg-red-50 text-red-600 border-red-150 animate-pulse"
                          }`}>
                            <AlertTriangle className="w-2.5 h-2.5" /> TUYÊN QUYẾT
                          </span>
                        )}

                        {/* Category Name badge */}
                        <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-md border ${
                          isChecked 
                            ? "bg-slate-50 border-slate-100 text-slate-400"
                            : it.category === "document" 
                              ? "bg-blue-50 border-blue-105 text-blue-600" 
                              : it.category === "mother"
                                ? "bg-purple-50 border-purple-105 text-purple-600" 
                                : "bg-orange-50 border-orange-105 text-orange-600"
                        }`}>
                          {it.category === "document" ? "Hồ Sơ" : it.category === "mother" ? "Cho Mẹ" : "Cho Con"}
                        </span>

                        {/* Quantity suggestion */}
                        <span className={`text-[9.5px] font-black select-none ${isChecked ? "text-slate-400" : "text-amber-700"}`}>
                          ({it.qty})
                        </span>
                      </div>

                      {/* Name of item */}
                      <h4 className={`text-xs font-extrabold max-w-full leading-snug tracking-tight ${isChecked ? "line-through text-slate-405 font-medium" : "text-slate-800"}`}>
                        {it.name}
                      </h4>
                    </div>

                    {/* Expand/Collapse of Rational and Delete actions */}
                    <div className="flex items-center gap-1 pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Help info toggle */}
                      <button
                        onClick={(e) => toggleExpand(it.id, e)}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          isExpanded 
                            ? "bg-slate-800 border-slate-850 text-white" 
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                        }`}
                        title="Bấm để xem kinh nghiệm chuẩn bị chi tiết"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {/* Custom Delete button */}
                      {it.id.startsWith("custom_") && (
                        <button
                          onClick={(e) => handleDeleteItem(it.id, it.name, e)}
                          className="w-7 h-7 rounded-lg border border-red-100 text-red-500 bg-red-50/50 hover:bg-red-50 hover:text-red-600 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                          title="Xóa vật phẩm này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Collapsible details info */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2.5 pt-2.5 border-t border-slate-100 text-[10.5px] font-medium leading-relaxed"
                      >
                        <div className="bg-amber-50/30 p-2.5 rounded-xl border border-amber-100/40 text-slate-700 flex gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-800">💡 Kinh nghiệm y khoa:</strong> <span className={isChecked ? "text-slate-400" : "text-slate-600"}>{it.desc}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER CONTROLS TO RESTORE / RESET */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] font-medium text-slate-400">
        <span>Bản quyền nội dung thuộc © Babicare</span>
        <div className="flex items-center gap-4">
          <button
            onClick={handleResetChecks}
            disabled={completedCount === 0}
            className={`flex items-center gap-0.5 cursor-pointer hover:underline outline-none transition-all ${
              completedCount === 0 ? "opacity-35 cursor-not-allowed text-slate-300" : "text-slate-500 hover:text-rose-605"
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa tích hết</span>
          </button>
          
          <button
            onClick={handleRestoreDefaults}
            className="flex items-center gap-0.5 text-rose-500 hover:text-rose-650 cursor-pointer hover:underline outline-none"
          >
            <span>Khôi phục mẫu gốc</span>
          </button>
        </div>
      </div>
    </div>
  );
}
