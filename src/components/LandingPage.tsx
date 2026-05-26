import React from "react";
import { motion } from "motion/react";
import { 
  Baby, 
  Sparkles, 
  Scale, 
  MessageSquare, 
  CalendarDays, 
  Music, 
  ShieldCheck, 
  Heart,
  ChevronRight,
  UserCheck
} from "lucide-react";

interface LandingPageProps {
  onSignInWithGoogle: () => void;
  onTryDemo: () => void;
  isFirebaseConfigured: boolean;
}

export default function LandingPage({ 
  onSignInWithGoogle, 
  onTryDemo, 
  isFirebaseConfigured 
}: LandingPageProps) {
  
  const features = [
    {
      icon: Baby,
      title: "Theo Dõi Thai Nhi Thông Minh",
      desc: "Tra cứu kích thước chuẩn, cân nặng, sự phát triển của con mỗi ngày theo tuần thai khoa học.",
      color: "from-pink-500 to-rose-400"
    },
    {
      icon: MessageSquare,
      title: "Trợ Lý Bác Sĩ AI BabiCare",
      desc: "Giải đáp mọi thắc mắc sức khỏe thai kỳ 24/7 trực tuyến dựa trên nguồn dữ liệu y khoa đáng tin cậy.",
      color: "from-purple-500 to-indigo-400"
    },
    {
      icon: Scale,
      title: "Phác Đồ Vitamin & Cân Nặng",
      desc: "Tính toán lượng canxi, sắt, vitamin và cảnh báo mức tăng cân lý tưởng bám sát y văn.",
      color: "from-amber-500 to-orange-400"
    },
    {
      icon: CalendarDays,
      title: "Quản Lý Chu Kỳ & Ngày Rụng Trứng",
      desc: "Trợ lý đắc lực tính ngày thụ thai tối ưu cho những mẹ đang chuẩn bị bước vào hành trình thả bầu.",
      color: "from-emerald-500 to-teal-400"
    },
    {
      icon: Music,
      title: "Thai Giáo Âm Nhạc & Cảm Xúc",
      desc: "Lịch trình thai giáo mỗi ngày bồi dưỡng sóng não và các bài tập vận động, yêu thương của mẹ.",
      color: "from-blue-500 to-sky-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/70 via-white to-pink-50/50 flex flex-col items-center justify-center p-4">
      {/* Sleek Header badge */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 flex items-center gap-1.5 bg-rose-100 text-rose-650 px-3 py-1 rounded-full text-[10px] font-black tracking-tight border border-rose-200/50"
      >
        <Sparkles className="w-3 h-3 text-rose-500 animate-pulse" />
        <span>BABI CARE - TRỢ LÝ THAI KỲ TOÀN DIỆN</span>
      </motion.div>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white rounded-[38px] border border-rose-100/50 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-36 h-36 bg-rose-250/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-pink-100/30 rounded-full blur-3xl -z-10" />

        {/* Hero Brand Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none">
            Mẹ Khỏe Re <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
              Bé Yêu Phát Triển Vượt Bội
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
            Hành trình 40 tuần thai kỳ hay từng ngày mong con đều được BabiCare lưu giữ, tính toán chuẩn chỉnh và khoa học nhất.
          </p>
        </div>

        {/* Dynamic Multi-Feature Showcase (Scroll list) */}
        <div className="space-y-3 max-h-[350px] sm:max-h-[400px] overflow-y-auto pr-1 select-none no-scrollbar">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 bg-slate-50/60 hover:bg-rose-50/30 transition-all p-3 rounded-2xl border border-slate-100"
            >
              <div className={`p-2 rounded-xl bg-gradient-to-br ${feat.color} text-white shrink-0 shadow-xs`}>
                <feat.icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-[11px] text-slate-705">
                  {feat.title}
                </h3>
                <p className="text-[9px] text-slate-450 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Direct Register Action Box */}
        <div className="space-y-2.5 pt-2 p-4 sm:p-6 md:p-8">
          {isFirebaseConfigured ? (
            <button
              onClick={onSignInWithGoogle}
              className="w-full cursor-pointer bg-slate-900 text-white font-black hover:bg-slate-805 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22l.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Đăng ký nhanh bằng Google</span>
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={onTryDemo}
                className="w-full cursor-pointer bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Trải Nghiệm Đăng Ký Demo (Mẹ Bầu)</span>
              </button>
              <p className="text-[8px] text-center text-slate-400 font-semibold italic">
                💡 Admin đang thiết lập kết nối Firebase. Chọn Demo để thử nghiệm ngay toàn bộ tính năng!
              </p>
            </div>
          )}

          {/* Core App trust assurances */}
          <div className="flex items-center justify-center gap-3.5 text-slate-400 pt-1 text-[9px] font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Bảo mật tuyệt đối
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-505" />
              Miễn phí trọn đời
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
