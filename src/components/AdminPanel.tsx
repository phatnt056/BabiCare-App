import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Settings, 
  FileText, 
  PlusCircle, 
  Trash2, 
  Save, 
  CheckCircle,
  Tag,
  Link,
  DollarSign,
  Image as ImageIcon,
  Edit2,
  BookOpen,
  Check,
  ChevronRight,
  ChevronDown,
  BookMarked,
  Info
} from "lucide-react";
import { AppTextSettings, AffiliateProduct } from "../types";
import { 
  VitaminInfo, 
  FoodNutrition, 
  ImmunizationMilestone, 
  MassageSpaSkin, 
  ThaiGiaoMilestone 
} from "../data/pregnancyHandbook";

interface AdminPanelProps {
  currentTexts: AppTextSettings;
  onSaveTexts: (newTexts: AppTextSettings) => Promise<void>;
  recommendedProducts: AffiliateProduct[];
  onAddProduct: (newProduct: AffiliateProduct) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  
  // Handbook states & handlers
  vitaminData: VitaminInfo[];
  onSaveVitaminData: (data: VitaminInfo[]) => Promise<void>;
  nutritionStages: FoodNutrition[];
  onSaveNutritionStages: (data: FoodNutrition[]) => Promise<void>;
  clinicalMilestones: ImmunizationMilestone[];
  onSaveClinicalMilestones: (data: ImmunizationMilestone[]) => Promise<void>;
  massageAndSkinSecrets: MassageSpaSkin[];
  onSaveMassageAndSkinSecrets: (data: MassageSpaSkin[]) => Promise<void>;
  thaiGiaoMilestones: ThaiGiaoMilestone[];
  onSaveThaiGiaoMilestones: (data: ThaiGiaoMilestone[]) => Promise<void>;
  
  onClose: () => void;
}

