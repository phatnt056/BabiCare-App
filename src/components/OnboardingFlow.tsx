import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Heart, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Scale, 
  CalendarDays 
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (data: {
    phase: "prepreg" | "pregnancy";
    motherAge: string;
    weightBefore: string;
    heightBefore: string;
    notes: string;
    lastPeriodDate: string;
    doctorDueDate: string;
    method: "LMP" | "EDD";
    cycleLength: string;
    periodDuration: string;
  }) => void;
  userEmail: string;
  userDisplayName: string;
}

export default function OnboardingFlow({ 
  onComplete, 
  userEmail, 
  userDisplayName 
}: OnboardingFlowProps) {
  
  const [phase, setPhase] = useState<"prepreg" | "pregnancy">("pregnancy");
  const [motherAge, setMotherAge] = useState<string>("28");
  const [weightBefore, setWeightBefore] = useState<string>("52");
  const [heightBefore, setHeightBefore] = useState<string>("160");
  const [notes, setNotes] = useState<string>("Hay mỏi vùng lưng dưới khi đứng lâu, thèm hoa quả mọng.");
  const [method, setMethod] = useState<"EDD">("EDD");
  
  // Baselines for menstrual cycle
  const [lastPeriodDate, setLastPeriodDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [cycleLength, setCycleLength] = useState<string>("28");
  const [periodDuration, setPeriodDuration] = useState<string>("5");

  // Pregnancy due date (doctorDueDate) loaded directly
  const [doctorDueDateInput, setDoctorDueDateInput] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 238); // default to ~238 days from now
    return d.toISOString().split("T")[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let lmpDate = lastPeriodDate;
    let finalDueDate = doctorDueDateInput;

    if (phase === "pregnancy") {
      // Calculate LMP as doctorDueDate minus 280 days
      const d = new Date(doctorDueDateInput);
      d.setDate(d.getDate() - 280);
      lmpDate = d.toISOString().split("T")[0];
    } else {
      // prepreg
      // Default doctor due date (280 days after lastPeriodDate)
      const d = new Date(lastPeriodDate);
      d.setDate(d.getDate() + 280);
      finalDueDate = d.toISOString().split("T")[0];
    }

    onComplete({
      phase,
      motherAge,
      weightBefore,
      heightBefore,
      notes,
      lastPeriodDate: lmpDate,
      doctorDueDate: finalDueDate,
      method: "EDD",
      cycleLength,
      periodDuration
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/70 via-white to-pink-50/50 flex flex-col items-center justify-center p-4">
      {/* Title greeting card */}
      <div className="w-full max-w-md mx-auto bg-white rounded-[38px] border border-rose-100/50 shadow-2xl p-6 sm:p-8 space-y-5 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full blur-2xl -z-10" />

        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-1 border border-rose-200/50">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800">Cá nhân hóa tài khoản</h2>
          <p className="text-xs text-slate-450 leading-relaxed font-semibold">
            Chào mừng <span className="text-rose-500 font-bold">{userDisplayName || userEmail}</span>! Hãy cho BabiCare biết tình trạng của mẹ để tinh chỉnh thông số chuẩn xác.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Step 1: Phase Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-550 uppercase tracking-tight block">Giai đoạn hiện tại của mẹ:</label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setPhase("pregnancy")}
                className={`flex flex-col items-center p-4 border rounded-3xl transition-all cursor-pointer active:scale-95 ${
                  phase === "pregnancy"
                    ? "border-rose-500 bg-rose-50/45 text-rose-650 ring-2 ring-rose-250/30"
                    : "border-slate-200/80 bg-white text-slate-500"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-1.5">
                  👶
                </div>
                <span className="font-extrabold text-[11px] block">Mẹ Đang Mang Thai</span>
                <span className="text-[8px] opacity-75 mt-0.5 block text-center leading-normal">Mặc định tính bắt đầu từ Tuần thai thứ 6</span>
              </button>

              <button
                type="button"
                onClick={() => setPhase("prepreg")}
                className={`flex flex-col items-center p-4 border rounded-3xl transition-all cursor-pointer active:scale-95 ${
                  phase === "prepreg"
                    ? "border-rose-500 bg-rose-50/45 text-rose-650 ring-2 ring-rose-250/30"
                    : "border-slate-200/80 bg-white text-slate-500"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-1.5">
                  🗓️
                </div>
                <span className="font-extrabold text-[11px] block">Đang Thả Bầu</span>
                <span className="text-[8px] opacity-75 mt-0.5 block text-center leading-normal">Tính rụng trứng & chu kỳ từ hôm nay</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 my-1 pt-3 space-y-3.5">
            {phase === "pregnancy" ? (
              /* Pregnancy Onboarding Inputs */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase block">Tuổi của mẹ:</label>
                    <input
                      type="number"
                      required
                      min="15"
                      max="55"
                      value={motherAge}
                      onChange={(e) => setMotherAge(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-450 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase block">Cân nặng trước bầu (kg):</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min="35"
                      max="150"
                      value={weightBefore}
                      onChange={(e) => setWeightBefore(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-450 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase block">Chiều cao (cm):</label>
                    <input
                      type="number"
                      required
                      min="120"
                      max="210"
                      value={heightBefore}
                      onChange={(e) => setHeightBefore(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-450 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-black text-rose-500 uppercase block">Ngày Dự Sinh Nhận Từ Bác Sĩ (EDD):</label>
                    <input
                      type="date"
                      required
                      value={doctorDueDateInput}
                      onChange={(e) => setDoctorDueDateInput(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-450 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase block">Ghi chú sức khỏe ban đầu:</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-705 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-450 bg-white resize-none"
                    placeholder="Mẹ thèm ngọt nhiều, mỏi gối..."
                  />
                </div>
              </div>
            ) : (
              /* Pre-preg Onboarding Inputs */
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase block">Ngày đầu kỳ sinh cuối gần nhất:</label>
                  <input
                    type="date"
                    required
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-450 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase block">Chu kỳ kinh trung bình (ngày):</label>
                    <input
                      type="number"
                      required
                      min="21"
                      max="45"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-450 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase block">Số ngày có kinh (ngày):</label>
                    <input
                      type="number"
                      required
                      min="2"
                      max="10"
                      value={periodDuration}
                      onChange={(e) => setPeriodDuration(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-450 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase block">Tuổi của mẹ:</label>
                    <input
                      type="number"
                      required
                      min="15"
                      max="55"
                      value={motherAge}
                      onChange={(e) => setMotherAge(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-450 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase block pt-0.5">Cân nặng hiện tại (kg):</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min="35"
                      max="150"
                      value={weightBefore}
                      onChange={(e) => setWeightBefore(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-450 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-slate-900 text-white font-black hover:bg-slate-805 py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <span>Kích Hoạt Tài Khoản</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
