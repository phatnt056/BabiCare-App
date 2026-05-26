import { useState } from "react";
import { Info, HelpCircle, Eye } from "lucide-react";

interface FetalAnatomyModelProps {
  week: number;
}

export default function FetalAnatomyModel({ week }: FetalAnatomyModelProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Determine stage & morphological description
  let stage: "embryo" | "early-fetus" | "mid-fetus" | "late-fetus" | "due-fetus" = "embryo";
  let stageName = "Giai đoạn Phôi thai sơ khai";
  let postureDescription = "Phôi bé nhỏ nằm cuộn tròn dịu êm bám chặt vào thành tử cung.";

  if (week <= 8) {
    stage = "embryo";
    stageName = "Giai đoạn Phôi thai (Embryo)";
    postureDescription = "Phôi bé bỏng hình chữ C, đang mọc mầm chi sơ khởi và tim thai có nhịp co bóp đầu tiên.";
  } else if (week <= 13) {
    stage = "early-fetus";
    stageName = "Giai đoạn Đầu Thai nhi (Early Fetus)";
    postureDescription = "Bé đã mất chiếc đuôi nhỏ phôi thai. Đầu bé to vượt trội so với thân, phản xạ khép mở tay chân xuất hiện.";
  } else if (week <= 27) {
    stage = "mid-fetus";
    stageName = "Giai đoạn Phát triển Vàng (Golden Fetus)";
    postureDescription = "Hệ xương sống hình thành, da mỏng phủ vernix và lông tơ mọc mịn. Bé hay duỗi mút ngón tay và nghịch dây rốn.";
  } else if (week <= 36) {
    stage = "late-fetus";
    stageName = "Giai đoạn Hoàn thiện (Mature Fetus)";
    postureDescription = "Bé bắt đầu tích mỡ phúng bính, chớp được mắt và tập thở nông nước ối. Tai thính rõ rệt.";
  } else {
    stage = "due-fetus";
    stageName = "Giai đoạn Sẵn sàng Chào đời (Term Fetus)";
    postureDescription = "Bé đã chúc đầu xuống thấp ở khung chậu mẹ (ngôi thuận), cơ thể trơn nhẵn chờ đợi khoảnh khắc chào đời.";
  }

  // Define interactive hotspots depending on the fetus' layout
  const getHotspots = () => {
    switch (stage) {
      case "embryo":
        return [
          { id: "brain", name: "Bộ não sọ", text: "Ống thần kinh sọ đang phát triển tốc độ cao khép kín bảo vệ não bộ sơ khai.", x: "50%", y: "30%" },
          { id: "heart", name: "Tim phôi", text: "Tim thai hình thành sơ khai với nhịp co bóp liên hồi gấp đôi nhịp tim mẹ.", x: "46%", y: "45%" },
          { id: "limb", name: "Chồi chi", text: "Các mầm tay, chân bé tí đang nhú ra trông tựa như các mái chèo nhỏ.", x: "58%", y: "55%" }
        ];
      case "early-fetus":
        return [
          { id: "brain", name: "Vỏ não sọ", text: "Các vùng não chuyên biệt ngăn cách, mí mắt mỏng mọc kín bảo phủ mắt bên dưới.", x: "50%", y: "25%" },
          { id: "stomach", name: "Ổ bụng & Gan", text: "Gan bắt đầu làm nhiệm vụ tạo máu, các cơ quan tiêu hoá chính dịch chuyển về ổ bụng ấm áp.", x: "47%", y: "50%" },
          { id: "fingers", name: "Ngón tay và móng", text: "Vân tay độc nhất đang hình thành, các ngón tay thon đã tác rời riêng biệt.", x: "65%", y: "45%" }
        ];
      case "mid-fetus":
        return [
          { id: "brain", name: "Não & Thính giác", text: "Vỏ não phát triển gấp nếp. Tai di chuyển lên đúng vị trí giúp bé nhạy cảm rõ rệt với tiếng kể chuyện của mẹ.", x: "48%", y: "20%" },
          { id: "heart", name: "Vách ngăn tim", text: "Cấu trúc 4 ngăn hoàn thiện ổn định, bơm máu dồi dào đi nuôi cơ thớ khỏe mạnh.", x: "51%", y: "42%" },
          { id: "skin", name: "Chất gây Vernix", text: "Lớp keo sáp trắng sữa bảo vệ da bé không bị ngấm chai sần do bơi trong môi trường nước ối ấm lâu ngày.", x: "62%", y: "55%" },
          { id: "spine", name: "Xương sống", text: "Cột sống mềm sụn cứng dần, uốn lượn rõ nét giúp nâng đỡ cổ vai rướn cao.", x: "32%", y: "48%" }
        ];
      case "late-fetus":
        return [
          { id: "eyes", name: "Đồng tử & Mắt", text: "Đồng tử nhạy quang có khả năng co nhỏ lại khi tiếp nhận ánh đèn sáng dịu hắt qua thành bụng mẹ.", x: "54%", y: "18%" },
          { id: "lungs", name: "Phế nang phổi", text: "Sản sinh dịch surfactant lót màng phổi, chuẩn bị cho phản xạ khóc cất tiếng thở tự do đầu tiên.", x: "48%", y: "36%" },
          { id: "fat", name: "Lớp mỡ sáp", text: "Chất béo dự trữ nhanh dưới mô liên mạc đạt 15% cân nặng để tự giữ ấm thân nhiệt ổn khi ra ngoài.", x: "68%", y: "58%" }
        ];
      default:
        return [
          { id: "head", name: "Ngôi đầu thuận", text: "Sọ khớp di dời mềm mỏng co dãn nhịp nhàng khi lách qua cổ tử cung hẹp mở sinh.", x: "50%", y: "75%" },
          { id: "lungs", name: "Phổi hoàn chỉnh", text: "Hệ hô hấp đã tích lũy đủ kho dự trữ tế bào, hoàn tất giai đoạn vàng huấn luyện thở nông nở phế nang.", x: "52%", y: "45%" },
          { id: "placenta", name: "Dây rốn & Bánh rau", text: "Bộ lọc bánh nhau truyền lượng tối đa kháng thể miễn dịch tự nhiên từ mẹ sang bảo hộ bé những ngày đầu đời.", x: "30%", y: "30%" }
        ];
    }
  };

  const hotspots = getHotspots();

  // Draw customized vector shapes based on the exact trimester phase
  const getFetalVectors = () => {
    switch (stage) {
      case "embryo":
        return (
          <g className="animate-pulse duration-[3000ms]">
            {/* Embryo shape curved bean like */}
            <path
              d="M50 32 C42 32, 38 42, 42 52 C45 58, 54 62, 58 56 C62 52, 54 48, 50 48"
              fill="none"
              stroke="#fb7185"
              strokeWidth="6"
              strokeLinecap="round"
              className="drop-shadow-md"
            />
            {/* Beating heart point */}
            <circle cx="46" cy="46" r="3.5" fill="#f43f5e" className="animate-ping" style={{ transformOrigin: "46px 46px" }} />
            <circle cx="46" cy="46" r="2" fill="#f43f5e" />
            {/* Buds */}
            <circle cx="56" cy="54" r="3" fill="#fda4af" />
          </g>
        );
      case "early-fetus":
        return (
          <g>
            {/* Placenta side curve */}
            <path d="M 25 15 C 10 35, 10 65, 25 85" stroke="#fecdd3" strokeWidth="8" fill="none" opacity="0.6" strokeLinecap="round" />
            {/* Cord */}
            <path d="M 20 50 Q 38 52, 46 51" stroke="#fda4af" strokeWidth="3" fill="none" strokeDasharray="3,3" />
            {/* Fetus curved with noticeable head */}
            <circle cx="50" cy="30" r="13" fill="none" stroke="#fb7185" strokeWidth="5.5" />
            <path d="M 46 41 C 40 48, 44 64, 56 64 C 64 64, 62 52, 50 51" fill="none" stroke="#fb7185" strokeWidth="5" />
            <circle cx="53" cy="27" r="1.5" fill="#e11d48" /> {/* eye dot starting */}
          </g>
        );
      case "mid-fetus":
        return (
          <g className="translate-y-[-5px]">
            {/* Cord and waves */}
            <path d="M 20 42 A 18 18 0 0 1 48 45" stroke="#fb7185" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" className="animate-pulse" />
            
            {/* Fully formed skeletal outline baby - hand in mouth */}
            {/* head */}
            <circle cx="48" cy="24" r="15" fill="none" stroke="#fb7185" strokeWidth="5" />
            {/* eye profile */}
            <path d="M 52 22 A 2 2 0 0 1 54 26" stroke="#fb7185" strokeWidth="2.5" fill="none" />
            {/* back and spinal light */}
            <path d="M 36 31 C 28 45, 34 60, 48 62" fill="none" stroke="#fda4af" strokeWidth="3" strokeDasharray="4,2" />
            <path d="M 38 31 C 32 45, 36 60, 48 62" fill="none" stroke="#fb7185" strokeWidth="4.5" />
            {/* limb/arm */}
            <path d="M 44 38 C 48 37, 51 32, 48 29" fill="none" stroke="#fb7185" strokeWidth="3.5" strokeLinecap="round" />
            {/* thigh and leg */}
            <path d="M 48 62 Q 58 58, 56 46 Q 52 46, 48 50" fill="none" stroke="#fb7185" strokeWidth="4" strokeLinecap="round" />
            {/* beating heart */}
            <circle cx="47" cy="38" r="2.5" fill="#e11d48" className="animate-ping" style={{ transformOrigin: "47px 38px" }} />
            <circle cx="47" cy="38" r="1.5" fill="#e11d48" />
          </g>
        );
      case "late-fetus":
        return (
          <g className="scale-[1.1] origin-center translate-y-[-5px]">
            {/* Baby head up-left, curled tightly, fat cheeks */}
            {/* large head */}
            <circle cx="45" cy="24" r="16.5" fill="#fff1f2" stroke="#f43f5e" strokeWidth="5.5" />
            <path d="M 45 20 Q 42 20, 41 24 C 42 27, 47 27, 48 24 Z" fill="#fda4af" />
            {/* body */}
            <path d="M 35 34 C 28 50, 36 66, 52 66 C 64 66, 64 52, 54 44" fill="none" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
            {/* folded arm */}
            <path d="M 41 38 C 45 42, 48 42, 46 32" fill="none" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
            {/* leg huddled closer */}
            <path d="M 52 66 C 62 65, 62 48, 52 48" fill="none" stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="48" cy="21" r="1.5" fill="#be123c" /> {/* closed eye with eyelashes */}
            <path d="M 47 18 C 47 18, 49 19, 50 18" stroke="#be123c" strokeWidth="1" />
          </g>
        );
      default: // due-fetus (head-down!)
        return (
          <g className="scale-[1.2] origin-center translate-y-[10px]">
            {/* Pelvic lower circle */}
            <path d="M 30 80 Q 50 95, 70 80" stroke="#fecdd3" strokeWidth="4" fill="none" opacity="0.8" strokeLinecap="round" />
            {/* Curled fetus dousing down */}
            {/* head at the bottom (x=50 y=68) */}
            <circle cx="50" cy="70" r="17" fill="#fff1f2" stroke="#e11d48" strokeWidth="5.5" />
            {/* resting eye */}
            <path d="M 50 66 Q 48 68, 46 66" stroke="#9f1239" strokeWidth="1.5" fill="none" />
            {/* fat body folding up */}
            <path d="M 45 56 C 30 46, 32 20, 50 20 C 65 20, 68 40, 56 56" fill="none" stroke="#e11d48" strokeWidth="5.5" strokeLinecap="round" />
            {/* folded arms holding cord */}
            <path d="M 44 48 C 46 40, 54 40, 52 48" fill="none" stroke="#e11d48" strokeWidth="3.5" strokeLinecap="round" />
            {/* cozy crossed leg wrapping head */}
            <path d="M 50 20 C 62 21, 62 45, 52 50" fill="none" stroke="#e11d48" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <div className="bg-gradient-to-b from-rose-50/70 to-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xs flex flex-col justify-between h-full min-h-[420px]">
      <div className="flex items-start justify-between">
        <div>
          <span className="bg-rose-500/10 text-rose-600 text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wide">
            {stageName}
          </span>
          <h3 className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1.5">
            Mô hình Thai sần Kính phóng đại
          </h3>
          <p className="text-slate-400 text-[11px] font-normal leading-relaxed">
            Nhấp chọn điểm phát sáng để nghe bác sĩ giải phẫu chi tiết cơ quan phát triển của bé
          </p>
        </div>
        <span className="text-xl">🔬</span>
      </div>

      {/* SVG Canvas Workspace */}
      <div className="flex-1 my-4 bg-rose-100/30 rounded-2xl border border-rose-100 p-2 relative flex items-center justify-center overflow-hidden min-h-[220px]">
        
        {/* Soft amniotic ocean flow bubbles */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-45 overflow-hidden">
          <div className="absolute w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" style={{ left: "15%", top: "40%", animationDuration: "4s" }}></div>
          <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse" style={{ right: "20%", bottom: "25%", animationDuration: "5s" }}></div>
          <div className="absolute w-2 h-2 rounded-full bg-rose-200 animate-bounce" style={{ left: "45%", top: "15%", animationDuration: "6s" }}></div>
        </div>

        {/* Aspect locked content wrap to preserve absolute percentage button positions perfectly */}
        <div className="relative w-full max-w-[210px] sm:max-w-[260px] aspect-square flex items-center justify-center z-10">
          {/* Placenta wall outline circle */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-rose-300 select-none">
            {/* Amniotic sac membrane */}
            <circle cx="50" cy="50" r="47" stroke="#fda4af" strokeWidth="1" strokeDasharray="3,1" fill="none" opacity="0.5" />
            {getFetalVectors()}
          </svg>

          {/* Hotspots layer relative to the aspect-locked square */}
          {hotspots.map((hs) => (
            <button
              key={hs.id}
              onClick={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)}
              className={`absolute z-20 w-5.5 h-5.5 rounded-full border-2 bg-white flex items-center justify-center cursor-pointer transition-all -translate-x-1/2 -translate-y-1/2 ${
                activeHotspot === hs.id 
                  ? "border-rose-500 scale-125 shadow-md ring-4 ring-rose-200" 
                  : "border-rose-400 shadow-xs hover:scale-110 hover:bg-rose-50 animate-pulse hover:animate-none"
              }`}
              style={{ left: hs.x, top: hs.y }}
              title={hs.name}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            </button>
          ))}
        </div>
      </div>

      {/* Narrative & Active Point Explanation Panel */}
      <div className="bg-white rounded-xl p-3 border border-rose-150/80 shadow-inner z-10">
        {activeHotspot ? (
          (() => {
            const hs = hotspots.find(h => h.id === activeHotspot);
            return hs ? (
              <div className="animate-fade-in text-slate-700">
                <div className="flex items-center gap-1 text-xs font-bold text-rose-600 mb-0.5 uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Cơ quan diệu vi: {hs.name}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {hs.text}
                </p>
              </div>
            ) : null;
          })()
        ) : (
          <div className="text-slate-500">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
              <Info className="w-3.5 h-3.5 text-rose-500" />
              <span>Hình thái tuần này</span>
            </div>
            <p className="text-xs italic text-slate-500 leading-relaxed mt-0.5 font-normal">
              {postureDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