export default function AdminPanel({
  currentTexts,
  onSaveTexts,
  recommendedProducts,
  onAddProduct,
  onDeleteProduct,
  
  vitaminData,
  onSaveVitaminData,
  nutritionStages,
  onSaveNutritionStages,
  clinicalMilestones,
  onSaveClinicalMilestones,
  massageAndSkinSecrets,
  onSaveMassageAndSkinSecrets,
  thaiGiaoMilestones,
  onSaveThaiGiaoMilestones,
  
  onClose
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"texts" | "products" | "handbook">("texts");
  const [handbookSection, setHandbookSection] = useState<"vitamin" | "nutrition" | "milestone" | "massage" | "thaigiao">("vitamin");
  
  // Active editing index
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Custom text states
  const [appTitle, setAppTitle] = useState(currentTexts.appTitle || "BaBiCare");
  const [homepageSubtitle, setHomepageSubtitle] = useState(currentTexts.homepageSubtitle || "");
  const [pregnancyTitle, setPregnancyTitle] = useState(currentTexts.pregnancyTitle || "");
  const [countdownLabel, setCountdownLabel] = useState(currentTexts.countdownLabel || "");
  const [maternityHandbookTitle, setMaternityHandbookTitle] = useState(currentTexts.maternityHandbookTitle || "");
  const [aiDoctorTitle, setAiDoctorTitle] = useState(currentTexts.aiDoctorTitle || "");
  const [aiDoctorSubtitle, setAiDoctorSubtitle] = useState(currentTexts.aiDoctorSubtitle || "");
  
  const [savingTexts, setSavingTexts] = useState(false);
  const [textStatus, setTextStatus] = useState("");

  // Product form states
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodAffiliateUrl, setProdAffiliateUrl] = useState("");
  const [prodImageUrl, setProdImageUrl] = useState("");
  const [prodCategory, setProdCategory] = useState<"vitamin" | "stretch_mark" | "food_drink">("vitamin");
  const [addingProduct, setAddingProduct] = useState(false);
  const [productStatus, setProductStatus] = useState("");

  // Temp states for Vitamin Editing
  const [vitName, setVitName] = useState("");
  const [vitRole, setVitRole] = useState("");
  const [vitDosage, setVitDosage] = useState("");
  const [vitTiming, setVitTiming] = useState("");
  const [vitSources, setVitSources] = useState("");
  const [vitNotice, setVitNotice] = useState("");

  // Temp states for Nutrition Editing
  const [nutStage, setNutStage] = useState("");
  const [nutRecommended, setNutRecommended] = useState("");
  const [nutDishes, setNutDishes] = useState("");
  const [nutDislikes, setNutDislikes] = useState("");
  const [nutTip, setNutTip] = useState("");

  // Temp states for Milestone Editing
  const [milTimeframe, setMilTimeframe] = useState("");
  const [milName, setMilName] = useState("");
  const [milPurpose, setMilPurpose] = useState("");
  const [milImportance, setMilImportance] = useState<"CRITICAL" | "HIGH" | "RECOMMENDED">("HIGH");
  const [milDoctorTip, setMilDoctorTip] = useState("");

  // Temp states for Massage Editing
  const [msgTopic, setMsgTopic] = useState("");
  const [msgBenefits, setMsgBenefits] = useState("");
  const [msgSteps, setMsgSteps] = useState("");
  const [msgStretch, setMsgStretch] = useState("");
  const [msgOils, setMsgOils] = useState("");
  const [msgWarning, setMsgWarning] = useState("");

  // Temp states for Thai Giao Editing
  const [tgStageName, setTgStageName] = useState("");
  const [tgMinWeek, setTgMinWeek] = useState(1);
  const [tgMaxWeek, setTgMaxWeek] = useState(42);
  const [tgFocusDesc, setTgFocusDesc] = useState("");
  const [tgAuditory, setTgAuditory] = useState("");
  const [tgVisual, setTgVisual] = useState("");
  const [tgKinesthetic, setTgKinesthetic] = useState("");
  const [tgDinhDuong, setTgDinhDuong] = useState("");
  const [tgEmotion, setTgEmotion] = useState("");
  const [tgFatherTask, setTgFatherTask] = useState("");
  const [tgDailyPractice, setTgDailyPractice] = useState("");

  const [handbookStatus, setHandbookStatus] = useState("");

  const handleSaveTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTexts(true);
    setTextStatus("");
    try {
      await onSaveTexts({
        id: "texts",
        appTitle,
        homepageSubtitle,
        pregnancyTitle,
        countdownLabel,
        maternityHandbookTitle,
        aiDoctorTitle,
        aiDoctorSubtitle
      });
      setTextStatus("✅ Lưu cấu hình văn bản thành công!");
      setTimeout(() => setTextStatus(""), 3000);
    } catch (err) {
      setTextStatus("❌ Không thể lưu cấu hình.");
    } finally {
      setSavingTexts(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodAffiliateUrl || !prodImageUrl) {
      setProductStatus("⚠️ Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setAddingProduct(true);
    setProductStatus("");
    try {
      const newProduct: AffiliateProduct = {
        id: "product_" + Date.now(),
        name: prodName,
        price: prodPrice,
        affiliateUrl: prodAffiliateUrl,
        imageUrl: prodImageUrl,
        category: prodCategory
      };
      await onAddProduct(newProduct);
      setProdName("");
      setProdPrice("");
      setProdAffiliateUrl("");
      setProdImageUrl("");
      setProductStatus("✅ Thêm sản phẩm thành công!");
      setTimeout(() => setProductStatus(""), 3000);
    } catch (err) {
      setProductStatus("❌ Lỗi dữ liệu không thể thêm.");
    } finally {
      setAddingProduct(false);
    }
  };

  // Setup Edit Handlers
  const startEditVitamin = (idx: number, vit: VitaminInfo) => {
    setEditingIndex(idx);
    setVitName(vit.name);
    setVitRole(vit.role);
    setVitDosage(vit.dosage);
    setVitTiming(vit.timing);
    setVitSources(vit.sources.join(", "));
    setVitNotice(vit.notice);
  };

  const saveVitaminEdit = async (idx: number) => {
    const updated = [...vitaminData];
    updated[idx] = {
      name: vitName,
      role: vitRole,
      dosage: vitDosage,
      timing: vitTiming,
      sources: vitSources.split(",").map(s => s.trim()).filter(Boolean),
      notice: vitNotice
    };
    try {
      await onSaveVitaminData(updated);
      setEditingIndex(null);
      setHandbookStatus("✅ Cập nhật Vitamin thành công!");
      setTimeout(() => setHandbookStatus(""), 3000);
    } catch (err) {
      setHandbookStatus("❌ Gặp lỗi khi lưu.");
    }
  };

  const startEditNutrition = (idx: number, nut: FoodNutrition) => {
    setEditingIndex(idx);
    setNutStage(nut.stage);
    setNutRecommended(nut.recommendedFoods.join(", "));
    setNutDishes(nut.dishes.join("\n"));
    setNutDislikes(nut.dislikes.join("\n"));
    setNutTip(nut.dietaryTip);
  };

  const saveNutritionEdit = async (idx: number) => {
    const updated = [...nutritionStages];
    updated[idx] = {
      stage: nutStage,
      recommendedFoods: nutRecommended.split(",").map(s => s.trim()).filter(Boolean),
      dishes: nutDishes.split("\n").map(s => s.trim()).filter(Boolean),
      dislikes: nutDislikes.split("\n").map(s => s.trim()).filter(Boolean),
      dietaryTip: nutTip
    };
    try {
      await onSaveNutritionStages(updated);
      setEditingIndex(null);
      setHandbookStatus("✅ Cập nhật Dinh Dưỡng thành công!");
      setTimeout(() => setHandbookStatus(""), 3000);
    } catch (err) {
      setHandbookStatus("❌ Gặp lỗi khi lưu.");
    }
  };

  const startEditMilestone = (idx: number, ms: ImmunizationMilestone) => {
    setEditingIndex(idx);
    setMilTimeframe(ms.timeframe);
    setMilName(ms.name);
    setMilPurpose(ms.purpose);
    setMilImportance(ms.importance);
    setMilDoctorTip(ms.doctorTip);
  };

  const saveMilestoneEdit = async (idx: number) => {
    const updated = [...clinicalMilestones];
    updated[idx] = {
      timeframe: milTimeframe,
      name: milName,
      purpose: milPurpose,
      importance: milImportance,
      doctorTip: milDoctorTip
    };
    try {
      await onSaveClinicalMilestones(updated);
      setEditingIndex(null);
      setHandbookStatus("✅ Cập nhật Lịch Khám thành công!");
      setTimeout(() => setHandbookStatus(""), 3000);
    } catch (err) {
      setHandbookStatus("❌ Gặp lỗi khi lưu.");
    }
  };

  const startEditMassage = (idx: number, b: MassageSpaSkin) => {
    setEditingIndex(idx);
    setMsgTopic(b.topic);
    setMsgBenefits(b.benefits);
    setMsgSteps(b.instructionSteps.join("\n"));
    setMsgStretch(b.stretchPreventions);
    setMsgOils(b.recommendedOils.join(", "));
    setMsgWarning(b.warning);
  };

  const saveMassageEdit = async (idx: number) => {
    const updated = [...massageAndSkinSecrets];
    updated[idx] = {
      topic: msgTopic,
      benefits: msgBenefits,
      instructionSteps: msgSteps.split("\n").map(s => s.trim()).filter(Boolean),
      stretchPreventions: msgStretch,
      recommendedOils: msgOils.split(",").map(s => s.trim()).filter(Boolean),
      warning: msgWarning
    };
    try {
      await onSaveMassageAndSkinSecrets(updated);
      setEditingIndex(null);
      setHandbookStatus("✅ Cập nhật Massage & Spa thành công!");
      setTimeout(() => setHandbookStatus(""), 3000);
    } catch (err) {
      setHandbookStatus("❌ Gặp lỗi khi lưu.");
    }
  };

  const startEditThaiGiao = (idx: number, tg: ThaiGiaoMilestone) => {
    setEditingIndex(idx);
    setTgStageName(tg.stageName);
    setTgMinWeek(tg.minWeek);
    setTgMaxWeek(tg.maxWeek);
    setTgFocusDesc(tg.focusDesc);
    setTgAuditory(tg.auditory);
    setTgVisual(tg.visual);
    setTgKinesthetic(tg.kinesthetic);
    setTgDinhDuong(tg.dinhDuong);
    setTgEmotion(tg.emotion);
    setTgFatherTask(tg.fatherTask);
    setTgDailyPractice(tg.dailyPractice);
  };

  const saveThaiGiaoEdit = async (idx: number) => {
    const updated = [...thaiGiaoMilestones];
    updated[idx] = {
      minWeek: Number(tgMinWeek),
      maxWeek: Number(tgMaxWeek),
      stageName: tgStageName,
      focusDesc: tgFocusDesc,
      auditory: tgAuditory,
      visual: tgVisual,
      kinesthetic: tgKinesthetic,
      dinhDuong: tgDinhDuong,
      emotion: tgEmotion,
      fatherTask: tgFatherTask,
      dailyPractice: tgDailyPractice
    };
    try {
      await onSaveThaiGiaoMilestones(updated);
      setEditingIndex(null);
      setHandbookStatus("✅ Cập nhật Thai Giáo thành công!");
      setTimeout(() => setHandbookStatus(""), 3000);
    } catch (err) {
      setHandbookStatus("❌ Gặp lỗi khi lưu.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-50 flex justify-end">
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="w-full sm:max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col"
      >
        {/* Panel Header */}
        <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 to-pink-50/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-500 text-white rounded-xl">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Hệ Thống Quản Trị Babicare</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Thay đổi nội dung thời gian thực</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-550 cursor-pointer active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel Tab Bar */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-1.5">
          <button
            onClick={() => { setActiveSubTab("texts"); setEditingIndex(null); }}
            className={`flex-1 cursor-pointer py-2 px-2 text-center text-xs font-black rounded-lg transition-all ${
              activeSubTab === "texts"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            ✏️ Sửa Chữ App
          </button>
          <button
            onClick={() => { setActiveSubTab("handbook"); setEditingIndex(null); }}
            className={`flex-1 cursor-pointer py-2 px-2 text-center text-xs font-black rounded-lg transition-all ${
              activeSubTab === "handbook"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            📖 Sửa Cẩm Nang
          </button>
          <button
            onClick={() => { setActiveSubTab("products"); setEditingIndex(null); }}
            className={`flex-1 cursor-pointer py-2 px-2 text-center text-xs font-black rounded-lg transition-all ${
              activeSubTab === "products"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            🛍️ Sản Phẩm
          </button>
        </div>

        {/* Panel Core Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {activeSubTab === "texts" ? (
            /* Tab: Dynamic texts editing form */
            <form onSubmit={handleSaveTexts} className="space-y-4">
              <p className="text-[10px] text-slate-450 leading-normal font-semibold">
                Tại đây, Admin có thể dễ dàng thay đổi văn bản các tiêu đề chính trên giao diện app, hệ thống sẽ đồng bộ xuống thiết bị của người dùng ngay lập tức!
              </p>

              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-rose-500 uppercase">Tên Application (Header):</label>
                  <input
                    type="text"
                    value={appTitle}
                    onChange={(e) => setAppTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-705 bg-white focus:border-rose-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-rose-500 uppercase">Slogan / Lời chào Homepage:</label>
                  <input
                    type="text"
                    value={homepageSubtitle}
                    onChange={(e) => setHomepageSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-705 bg-white focus:border-rose-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-rose-500 uppercase">Tiêu đề Thẻ Chỉ Số Thai Nhi:</label>
                  <input
                    type="text"
                    value={pregnancyTitle}
                    onChange={(e) => setPregnancyTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-705 bg-white focus:border-rose-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-rose-500 uppercase">Nhãn Đếm Ngược Ngày Sinh:</label>
                  <input
                    type="text"
                    value={countdownLabel}
                    onChange={(e) => setCountdownLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-705 bg-white focus:border-rose-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-rose-500 uppercase">Tên Tab Cẩm Nang Thai Giáo:</label>
                  <input
                    type="text"
                    value={maternityHandbookTitle}
                    onChange={(e) => setMaternityHandbookTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-705 bg-white focus:border-rose-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-rose-500 uppercase">Tên Trợ Lý BaBiCare AI:</label>
                  <input
                    type="text"
                    value={aiDoctorTitle}
                    onChange={(e) => setAiDoctorTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-705 bg-white focus:border-rose-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-rose-500 uppercase">Mô tả phụ của Trợ lý AI:</label>
                  <input
                    type="text"
                    value={aiDoctorSubtitle}
                    onChange={(e) => setAiDoctorSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-705 bg-white focus:border-rose-400 outline-none"
                  />
                </div>

                {textStatus && (
                  <p className="text-[10.5px] font-bold text-center text-rose-500 animate-pulse">{textStatus}</p>
                )}

                <button
                  type="submit"
                  disabled={savingTexts}
                  className="w-full cursor-pointer bg-slate-900 text-white font-black hover:bg-slate-800 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingTexts ? "Đang đồng bộ..." : "Cập Nhật Văn Bản Toàn App"}</span>
                </button>
              </div>
            </form>
          ) : activeSubTab === "handbook" ? (
            /* Dynamic handbook contents editing screen */
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-3 rounded-2xl text-white">
                <h4 className="font-extrabold text-xs flex items-center gap-1 bg-black/10 px-2 py-1 rounded-lg w-fit mb-1">
                  <BookOpen className="w-3.5 h-3.5" /> Biên tập Cẩm nang & Thai giáo
                </h4>
                <p className="text-[10px] opacity-90 leading-normal">
                  Bạn có thể lựa chọn chuyên mục bên dưới để viết lại sách hướng dẫn cho các mẹ, bách khoa toàn thư, lịch trình và cả thai giáo theo tuần.
                </p>
              </div>

              {/* Sub tabs inside the handbook tab */}
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                {[
                  { id: "vitamin", label: "💊 Vit" },
                  { id: "nutrition", label: "🥑 DinhDưỡng" },
                  { id: "milestone", label: "📅 LịchKhám" },
                  { id: "massage", label: "💆 Massage" },
                  { id: "thaigiao", label: "🎧 ThaiGiáo" }
                ].map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => { setHandbookSection(sec.id as any); setEditingIndex(null); }}
                    className={`flex-1 min-w-[70px] py-1.5 px-1.5 rounded-lg text-center text-[9px] sm:text-[10px] font-black transition-all cursor-pointer ${
                      handbookSection === sec.id
                        ? "bg-white text-rose-600 shadow-3xs border border-rose-100"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              {handbookStatus && (
                <p className="text-[10px] font-black text-rose-600 text-center animate-bounce">{handbookStatus}</p>
              )}

              <div className="border border-slate-105 rounded-2xl p-3 bg-slate-50/50 space-y-3">
                
                {/* 1. EDITING VITAMIN DATA */}
                {handbookSection === "vitamin" && (
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1">Chỉnh Sửa Vi Chất Y Khoa</h5>
                    
                    {editingIndex === null ? (
                      <div className="space-y-2">
                        {vitaminData.map((vit, idx) => (
                          <div key={idx} className="bg-white p-3 border border-slate-200 rounded-xl flex items-center justify-between gap-2.5">
                            <div className="min-w-0">
                              <p className="font-extrabold text-xs text-slate-850 truncate">{vit.name}</p>
                              <p className="text-[9px] text-slate-400 font-medium line-clamp-1 italic">{vit.role}</p>
                            </div>
                            <button
                              onClick={() => startEditVitamin(idx, vit)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg text-[10px] font-black text-rose-600 flex items-center gap-0.5"
                            >
                              <Edit2 className="w-3 h-3" /> Sửa
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-white border border-rose-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b pb-1.5 border-rose-50">
                          <span className="text-[10px] font-black text-rose-600 uppercase">Đang Sửa: {vitaminData[editingIndex].name}</span>
                          <button onClick={() => setEditingIndex(null)} className="text-slate-400 text-[10px] font-extrabold hover:text-slate-600">Hủy</button>
                        </div>

                        <div className="space-y-2 text-xs text-slate-700">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Tên vi chất:</label>
                            <input value={vitName} onChange={(e) => setVitName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Vai trò chính:</label>
                            <textarea value={vitRole} onChange={(e) => setVitRole(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400">Liều lượng:</label>
                              <input value={vitDosage} onChange={(e) => setVitDosage(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400">Thời điểm uống:</label>
                              <input value={vitTiming} onChange={(e) => setVitTiming(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Nguồn thực phẩm (Cách nhau bởi dấu phẩy):</label>
                            <input value={vitSources} onChange={(e) => setVitSources(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Lưu ý quan trọng:</label>
                            <textarea value={vitNotice} onChange={(e) => setVitNotice(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>

                          <button
                            onClick={() => saveVitaminEdit(editingIndex)}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-lg text-center font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> Lưu Thay Đổi Vitamin
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. EDITING NUTRITION DATA */}
                {handbookSection === "nutrition" && (
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Dinh Dưỡng Theo Kỳ</h5>
                    
                    {editingIndex === null ? (
                      <div className="space-y-2">
                        {nutritionStages.map((nut, idx) => (
                          <div key={idx} className="bg-white p-3 border border-slate-200 rounded-xl flex items-center justify-between gap-1.5">
                            <div className="min-w-0">
                              <p className="font-extrabold text-xs text-slate-850 truncate">{nut.stage}</p>
                              <p className="text-[9px] text-slate-400 font-medium line-clamp-1 italic">{nut.dietaryTip}</p>
                            </div>
                            <button
                              onClick={() => startEditNutrition(idx, nut)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg text-[10px] font-black text-rose-600 flex items-center gap-0.5 shrink-0"
                            >
                              <Edit2 className="w-3 h-3" /> Sửa
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-white border border-rose-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b pb-1.5 border-rose-50">
                          <span className="text-[10px] font-black text-rose-600 uppercase">Đang Sửa Dinh Dưỡng ({nutritionStages[editingIndex].stage})</span>
                          <button onClick={() => setEditingIndex(null)} className="text-slate-400 text-[10px] font-extrabold hover:text-slate-600">Hủy</button>
                        </div>

                        <div className="space-y-2 text-xs text-slate-700">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Tên Giai Đoạn:</label>
                            <input value={nutStage} onChange={(e) => setNutStage(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Bí quyết ăn uống / Hướng dẫn giảm nghén:</label>
                            <textarea value={nutTip} onChange={(e) => setNutTip(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Thực phẩm khuyên dùng (Cách nhau bởi dấu phẩy):</label>
                            <input value={nutRecommended} onChange={(e) => setNutRecommended(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Món ăn gợi ý dưỡng thai (Mỗi dòng một món):</label>
                            <textarea value={nutDishes} onChange={(e) => setNutDishes(e.target.value)} rows={3} className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Thú kiêng kỵ tiêu cực (Mỗi dòng một thực phẩm):</label>
                            <textarea value={nutDislikes} onChange={(e) => setNutDislikes(e.target.value)} rows={3} className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
                          </div>

                          <button
                            onClick={() => saveNutritionEdit(editingIndex)}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-lg text-center font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> Lưu Thay Đổi Dinh Dưỡng
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. EDITING CLINICAL MILESTONES (LỊCH KHÁM THAI) */}
                {handbookSection === "milestone" && (
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Lịch Khám & Xét Nghiệm Thai</h5>
                    
                    {editingIndex === null ? (
                      <div className="space-y-2">
                        {clinicalMilestones.map((ms, idx) => (
                          <div key={idx} className="bg-white p-3 border border-slate-200 rounded-xl flex items-center justify-between gap-1.5">
                            <div className="min-w-0">
                              <p className="font-extrabold text-xs text-slate-850 truncate">{ms.timeframe}</p>
                              <p className="text-[9px] text-slate-400 font-medium line-clamp-1 italic">{ms.name}</p>
                            </div>
                            <button
                              onClick={() => startEditMilestone(idx, ms)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg text-[10px] font-black text-rose-600 flex items-center gap-0.5 shrink-0"
                            >
                              <Edit2 className="w-3 h-3" /> Sửa
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-white border border-rose-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b pb-1.5 border-rose-50">
                          <span className="text-[10px] font-black text-rose-600 uppercase">Sửa Mốc Khám ({clinicalMilestones[editingIndex].timeframe})</span>
                          <button onClick={() => setEditingIndex(null)} className="text-slate-400 text-[10px] font-extrabold hover:text-slate-600">Hủy</button>
                        </div>

                        <div className="space-y-2 text-xs text-slate-700">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400">Khoảng tuần thai:</label>
                              <input value={milTimeframe} onChange={(e) => setMilTimeframe(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400">Mức độ quan trọng:</label>
                              <select 
                                value={milImportance} 
                                onChange={(e) => setMilImportance(e.target.value as any)} 
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                              >
                                <option value="CRITICAL">⚠️ CRITICAL (Bắt buộc)</option>
                                <option value="HIGH">⭐️ HIGH (Quan trọng)</option>
                                <option value="RECOMMENDED">✅ RECOMMENDED (Khuyên dùng)</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Tên siêu âm/xét nghiệm:</label>
                            <input value={milName} onChange={(e) => setMilName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Mục đích chuyên sâu:</label>
                            <textarea value={milPurpose} onChange={(e) => setMilPurpose(e.target.value)} rows={3} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Lời khuyên trực tiếp của bác sĩ:</label>
                            <textarea value={milDoctorTip} onChange={(e) => setMilDoctorTip(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>

                          <button
                            onClick={() => saveMilestoneEdit(editingIndex)}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-lg text-center font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> Lưu Thay Đổi Mốc Khám
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. EDITING MASSAGE SPA SKIN SECRET */}
                {handbookSection === "massage" && (
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Massage & Ngừa Rạn Da</h5>
                    
                    {editingIndex === null ? (
                      <div className="space-y-2">
                        {massageAndSkinSecrets.map((b, idx) => (
                          <div key={idx} className="bg-white p-3 border border-slate-200 rounded-xl flex items-center justify-between gap-1.5">
                            <div className="min-w-0">
                              <p className="font-extrabold text-xs text-slate-850 truncate">{b.topic}</p>
                              <p className="text-[9px] text-slate-400 font-medium line-clamp-1 italic">{b.benefits}</p>
                            </div>
                            <button
                              onClick={() => startEditMassage(idx, b)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg text-[10px] font-black text-rose-600 flex items-center gap-0.5 shrink-0"
                            >
                              <Edit2 className="w-3 h-3" /> Sửa
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-white border border-rose-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b pb-1.5 border-rose-50">
                          <span className="text-[10px] font-black text-rose-600 uppercase">Sửa Topic ({massageAndSkinSecrets[editingIndex].topic})</span>
                          <button onClick={() => setEditingIndex(null)} className="text-slate-400 text-[10px] font-extrabold hover:text-slate-600">Hủy</button>
                        </div>

                        <div className="space-y-2 text-xs text-slate-700">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Tiêu đề chủ đề:</label>
                            <input value={msgTopic} onChange={(e) => setMsgTopic(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Lợi ích mang lại:</label>
                            <textarea value={msgBenefits} onChange={(e) => setMsgBenefits(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Các bước thực hiện (Mỗi bước một dòng):</label>
                            <textarea value={msgSteps} onChange={(e) => setMsgSteps(e.target.value)} rows={3} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Bí quyết chống rạn da bụng:</label>
                            <textarea value={msgStretch} onChange={(e) => setMsgStretch(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Các loại dầu khuyên dùng (Cách nhau bởi dấu phẩy):</label>
                            <input value={msgOils} onChange={(e) => setMsgOils(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400">Chống chỉ định quan trọng:</label>
                            <textarea value={msgWarning} onChange={(e) => setMsgWarning(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>

                          <button
                            onClick={() => saveMassageEdit(editingIndex)}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-lg text-center font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> Lưu Thay Đổi Massage Bầu
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. EDITING EXPANSIVE THAI GIAO MILIEUS MILS */}
                {handbookSection === "thaigiao" && (
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Thai Giáo Khoa Học Theo Tuần</h5>
                    
                    {editingIndex === null ? (
                      <div className="space-y-2">
                        {thaiGiaoMilestones.map((tg, idx) => (
                          <div key={idx} className="bg-white p-3 border border-slate-200 rounded-xl flex items-center justify-between gap-1.5">
                            <div className="min-w-0">
                              <p className="font-extrabold text-xs text-slate-850 truncate">{tg.stageName}</p>
                              <p className="text-[9px] text-slate-400 font-medium line-clamp-1 italic">Trọng tâm: {tg.focusDesc}</p>
                            </div>
                            <button
                              onClick={() => startEditThaiGiao(idx, tg)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg text-[10px] font-black text-rose-600 flex items-center gap-0.5 shrink-0"
                            >
                              <Edit2 className="w-3 h-3" /> Sửa
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-white border border-rose-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b pb-1.5 border-rose-50">
                          <span className="text-[10px] font-black text-rose-600 uppercase">Sửa Thai Giáo ({thaiGiaoMilestones[editingIndex].minWeek}-{thaiGiaoMilestones[editingIndex].maxWeek}w)</span>
                          <button onClick={() => setEditingIndex(null)} className="text-slate-400 text-[10px] font-extrabold hover:text-slate-600">Hủy</button>
                        </div>

                        <div className="space-y-2 text-xs text-slate-700 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400">Từ tuần:</label>
                              <input type="number" value={tgMinWeek} onChange={(e) => setTgMinWeek(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400">Đến tuần:</label>
                              <input type="number" value={tgMaxWeek} onChange={(e) => setTgMaxWeek(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400">Tên dấu mốc:</label>
                              <input value={tgStageName} onChange={(e) => setTgStageName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs uppercase font-extrabold text-rose-700" />
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-xs">
                            <label className="text-[9px] font-bold text-rose-600 block">🎯 Trọng tâm thai giáo:</label>
                            <textarea value={tgFocusDesc} onChange={(e) => setTgFocusDesc(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                          
                          <div className="space-y-1 text-xs">
                            <label className="text-[9px] font-bold text-slate-500 block">🔊 Thai giáo Thính Giác (Âm nhạc):</label>
                            <textarea value={tgAuditory} onChange={(e) => setTgAuditory(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs animate-pulse" />
                          </div>

                          <div className="space-y-1 text-xs">
                            <label className="text-[9px] font-bold text-slate-500 block">👁️ Thai giáo Thị Giác:</label>
                            <textarea value={tgVisual} onChange={(e) => setTgVisual(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>

                          <div className="space-y-1 text-xs">
                            <label className="text-[9px] font-bold text-slate-500 block">🤸 Thai giáo Xúc giác / Vận động:</label>
                            <textarea value={tgKinesthetic} onChange={(e) => setTgKinesthetic(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>

                          <div className="space-y-1 text-xs">
                            <label className="text-[9px] font-bold text-slate-500 block">🥦 Thai giáo Dinh dưỡng / Vị giác:</label>
                            <textarea value={tgDinhDuong} onChange={(e) => setTgDinhDuong(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>

                          <div className="space-y-1 text-xs">
                            <label className="text-[9px] font-bold text-slate-500 block">🧠 Thai giáo Cảm xúc (Tâm hồn):</label>
                            <textarea value={tgEmotion} onChange={(e) => setTgEmotion(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>

                          <div className="space-y-1 text-xs">
                            <label className="text-[9px] font-bold text-slate-500 block">👨 Nhiệm vụ dành cho Bố:</label>
                            <textarea value={tgFatherTask} onChange={(e) => setTgFatherTask(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold" />
                          </div>

                          <div className="space-y-1 text-xs pt-1">
                            <label className="text-[9px] font-bold text-rose-500 block uppercase">📝 Thử thách luyện tập hàng ngày:</label>
                            <textarea value={tgDailyPractice} onChange={(e) => setTgDailyPractice(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 text-rose-950 rounded-lg text-xs bg-rose-50/20" />
                          </div>

                          <button
                            onClick={() => saveThaiGiaoEdit(editingIndex)}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-lg text-center font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer mt-2"
                          >
                            <Save className="w-3.5 h-3.5" /> Lưu Thay Đổi Thai Giáo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          ) : (
            /* Tab: Product Management */
            <div className="space-y-5">
              {/* Product addition form */}
              <form onSubmit={handleAddProduct} className="p-4 border border-rose-100 bg-rose-50/15 rounded-2xl space-y-3">
                <h4 className="font-extrabold text-[11px] text-rose-600 flex items-center gap-1.5 uppercase">
                  <PlusCircle className="w-4 h-4" /> Thêm Sản phẩm Thai Kỳ Kì Vọng
                </h4>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Tên sản phẩm..."
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-705 bg-white outline-none focus:border-rose-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative flex items-center">
                      <Tag className="w-3 h-3 absolute left-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Giá bán (340.000đ)..."
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 border border-slate-200 rounded-lg text-[10px] text-slate-705 bg-white outline-none focus:border-rose-300"
                      />
                    </div>

                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[10px] text-slate-500 bg-white outline-none font-semibold cursor-pointer"
                    >
                      <option value="vitamin">💊 Vitamin Bầu</option>
                      <option value="stretch_mark">🌱 Ngừa Rạn Da</option>
                      <option value="food_drink">🥑 Ăn - Uống</option>
                    </select>
                  </div>

                  <div className="relative flex items-center">
                    <Link className="w-3 h-3 absolute left-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Đường dẫn tiếp thị Shopee (Affiliate URL)..."
                      value={prodAffiliateUrl}
                      onChange={(e) => setProdAffiliateUrl(e.target.value)}
                      className="w-full pl-7 pr-2 py-1.5 border border-slate-200 rounded-lg text-[10px] text-slate-705 bg-white outline-none focus:border-rose-300"
                    />
                  </div>

                  <div className="relative flex items-center">
                    <ImageIcon className="w-3 h-3 absolute left-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Đường dẫn hình ảnh (Unsplash)..."
                      value={prodImageUrl}
                      onChange={(e) => setProdImageUrl(e.target.value)}
                      className="w-full pl-7 pr-2 py-1.5 border border-slate-200 rounded-lg text-[10px] text-slate-705 bg-white outline-none focus:border-rose-300"
                    />
                  </div>

                  {productStatus && (
                    <p className="text-[10px] font-bold text-center text-rose-500 animate-pulse">{productStatus}</p>
                  )}

                  <button
                    type="submit"
                    disabled={addingProduct}
                    className="w-full cursor-pointer bg-rose-500 hover:bg-rose-550 text-white font-black py-2.5 rounded-xl text-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform"
                  >
                    <span>{addingProduct ? "Đang đẩy lên..." : "Kích hoạt & Đưa vào mục"}</span>
                  </button>
                </div>
              </form>

              {/* Current database list */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-[11px] text-slate-700 uppercase font-bold text-rose-550">Sản phẩm hiện hành ({recommendedProducts.length})</h4>
                <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1 no-scrollbar border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                  {recommendedProducts.map((prod) => (
                    <div 
                      key={prod.id} 
                      className="bg-white p-2.5 rounded-xl border border-slate-150 flex items-center justify-between gap-3 text-left animate-fade-in"
                    >
                      <img 
                        src={prod.imageUrl} 
                        alt={prod.name} 
                        className="w-9 h-9 object-cover rounded-lg shrink-0 border border-slate-100 animate-fade-in" 
                      />
                      <div className="flex-1 min-w-0 font-bold">
                        <p className="font-black text-[10px] text-slate-800 line-clamp-1 truncate">{prod.name}</p>
                        <div className="flex items-center gap-2 text-[8px] text-slate-400 font-bold">
                          <span className="text-rose-500">{prod.price}</span>
                          <span>•</span>
                          <span className="capitalize">{prod.category === "vitamin" ? "Vitamin" : prod.category === "stretch_mark" ? "Ngừa rạn" : "Ăn - uống"}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:bg-rose-550 hover:text-white flex items-center justify-center cursor-pointer border border-slate-100 active:scale-95 transition-all"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {recommendedProducts.length === 0 && (
                    <p className="text-center text-[9px] py-4 text-slate-400 font-semibold italic">Không có sản phẩm tùy biến nào. Hệ thống đang dùng tài nguyên mẫu.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
