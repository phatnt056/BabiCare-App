import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import LandingPage from "./components/LandingPage";
import OnboardingFlow from "./components/OnboardingFlow";
import AdminPanel from "./components/AdminPanel";
import { 
  db, 
  auth, 
  googleProvider, 
  isFirebaseConfigured,
  handleFirestoreError,
  OperationType 
} from "./lib/firebase";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  onSnapshot 
} from "firebase/firestore";

import { 
  Calendar, 
  Baby, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  TrendingUp, 
  ChevronRight, 
  ChevronLeft,
  Heart, 
  Send, 
  History, 
  RefreshCw, 
  AlertCircle,
  Clock,
  Apple,
  Info,
  Scale,
  Settings,
  X,
  Smartphone,
  Maximize2,
  CalendarDays,
  Plus,
  Smile,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Pencil,
  ShoppingBag
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { fetalDevelopmentData, FetalStats } from "./data/fetalDevelopment";
import { 
  calculateFromLMP, 
  calculateFromEDD, 
  formatLocalDate, 
  PregnancyResult 
} from "./utils/pregnancyCalculator";
import { ChatMessage, AffiliateProduct } from "./types";
import FetalAnatomyModel from "./components/FetalAnatomyModel";
import { evaluateUltrasound, parseFetalMetric, MetricEvaluation } from "./utils/ultrasoundEvaluator";
import { vitaminData, nutritionStages, clinicalMilestones, massageAndSkinSecrets, getThaiGiaoByWeek, generateThaiGiaoDailyTasks, DailyThaiGiaoTask, VitaminInfo, FoodNutrition, ImmunizationMilestone, MassageSpaSkin, ThaiGiaoMilestone, thaiGiaoMilestones } from "./data/pregnancyHandbook";
import HospitalBagChecklist from "./components/HospitalBagChecklist";

// Suggested questions for quick actions in chatbot
const SUGGESTED_QUESTIONS = [
  "Sắt và Canxi nên uống lúc nào?",
  "Tôi hay bị mỏi lưng cuối ngày, làm sao giảm?",
  "Mốc siêu âm quan trọng tuần này?",
  "Có cần xét nghiệm tiểu đường thai kỳ không?",
  "Bé đạp thế nào là bình thường?"
];

// Seed initial default values relative to current local time (2026-05-22)
const INITIAL_LMP = "2025-12-19";
const INITIAL_EDD = "2026-09-25";


const DEFAULT_AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: "1",
    name: "Vitamin Bầu Elevit Úc chính hãng (100 viên)",
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=elevit",
    price: "1.150.000đ",
    category: "vitamin"
  },
  {
    id: "2",
    name: "Dầu Massage Ngăn Rạn Da Bio-Oil dịu nhẹ (200ml)",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=bio%20oil",
    price: "365.000đ",
    category: "stretch_mark"
  },
  {
    id: "3",
    name: "Sắt Cho Bà Bầu Blackmores Pregnancy Iron (30v)",
    imageUrl: "https://images.unsplash.com/photo-1611070973770-b1a672610045?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=blackmores%2520pregnancy%252520iron",
    price: "195.000đ",
    category: "vitamin"
  },
  {
    id: "4",
    name: "Dầu Cá DHA Cho Bà Bầu Bio Island Úc (60 viên)",
    imageUrl: "https://images.unsplash.com/photo-1626244661279-645535abbefa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=bio%20island%20dha%20 bầu",
    price: "420.000đ",
    category: "vitamin"
  },
  {
    id: "5",
    name: "Canxi Nước Osteocare Liquid Anh Dưỡng Thai (250ml)",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=canxi%20osteocare%20liquid",
    price: "245.000đ",
    category: "vitamin"
  },
  {
    id: "6",
    name: "Kem Massage Chống Rạn Da Palmer's Cocoa Butter",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=palmer%20r%E1%BA%A1n%20da",
    price: "340.000đ",
    category: "stretch_mark"
  },
  {
    id: "7",
    name: "Sữa Bầu Frisomum Gold Vị Cam Thanh Mát (900g)",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=frisomum%20gold",
    price: "495.000đ",
    category: "food_drink"
  },
  {
    id: "8",
    name: "Hạt Óc Chó Vàng Mỹ Cao Cấp Cho Trí Não Bé",
    imageUrl: "https://images.unsplash.com/photo-1590005354167-6da97870c913?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=h%E1%BA%A1t%20%C3%B3c%2520ch%252525C3%252525B3%20m%E1%BB%B9",
    price: "185.000đ",
    category: "food_drink"
  },
  {
    id: "9",
    name: "Kem Massage Chống Rạn Da Pigeon Nhật Bản (110g)",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=kem%20ran%20da%20pigeon",
    price: "320.000đ",
    category: "stretch_mark"
  },
  {
    id: "10",
    name: "Sữa Bầu Morinaga Nhật Bản Vị Trà Thơm Ngon (216g)",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=sua%20bau%20morinaga",
    price: "220.000đ",
    category: "food_drink"
  }
];

const DEFAULT_PREPREG_NUTRI_PRODUCTS: AffiliateProduct[] = [
  {
    id: "pn1",
    name: "Viên uống Elevit Hộp 100v - Bổ sung acid folic & vitamin khoáng chất",
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=elevit",
    price: "1.150.000đ"
  },
  {
    id: "pn2",
    name: "Acid Folic Blackmores Folate 500mcg ngừa dị tật ống thần kinh (90v)",
    imageUrl: "https://images.unsplash.com/photo-1611070973770-b1a672610045?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=blackmores%20folate%20500mcg",
    price: "180.000đ"
  },
  {
    id: "pn3",
    name: "Dầu cá bầu bổ sung DHA Bio Island Úc (60 viên)",
    imageUrl: "https://images.unsplash.com/photo-1626244661279-645535abbefa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=bio%20island%20dha%20b%E1%BA%A7u",
    price: "420.000đ"
  },
  {
    id: "pn4",
    name: "Sắt hữu cơ cho bà bầu Blackmores Pregnancy Iron (30v)",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=blackmores%20pregnancy%20iron",
    price: "195.000đ"
  }
];

const DEFAULT_OVULATION_PRODUCTS: AffiliateProduct[] = [
  {
    id: "ov1",
    name: "Hộp 12/24 Que Thử Rụng Trứng LH EvaTest cực nhạy bén",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=que%20th%E1%BB%B1%20r%E1%BB%A5ng%2520tr%E1%BB%A9ng%20evatest",
    price: "120.000đ"
  },
  {
    id: "ov2",
    name: "Bút Thử Rụng Trứng Điện Tử Clearblue thông minh bậc nhất",
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=clearblue%20ovulation%20test",
    price: "750.000đ"
  },
  {
    id: "ov3",
    name: "Nhiệt Kế Điện Tử Đo Nhiệt Độ Cơ Thể Sớm (Độ chuẩn xác 0.01)",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=nhi%E1%BB%87t%20k%E1%BA%BF%20%C4%91i%E1%BB%87n%20t%E1%BB%AD%20ng%E1%BA%ADm%20mi%E1%BB%87ng",
    price: "135.000đ"
  },
  {
    id: "ov4",
    name: "Nước Hồng Sâm Thượng Hạng bổ sung sinh lực cho vợ chồng",
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=n%C6%B0%E1%BB%9Bc%20h%E1%BB%93ng%20s%C3%A2m",
    price: "550.000đ"
  }
];

const DEFAULT_PREGNANCY_DETECTION_PRODUCTS: AffiliateProduct[] = [
  {
    id: "pd1",
    name: "Hộp 5 Que Thử Thai HCG Quickstrip siêu nhạy phát hiện sớm",
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=que%20th%E1%BB%AD%20thai%20quickstrip",
    price: "85.000đ"
  },
  {
    id: "pd2",
    name: "Bút Thử Thai Điện Tử Clearblue hiển thị số tuần thai chi tiết",
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=clearblue%20pregnancy%20test",
    price: "225.000đ"
  },
  {
    id: "pd3",
    name: "Que Thử Thai Bản Lớn Amest độ chuẩn xác 99% chống mờ nhầm",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=que%20th%E1%BB%AD%20thai%20amest",
    price: "35.000đ"
  },
  {
    id: "pd4",
    name: "Sữa Bầu Frisomum Gold Hương Cam thơm ngon dễ uống (900g)",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    affiliateUrl: "https://shopee.vn/search?keyword=frisomum%20gold%20900g",
    price: "495.000đ"
  }
];

export default function App() {
  // Mobile Frame Layout Toggle (Only affects Desktop)
  const [isSimulatedFrame, setIsSimulatedFrame] = useState<boolean>(true);
  
  // Real time Clock for the iPhone/Android virtual status bar
  const [deviceTime, setDeviceTime] = useState<string>("09:41");

  // --- User & Configuration States ---
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  // --- PWA Installation States ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPWAInstallPrompt, setShowPWAInstallPrompt] = useState<boolean>(false);
  const [isAlreadyStandalone, setIsAlreadyStandalone] = useState<boolean>(false);
  const [pwaInstallDismissed, setPwaInstallDismissed] = useState<boolean>(() => {
    return localStorage.getItem("babicare_pwa_dismissed") === "true";
  });

  // --- Dynamic Handbook States ---
  const [customVitaminData, setCustomVitaminData] = useState<VitaminInfo[]>(() => {
    try {
      const saved = localStorage.getItem("babicare_handbook_vitamin");
      if (saved) return JSON.parse(saved);
    } catch {}
    return vitaminData;
  });

  const [customNutritionStages, setCustomNutritionStages] = useState<FoodNutrition[]>(() => {
    try {
      const saved = localStorage.getItem("babicare_handbook_nutrition");
      if (saved) return JSON.parse(saved);
    } catch {}
    return nutritionStages;
  });

  const [customClinicalMilestones, setCustomClinicalMilestones] = useState<ImmunizationMilestone[]>(() => {
    try {
      const saved = localStorage.getItem("babicare_handbook_milestones");
      if (saved) return JSON.parse(saved);
    } catch {}
    return clinicalMilestones;
  });

  const [customMassageAndSkinSecrets, setCustomMassageAndSkinSecrets] = useState<MassageSpaSkin[]>(() => {
    try {
      const saved = localStorage.getItem("babicare_handbook_massage");
      if (saved) return JSON.parse(saved);
    } catch {}
    return massageAndSkinSecrets;
  });

  const [customThaiGiaoMilestones, setCustomThaiGiaoMilestones] = useState<ThaiGiaoMilestone[]>(() => {
    try {
      const saved = localStorage.getItem("babicare_handbook_thaigiao");
      if (saved) return JSON.parse(saved);
    } catch {}
    return thaiGiaoMilestones;
  });

  // --- Conception Reporting States ---
  const [pregnancyReportState, setPregnancyReportState] = useState<"none" | "success" | "celebrate_modal" | "not_yet">("none");
  const [lmpInputDate, setLmpInputDate] = useState<string>("2026-05-10");
  const [calculatedEdd, setCalculatedEdd] = useState<string>("");
  const [calculatedWeeks, setCalculatedWeeks] = useState<{weeks: number, days: number} | null>(null);

  const [notPregnantStart, setNotPregnantStart] = useState<string>("2026-05-20");
  const [notPregnantPeriodDays, setNotPregnantPeriodDays] = useState<number>(5);
  const [notPregnantCycleLength, setNotPregnantCycleLength] = useState<number>(28);

  const getCustomThaiGiaoByWeek = (week: number): ThaiGiaoMilestone => {
    const milestone = customThaiGiaoMilestones.find(m => week >= m.minWeek && week <= m.maxWeek);
    if (milestone) return milestone;
    return customThaiGiaoMilestones[customThaiGiaoMilestones.length - 1] || thaiGiaoMilestones[0];
  };

  const generateCustomThaiGiaoDailyTasks = (week: number): DailyThaiGiaoTask[] => {
    const milestone = getCustomThaiGiaoByWeek(week);
    const startDay = (week - 1) * 7 + 1;
    return [
      {
        dayIndex: 1,
        pregnancyDay: startDay,
        title: "Thai Giáo Thính Giác: Hòa Điệu Sóng Nhạc",
        method: "Thính Giác",
        icon: "🔊",
        description: `Bắt đầu ngày hành trình tuần thai thứ ${week}. Mẹ hãy dành 15 phút rảnh rỗi nghe nhạc: ${milestone.auditory}. Hãy nhẹ nhàng nói: "Trực giác cảm nhận, chúc con yêu ngày đầu tuần vui vẻ nhé!"`
      },
      {
        dayIndex: 2,
        pregnancyDay: startDay + 1,
        title: "Thai Giáo Thị Giác: Kích Hoạt Neuron Trực Quan",
        method: "Thị Giác",
        icon: "👁️",
        description: `Mẹ hãy duy trì thói quen: ${milestone.visual}. Điều này kích hoạt hàng triệu khớp thần kinh sơ khởi tại thùy chẩm phát triển lành mạnh.`
      },
      {
        dayIndex: 3,
        pregnancyDay: startDay + 2,
        title: "Thai Giáo Xúc Giác: Vỗ Về Cảm Xúc Phôi Thai",
        method: "Xúc Giác / Vận động",
        icon: "🤸",
        description: `Thực hiện bài tập xoa bụng hoặc vận động nhẹ nhàng: ${milestone.kinesthetic}. Hãy mát-xa từ trái qua phải, từ trên xuống dưới trong 5 phút.`
      },
      {
        dayIndex: 4,
        pregnancyDay: startDay + 3,
        title: "Thai Giáo Dinh Dưỡng: Vị Giác & Sinh Khí",
        method: "Vị Giác / Dinh Dưỡng",
        icon: "🥦",
        description: `Bổ sung năng lượng tích cực hôm nay: ${milestone.dinhDuong}. Hãy nhai thật chậm rái để hấp thu từng giọt dưỡng chất.`
      },
      {
        dayIndex: 5,
        pregnancyDay: startDay + 4,
        title: "Thai Giáo Cảm Xúc: Lá Thư Viết Cho Con",
        method: "Thai Giáo Ý Niệm / Cảm Xúc",
        icon: "🧠",
        description: `Học cách buông thả muộn phiền: ${milestone.emotion}. Tâm thế an dung tự tại của mẹ giải phóng Endorphin nuôi nấng tế bào con tròn trịa.`
      },
      {
        dayIndex: 6,
        pregnancyDay: startDay + 5,
        title: "Nhiệm Vụ Của Bố: Kết Nối Phụ Tử Thiêng Liêng",
        method: "Bố Thai Giáo",
        icon: "👨",
        description: `Hôm nay là ca trực kết nối của bố! Bố hãy dành 10 phút nói chuyện hoặc xoa eo bầu cho mẹ: ${milestone.fatherTask}.`
      },
      {
        dayIndex: 7,
        pregnancyDay: startDay + 6,
        title: "Thử Thách Cuối Tuần: Luyện Tập Thường Nhật",
        method: "Hành động thực tiễn",
        icon: "📝",
        description: `Cùng khép lại tuần thai ${week} rực rỡ với thử thách: ${milestone.dailyPractice}. Mẹ làm rất tốt, con yêu đang cảm ơn mẹ đấy!`
      }
    ];
  };

  // Dynamic texts state loaded from Firestore
  const [appTexts, setAppTexts] = useState<any>({
    id: "texts",
    appTitle: "BaBiCare",
    homepageSubtitle: "Trợ Lý BaBiCare AI",
    pregnancyTitle: "Thông Số Phát Triển Của Bé Yêu",
    countdownLabel: "Ngày bé chào đời",
    maternityHandbookTitle: "Cẩm Nang Mang Thai & Thai Giáo",
    aiDoctorTitle: "Trợ Lý AI BaBiCare",
    aiDoctorSubtitle: "Tư vấn sức khỏe thai kỳ trực tuyến 24/7"
  });

  // Dynamic Recommended Products state
  const [customRecommendProducts, setCustomRecommendProducts] = useState<AffiliateProduct[]>(DEFAULT_AFFILIATE_PRODUCTS);

  useEffect(() => {
    // 1. Clock timer update logic
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, "0");
      let minutes = now.getMinutes().toString().padStart(2, "0");
      setDeviceTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);

    // 2. Check PWA standalone mode and prepare installation banner
    const isStandalone_Media = window.matchMedia("(display-mode: standalone)").matches;
    const navigator_standalone = (navigator as any).standalone === true;
    const isInstalled = isStandalone_Media || navigator_standalone;
    setIsAlreadyStandalone(isInstalled);

    if (!isInstalled && localStorage.getItem("babicare_pwa_dismissed") !== "true") {
      const timer = setTimeout(() => {
        setShowPWAInstallPrompt(true);
      }, 4000); // Wait 4s after loading for smooth appearance
    }

    // 3. Handle beforeinstallprompt on supported platforms (Chrome/Android)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("[PWA] beforeinstallprompt event captured");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);


  // Form states
  const [method, setMethod] = useState<"LMP" | "EDD">("LMP");
  const [lastPeriodDate, setLastPeriodDate] = useState<string>(INITIAL_LMP);
  const [doctorDueDate, setDoctorDueDate] = useState<string>(INITIAL_EDD);
  const [motherPhase, setMotherPhase] = useState<"prepreg" | "pregnancy">(() => {
    return (localStorage.getItem("babicare_mother_phase") as "prepreg" | "pregnancy") || "pregnancy";
  });
  const [motherName, setMotherName] = useState<string>(() => {
    return localStorage.getItem("babicare_mother_name") || "";
  });
  const [motherPhone, setMotherPhone] = useState<string>(() => {
    return localStorage.getItem("babicare_mother_phone") || "";
  });
  const [motherEmailState, setMotherEmailState] = useState<string>(() => {
    return localStorage.getItem("babicare_mother_email") || "";
  });
  const [motherAddress, setMotherAddress] = useState<string>(() => {
    return localStorage.getItem("babicare_mother_address") || "";
  });
  const [motherBirthdate, setMotherBirthdate] = useState<string>(() => {
    return localStorage.getItem("babicare_mother_birthdate") || "1998-05-25";
  });

  const [motherAge, setMotherAge] = useState<string>(() => {
    return localStorage.getItem("babicare_mother_age") || "28";
  });
  const [weightBefore, setWeightBefore] = useState<string>(() => {
    return localStorage.getItem("babicare_weight_before") || "52";
  });
  const [heightBefore, setHeightBefore] = useState<string>(() => {
    return localStorage.getItem("babicare_height_before") || "160";
  });
  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem("babicare_mother_notes") || "Hay mỏi vùng lưng dưới khi đứng lâu, thèm đồ chua dịu.";
  });

  const calculateGregorianAge = (birthdateStr: string): number => {
    if (!birthdateStr) return 28;
    const birth = new Date(birthdateStr);
    if (isNaN(birth.getTime())) return 28;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getLunarAge = (birthdateStr: string): number => {
    return calculateGregorianAge(birthdateStr) + 1;
  };

  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem("babicare_gemini_api_key") || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
  });

  const getApiKey = () => {
    return geminiApiKey || localStorage.getItem("babicare_gemini_api_key") || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
  };

  const [maternalWeeklyWeights, setMaternalWeeklyWeights] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("babicare_maternal_weekly_weights");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading maternal weekly weights:", e);
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem("babicare_maternal_weekly_weights", JSON.stringify(maternalWeeklyWeights));
  }, [maternalWeeklyWeights]);

  // Profile modal slide-up state
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Affiliate Recommended Products State
  const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProduct[]>(() => {
    const saved = localStorage.getItem("babicare_affiliate_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading affiliate products:", e);
      }
    }
    return DEFAULT_AFFILIATE_PRODUCTS;
  });

  const [prePregNutriProducts, setPrePregNutriProducts] = useState<AffiliateProduct[]>(() => {
    const saved = localStorage.getItem("babicare_prepreg_nutri_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading prepreg nutri products:", e);
      }
    }
    return DEFAULT_PREPREG_NUTRI_PRODUCTS;
  });

  const [ovulationProducts, setOvulationProducts] = useState<AffiliateProduct[]>(() => {
    const saved = localStorage.getItem("babicare_ovulation_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading ovulation products:", e);
      }
    }
    return DEFAULT_OVULATION_PRODUCTS;
  });

  const [pregnancyDetectionProducts, setPregnancyDetectionProducts] = useState<AffiliateProduct[]>(() => {
    const saved = localStorage.getItem("babicare_pregnancy_detection_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading pregnancy detection products:", e);
      }
    }
    return DEFAULT_PREGNANCY_DETECTION_PRODUCTS;
  });

  const [isAffiliateEditModalOpen, setIsAffiliateEditModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<AffiliateProduct | null>(null);
  const [isParsingLink, setIsParsingLink] = useState<boolean>(false);

  const extractKeywordFromUrlLocal = (urlStr: string): string => {
    try {
      const u = new URL(urlStr);
      const q = u.searchParams.get("keyword") || u.searchParams.get("q");
      if (q) return decodeURIComponent(q).trim();
      
      const parts = u.pathname.split("/");
      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        const decoded = decodeURIComponent(lastPart);
        const cleaned = decoded.split("-i.")[0];
        if (cleaned && cleaned.length > 3) {
          return cleaned.replace(/-/g, " ").trim();
        }
      }
    } catch (e) {}
    return "";
  };

  const handleAutoParseLink = async (url: string) => {
    if (!url || typeof url !== "string") return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) return;

    setIsParsingLink(true);
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error("Mẹ chưa cấu hình API Key Gemini. Vui lòng mở phần CÀI ĐẶT băm góc trên bên phải và thêm API Key nhé.");
      }

      // Trích xuất từ khóa từ URL trực tiếp ở client-side
      const extractedKeyword = extractKeywordFromUrlLocal(url) || "Sản Phẩm Tiếp Thị Thai Kỳ / Em Bé";

      const prompt = `Bạn là trợ lý AI xử lý dữ liệu liên kết tiếp thị (affiliate link parser) chuyên nghiệp tại Việt Nam.
Phân tích từ khóa / URL sản phẩm chi tiết dưới đây để trích xuất ra:
1. Tên sản phẩm gọn gàng, súc tích (mẫu mã thực, loại bỏ chữ dán quảng cáo dư thừa, mã freeship bộc lột phụ, nhãn SKU rườm rà).
2. Giá bán tốt nhất hoàn hảo kèm chữ đ (ví dụ: "1.150.050đ" hoặc "365.000đ"). Hãy tự động phân tích loại sản phẩm và ước tính một khoảng giá bán lẻ thực tế, sát thị trường nhất tại Việt Nam của mặt hàng sản phẩm đó (ví dụ: Elevit bầu khoảng 1.150.000đ, Sắt Blackmores hũ khoảng 195.000đ, Kem dưỡng ẩm mờ rạn nứt khoảng 340.000đ).
3. Ảnh đại diện Unsplash phù hợp mô tả sản phẩm (ví dụ dưỡng da, vitamin bầu bồi bổ, sữa dinh dưỡng, ngũ cốc tự nhiên).

Ý nghĩa từ khóa / URL đầu vào:
- URL: ${url}
- Từ khóa trích xuất được: ${extractedKeyword}

Hãy trả về một đối tượng JSON duy nhất theo đúng cấu trúc sau mà không có thêm bất kỳ từ ngữ nào khác ngoài JSON:
{
  "name": "Tên sản phẩm đẹp nhất",
  "price": "Giá bán tốt nhất kèm chữ đ",
  "imageUrl": "Link ảnh sản phẩm từ Unsplash phù hợp nhất"
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const resData = await response.json();
        const textOutput = resData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        
        const data = JSON.parse(textOutput.trim());
        if (editingProduct) {
          setEditingProduct(prev => {
            if (!prev) return null;
            return {
              ...prev,
              name: data.name || prev.name,
              imageUrl: data.imageUrl || prev.imageUrl,
              price: data.price || prev.price,
              affiliateUrl: url
            };
          });
        }
      }
    } catch (e) {
      console.error("Error auto parsing affiliate link:", e);
    } finally {
      setIsParsingLink(false);
    }
  };

  // Auto-save changes to affiliate lists
  useEffect(() => {
    localStorage.setItem("babicare_affiliate_products", JSON.stringify(affiliateProducts));
  }, [affiliateProducts]);

  useEffect(() => {
    localStorage.setItem("babicare_prepreg_nutri_products", JSON.stringify(prePregNutriProducts));
  }, [prePregNutriProducts]);

  useEffect(() => {
    localStorage.setItem("babicare_ovulation_products", JSON.stringify(ovulationProducts));
  }, [ovulationProducts]);

  useEffect(() => {
    localStorage.setItem("babicare_pregnancy_detection_products", JSON.stringify(pregnancyDetectionProducts));
  }, [pregnancyDetectionProducts]);

  // Calculated Stats State
  const [stats, setStats] = useState<PregnancyResult | null>(null);

  // Explorer State - allows exploring other weeks too!
  const [selectedWeek, setSelectedWeek] = useState<number>(21);

  // Tab State: "info" (Thai Kỳ) | "fetal" (Chỉ số của bé) | "handbook" (Cẩm nang sức khỏe) | "aiReport" (Báo cáo AI Chuyên Sâu) | "menstrual" (Theo dõi kỳ kinh, rụng trứng)
  const [activeTab, setActiveTab] = useState<"info" | "fetal" | "handbook" | "aiReport" | "menstrual">("info");

  // Nút Chat nổi và giao diện Chatbox riêng biệt
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Sub Tab inside "Cẩm nang chăm sóc sức khỏe"
  const [handbookSubTab, setHandbookSubTab] = useState<"vitamin" | "nutrition" | "milestone" | "massage" | "thaigiao" | "hospitalBag">("vitamin");
  const [selectedVitaminPhase, setSelectedVitaminPhase] = useState<number>(0);
  const [activeProductCategory, setActiveProductCategory] = useState<"all" | "vitamin" | "stretch_mark" | "food_drink">("all");

  // Sub Tab inside "Thả Bầu"
  const [menstrualSubTab, setMenstrualSubTab] = useState<"calculator" | "prePregnancy">("calculator");

  // Checklist tiền thai sản lưu trữ persistent
  const [prePregChecklist, setPrePregChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("pre_preg_checklist");
      return stored ? JSON.parse(stored) : {
        vaccine_mmr: false,
        vaccine_flu: false,
        vaccine_hpv: false,
        folic_acid: false,
        dha_omega: false,
        blood_test: false,
        genetic_screening: false,
        fertility_check: false,
        finance_plan: false,
        stress_relief: false,
        no_toxins: false,
        test_lh_egg: false,
        hcg_pregnant: false,
      };
    } catch {
      return {
        vaccine_mmr: false,
        vaccine_flu: false,
        vaccine_hpv: false,
        folic_acid: false,
        dha_omega: false,
        blood_test: false,
        genetic_screening: false,
        fertility_check: false,
        finance_plan: false,
        stress_relief: false,
        no_toxins: false,
        test_lh_egg: false,
        hcg_pregnant: false,
      };
    }
  });

  const toggleChecklistItem = (key: string) => {
    const updated = { ...prePregChecklist, [key]: !prePregChecklist[key] };
    setPrePregChecklist(updated);
    localStorage.setItem("pre_preg_checklist", JSON.stringify(updated));
  };

  // Sub Tab inside "Chỉ số Sinh học chi tiết": "standard" (Mặc định) | "ultrasound" (So sánh siêu âm)
  const [fetalSubTab, setFetalSubTab] = useState<"standard" | "ultrasound">("standard");

  // State for user's ultrasound data saved by week number
  const [ultrasoundInputs, setUltrasoundInputs] = useState<Record<number, {
    weight: string;
    length: string;
    hc: string;
    ac: string;
    fl: string;
  }>>({
    21: { weight: "385", length: "27.1", hc: "192", ac: "168", fl: "36" }
  });

  // Gemini API States - AI Health Report
  const [aiReport, setAiReport] = useState<string>("");
  const [loadingReport, setLoadingReport] = useState<boolean>(false);
  const [errorReport, setErrorReport] = useState<string>("");

  // Gemini API States - Chatbot Trợ Lý BaBiCare AI
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Chào mẹ bầu thân yêu! Tôi là Trợ Lý BaBiCare AI, người bạn đồng hành y khoa thông minh cùng mẹ trong suốt thai kỳ nhiệm màu. Hãy cho tôi biết mẹ có băn khoăn gì về chỉ số phát triển của con, triệu chứng cơ thể hay chế độ dinh dưỡng tuần này không nhé?",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState<string>("");
  const [loadingChat, setLoadingChat] = useState<boolean>(false);

  // Thai giáo States
  const [babyNotes, setBabyNotes] = useState<Record<number, string>>(() => {
    try {
      const stored = localStorage.getItem("baby_notes");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [playingTrack, setPlayingTrack] = useState<string | null>("Nhạc Baroque Giai Điệu Não Bộ (Binaural Bach)");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [musicProgress, setMusicProgress] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setMusicProgress(prev => {
          if (prev >= 100) {
            return 0; // Loop tracking
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // ==================== STATE VÀ LOGIC THEO DÕI KỲ KINH & RỤNG TRỨNG ====================
  const [menstrualLogs, setMenstrualLogs] = useState<Array<{
    id: string;
    startDate: string;
    periodDays: number;
    cycleLength: number;
  }>>(() => {
    try {
      const stored = localStorage.getItem("menstrual_logs");
      if (stored) return JSON.parse(stored);
    } catch {}
    // Seed data: simulating 3 consecutive menstrual cycles to instantly trigger the dyn average
    return [
      { id: "seed-1", startDate: "2026-03-01", periodDays: 5, cycleLength: 28 },
      { id: "seed-2", startDate: "2026-03-29", periodDays: 5, cycleLength: 29 },
      { id: "seed-3", startDate: "2026-04-27", periodDays: 6, cycleLength: 28 },
    ];
  });

  const [newLogStartDate, setNewLogStartDate] = useState<string>("2026-05-20");
  const [newLogPeriodDays, setNewLogPeriodDays] = useState<number>(5);
  const [newLogCycleLength, setNewLogCycleLength] = useState<number>(28);

  // --- Firebase Listeners, Sync Hooks and User Signin Handlers ---
  const handleSignInWithGoogle = async () => {
    if (!isFirebaseConfigured()) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleTryDemo = () => {
    const demoUser = {
      uid: "demo_user_6688",
      email: "suacauba@gmail.com",
      displayName: "Mẹ Bầu Trải Nghiệm",
      photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      isDemo: true
    };
    setUser(demoUser);
    setIsAdminUser(true);
    setIsOnboarding(true);
  };

  const handleOnboardingComplete = async (inputs: any) => {
    setMethod(inputs.method);
    setLastPeriodDate(inputs.lastPeriodDate);
    setDoctorDueDate(inputs.doctorDueDate);
    setMotherPhase(inputs.phase);
    setMotherAge(inputs.motherAge);
    setWeightBefore(inputs.weightBefore);
    setHeightBefore(inputs.heightBefore);
    setNotes(inputs.notes);
    
    // Set some defaults based on user account
    const defaultName = user?.displayName || "";
    const defaultEmail = user?.email || "";
    setMotherName(defaultName);
    setMotherEmailState(defaultEmail);
    setMotherPhone("");
    setMotherAddress("");
    setMotherBirthdate("1998-05-25"); // default birthdate equivalent to age 28 roughly

    localStorage.setItem("babicare_mother_name", defaultName);
    localStorage.setItem("babicare_mother_email", defaultEmail);
    localStorage.setItem("babicare_mother_phone", "");
    localStorage.setItem("babicare_mother_address", "");
    localStorage.setItem("babicare_mother_birthdate", "1998-05-25");
    localStorage.setItem("babicare_mother_age", inputs.motherAge);
    localStorage.setItem("babicare_weight_before", inputs.weightBefore);
    localStorage.setItem("babicare_height_before", inputs.heightBefore);
    localStorage.setItem("babicare_mother_notes", inputs.notes);
    localStorage.setItem("babicare_gemini_api_key", geminiApiKey);
    localStorage.setItem("babicare_mother_phase", inputs.phase);

    setMaternalWeeklyWeights({});
    setPrePregChecklist({});
    setBabyNotes({});
    setUltrasoundInputs({});
    
    // Calculate stats immediately
    performCalculation(inputs.method, inputs.lastPeriodDate, inputs.doctorDueDate);
    
    if (inputs.phase === "prepreg") {
      setActiveTab("menstrual");
      setMenstrualSubTab("calculator");
      const todayStr = new Date().toISOString().split("T")[0];
      setMenstrualLogs([{
        id: "initial_log",
        startDate: todayStr,
        periodDays: parseInt(inputs.periodDuration, 10) || 5,
        cycleLength: parseInt(inputs.cycleLength, 10) || 28
      }]);
    } else {
      setActiveTab("info");
      setSelectedWeek(6);
    }

    setIsOnboarding(false);

    const initialSyncData = {
      uid: user.uid,
      email: user.email || "",
      phase: inputs.phase,
      motherName: defaultName,
      motherEmail: defaultEmail,
      motherPhone: "",
      motherAddress: "",
      motherBirthdate: "1998-05-25",
      motherAge: inputs.motherAge,
      weightBefore: inputs.weightBefore,
      heightBefore: inputs.heightBefore,
      notes: inputs.notes,
      method: inputs.method,
      lastPeriodDate: inputs.lastPeriodDate,
      doctorDueDate: inputs.doctorDueDate,
      maternalWeeklyWeights: {},
      prePregChecklist: {},
      babyNotes: {},
      menstrualLogs: inputs.phase === "prepreg" ? [{
        id: "initial_log",
        startDate: new Date().toISOString().split("T")[0],
        periodDays: parseInt(inputs.periodDuration, 10) || 5,
        cycleLength: parseInt(inputs.cycleLength, 10) || 28
      }] : [],
      ultrasoundInputs: {}
    };

    await saveUserData(initialSyncData);
  };

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setUserLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        const isEmailAdmin = fbUser.email === "suacauba@gmail.com";
        setIsAdminUser(isEmailAdmin);
        
        const userRef = doc(db, "users", fbUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.phase) {
              setMethod(userData.method || "LMP");
              setLastPeriodDate(userData.lastPeriodDate || INITIAL_LMP);
              setDoctorDueDate(userData.doctorDueDate || INITIAL_EDD);
              setMotherPhase(userData.phase || "pregnancy");
              setMotherName(userData.motherName || fbUser.displayName || "");
              setMotherPhone(userData.motherPhone || "");
              setMotherEmailState(userData.motherEmail || fbUser.email || "");
              setMotherAddress(userData.motherAddress || "");
              setMotherBirthdate(userData.motherBirthdate || "1998-05-25");
              setMotherAge(userData.motherAge || "28");
              setWeightBefore(userData.weightBefore || "52");
              setHeightBefore(userData.heightBefore || "160");
              setNotes(userData.notes || "");
              if (userData.maternalWeeklyWeights) setMaternalWeeklyWeights(userData.maternalWeeklyWeights);
              if (userData.prePregChecklist) setPrePregChecklist(userData.prePregChecklist);
              if (userData.babyNotes) setBabyNotes(userData.babyNotes);
              if (userData.menstrualLogs) setMenstrualLogs(userData.menstrualLogs);
              if (userData.ultrasoundInputs) setUltrasoundInputs(userData.ultrasoundInputs);
              setIsOnboarding(false);
            } else {
              setIsOnboarding(true);
            }
          } else {
            setIsOnboarding(true);
          }
        } catch (err) {
          console.error("Error loading user from Firestore:", err);
          setIsOnboarding(true);
        }
      } else {
        setUser(null);
        setIsAdminUser(false);
        setIsOnboarding(false);
      }
      setUserLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    
    const settingsDoc = doc(db, "appSettings", "texts");
    const unsubscribe = onSnapshot(settingsDoc, (snap) => {
      if (snap.exists()) {
        const textData = snap.data();
        setAppTexts((prev: any) => ({
          ...prev,
          ...textData
        }));
      }
    }, (err) => {
      console.warn("Could not subscribe to appSettings:", err);
    });
    
    return () => unsubscribe();
  }, [user]);

  // --- Handbook Real-time Synchronizer ---
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    
    const hbDoc = doc(db, "appSettings", "handbook");
    const unsubscribe = onSnapshot(hbDoc, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.vitaminData) {
          setCustomVitaminData(data.vitaminData);
          localStorage.setItem("babicare_handbook_vitamin", JSON.stringify(data.vitaminData));
        }
        if (data.nutritionStages) {
          setCustomNutritionStages(data.nutritionStages);
          localStorage.setItem("babicare_handbook_nutrition", JSON.stringify(data.nutritionStages));
        }
        if (data.clinicalMilestones) {
          setCustomClinicalMilestones(data.clinicalMilestones);
          localStorage.setItem("babicare_handbook_milestones", JSON.stringify(data.clinicalMilestones));
        }
        if (data.massageAndSkinSecrets) {
          setCustomMassageAndSkinSecrets(data.massageAndSkinSecrets);
          localStorage.setItem("babicare_handbook_massage", JSON.stringify(data.massageAndSkinSecrets));
        }
        if (data.thaiGiaoMilestones) {
          setCustomThaiGiaoMilestones(data.thaiGiaoMilestones);
          localStorage.setItem("babicare_handbook_thaigiao", JSON.stringify(data.thaiGiaoMilestones));
        }
      }
    }, (err) => {
      console.warn("Could not subscribe to handbook configurations:", err);
    });
    
    return () => unsubscribe();
  }, [user]);

  const handleSaveVitaminData = async (data: VitaminInfo[]) => {
    setCustomVitaminData(data);
    localStorage.setItem("babicare_handbook_vitamin", JSON.stringify(data));
    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, "appSettings", "handbook"), { vitaminData: data }, { merge: true });
      } catch (err) {
        console.error("Failed to sync Vitamin to Firestore:", err);
      }
    }
  };

  const handleSaveNutritionStages = async (data: FoodNutrition[]) => {
    setCustomNutritionStages(data);
    localStorage.setItem("babicare_handbook_nutrition", JSON.stringify(data));
    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, "appSettings", "handbook"), { nutritionStages: data }, { merge: true });
      } catch (err) {
        console.error("Failed to sync Nutrition to Firestore:", err);
      }
    }
  };

  const handleSaveClinicalMilestones = async (data: ImmunizationMilestone[]) => {
    setCustomClinicalMilestones(data);
    localStorage.setItem("babicare_handbook_milestones", JSON.stringify(data));
    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, "appSettings", "handbook"), { clinicalMilestones: data }, { merge: true });
      } catch (err) {
        console.error("Failed to sync Milestones to Firestore:", err);
      }
    }
  };

  const handleSaveMassageAndSkinSecrets = async (data: MassageSpaSkin[]) => {
    setCustomMassageAndSkinSecrets(data);
    localStorage.setItem("babicare_handbook_massage", JSON.stringify(data));
    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, "appSettings", "handbook"), { massageAndSkinSecrets: data }, { merge: true });
      } catch (err) {
        console.error("Failed to sync Massage & Skin secrets to Firestore:", err);
      }
    }
  };

  const handleSaveThaiGiaoMilestones = async (data: ThaiGiaoMilestone[]) => {
    setCustomThaiGiaoMilestones(data);
    localStorage.setItem("babicare_handbook_thaigiao", JSON.stringify(data));
    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, "appSettings", "handbook"), { thaiGiaoMilestones: data }, { merge: true });
      } catch (err) {
        console.error("Failed to sync Thai Giao to Firestore:", err);
      }
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      const saved = localStorage.getItem("babicare_custom_recommend_products");
      if (saved) {
        try {
          setCustomRecommendProducts(JSON.parse(saved));
          return;
        } catch (_) {}
      }
      setCustomRecommendProducts(DEFAULT_AFFILIATE_PRODUCTS);
      return;
    }
    
    const prodCol = collection(db, "recommendedProducts");
    const unsubscribe = onSnapshot(prodCol, (snapshot) => {
      const items: AffiliateProduct[] = [];
      snapshot.forEach((pDoc) => {
        items.push(pDoc.data() as AffiliateProduct);
      });
      if (items.length > 0) {
        setCustomRecommendProducts(items);
      } else {
        setCustomRecommendProducts(DEFAULT_AFFILIATE_PRODUCTS);
      }
    }, (err) => {
      console.warn("Could not subscribe to recommendedProducts, using samples:", err);
    });
    
    return () => unsubscribe();
  }, [user]);

  const saveUserData = async (updates: any) => {
    if (user) {
      if (user.isDemo) {
        localStorage.setItem("babicare_demo_profile", JSON.stringify({ ...user, ...updates }));
        return;
      }
      if (isFirebaseConfigured()) {
        try {
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, {
            ...updates,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (error) {
          console.error("Failed to write to Firestore:", error);
        }
      }
    }
  };

  useEffect(() => {
    if (!user || userLoading) return;
    
    const dataToSync = {
      uid: user.uid,
      email: user.email || "",
      phase: motherPhase,
      motherName,
      motherPhone,
      motherEmail: motherEmailState,
      motherAddress,
      motherBirthdate,
      motherAge,
      weightBefore,
      heightBefore,
      notes,
      method,
      lastPeriodDate,
      doctorDueDate,
      maternalWeeklyWeights,
      prePregChecklist,
      babyNotes,
      menstrualLogs,
      ultrasoundInputs
    };

    saveUserData(dataToSync);
  }, [
    user,
    motherPhase,
    motherName,
    motherPhone,
    motherEmailState,
    motherAddress,
    motherBirthdate,
    motherAge,
    weightBefore,
    heightBefore,
    notes,
    method,
    lastPeriodDate,
    doctorDueDate,
    maternalWeeklyWeights,
    prePregChecklist,
    babyNotes,
    menstrualLogs,
    ultrasoundInputs
  ]);

  // Machine Learning calculation to derive medical stats from cycle history
  const analyzeMenstrualCycles = () => {
    if (menstrualLogs.length === 0) {
      return {
        avgCycleLength: 28,
        avgPeriodDays: 5,
        totalGapsSampled: 0,
        cycleLengthsSource: "Mặc định (chưa đủ dữ liệu)",
        latestStartDate: "2026-05-20"
      };
    }

    // Sort ascending to measure physical intervals between periods
    const sortedLogsAsc = [...menstrualLogs].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const sortedLogsDesc = [...menstrualLogs].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    const latestStartDate = sortedLogsDesc[0].startDate;

    const gaps: number[] = [];
    for (let i = 0; i < sortedLogsAsc.length - 1; i++) {
      const currentVal = new Date(sortedLogsAsc[i].startDate);
      const nextVal = new Date(sortedLogsAsc[i+1].startDate);
      const diffTime = nextVal.getTime() - currentVal.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      // Standard physiological limit (18 - 45 days)
      if (diffDays >= 18 && diffDays <= 45) {
        gaps.push(diffDays);
      }
    }

    const totalDaysCount = menstrualLogs.reduce((sum, log) => sum + log.periodDays, 0);
    const avgPeriodDays = Math.round((totalDaysCount / menstrualLogs.length) * 10) / 10;

    let avgCycleLength = 28;
    let cycleLengthsSource = "";

    if (gaps.length > 0) {
      const sumGaps = gaps.reduce((sum, g) => sum + g, 0);
      avgCycleLength = Math.round((sumGaps / gaps.length) * 10) / 10;
      cycleLengthsSource = `Học máy thông minh thu được từ ${gaps.length} chu kỳ nhịp kinh thực tế của mẹ`;
    } else {
      const sumDeclared = menstrualLogs.reduce((sum, log) => sum + log.cycleLength, 0);
      avgCycleLength = Math.round((sumDeclared / menstrualLogs.length) * 10) / 10;
      cycleLengthsSource = "Tính theo trung bình số ngày chu kỳ mẹ tự khai báo (chưa đủ dữ liệu các tháng liên tiếp)";
    }

    return {
      avgCycleLength,
      avgPeriodDays,
      totalGapsSampled: gaps.length,
      cycleLengthsSource,
      latestStartDate
    };
  };

  const saveMenstrualLogs = (updated: typeof menstrualLogs) => {
    setMenstrualLogs(updated);
    try {
      localStorage.setItem("menstrual_logs", JSON.stringify(updated));
    } catch {}
  };

  // Handle Initial & Form Submission Calculations
  const performCalculation = (
    overrideMethod?: "LMP" | "EDD",
    overrideLMP?: string,
    overrideEDD?: string
  ) => {
    try {
      const activeMethod = overrideMethod !== undefined ? overrideMethod : method;
      const activeLMP = overrideLMP !== undefined ? overrideLMP : lastPeriodDate;
      const activeEDD = overrideEDD !== undefined ? overrideEDD : doctorDueDate;

      let result: PregnancyResult;
      if (activeMethod === "LMP") {
        result = calculateFromLMP(activeLMP, new Date("2026-05-22"));
        setDoctorDueDate(formatLocalDate(result.estimatedDueDate));
      } else {
        result = calculateFromEDD(activeEDD, new Date("2026-05-22"));
      }
      setStats(result);
      
      const computedWeek = result.gestationalWeeks;
      const clampedWeek = Math.min(42, Math.max(4, computedWeek));
      setSelectedWeek(clampedWeek);
    } catch (error) {
      console.error("Error computing pregnancy statistics:", error);
    }
  };

  // Run on mount
  useEffect(() => {
    performCalculation();
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("babicare_mother_name", motherName);
    localStorage.setItem("babicare_mother_phone", motherPhone);
    localStorage.setItem("babicare_mother_email", motherEmailState);
    localStorage.setItem("babicare_mother_address", motherAddress);
    localStorage.setItem("babicare_mother_birthdate", motherBirthdate);
    localStorage.setItem("babicare_mother_age", motherAge);
    localStorage.setItem("babicare_weight_before", weightBefore);
    localStorage.setItem("babicare_height_before", heightBefore);
    localStorage.setItem("babicare_mother_notes", notes);
    localStorage.setItem("babicare_gemini_api_key", geminiApiKey);
    localStorage.setItem("babicare_mother_phase", motherPhase);
    performCalculation();
    setIsProfileOpen(false); // Smooth slide close on submission
  };

  // Generate Gemini AI Pregnancy deep report (Called directly from Client-side for Cloudflare compatible)
  const handleGenerateReport = async () => {
    setLoadingReport(true);
    setAiReport("");
    setErrorReport("");
    setActiveTab("aiReport");
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error("Mẹ chưa khai báo API Key Gemini! Vui lòng bấm vào 'CÀI ĐẶT' ở góc trên bên phải để nhập API Key và Lưu lại nhé.");
      }

      const prompt = `Bạn là một bác sĩ sản khoa và chuyên gia dinh dưỡng thai kỳ ưu tú với hơn 20 năm kinh nghiệm của Việt Nam. 
Hãy viết một bản "Cẩm nang & Báo cáo Sức khỏe Chuyên Sâu" bằng tiếng Việt cho người mẹ đang mang thai ở TUẦN thứ ${selectedWeek}.
Thông tin thêm về sản phụ nếu có:
${motherAge ? `- Tuổi hiện tại của mẹ: ${motherAge} tuổi` : ""}
${weightBefore ? `- Cân nặng trước khi mang thai: ${weightBefore} kg` : ""}
${notes ? `- Triệu chứng mệt mỏi hoặc lưu ý sức khỏe của mẹ: ${notes}` : ""}

Hãy cung cấp báo cáo chi tiết, chuyên nghiệp nhưng vô cùng ân cần, ấm áp dưới dạng Markdown với các phần cụ thể sau:

1. **🌟 Tổng quan sự phát triển kì diệu của bé ở Tuần ${selectedWeek}**
   - Mô tả sinh động về sự phát triển hình thái kỳ này (ví dụ: tay chân, tóc móng, tim thai, não bộ phát triển thế nào).
   - Hãy liệt kê một cách rõ ràng các chỉ số phát triển trung bình cho tuần ${selectedWeek} (mẹ bầu rất mong mỏi các chỉ số này):
     - Chiều dài: chỉ rõ là chiều dài đầu mông (CRL) hay chiều dài đầu chân
     - Cân nặng ước lượng (g)
     - Chu vi đầu (HC - mm)
     - Chu vi bụng (AC - mm)
     - Chiều dài xương đùi (FL - mm)
     - (Nếu mốc thai nhi còn quá nhỏ chưa đo được một số chỉ số thì hãy giải thích nhẹ nhàng cho mẹ an tâm).

2. **🥦 Chế độ Dinh dưỡng Hợp lý & Khoa học tuần này**
   - Các nhóm chất cốt lõi cần nạp nhiều (Sắt, Canxi, DHA, Acid Folic, các loại thực phẩm thực tế nên ăn tại Việt Nam).
   - Những món ăn, thói quen mẹ bầu tuyệt đối cần tránh lúc này.

3. **🤰 Thay đổi tự nhiên trên cơ thể Mẹ & Cách xoa dịu**
   - Các triệu chứng thường gặp ở cơ thể mẹ vào tuần ${selectedWeek} (ốm nghén, đau lưng, ngủ kém, thay đổi nội sắc tố hoặc tâm lý...) và các mẹo dân gian/y học an toàn để làm giảm sự mệt mỏi.

4. **📅 Lịch trình Khám thai & Xét nghiệm cốt lõi tại mốc này**
   - Giải thích cho mẹ hiểu tuần ${selectedWeek} có nằm trong hoặc gần một mốc siêu âm đặc biệt quan trọng hay xét nghiệm sàng lọc dị tật, tiểu đường, xét nghiệm máu, tiêm phòng uốn ván nào không. Nếu có thì cần thực hiện những gì.

5. **🧘‍♀️ Chăm sóc tinh thần & Gợi ý Vận động nhẹ nhàng**
   - Bài tập phù hợp cho tuần thai này cùng mẹo chia sẻ cùng chồng hoặc thai giáo âm nhạc, tinh thần hạnh phúc.

Hãy kết luận bằng lời chúc bình an, tự tin và một ghi chú y khoa nhỏ nhắc nhở rằng báo cáo này mang tính chất định hướng khoa học và không thay thế hoàn toàn cho các chẩn đoán khám chữa trực tiếp từ bác sĩ chuyên môn chăm sóc khám thai định kỳ của mẹ.`;

      // Direct call to official Google Gemini API (No CORS proxy is required for Gemini generateContent)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error("Không thể kết nối trực tiếp đến máy chủ Gemini của Google. Vui lòng xác minh lại API Key trong phần CÀI ĐẶT.");
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error("Không nhận diện được nội dung phản hồi từ Gemini.");
      }

      setAiReport(content);
    } catch (err: any) {
      setErrorReport(err.message || "Đã xảy ra lỗi ngoài ý muốn khi lấy tư vấn y tế.");
    } finally {
      setLoadingReport(false);
    }
  };

  // Send message to Trợ lý Bác sĩ BaBiCare AI (Calling Gemini directly from browser client)
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || userInput;
    if (!textToSend.trim() || loadingChat) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customMessage) setUserInput("");
    setLoadingChat(true);

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error("Mẹ chưa cấu hình API Key Gemini. Hãy bấm nút 'CÀI ĐẶT' ở góc phải bên trên, dán API Key và bấm Lưu lại để bắt đầu trò chuyện nhé!");
      }

      const systemInstruction = `Bạn là "Trợ lý Bác Sĩ BaBiCare AI", trợ lý thông minh chuyên gia y khoa sản phụ khoa và tư vấn thai sản tận tâm số 1 Việt Nam. 
Bạn đang trò chuyện, gỡ rối nỗi lo và trả lời các thắc mắc chuyên biệt về sức khỏe cho mẹ bầu đang ở TUẦN THỨ ${selectedWeek} của thai kỳ.
Hãy trả lời vô cùng ân cần, nhẹ nhàng, dùng từ ngữ ấm áp, gần gũi như người thân trong nhà nhưng bảo đảm tính chính xác và an toàn y khoa.
Nếu người mẹ hỏi các biểu hiện nguy hiểm trực tiếp (đau bụng quặn thắt, ra máu đỏ tươi, rỉ nước ối, thai kém máy hoặc không máy bất ngờ sau tuần 20...), hãy khuyên mẹ bình tĩnh nhưng cần đến ngay cơ sở y tế gần nhất hoặc liên hệ bác sĩ chuyên khoa phụ sản để thăm khám kịp thời, không tự điều trị qua mạng.`;

      const formattedHistory = [...chatMessages, userMsg].map((m) => {
        const roleName = m.role === "user" ? "Mẹ bầu" : "Trợ lý Bác sĩ";
        return `${roleName}: ${m.content || ""}`;
      }).join("\n");

      const promptText = `${systemInstruction}\n\nLịch sử trò chuyện cũ:\n${formattedHistory}\n\nTrợ lý Bác sĩ:`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (!response.ok) {
        throw new Error("Không thể kết nối đến máy chủ AI của Google. Vui lòng kiểm tra lại API Key.");
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error("Không thể nhận câu trả lời từ bác sĩ AI.");
      }

      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: content,
        timestamp: new Date()
      }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: err.message || "Trợ Lý BaBiCare AI đang gặp sự cố kết nối nhẹ lúc này. Mẹ bầu đừng lo lắng nhé, hãy thử đặt lại câu hỏi sau giây lát.",
        timestamp: new Date()
      }]);
    } finally {
      setLoadingChat(false);
    }
  };

  // --- PWA Installation Callbacks ---
  const handlePWAInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("[PWA] Installation prompt not deferred or supported natively.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowPWAInstallPrompt(false);
  };

  const handlePWADismiss = (stopPrompting: boolean) => {
    if (stopPrompting) {
      localStorage.setItem("babicare_pwa_dismissed", "true");
    }
    setShowPWAInstallPrompt(false);
  };

  // Get current active fetal stats
  const currentFetalStats: FetalStats | undefined = fetalDevelopmentData[selectedWeek];

  return (
    <div className="h-screen w-screen overflow-hidden bg-linear-to-tr from-rose-50/20 via-pink-50/15 to-orange-50/20 text-slate-800 font-sans flex items-center justify-center p-0 md:p-4 selection:bg-rose-200">
      
      {/* Hide scrollbar classes inline */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Outer Layout Options Bar (Only visible on Desktops for demonstrating fidelity flexibility) */}
      <div className="hidden lg:flex flex-col gap-3 absolute left-6 top-6 max-w-xs bg-white/95 p-4 rounded-3xl border border-rose-100 shadow-xl backdrop-blur-md z-40">
        <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
          <span>🛠️</span> Chế Độ Hiển Thị
        </h3>
        <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
          Dễ dàng thay đổi kích thước mô phỏng trải nghiệm ứng dụng trên di động thực tế.
        </p>
        
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setIsSimulatedFrame(true)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isSimulatedFrame 
                ? "bg-rose-500 text-white shadow-md shadow-rose-200" 
                : "bg-slate-100 hover:bg-rose-50 text-slate-600 border border-slate-200/50"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            iOS / Android
          </button>
          <button
            onClick={() => setIsSimulatedFrame(false)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              !isSimulatedFrame 
                ? "bg-rose-500 text-white shadow-md shadow-rose-200" 
                : "bg-slate-100 hover:bg-rose-50 text-slate-600 border border-slate-200/50"
            }`}
          >
            <Maximize2 className="w-4 h-4" />
            Tràn màn hình
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
          📍 Tính năng đồng bộ hoá theo chu kỳ sinh học người mẹ.
        </div>
      </div>

      {/* Main Responsive Device Container */}
      <div 
        className="min-h-screen w-full max-w-none px-4 sm:px-6 md:px-8 bg-white relative flex flex-col transition-all duration-300 border-0"
      >
        
        {/* VIRTUAL STATUS BAR (Only shown in iPhone/Simulated Mode to add deep realism) */}
        {isSimulatedFrame && (
          <div className="hidden md:flex items-center justify-between px-6 pt-3 pb-1 h-9 select-none text-[11px] font-bold text-slate-800 z-30 shrink-0">
            {/* Clock */}
            <span>{deviceTime}</span>
            
            {/* Dynamic Island Notch simulator */}
            <div className="w-[110px] h-4.5 bg-slate-900 rounded-full flex items-center justify-center absolute left-1/2 -translate-x-1/2 top-2 z-[40]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-900/40 absolute right-4"></span>
            </div>

            {/* Hardware Status Icons */}
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span className="text-[12px]">📶</span>
              <span className="text-[12px]">🔋 100%</span>
            </div>
          </div>
        )}

        {/* APP BODY COLUMN */}
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {userLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[10.5px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Chào mừng mẹ đến với Babicare...</p>
            </div>
          ) : !user ? (
            <LandingPage 
              onSignInWithGoogle={handleSignInWithGoogle} 
              onTryDemo={handleTryDemo} 
              isFirebaseConfigured={isFirebaseConfigured()}
            />
          ) : isOnboarding ? (
            <OnboardingFlow 
              userEmail={user.email || ""} 
              userDisplayName={user.displayName || "Mẹ Bầu"} 
              onComplete={handleOnboardingComplete} 
            />
          ) : (
            <>
          
          {/* HEADER NAV */}
          <header className="px-4 py-3 bg-white/95 border-b border-rose-50 flex items-center justify-between relative z-30 backdrop-blur-md shrink-0 select-none">
            <div className="flex items-center gap-2">
              <span className="text-2xl transform active:scale-90 transition-transform duration-155 cursor-default">🤰</span>
              <div>
                <h1 className="text-sm font-black text-slate-800 tracking-tight leading-none uppercase">{appTexts.appTitle}</h1>
                <p className="text-[9px] text-rose-500 font-extrabold mt-0.5 tracking-wider">{appTexts.homepageSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Admin Panel Launcher Button */}
              {isAdminUser && (
                <button
                  onClick={() => setIsAdminPanelOpen(true)}
                  className="p-1.5 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 transition-all active:scale-90 cursor-pointer flex items-center justify-center animate-pulse"
                  title="Mở Bảng Admin"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-700" />
                </button>
              )}

              {/* Profile config pill */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="py-1.5 px-3 rounded-full bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 text-[10px] font-black flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-rose-505 animate-spin-slow" />
                <span>CÀI ĐẶT</span>
              </button>
            </div>
          </header>

          {/* PREGNANCY COUNTDOWN ROW (Vibrant highlight ribbon that shrinks or details the week) */}
          {activeTab === "info" && stats && (
            <div className="bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-4 py-2.5 text-white shadow-inner shrink-0 relative overflow-hidden select-none">
              <div className="flex items-center justify-between z-10 relative">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="bg-white/20 text-[8px] uppercase font-black px-2 py-0.5 rounded-full letter tracking-widest text-white">
                      Mẹ Thai {stats.gestationalWeeks} Tuần
                    </span>
                    <span className="text-[10px] font-semibold text-rose-100 opacity-90">
                      Dự sinh: {stats.estimatedDueDate.toLocaleDateString("vi-VN", { day: 'numeric', month: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-rose-50 leading-tight mt-0.5">
                    {stats.remainingDays > 0 ? (
                      <>Còn <strong className="text-white font-black text-sm">{stats.remainingDays} ngày</strong> để ôm bé yêu</>
                    ) : (
                      <>Đến ngày lâm bồn thiêng liêng! </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-black/15 px-2 py-1.5 rounded-xl border border-white/10 text-right">
                  <span className="text-[10px] text-rose-100 block font-semibold leading-none">Hành trình</span>
                  <span className="text-xs font-black text-white leading-none">{stats.percentComplete}%</span>
                </div>
              </div>
              
              {/* Slender Progress Line */}
              <div className="w-full h-1 bg-rose-950/20 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-amber-300 rounded-full" style={{ width: `${stats.percentComplete}%` }}></div>
              </div>
            </div>
          )}

          {/* HORIZONTAL WEEK TOUCH CAROUSEL (Explore weeks easily by swiping or tapping) */}
          {activeTab === "info" && (
            <div className="bg-slate-50 border-b border-rose-100 py-2 shrink-0">
              <div className="flex items-center justify-between px-4 mb-1.5">
                <span className="text-[9px] font-black tracking-widest uppercase text-slate-400">Khám Phá Sự Phát Triển</span>
                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">Tuần {selectedWeek} / 42</span>
              </div>
              
              <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar scroll-smooth">
                {Array.from({ length: 39 }, (_, i) => i + 4).map((w) => {
                  const isActive = selectedWeek === w;
                  const isCalculated = stats && stats.gestationalWeeks === w;
                  return (
                    <button
                      key={w}
                      onClick={() => setSelectedWeek(w)}
                      className={`h-9 w-12 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-90 ${
                        isActive 
                          ? "bg-rose-500 text-white font-black shadow-md shadow-rose-200" 
                          : isCalculated
                          ? "bg-amber-100 border border-amber-300 text-amber-800"
                          : "bg-white hover:bg-rose-50 text-slate-600 border border-slate-150"
                      }`}
                      title={`Tuần ${w}`}
                    >
                      T{w}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MAIN CONTAINER (Tab switching viewport - scrollable contents) */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 pb-6 touch-pan-y">
            
            {/* ==================== TAB 1: THÔNG TIN THAI KỲ ==================== */}
            {activeTab === "info" && currentFetalStats && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Anatomical visual model panel */}
                <div className="bg-white rounded-3xl border border-rose-105 shadow-sm overflow-hidden">
                  <FetalAnatomyModel week={selectedWeek} />
                </div>

                {/* Narrative baby size and visual description */}
                <div className="bg-white rounded-3xl p-4.5 border border-rose-100 shadow-xs space-y-3">
                  <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-rose-50 pb-2">
                    <Baby className="w-4 h-4 text-rose-500" /> Đặc điểm của bé lúc này
                  </h4>
                  
                  <p className="text-slate-700 text-xs leading-relaxed font-normal">
                    {currentFetalStats.description || "Phôi thai học đang phát triển các tế bào nguyên thô nền tảng."}
                  </p>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl p-3 border border-amber-200/50 flex items-center gap-3.5">
                    <span className="text-3xl select-none filter drop-shadow-sm">
                      {currentFetalStats.fruitComparison?.toLowerCase().includes("bắp") || currentFetalStats.fruitComparison?.toLowerCase().includes("ngô") ? "🌽" :
                       currentFetalStats.fruitComparison?.toLowerCase().includes("nho") ? "🍇" :
                       currentFetalStats.fruitComparison?.toLowerCase().includes("cam") || currentFetalStats.fruitComparison?.toLowerCase().includes("chanh") ? "🍋" :
                       currentFetalStats.fruitComparison?.toLowerCase().includes("táo") ? "🍎" :
                       currentFetalStats.fruitComparison?.toLowerCase().includes("bơ") ? "🥑" :
                       currentFetalStats.fruitComparison?.toLowerCase().includes("đu đủ") ? "🍈" :
                       currentFetalStats.fruitComparison?.toLowerCase().includes("chuối") ? "🍌" :
                       currentFetalStats.fruitComparison?.toLowerCase().includes("dưa") ? "🍉" :
                       currentFetalStats.fruitComparison?.toLowerCase().includes("xoài") ? "🥭" :
                       currentFetalStats.fruitComparison?.toLowerCase().includes("thơm") || currentFetalStats.fruitComparison?.toLowerCase().includes("dứa") ? "🍍" :
                       currentFetalStats.fruitComparison?.toLowerCase().includes("sung") || currentFetalStats.fruitComparison?.toLowerCase().includes("fig") ? "🍎" :
                       "🍒"}
                    </span>
                    <div>
                      <p className="text-[9px] font-black text-orange-850 uppercase tracking-wider">Kích thước chuẩn tượng hình</p>
                      <p className="text-xs font-black text-slate-800 leading-snug mt-0.5">
                        Chiều ngang của con tương đương một quả <strong className="text-orange-600">{currentFetalStats.fruitComparison || "Dâu nhỏ"}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* ==================== CHỈ SỐ BÉ PHÁT TRIỂN & ĐỐI CHIẾU SIÊU ÂM ==================== */}
                <div className="bg-white rounded-3xl p-4.5 border border-rose-100 shadow-xs space-y-4">
                  <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-rose-50 pb-2">
                    <TrendingUp className="w-4 h-4 text-rose-500" /> Chỉ số & Đối chiếu siêu âm tuần thai {selectedWeek}
                  </h4>

                  {/* Embedded Sub-tabs for ultrasound input */}
                  <div className="flex bg-slate-50 p-1 border border-slate-150 rounded-full z-10">
                    <button
                      onClick={() => setFetalSubTab("standard")}
                      className={`flex-1 py-1.5 text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer rounded-full ${
                        fetalSubTab === "standard"
                          ? "bg-white text-rose-600 shadow-xs border border-rose-100 font-extrabold"
                          : "text-slate-550 hover:text-rose-600"
                      }`}
                    >
                      📏 Tiêu Chuẩn Tuần Thai
                    </button>
                    <button
                      onClick={() => setFetalSubTab("ultrasound")}
                      className={`flex-1 py-1.5 text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer rounded-full relative ${
                        fetalSubTab === "ultrasound"
                          ? "bg-white text-rose-600 shadow-xs border border-rose-100 font-extrabold"
                          : "text-slate-550 hover:text-rose-600"
                      }`}
                    >
                      🩺 Đối Chiếu Siêu Âm
                      {Object.values(ultrasoundInputs[selectedWeek] || {}).some(Boolean) && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse absolute -right-0.5 -top-0.5"></span>
                      )}
                    </button>
                  </div>

                  {/* Sub Tab: Standard metrics list */}
                  {fetalSubTab === "standard" ? (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {/* Weight */}
                        <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs font-semibold">
                          <span className="text-slate-500 flex items-center gap-2">⚖️ Cân nặng ước lượng (EFW)</span>
                          <span className="text-sm font-black text-rose-650">{currentFetalStats.weight}</span>
                        </div>

                        {/* Length */}
                        <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs font-semibold">
                          <span className="text-slate-500 flex items-center gap-2">📏 Chiều dài đầu mông/đùi</span>
                          <span className="text-sm font-black text-rose-650 flex items-center gap-1">
                            {currentFetalStats.length}
                            <span className="text-[8px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded-sm">
                              ({currentFetalStats.lengthType})
                            </span>
                          </span>
                        </div>

                        {/* HC */}
                        <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs font-semibold">
                          <span className="text-slate-500 flex items-center gap-2">🧠 Chu vi vòng đầu (HC)</span>
                          <span className="text-sm font-black text-rose-650">{currentFetalStats.hc}</span>
                        </div>

                        {/* AC */}
                        <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs font-semibold">
                          <span className="text-slate-500 flex items-center gap-2">🤰 Chu vi vòng bụng (AC)</span>
                          <span className="text-sm font-black text-rose-650">{currentFetalStats.ac}</span>
                        </div>

                        {/* FL */}
                        <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs font-semibold">
                          <span className="text-slate-500 flex items-center gap-2">🦴 Chiều dài xương đùi (FL)</span>
                          <span className="text-sm font-black text-rose-650">{currentFetalStats.fl}</span>
                        </div>

                        {/* Heart rate estimate */}
                        <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs font-semibold">
                          <span className="text-slate-500 flex items-center gap-2">💓 Tim thai trung bình</span>
                          <span className="text-sm font-black text-emerald-600 animate-pulse">{selectedWeek < 6 ? "Chưa đo" : "120 - 160 bpm"}</span>
                        </div>
                      </div>

                      {/* Warning / Notes block */}
                      <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-2xl flex gap-2.5 text-[11px] leading-relaxed text-slate-650">
                        <Info className="w-5 h-5 text-rose-500 shrink-0" />
                        <p>
                          <strong className="text-rose-900 block font-bold mb-0.5">Nhắc nhở y khoa sản khoa:</strong>
                          Các chỉ số siêu âm có thể sai lệch nhẹ khoảng 10% tùy thuộc di truyền và tạng của mẹ bầu. Đừng lo lắng vô cớ, hãy tái khám thường kỳ sản phụ khoa mẹ nhé!
                        </p>
                      </div>

                      {/* Special CTA triggers deep handbook creation */}
                      <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-3xl p-4.5 text-white shadow-md flex items-center justify-between gap-3 select-none">
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs uppercase text-amber-200">Cẩm nang riêng</h4>
                          <p className="text-[11px] text-white opacity-95 flex items-center gap-1">Tạo phân tích cẩm nang cho tuần {selectedWeek}!</p>
                        </div>
                        <button
                          onClick={handleGenerateReport}
                          className="bg-white hover:bg-orange-55 text-orange-600 font-extrabold py-2 px-3 rounded-xl text-[10px] transition-all shadow-xs shrink-0 cursor-pointer active:scale-95 duration-100"
                        >
                          Khởi Tạo Ngay
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Entry Form */}
                      <div className="bg-slate-50/50 rounded-2xl p-3.5 border border-slate-100 space-y-3">
                        <h4 className="text-[10px] font-black text-slate-800 flex items-center gap-1.5 border-b border-slate-150 pb-1.5">
                          <span>📝</span> Nhập số liệu siêu âm thai tuần {selectedWeek}
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          {/* EFW Weight input */}
                          <div className="space-y-1">
                            <label className="block text-[9px] font-black text-slate-500 uppercase">Cân nặng (g):</label>
                            <input
                              type="number"
                              value={ultrasoundInputs[selectedWeek]?.weight || ""}
                              onChange={(e) => {
                                setUltrasoundInputs(prev => ({
                                  ...prev,
                                  [selectedWeek]: {
                                    ...(prev[selectedWeek] || { weight: "", length: "", hc: "", ac: "", fl: "" }),
                                    weight: e.target.value
                                  }
                                }));
                              }}
                              placeholder={parseFetalMetric(currentFetalStats.weight).value ? parseFetalMetric(currentFetalStats.weight).value.toString() : ""}
                              className="w-full px-2.5 py-1.5 border border-slate-200 text-xs rounded-xl focus:border-rose-400 outline-none text-slate-700 font-semibold"
                            />
                            <p className="text-[8px] text-slate-400">{currentFetalStats.weight}</p>
                          </div>

                          {/* Length input */}
                          <div className="space-y-1">
                            <label className="block text-[9px] font-black text-slate-500 uppercase">Chiều dài (cm):</label>
                            <input
                              type="number"
                              step="0.1"
                              value={ultrasoundInputs[selectedWeek]?.length || ""}
                              onChange={(e) => {
                                setUltrasoundInputs(prev => ({
                                  ...prev,
                                  [selectedWeek]: {
                                    ...(prev[selectedWeek] || { weight: "", length: "", hc: "", ac: "", fl: "" }),
                                    length: e.target.value
                                  }
                                }));
                              }}
                              placeholder={parseFetalMetric(currentFetalStats.length).value ? parseFetalMetric(currentFetalStats.length).value.toString() : ""}
                              className="w-full px-2.5 py-1.5 border border-slate-200 text-xs rounded-xl focus:border-rose-400 outline-none text-slate-700 font-semibold"
                            />
                            <p className="text-[8px] text-slate-400">{currentFetalStats.length} ({currentFetalStats.lengthType})</p>
                          </div>

                          {/* HC input */}
                          <div className="space-y-1">
                            <label className="block text-[9px] font-black text-slate-500 uppercase">Vòng đầu - HC (mm):</label>
                            <input
                              type="number"
                              value={ultrasoundInputs[selectedWeek]?.hc || ""}
                              onChange={(e) => {
                                setUltrasoundInputs(prev => ({
                                  ...prev,
                                  [selectedWeek]: {
                                    ...(prev[selectedWeek] || { weight: "", length: "", hc: "", ac: "", fl: "" }),
                                    hc: e.target.value
                                  }
                                }));
                              }}
                              placeholder={parseFetalMetric(currentFetalStats.hc).value ? parseFetalMetric(currentFetalStats.hc).value.toString() : ""}
                              className="w-full px-2.5 py-1.5 border border-slate-200 text-xs rounded-xl focus:border-rose-400 outline-none text-slate-700 font-semibold"
                            />
                            <p className="text-[8px] text-slate-400">{currentFetalStats.hc}</p>
                          </div>

                          {/* AC input */}
                          <div className="space-y-1">
                            <label className="block text-[9px] font-black text-slate-500 uppercase">Vòng bụng - AC (mm):</label>
                            <input
                              type="number"
                              value={ultrasoundInputs[selectedWeek]?.ac || ""}
                              onChange={(e) => {
                                setUltrasoundInputs(prev => ({
                                  ...prev,
                                  [selectedWeek]: {
                                    ...(prev[selectedWeek] || { weight: "", length: "", hc: "", ac: "", fl: "" }),
                                    ac: e.target.value
                                  }
                                }));
                              }}
                              placeholder={parseFetalMetric(currentFetalStats.ac).value ? parseFetalMetric(currentFetalStats.ac).value.toString() : ""}
                              className="w-full px-2.5 py-1.5 border border-slate-200 text-xs rounded-xl focus:border-rose-400 outline-none text-slate-700 font-semibold"
                            />
                            <p className="text-[8px] text-slate-400">{currentFetalStats.ac}</p>
                          </div>
                        </div>
                      </div>

                      {/* Comparisons output logic */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-1 border-b border-rose-100">
                          <span className="text-[10px] font-black text-rose-900 uppercase">📊 Kết quả đối chiếu thông minh</span>
                          <span className="text-[9px] text-slate-400 italic">Tự động tính toán</span>
                        </div>

                        {(() => {
                          const currentInputs = ultrasoundInputs[selectedWeek] || { weight: "", length: "", hc: "", ac: "", fl: "" };
                          const evals = evaluateUltrasound(selectedWeek, currentInputs, {
                            weight: currentFetalStats.weight,
                            length: currentFetalStats.length,
                            hc: currentFetalStats.hc,
                            ac: currentFetalStats.ac,
                            fl: currentFetalStats.fl,
                          });

                          if (evals.length === 0) {
                            return (
                              <div className="py-7 bg-slate-50/50 border border-dashed border-rose-100 rounded-3xl text-center px-4">
                                <span className="text-2xl block">🩺</span>
                                <p className="text-slate-500 text-[11px] font-bold mt-2">Mẹ chưa nhập chỉ số siêu âm của tuần này</p>
                                <p className="text-[9.5px] text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                                  Hệ thống tự động chấm điểm, tính phần trăm lệch chuẩn và đưa ra lời khuyên từ AI tương lai ngay khi mẹ nhập số liệu.
                                </p>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-3">
                              {evals.map((e, index) => {
                                const isLow = e.status === "low";
                                const isHigh = e.status === "high";
                                const deviationSign = e.deviation > 0 ? "+" : "";

                                return (
                                  <div 
                                    key={index} 
                                    className={`p-3.5 rounded-2xl border ${
                                      isLow ? "bg-amber-50/50 border-amber-200" :
                                      isHigh ? "bg-slate-50 border-slate-250" :
                                      "bg-emerald-50/40 border-emerald-200"
                                    }`}
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-black text-slate-800">{e.metricName}</span>
                                          <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-md uppercase ${
                                            isLow ? "bg-amber-100 text-amber-800 border border-amber-300" :
                                            isHigh ? "bg-slate-200 text-slate-800 border border-slate-350" :
                                            "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                          }`}>
                                            {e.statusText}
                                          </span>
                                        </div>
                                        <span className={`font-black text-[10px] ${isLow ? "text-amber-600" : isHigh ? "text-slate-650" : "text-emerald-600"}`}>
                                          Lệch: {deviationSign}{e.deviation}%
                                        </span>
                                      </div>

                                      <div className="text-[10px] text-slate-550 flex gap-2">
                                        <span>Đo được: <strong className="text-slate-800">{e.actualValue} {e.unit}</strong></span>
                                        <span className="opacity-30">|</span>
                                        <span>Chuẩn: <span className="text-slate-800">{e.standardValue}</span></span>
                                      </div>
                                    </div>

                                    {/* Progress Visualizer Dial */}
                                    {e.standardValue > 0 && (
                                      <div className="mt-2.5">
                                        <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                          <span>Nhẹ hơn (-15%)</span>
                                          <span>Chuẩn</span>
                                          <span>Lớn hơn (+15%)</span>
                                        </div>
                                        <div className="relative w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                          <div className="absolute left-[35%] right-[35%] h-full bg-emerald-250/30 font-semibold" />
                                          {(() => {
                                            const clampedDev = Math.min(25, Math.max(-25, e.deviation));
                                            const leftPercent = 50 + (clampedDev * 2.0);
                                            return (
                                              <div
                                                className="absolute top-0 bottom-0 w-2.5 bg-rose-550 border border-white rounded-full shadow-md -translate-x-1"
                                                style={{ left: `${leftPercent}%` }}
                                              />
                                            );
                                          })()}
                                        </div>
                                      </div>
                                    )}

                                    <div className="mt-2.5 text-[10px] text-slate-650 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                                      👩‍⚕️ <strong className="text-rose-600 font-extrabold">Từ BaBiCare AI:</strong> {e.advice}
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Chat consultation trigger with Gemini */}
                              <div className="bg-linear-to-br from-rose-500 to-rose-600 p-4 rounded-3xl text-white shadow-md space-y-2 mt-4 select-none">
                                <h5 className="font-extrabold text-xs sm:text-sm">💬 Tư Vấn Chuyên Sâu Chỉ Số Này?</h5>
                                <p className="text-[10px] text-rose-100 leading-relaxed font-normal">
                                  Trợ Lý BaBiCare AI sẽ phân tích các đặc điểm sinh học tuần {selectedWeek} và gợi ý chế độ tập luyện, bồi dưỡng tối ưu nhất cho mẹ.
                                </p>
                                <button
                                  onClick={() => {
                                    let messageText = `Tôi vừa khám siêu âm em bé ở tuần ${selectedWeek}. Trợ Lý BaBiCare AI tư vấn giúp tôi phân tích:\n`;
                                    evals.forEach(e => {
                                      const deviationSign = e.deviation > 0 ? "+" : "";
                                      messageText += `- ${e.metricName}: ${e.actualValue} (Chuẩn: ${e.standardValue} | Lệch: ${deviationSign}${e.deviation}%)\n`;
                                    });
                                    messageText += `\nLời khuyên về dinh dưỡng dưỡng thai và vận động lúc này của mẹ bầu cần thay đổi như thế nào ạ?`;
                                    
                                    setIsChatOpen(true);
                                    handleSendMessage(messageText);
                                  }}
                                  className="w-full bg-white hover:bg-rose-50 text-rose-600 font-extrabold py-2 px-4 rounded-xl text-[10px] transition-colors shadow-xs shrink-0 cursor-pointer text-center"
                                >
                                  Phân tích cùng Trợ Lý ngay
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* ==================== CHỈ SỐ BẦU - THEO DÕI CÂN NẶNG MẸ BẦU WHO ==================== */}
                <div id="maternal-weight-tracker" className="bg-white rounded-3xl p-4.5 border border-rose-105 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-rose-50 pb-2">
                    <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-rose-500" /> Chỉ số & Cân nặng mẹ bầu WHO
                    </h4>
                    <span className="text-[8.5px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                      Đồng bộ hồ sơ
                    </span>
                  </div>

                  {/* Pre-pregnancy & BMI Profile values */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150 grid grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded-xl text-center border border-slate-100">
                      <span className="block text-[8px] text-slate-400 font-extrabold uppercase">Cân nặng trước</span>
                      <div className="flex items-center justify-center gap-0.5 mt-0.5">
                        <input
                          id="input-weight-before"
                          type="number"
                          value={weightBefore}
                          onChange={(e) => {
                            setWeightBefore(e.target.value);
                            localStorage.setItem("babicare_weight_before", e.target.value);
                          }}
                          className="w-10 text-center font-black text-slate-800 text-xs py-0.5 bg-slate-50 rounded border border-slate-200 outline-none focus:bg-white"
                        />
                        <span className="text-[10px] font-bold text-slate-500">kg</span>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-xl text-center border border-slate-100">
                      <span className="block text-[8px] text-slate-400 font-extrabold uppercase">Chiều cao trước</span>
                      <div className="flex items-center justify-center gap-0.5 mt-0.5">
                        <input
                          id="input-height-before"
                          type="number"
                          value={heightBefore}
                          onChange={(e) => {
                            setHeightBefore(e.target.value);
                            localStorage.setItem("babicare_height_before", e.target.value);
                          }}
                          className="w-10 text-center font-black text-slate-800 text-xs py-0.5 bg-slate-50 rounded border border-slate-200 outline-none focus:bg-white"
                        />
                        <span className="text-[10px] font-bold text-slate-500">cm</span>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-xl flex flex-col justify-center items-center border border-slate-100">
                      <span className="block text-[8px] text-slate-400 font-extrabold uppercase mb-0.5">BMI & Thể trạng</span>
                      {(() => {
                        const wNum = parseFloat(weightBefore) || 52;
                        const hNum = parseFloat(heightBefore) || 160;
                        const bmiValue = wNum / Math.pow(hNum / 100, 2);
                        const isBmiValid = !isNaN(bmiValue) && bmiValue > 0 && bmiValue < 100;
                        
                        let bmiLevel = "Bình thường";
                        let levelColor = "text-emerald-650 bg-emerald-50 border border-emerald-250 font-black";
                        if (!isBmiValid) {
                          bmiLevel = "Chưa rõ";
                          levelColor = "text-slate-500 bg-slate-50 border border-slate-205";
                        } else if (bmiValue < 18.5) {
                          bmiLevel = "Thiếu cân";
                          levelColor = "text-amber-600 bg-amber-50 border border-amber-200 font-bold";
                        } else if (bmiValue >= 25 && bmiValue < 30) {
                          bmiLevel = "Thừa cân";
                          levelColor = "text-orange-650 bg-orange-50 border border-orange-200 font-bold";
                        } else if (bmiValue >= 30) {
                          bmiLevel = "Béo phì";
                          levelColor = "text-rose-650 bg-rose-50 border border-rose-250 font-black animate-pulse";
                        }

                        return (
                          <div className="text-center font-semibold text-[10px] leading-tight">
                            <span className="font-extrabold block text-slate-800">
                              {isBmiValid ? bmiValue.toFixed(1) : "--"} <span className="text-[8px] text-slate-400">BMI</span>
                            </span>
                            <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-md uppercase inline-block mt-1 ${levelColor}`}>
                              {bmiLevel}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Current Active Week Mother Weight entry field */}
                  <div className="bg-rose-50/30 rounded-2xl p-3.5 border border-rose-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-rose-900 uppercase">
                        ⚖️ Cân nặng hiện tại ở tuần thứ {selectedWeek}:
                      </label>
                      <div className="relative flex items-center bg-white border border-rose-200/80 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-rose-400">
                        <input
                          id="input-maternal-current-weight"
                          type="number"
                          step="0.1"
                          value={maternalWeeklyWeights[selectedWeek] || ""}
                          placeholder={`${weightBefore}`}
                          onChange={(e) => {
                            setMaternalWeeklyWeights(prev => ({
                              ...prev,
                              [selectedWeek]: e.target.value
                            }));
                          }}
                          className="w-18 px-2 py-1 text-center font-black text-rose-700 outline-none text-xs"
                        />
                        <span className="text-[9px] font-extrabold text-slate-400 pr-2">kg</span>
                      </div>
                    </div>
                    
                    {/* Active evaluation under WHO guidelines */}
                    {(() => {
                      const wNum = parseFloat(weightBefore) || 52;
                      const hNum = parseFloat(heightBefore) || 160;
                      const bmiVal = wNum / Math.pow(hNum / 100, 2);
                      const isBmiValid = !isNaN(bmiVal) && bmiVal > 0 && bmiVal < 100;

                      // Trimester calculation
                      let minRate = 0.35;
                      let maxRate = 0.50;
                      if (isBmiValid) {
                        if (bmiVal < 18.5) {
                          minRate = 0.44;
                          maxRate = 0.58;
                        } else if (bmiVal >= 18.5 && bmiVal < 25) {
                          minRate = 0.35;
                          maxRate = 0.50;
                        } else if (bmiVal >= 25 && bmiVal < 30) {
                          minRate = 0.23;
                          maxRate = 0.33;
                        } else {
                          minRate = 0.17;
                          maxRate = 0.27;
                        }
                      }

                      let idealMin = 0;
                      let idealMax = 0;
                      if (selectedWeek <= 13) {
                        idealMin = (0.5 / 13) * selectedWeek;
                        idealMax = (2.0 / 13) * selectedWeek;
                      } else {
                        const remaining = selectedWeek - 13;
                        idealMin = 0.5 + minRate * remaining;
                        idealMax = 2.0 + maxRate * remaining;
                      }

                      const minGain = parseFloat(idealMin.toFixed(1));
                      const maxGain = parseFloat(idealMax.toFixed(1));

                      const curWeightRaw = maternalWeeklyWeights[selectedWeek];
                      if (!curWeightRaw) {
                        return (
                          <div className="bg-white/80 p-3 rounded-xl border border-dashed border-rose-105 text-center text-[10px] text-slate-500 font-medium">
                            Hãy điền cân nặng hiện tại để đối chiếu chuẩn WHO.
                            <span className="block text-[8.5px] text-slate-400 mt-1.5 leading-relaxed">
                              Mức tăng trưởng lý tưởng WHO cho tuần {selectedWeek} từ lúc có bầu là: <strong className="text-emerald-600 font-extrabold">+{minGain} kg</strong> đến <strong className="text-emerald-650 font-extrabold">+{maxGain} kg</strong>.
                            </span>
                          </div>
                        );
                      }

                      const curWeight = parseFloat(curWeightRaw);
                      if (isNaN(curWeight)) return null;

                      const actualWeightGain = curWeight - wNum;
                      
                      let isLow = actualWeightGain < minGain;
                      let isHigh = actualWeightGain > maxGain;
                      let statusText = "Chuẩn WHO";
                      let statusColor = "text-emerald-700 bg-emerald-50 border border-emerald-250 font-bold";
                      let adviceText = `Mẹ đang duy trì cân nặng tuyệt vời! Mức tăng +${actualWeightGain.toFixed(1)} kg nằm trong chuẩn lý tưởng (${minGain} đến ${maxGain} kg) của WHO cho tuần ${selectedWeek}. Hãy tiếp tục chế độ ăn khoa học, giàu vitamin, đạm và duy trì tinh thần vui tươi mẹ bầu ơi!`;
                      let offsetText = "Đạt chuẩn tuyệt đối 🎉";

                      if (isLow) {
                        const diff = minGain - actualWeightGain;
                        const isSevere = diff > 3.0 || (isBmiValid && bmiVal < 17.0);

                        if (isSevere) {
                          statusText = "Cảnh báo: Thiếu cân trầm trọng";
                          statusColor = "text-rose-700 bg-rose-50 border border-rose-300 animate-pulse font-extrabold";
                          offsetText = `Thiếu hụt ${diff.toFixed(1)} kg`;
                          adviceText = `Cảnh báo sức khỏe: Số cân tăng của mẹ đang thiếu hụt tới ${diff.toFixed(1)} kg so với chuẩn tối thiểu của WHO (hoặc BMI khởi điểm ở mốc báo động). Việc thiếu cân nghiêm trọng này cần bổ sung dinh dưỡng tích cực để không ảnh hưởng xấu đến thai nhi. Mẹ cần ăn thêm bữa phụ nhiều dưỡng chất: uống thêm sữa bầu, sữa hạt dinh dưỡng hàng ngày; ăn thêm quả bơ, trứng, thịt đỏ, các loại hạt dinh dưỡng lành mạnh (hạnh nhân, óc chó) và bổ sung vi chất đầy đủ theo chỉ định của bác sĩ sản khoa nhé!`;
                        } else {
                          // Mild deficit: reassure the mother to prevent stress/anxiety
                          statusText = "Cân đối - Trong tầm kiểm soát";
                          statusColor = "text-emerald-700 bg-emerald-55 border border-emerald-250 font-medium";
                          offsetText = `Dao động nhẹ: -${diff.toFixed(1)} kg`;
                          adviceText = `Mẹ ơi hãy hoàn toàn yên tâm và giữ tâm lý thật thoải mái nhé! Số cân của mẹ hiện tại chỉ dao động thấp hơn một chút khoảng ${diff.toFixed(1)} kg so với mốc lý thuyết của WHO nhưng vẫn hoàn toàn nằm trong tầm kiểm soát cân nặng an toàn và ăn uống hợp lý. Mẹ hãy cứ tiếp tục ăn uống điều độ, vui vẻ và không tự tạo áp lực tâm lý cho bản thân nha!`;
                        }
                      } else if (isHigh) {
                        const diff = actualWeightGain - maxGain;
                        const isWarn = diff >= 1.0;

                        if (isWarn) {
                          statusText = "Cảnh báo: Dư cân hiểm họa";
                          statusColor = "text-rose-800 bg-rose-50 border border-rose-350 font-black animate-pulse";
                          offsetText = `Dư thừa ${diff.toFixed(1)} kg`;
                          adviceText = `Cảnh báo kiểm soát cân nặng và dinh dưỡng: Cân nặng hiện tại của mẹ đang vượt quá mốc tối đa của WHO tới ${diff.toFixed(1)} kg. Mẹ cần đặc biệt kiểm soát cân nặng, kiểm soát chặt chẽ dinh dưỡng và chỉ số đường huyết ngay lập tức để giảm thiểu nguy cơ tiểu đường thai kỳ, béo phì, thai quá to dẫn đến khó sinh hoặc phải can thiệp mổ lấy thai:
1. Kiêng ăn ngọt và đường hóa học tuyệt đối (trà sữa, đồ ngọt đóng hộp, các loại quả ngọt đậm như nhãn, vải, mít, sầu riêng).
2. Giảm tối đa phần tinh bột hấp thu nhanh (cơm trắng, bánh mì trắng, xôi nếp), thay thế bằng yến mạch, khoai lang luộc hoặc gạo lứt.
3. Tăng cường rau xanh, trái cây ít đường và chia khẩu phần thành các bữa nhỏ trong ngày để ổn định đường huyết dạ dày.
4. Đăng ký xét nghiệm dung nạp đường huyết thai kỳ theo đúng lịch nhắc của bác sĩ khám sản nhé!`;
                        } else {
                          statusText = "Dư cân nhẹ";
                          statusColor = "text-amber-700 bg-amber-50 border border-amber-250 font-semibold";
                          offsetText = `Vượt nhẹ: +${diff.toFixed(1)} kg`;
                          adviceText = `Số cân hiện tại chỉ vượt mốc chuẩn tối đa của WHO khoảng ${diff.toFixed(1)} kg (dưới 1kg), một mức dao động rất nhỏ chưa cần lo lắng. Mẹ chỉ cần điều chỉnh nhẹ thực đơn: uống sữa không đường thay vì có đường, giảm bớt snack đồ ăn vặt nhiều dầu mỡ và kết hợp yoga đi bộ nhẹ nhàng 15-20 phút mỗi ngày nha mẹ!`;
                        }
                      }

                      return (
                        <div className="space-y-3 pt-1">
                          {/* Comparison Header */}
                          <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="text-slate-600">Đánh giá chuẩn:</span>
                              <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-md uppercase ${statusColor}`}>
                                {statusText}
                              </span>
                            </div>
                            <span className={`font-black uppercase text-[10px] ${isLow ? "text-amber-600" : isHigh ? "text-rose-600" : "text-emerald-600"}`}>
                              {offsetText}
                            </span>
                          </div>

                          {/* Graphical Visualizer Gauge */}
                          <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1.5">
                            <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>Thiếu cân (Dưới +{minGain} kg)</span>
                              <span className="text-emerald-600 font-extrabold">Khoảng Chuẩn (+{minGain} đến +{maxGain} kg)</span>
                              <span>Dư cân (Trên +{maxGain} kg)</span>
                            </div>
                            <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                              {/* Standard zone highlighted */}
                              {(() => {
                                const totalSpan = 18.0;
                                const leftPercent = Math.max(5, (minGain / totalSpan) * 100);
                                const rightPercent = Math.min(95, (maxGain / totalSpan) * 100);
                                const wPercent = Math.max(10, rightPercent - leftPercent);
                                return (
                                  <div 
                                    className="absolute h-full bg-emerald-500/20"
                                    style={{ left: `${leftPercent}%`, width: `${wPercent}%` }}
                                  />
                                );
                              })()}

                              {/* Pointer pin represent actual weight gain */}
                              {(() => {
                                const totalSpan = 18.0;
                                const clampedGain = Math.min(totalSpan, Math.max(0, actualWeightGain));
                                const leftPercent = (clampedGain / totalSpan) * 100;
                                return (
                                  <div
                                    className="absolute top-0 bottom-0 w-2.5 bg-rose-500 border border-white rounded-full shadow-md -translate-x-1"
                                    style={{ left: `${leftPercent}%` }}
                                  />
                                );
                              })()}
                            </div>
                            <div className="flex justify-between text-[8.5px] font-bold text-slate-450">
                              <span>Bắt đầu (0 kg)</span>
                              <span>Mẹ tăng: <strong className="text-rose-600">+{actualWeightGain.toFixed(1)} kg</strong></span>
                              <span>Mốc +18 kg</span>
                            </div>
                          </div>

                          {/* Dynamic physician advice dialog */}
                          <div className="text-[10px] text-slate-650 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                            👩‍⚕️ <strong className="text-rose-600 font-extrabold">Gợi ý từ trợ lý BaBiCare:</strong> {adviceText}
                          </div>

                          {/* Chat consultation trigger with Gemini */}
                          <div className="bg-linear-to-br from-amber-500 to-orange-550 p-3.5 rounded-2xl text-white shadow-xs space-y-1.5 select-none">
                            <h5 className="font-extrabold text-[10.5px]">💬 Tư vấn thực đơn riêng cho tuần {selectedWeek}?</h5>
                            <p className="text-[9.5px] text-orange-50 leading-relaxed font-normal">
                              Trợ lý AI sẽ lên một thực đơn sinh học, giàu vi chất dưỡng thai cá nhân hoá cho mẹ dựa trên thông số BMI trước sinh.
                            </p>
                            <button
                              id="btn-ai-weight-consult"
                              onClick={() => {
                                const bmiValStr = isBmiValid ? bmiVal.toFixed(1) : "chưa rõ";
                                let msg = `Tôi đang mang thai tuần thứ ${selectedWeek}. `;
                                msg += `Trước khi bầu, tôi cao ${heightBefore} cm và nặng ${weightBefore} kg (BMI đạt ${bmiValStr}). `;
                                msg += `Hiện tại cân nặng đo được ở tuần ${selectedWeek} là ${curWeight} kg (tăng +${actualWeightGain.toFixed(1)} kg so với trước bầu). `;
                                msg += `WHO khuyến cáo mức tăng chuẩn là giữa +${minGain} kg và +${maxGain} kg. `;
                                msg += `Hệ thống đánh giá tôi đang bị: **${statusText}** (${offsetText}). `;
                                msg += `\nTrợ lý Bác sĩ BaBiCare AI hãy phân tích tình trạng dồi dào/thiếu chất này, đồng thời tư vấn giúp tôi thực đơn chi tiết cho cả tuần để cân bằng và bảo vệ sức khoẻ tốt nhất !`;
                                
                                setIsChatOpen(true);
                                handleSendMessage(msg);
                              }}
                              className="w-full bg-white hover:bg-orange-50 text-orange-600 font-extrabold py-1.5 px-3 rounded-xl text-[9px] transition-all hover:shadow-xs active:scale-95 cursor-pointer text-center"
                            >
                              Nhận Tư Vấn Thực Đơn Cùng AI ngay
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Maternal Organ completion gauges */}
                <div className="bg-white rounded-3xl p-4.5 border border-slate-150 shadow-xs space-y-3">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-rose-50 pb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-rose-500" /> Tiến độ hoàn thiện cơ quan bé
                  </h4>

                  <div className="space-y-3">
                    {/* Brain development */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">🧠 Hoàn thiện Não & Thần Kinh</span>
                        <span className="text-rose-600">{Math.min(100, Math.round(selectedWeek * 2.3 + 5))}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, Math.round(selectedWeek * 2.3 + 5))}%` }}></div>
                      </div>
                    </div>

                    {/* Cardiovascular development */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">💓 Tim mạch & Tuần hoàn</span>
                        <span className="text-amber-600">{selectedWeek >= 6 ? Math.min(100, Math.round(45 + selectedWeek * 1.5)) : 10}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedWeek >= 6 ? Math.min(100, Math.round(45 + selectedWeek * 1.5)) : 10}%` }}></div>
                      </div>
                    </div>

                    {/* Senses development */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">🤰 Giác quan & Biểu bì da</span>
                        <span className="text-emerald-600">
                          {selectedWeek <= 13 ? 20 : selectedWeek <= 27 ? Math.round(30 + (selectedWeek - 13) * 5) : 100}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedWeek <= 13 ? 20 : selectedWeek <= 27 ? Math.round(30 + (selectedWeek - 13) * 5) : 100}%` }}></div>
                      </div>
                    </div>

                    {/* Lungs development */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">🫁 Hệ hô hấp & Túi phế nang</span>
                        <span className="text-blue-600">
                          {selectedWeek <= 16 ? 10 : selectedWeek <= 35 ? Math.round(20 + (selectedWeek - 16) * 4.2) : 100}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedWeek <= 16 ? 10 : selectedWeek <= 35 ? Math.round(20 + (selectedWeek - 16) * 4.2) : 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed italic border-t border-slate-100 pt-2 block text-left">
                    {selectedWeek <= 13 ? "📌 Tam cá nguyệt 1: Tế bào mầm sơ khởi đang biệt hóa ống tủy sống." :
                     selectedWeek <= 27 ? "📌 Tam cá nguyệt 2: Thính giác đã hoạt động mượt mà, cảm nhận nhịp mẹ." :
                     "📌 Tam cá nguyệt 3: Đang bứt tốc làm dày mỡ biểu bì và tập hô hấp phổi độc lập."}
                  </p>
                </div>

              </div>
            )}

            {/* ==================== TAB 3: CẨM NANG SỨC KHỎE (4 SUB-TABS) ==================== */}
            {activeTab === "handbook" && (
              <div className="space-y-4 animate-fade-in">
                
                {/* 4 horizontal icon subtabs configured for touch scrolling */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar sticky top-0 bg-slate-50 z-10 py-1">
                  <button
                    onClick={() => setHandbookSubTab("hospitalBag")}
                    className={`py-2 px-3 text-[10px] font-black rounded-full flex items-center gap-1 shrink-0 cursor-pointer transition-all active:scale-95 border ${
                      handbookSubTab === "hospitalBag"
                        ? "bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-250"
                        : "bg-white border-slate-205 text-slate-550"
                    }`}
                  >
                    🎒 Giỏ Đi Sinh
                  </button>
                  <button
                    onClick={() => setHandbookSubTab("vitamin")}
                    className={`py-2 px-3 text-[10px] font-black rounded-full flex items-center gap-1 shrink-0 cursor-pointer transition-all active:scale-95 border ${
                      handbookSubTab === "vitamin"
                        ? "bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-250"
                        : "bg-white border-slate-205 text-slate-550"
                    }`}
                  >
                    💊 Vitamin
                  </button>
                  <button
                    onClick={() => setHandbookSubTab("nutrition")}
                    className={`py-2 px-3 text-[10px] font-black rounded-full flex items-center gap-1 shrink-0 cursor-pointer transition-all active:scale-95 border ${
                      handbookSubTab === "nutrition"
                        ? "bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-250"
                        : "bg-white border-slate-205 text-slate-550"
                    }`}
                  >
                    🥑 Dinh Dưỡng
                  </button>
                  <button
                    onClick={() => setHandbookSubTab("milestone")}
                    className={`py-2 px-3 text-[10px] font-black rounded-full flex items-center gap-1 shrink-0 cursor-pointer transition-all active:scale-95 border ${
                      handbookSubTab === "milestone"
                        ? "bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-250"
                        : "bg-white border-slate-205 text-slate-550"
                    }`}
                  >
                    📅 Lịch Khám Thai
                  </button>
                  <button
                    onClick={() => setHandbookSubTab("massage")}
                    className={`py-2 px-3 text-[10px] font-black rounded-full flex items-center gap-1 shrink-0 cursor-pointer transition-all active:scale-95 border ${
                      handbookSubTab === "massage"
                        ? "bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-250"
                        : "bg-white border-slate-205 text-slate-550"
                    }`}
                  >
                    💆 Massage Bầu
                  </button>
                  <button
                    onClick={() => setHandbookSubTab("thaigiao")}
                    className={`py-2 px-3 text-[10px] font-black rounded-full flex items-center gap-1 shrink-0 cursor-pointer transition-all active:scale-95 border ${
                      handbookSubTab === "thaigiao"
                        ? "bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-250"
                        : "bg-white border-slate-205 text-slate-550"
                    }`}
                  >
                    🎧 Thai Giáo
                  </button>
                </div>

                {handbookSubTab === "vitamin" && (
                  <div className="space-y-4">
                      {/* Phác đồ bổ sung Vitamin theo Giai đoạn */}
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-4 border border-rose-100 shadow-2xs space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-rose-200/50 text-rose-800 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            💡 PHÁC ĐỒ THEO GIAI ĐOẠN KHUYÊN DÙNG
                          </span>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 tracking-tight">
                            Hướng Dẫn Bổ Sung Vitamin Từng Giai Đoạn Thai Kỳ
                          </h4>
                          <p className="text-[10px] text-slate-500 font-bold">
                            Hãy lướt ngang và chạm vào từng giai đoạn để xem phác đồ phối hợp các viên uống bổ trợ tối ưu dưới đây.
                          </p>
                        </div>

                        {/* Horizontal Timeline/Stepper */}
                        <div className="flex gap-2 overflow-x-auto pb-2.5 pt-1.5 no-scrollbar flex-nowrap w-full">
                          {[
                            { index: 0, title: "Tam Kỳ I", sub: "0 - 3 tháng", icon: "🌸", color: "text-pink-600 bg-pink-50" },
                            { index: 1, title: "Tam Kỳ II", sub: "4 - 7 tháng", icon: "⚡️", color: "text-emerald-600 bg-emerald-50" },
                            { index: 2, title: "Tam Kỳ III (Đầu)", sub: "28w - 34w", icon: "🍯", color: "text-amber-600 bg-amber-50" },
                            { index: 3, title: "Tam Kỳ III (Sát sinh)", sub: "34w - Đi sinh", icon: "🚀", color: "text-red-650 bg-red-50" }
                          ].map((phaseObj) => {
                            const isActive = selectedVitaminPhase === phaseObj.index;
                            return (
                              <button
                                key={phaseObj.index}
                                onClick={() => setSelectedVitaminPhase(phaseObj.index)}
                                className={`cursor-pointer min-w-[135px] flex-1 py-2.5 px-3.5 rounded-2xl flex flex-col items-start gap-0.5 border text-left transition-all relative ${
                                  isActive
                                    ? "bg-white border-rose-450 shadow-xs"
                                    : "bg-white/45 border-slate-205/60 hover:border-slate-300 text-slate-500"
                                }`}
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="activeVitaminIndicator"
                                    className="absolute inset-0 rounded-2xl border-2 border-rose-500 pointer-events-none"
                                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                  />
                                )}
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs">{phaseObj.icon}</span>
                                  <span className={`text-[10px] font-black tracking-tight ${isActive ? "text-rose-600" : "text-slate-750"}`}>
                                    {phaseObj.title}
                                  </span>
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">{phaseObj.sub}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Phase Detailed Box with Animated transition */}
                        <div className="pt-1">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={selectedVitaminPhase}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.18 }}
                            >
                              {selectedVitaminPhase === 0 && (
                                <div className="bg-white rounded-2xl p-3.5 border border-pink-100 shadow-3xs space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-pink-50 pb-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm">🌸</span>
                                      <h5 className="text-[11px] sm:text-xs font-black text-pink-800 uppercase tracking-tight">
                                        Tam Cá Nguyệt I (Hành trình 0 - 3 tháng)
                                      </h5>
                                    </div>
                                    <span className="text-[9px] font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                                      HÌNH THÀNH NÃO BỘ VÀ THẦN KINH
                                    </span>
                                  </div>

                                  <div className="space-y-3.5 text-[10.5px] leading-relaxed">
                                    <div className="flex items-start gap-2.5">
                                      <span className="text-rose-500 bg-rose-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-rose-100">1</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Uống <span className="text-rose-600 text-xs font-black">Pregnacare Plus Omega 3</span>
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          Uống DHA trong giai đoạn này là cực kỳ quan trọng giúp thúc đẩy quá trình <strong>hình thành tế bào não bộ, cấu trúc võng mạc nhãn cầu và hệ thần sinh học sơ khởi</strong> cho con yêu.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 pt-2 border-t border-slate-50">
                                      <span className="text-indigo-505 bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-indigo-100">2</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          <span className="text-indigo-605 font-black">Ostelin Calcium</span> (Liều dùng: <strong>01 viên</strong>/ngày nếu cần)
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          Uống nếu mẹ nghén nhiều, ăn uống bị hạn chế hoặc nghèo dinh dưỡng. Nếu sức khỏe tốt ăn uống hoàn toàn đầy đủ thì canxi chưa thực sự cấp bách bồi đắp dồn dập vào lúc này.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 pt-2 border-t border-slate-50">
                                      <span className="text-teal-505 bg-teal-55/70 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-teal-100">3</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Đồng hành cùng <span className="text-teal-605 font-black">Men vi sinh tiêu hóa</span>
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          Hệ vi sinh khỏe mạnh giảm bớt sự khó chịu do thay đổi hormone sinh lý, đẩy lùi chướng bụng và ấm ruột mẹ bầu.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {selectedVitaminPhase === 1 && (
                                <div className="bg-white rounded-2xl p-3.5 border border-emerald-100 shadow-3xs space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-emerald-50 pb-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm">⚡️</span>
                                      <h5 className="text-[11px] sm:text-xs font-black text-emerald-800 uppercase tracking-tight">
                                        Tam Cá Nguyệt II (Khúc quanh 4 - 7 tháng)
                                      </h5>
                                    </div>
                                    <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                      BỒI DƯỠNG KHUNG XƯƠNG CỨNG CÁP
                                    </span>
                                  </div>

                                  <div className="space-y-3.5 text-[10.5px] leading-relaxed">
                                    <div className="flex items-start gap-2.5">
                                      <span className="text-emerald-500 bg-emerald-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-emerald-105">1</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Uống <span className="text-emerald-650 text-xs font-black">Pregnacare MAX</span> hằng ngày
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          Cung cấp bộ lọc vi chất dồi dào tối đa giúp nâng cao sức đề kháng chung và bổ sung dưỡng chất bồi bổ xương sụn cho em bé phát triển dài chân.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 pt-2 border-t border-slate-50">
                                      <span className="text-amber-500 bg-amber-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-amber-100">2</span>
                                      <div className="space-y-2">
                                        <p className="font-extrabold text-slate-800">
                                          Cách bổ sung <span className="text-amber-655 font-bold">Ostelin Calcium</span> đặc biệt:
                                        </p>
                                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10px] text-slate-650 space-y-1.5">
                                          <div className="flex items-start gap-1">
                                            <span className="text-emerald-500 shrink-0 mt-0.5">🥦</span>
                                            <span>
                                              Nếu thực đơn ăn uống nhiều canxi (hải sản phong phú như tôm cua, rau xanh đậm, các loại hạt khô giàu béo): <strong>KHÔNG CẦN uống bổ sung thêm Ostelin Calcium</strong> ngoài nữa nhé mẹ.
                                            </span>
                                          </div>
                                          <div className="flex items-start gap-1 pt-1.5 border-t border-slate-200/50">
                                            <span className="text-amber-550 shrink-0 mt-0.5">💊</span>
                                            <span>
                                              Nếu thực đơn nghèo dinh dưỡng, mẹ ít ăn được hải sản/hạt khô: Bổ sung <strong>01 viên Ostelin Calcium</strong> vào mỗi buổi sáng.
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 pt-2 border-t border-slate-50">
                                      <span className="text-teal-505 bg-teal-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-teal-100">3</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Uống <span className="text-teal-605 font-bold">Men vi sinh</span> hằng ngày
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          Hạn chế tình trạng táo bón do tử cung bắt đầu phình to chèn đẩy áp lực vào thành đại tràng.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {selectedVitaminPhase === 2 && (
                                <div className="bg-white rounded-2xl p-3.5 border border-amber-100 shadow-3xs space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-amber-50 pb-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm">🍯</span>
                                      <h5 className="text-[11px] sm:text-xs font-black text-amber-800 uppercase tracking-tight">
                                        Tam Cá Nguyệt III - Khởi Động (Tuần 28 - 34)
                                      </h5>
                                    </div>
                                    <span className="text-[9px] font-extrabold text-amber-650 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                      PHÁT TRIỂN NẶNG CÂN VƯỢT TRỘI
                                    </span>
                                  </div>

                                  <div className="space-y-3.5 text-[10.5px] leading-relaxed">
                                    <div className="flex items-start gap-2.5">
                                      <span className="text-amber-500 bg-amber-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-amber-105">1</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Uống <span className="text-rose-600 font-extrabold">Pregnacare MAX</span> hàng ngày
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          Giai đoạn vàng tối ưu hóa chế độ ăn uống lành mạnh của mẹ giúp bé yêu hấp thu đầy đủ chất để bồi đắp bắp cơ và mỡ dưới da tròn trịa.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 pt-2 border-t border-slate-50">
                                      <span className="text-rose-500 bg-rose-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-rose-100">2</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Uống thêm <span className="text-amber-600 font-extrabold">01 viên Ostelin Calcium</span> hằng ngày
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          Đáp ứng tốc độ hóa cốt xương khớp thần tốc của bé. Giúp mẹ bầu giảm ê đau lưng, nhức khớp háng dữ dội hoặc bị chuột rút về đêm.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 pt-2 border-t border-slate-50">
                                      <span className="text-teal-505 bg-teal-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-teal-100">3</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Uống <span className="text-teal-605 font-bold">Men vi sinh tiêu hóa</span> đều đặn
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          Đảm bảo hệ vi sinh tối ưu để hấp thu tốt nhất các dưỡng chất quý giá từ thức ăn đưa vào.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {selectedVitaminPhase === 3 && (
                                <div className="bg-white rounded-2xl p-3.5 border border-red-100 shadow-3xs space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-red-55 pb-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm">🚀</span>
                                      <h5 className="text-[11px] sm:text-xs font-black text-red-800 uppercase tracking-tight">
                                        Bứt Tốc: Tuần 34 - Sát Ngày Đi Sanh
                                      </h5>
                                    </div>
                                    <span className="text-[9px] font-extrabold text-red-650 bg-red-50 px-2 py-0.5 rounded-md border border-red-105 animate-pulse">
                                      PHÒNG THIẾU MÁU & XƯƠNG HOÀN THIỆN
                                    </span>
                                  </div>

                                  <div className="space-y-3.5 text-[10.5px] leading-relaxed">
                                    <div className="flex items-start gap-2.5">
                                      <span className="text-red-500 bg-red-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-red-105">1</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Uống <span className="text-rose-650 font-black">Pregnacare MAX</span> + Ăn uống đầy đủ dưỡng chất
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          Nồi nước cốt dinh dưỡng không thể thiếu phục vụ sức khỏe dẻo dai đón chào kỳ chuyển dạ tốn nhiều calo.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 pt-2 border-t border-slate-50">
                                      <span className="text-amber-500 bg-amber-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-amber-100">2</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Bổ sung lượng canxi gấp đôi: <span className="text-amber-655 font-black">02 viên Ostelin Calcium</span> mỗi ngày
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          Đáp ứng khung răng mầm vững vàng cho em bé sơ sinh đồng thời chống loãng xương muộn hoặc rụng hỏng chân răng sau sinh ở mẹ bầu.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 pt-2 border-t border-slate-50">
                                      <span className="text-red-650 bg-red-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-red-100 shrink-0">3</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Uống bổ sung <span className="text-red-600 font-black">01 viên sắt BLACKMORE IRON</span> hằng ngày
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          <strong>Phòng ngừa tối quan trọng:</strong> Giúp dự trữ dung tích huyết sắc hồng cầu toàn vẹn trước ngày lâm bồn sinh đẻ, đẩy lùi nguy cơ choáng váng do mất máu, suy nhược mệt mỏi sau mổ đẻ phức tạp hay băng huyết.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 pt-2 border-t border-slate-50">
                                      <span className="text-teal-505 bg-teal-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-teal-100 border-dashed">4</span>
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-800">
                                          Duy trì đều đặn <span className="text-teal-605 font-bold">Men vi sinh</span> giúp hệ thống tiêu hóa thông suốt trước giờ vượt cạn ấm áp bụng mẹ.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Từng loại dưỡng chất riêng lẻ */}
                      <div className="border-t border-slate-100 pt-3.5 pb-0.5 flex items-center justify-between">
                        <span className="font-black text-[10px] uppercase tracking-wider text-slate-400 pl-1">
                          🔬 Bách khoa toàn thư vi chất y khoa riêng lẻ
                        </span>
                      </div>

                      <div className="space-y-3">
                        {customVitaminData.map((vit, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-4 border border-rose-50 shadow-xs space-y-2">
                          <div className="flex items-center justify-between border-b border-rose-50 pb-1.5">
                            <span className="text-xs font-black text-rose-700 flex items-center gap-1">✨ {vit.name}</span>
                            <span className="text-[9px] font-black tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-100">
                              {vit.dosage}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-slate-650 leading-relaxed font-normal">
                            {vit.role}
                          </p>

                          <div className="text-[10px] space-y-1.5 bg-rose-50/20 p-2.5 rounded-2xl border border-rose-100/30 text-slate-700">
                            <div>
                              <strong>🕒 Cách dùng hấp thụ tốt:</strong> <span className="text-slate-600">{vit.timing}</span>
                            </div>
                            <div>
                              <strong>🥚 Nguồn tự nhiên dồi dào:</strong> <span className="text-slate-500">{vit.sources.slice(0, 3).join(", ")}...</span>
                            </div>
                            <div className="pt-1.5 border-t border-rose-100/30 text-rose-800">
                              <strong>⚠️ Tránh sai sót sản khoa:</strong> <span className="italic">{vit.notice}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: Nutrition diet schedule */}
                  {handbookSubTab === "nutrition" && (
                    <div className="space-y-3">
                      {(() => {
                        const stageIdx = selectedWeek <= 13 ? 0 : selectedWeek <= 27 ? 1 : 2;
                        const currStage = customNutritionStages[stageIdx] || nutritionStages[stageIdx];
                        return (
                          <div className="space-y-3">
                            {/* Main Stage header card */}
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-4 shadow-sm select-none">
                              <span className="text-[9px] uppercase font-black bg-black/20 px-2 py-0.5 rounded-full tracking-wide">
                                {currStage.stage}
                              </span>
                              <h4 className="font-extrabold text-xs sm:text-sm mt-1">Dinh Dưỡng Khoa Học Cho Mẹ</h4>
                              <p className="text-[10px] text-amber-50 opacity-95 leading-relaxed mt-1 font-normal">
                                {currStage.dietaryTip}
                              </p>
                            </div>

                            {/* Recommended foods list */}
                            <div className="bg-white rounded-3xl p-4 border border-rose-50 shadow-xs space-y-3">
                              <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-widest border-b border-rose-50 pb-1.5 flex items-center gap-1.5">
                                🥦 Thực phẩm khuyên dùng hàng ngày
                              </h5>
                              <div className="flex flex-wrap gap-1.5">
                                {currStage.recommendedFoods.map((food, idx) => (
                                  <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200/50 text-[10px] font-bold px-2.5 py-1 rounded-xl">
                                    ✓ {food}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Dishes recipes */}
                            <div className="bg-white rounded-3xl p-4 border border-slate-150 shadow-xs space-y-2.5">
                              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-rose-50 pb-1.5 flex items-center gap-1.5">
                                🥘 Món Ngon Dưỡng Thai Gợi Ý
                              </h5>
                              <div className="space-y-2">
                                {currStage.dishes.map((dish, idx) => (
                                  <div key={idx} className="p-3 bg-amber-50/40 border border-amber-200/40 rounded-2xl text-[11px] leading-relaxed text-slate-700">
                                    ⭐ <strong className="text-amber-900">{dish.split(" (")[0]}</strong>
                                    {dish.includes(" (") && (
                                      <p className="text-[10px] text-slate-500 mt-0.5">{dish.substring(dish.indexOf(" (") + 2, dish.length - 1)}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Avoid dietary items */}
                            <div className="bg-white rounded-3xl p-4 border border-red-100 shadow-xs space-y-2.5">
                              <h5 className="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-1.5 flex items-center gap-1.5">
                                🚫 Thực phẩm kiên kỵ tối đa
                              </h5>
                              <div className="space-y-2">
                                {currStage.dislikes.map((food, idx) => (
                                  <div key={idx} className="p-2.5 bg-red-50/40 border border-red-150 rounded-2xl text-[10px] leading-relaxed text-red-950 font-normal">
                                    ⚠️ <strong>{food.split(" (")[0]}:</strong>{" "}
                                    <span className="text-red-800">{food.includes(" (") ? food.substring(food.indexOf(" (") + 2, food.length - 1) : "Không khuyên dùng hoặc tiềm ẩn vi khuẩn."}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* SUBTAB 3: Prenatal checks & clinical appointments */}
                  {handbookSubTab === "milestone" && (
                    <div className="space-y-3">
                      {customClinicalMilestones.map((ms, idx) => {
                        const isHighlighted = ms.timeframe.includes(selectedWeek.toString()) || 
                          (selectedWeek >= 20 && selectedWeek <= 24 && ms.timeframe.includes("20 - 24")) ||
                          (selectedWeek >= 11 && selectedWeek <= 13 && ms.timeframe.includes("11 - 13")) ||
                          (selectedWeek >= 24 && selectedWeek <= 28 && ms.timeframe.includes("24 - 28")) ||
                          (selectedWeek >= 32 && selectedWeek <= 35 && ms.timeframe.includes("32 - 35"));

                        return (
                          <div 
                            key={idx} 
                            className={`rounded-3xl p-4 border transition-all ${
                              isHighlighted 
                                ? "bg-rose-500/10 border-rose-300 ring-1 ring-rose-200" 
                                : "bg-white border-slate-150"
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-dashed border-slate-100 pb-2 mb-2">
                              <div>
                                <span className="text-xs font-black text-slate-900 block leading-tight">📍 {ms.timeframe}</span>
                                <span className="text-[9px] text-slate-400 mt-0.5 block">Nội dung chăm sóc sức khỏe mẫu mực</span>
                              </div>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                                ms.importance === "CRITICAL" ? "bg-red-500 text-white" :
                                ms.importance === "HIGH" ? "bg-amber-500 text-white" :
                                "bg-blue-500 text-white"
                              } ${isHighlighted ? "animate-pulse" : ""}`}>
                                {ms.importance}
                              </span>
                            </div>

                            <h5 className="text-[11px] font-black text-slate-800 mb-1 leading-snug">
                              {ms.name}
                            </h5>

                            <p className="text-[11px] text-slate-500 leading-normal font-normal">
                              {ms.purpose}
                            </p>

                            <div className="mt-2.5 space-y-1.5 text-[10px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-100/50">
                              <div className="text-rose-900 leading-normal">
                                <strong>👩‍⚕️ Lời khuyên vàng bác sĩ:</strong> <span className="italic font-normal">{ms.doctorTip}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* SUBTAB 4: Massage & skin stretches */}
                  {handbookSubTab === "massage" && (
                    <div className="space-y-3">
                      {customMassageAndSkinSecrets.map((spa, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-4 border border-rose-100/80 shadow-xs space-y-3">
                           <h4 className="text-xs font-black text-slate-800 border-b border-rose-50 pb-1.5 flex items-center justify-between">
                            <span>🌺 {spa.topic}</span>
                            <span className="text-[8px] text-rose-500 bg-rose-50 font-black px-2 py-0.5 rounded-full">Khuyên dùng hàng ngày</span>
                          </h4>

                          <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                            {spa.benefits}
                          </p>

                          <div className="space-y-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-150">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Các tư thế thực hiện tại nhà:</span>
                            {spa.instructionSteps.map((step, sIdx) => {
                              const parts = step.split(": ");
                              return (
                                <div key={sIdx} className="text-[11px] leading-relaxed text-slate-600 font-normal">
                                  📌 <strong className="text-slate-800">{parts[0]}</strong>: {parts[1]}
                                </div>
                              );
                            })}
                          </div>

                          <div className="space-y-2 bg-emerald-50/30 p-3 rounded-2xl border border-emerald-100">
                            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block">Bí quyết rạn da:</span>
                            <p className="text-[10px] text-slate-600 leading-relaxed font-normal">{spa.stretchPreventions}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {spa.recommendedOils.map((oil, oIdx) => (
                                <span key={oIdx} className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                                  🌿 {oil.split(" (")[0]}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-red-50/50 p-3 rounded-2xl border border-red-100/55 text-[10px] leading-relaxed text-red-900">
                            <strong>🚫 Chống chỉ định bảo hộ tối đa:</strong>
                            <p className="mt-0.5 italic font-normal">{spa.warning}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SUBTAB 5: Thai giáo theo tuần */}
                  {handbookSubTab === "thaigiao" && (() => {
                    const tg = getCustomThaiGiaoByWeek(selectedWeek);
                    return (
                      <div className="space-y-4 animate-fade-in text-slate-800">
                        {/* Intro card with Trimester visual indicator */}
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-3xl border border-rose-100/50 shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black tracking-wider uppercase bg-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-xs text-[8px]">
                              {tg.stageName}
                            </span>
                            <span className="text-[10px] font-extrabold text-rose-500">
                              Tuần {selectedWeek} 🗓️
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-slate-705 leading-relaxed font-semibold">
                            💡 <span className="text-rose-600 font-extrabold">Trọng tâm:</span> {tg.focusDesc}
                          </p>

                          <div className="text-[10px] bg-white/70 p-2 rounded-xl text-slate-550 border border-rose-100/30 font-medium">
                            🌿 <code className="text-slate-800 font-mono font-bold">Lịch trình:</code> Ngày {(selectedWeek - 1) * 7 + 1} đến {selectedWeek * 7} của thai kỳ. Thính giác và cơ quan phản xạ của con đang biến đổi thần tốc từng mốc tuần!
                          </div>
                        </div>

                        {/* Interactive Music Player Card */}
                        <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
                          <div className="flex items-center justify-between border-b border-rose-50 pb-2">
                            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                              📻 Đài Phát Nhạc Thai Giáo Cho Bé
                            </h4>
                            <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full select-none animate-pulse">
                              {isPlaying ? "Đang phát..." : "Đang dừng"}
                            </span>
                          </div>

                          <div className="bg-gradient-to-r from-slate-50 to-rose-50/35 p-3 rounded-2xl border border-slate-150 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <div className={`w-10 h-10 rounded-full bg-rose-550 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-xs ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
                                🎵
                              </div>
                              <div className="space-y-0.5 min-w-0 pr-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">CHỦ ĐỀ ĐANG PHÁT</span>
                                <h5 className="text-[11px] font-extrabold text-slate-805 truncate leading-tight">
                                  {playingTrack}
                                </h5>
                                <p className="text-[9px] text-slate-500 leading-none">Khuyên dùng: Cho nghe âm lượng dưới 60dB</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 select-none">
                              <button
                                onClick={() => setIsPlaying(prev => !prev)}
                                className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold p-2 rounded-full cursor-pointer transition-all active:scale-90 flex items-center justify-center shadow-xs w-9 h-9 text-[11px]"
                              >
                                {isPlaying ? "⏸️ Tạm dừng" : "▶️ Bắt đầu"}
                              </button>
                            </div>

                            {/* Simulated Progress bar */}
                            <div className="w-full h-1 bg-slate-200/50 rounded-full overflow-hidden absolute bottom-0 left-0">
                              <div 
                                className="h-full bg-rose-500 transition-all duration-300"
                                style={{ width: `${musicProgress}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Playlist Selectors */}
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {[
                              "Nhạc Baroque Giai Điệu Não Bộ (Binaural Bach)",
                              "Bản Giao Hưởng Ánh Sáng cho Thai Nhi",
                              "Hát Ru Đồng Dao Việt Nam êm dịu",
                              "Tiếng Sóng Biển & Nhịp Tim Mẹ (Pink Noise)"
                            ].map((track, trackIdx) => (
                              <button
                                key={trackIdx}
                                onClick={() => {
                                  setPlayingTrack(track);
                                  setIsPlaying(true);
                                  setMusicProgress(0);
                                }}
                                className={`p-2 rounded-xl border text-left text-[9px] font-black transition-colors shrink-0 cursor-pointer ${
                                  playingTrack === track
                                    ? "bg-rose-50 border-rose-300 text-rose-700"
                                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-650"
                                }`}
                              >
                                {playingTrack === track ? "🟢 " : "🎹 "} {track}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Message to Baby (Diary) */}
                        <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
                          <div className="flex items-center justify-between border-b border-rose-50 pb-2">
                            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                              ✍️ Lời Yêu Thương Gửi Bé Cưng (Tuần {selectedWeek})
                            </h4>
                            <span className="text-[8px] font-extrabold text-slate-400">Tự động lưu trữ</span>
                          </div>

                          <span className="text-[9px] text-slate-500 leading-relaxed block font-medium">
                            Ký ức thai kỳ chính là mạch nguồn ấm áp của con. Mẹ hãy viết lại những cột mốc đáng nhớ, những mong ước gửi trao cho con tuần thai này nhé!
                          </span>

                          <textarea
                            value={babyNotes[selectedWeek] || ""}
                            onChange={(e) => {
                              const text = e.target.value;
                              setBabyNotes(prev => {
                                const updated = { ...prev, [selectedWeek]: text };
                                localStorage.setItem("baby_notes", JSON.stringify(updated));
                                return updated;
                              });
                            }}
                            placeholder="Mẹ gõ đôi dòng gửi con cưng nhé... (Ví dụ: 'Hôm nay con đạp hăng quá, ba ghé tai nói chuyện con liền đáp lại...')"
                            className="w-full h-24 p-3 border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-2xl text-[11px] bg-slate-50/50 outline-none font-medium text-slate-800 leading-relaxed resize-none"
                          />

                          {(babyNotes[selectedWeek] || "").trim() && (
                            <div className="bg-emerald-50/50 rounded-xl p-2.5 border border-emerald-100/50 flex items-center gap-2">
                              <span className="text-sm">💾</span>
                              <p className="text-[9.5px] text-emerald-800 font-extrabold leading-normal">
                                Đã ghi lại nhật ký thai giáo tuần {selectedWeek} thành công trên máy của mẹ!
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Category list details */}
                        <div className="space-y-3">
                          {/* 1. Auditory */}
                          <div className="bg-white rounded-3xl p-4 border border-rose-105 shadow-xs space-y-2">
                            <h5 className="text-[11px] font-black text-rose-500 flex items-center gap-1.5 uppercase tracking-wider">
                              🔊 Thính Giác (Thai Giáo Âm Thanh)
                            </h5>
                            <p className="text-[11px] text-slate-655 leading-relaxed font-semibold">
                              {tg.auditory}
                            </p>
                          </div>

                          {/* 2. Visual */}
                          <div className="bg-white rounded-3xl p-4 border border-rose-105 shadow-xs space-y-2">
                            <h5 className="text-[11px] font-black text-emerald-600 flex items-center gap-1.5 uppercase tracking-wider">
                              👁️ Thị Giác (Thai Giáo Mỹ Học)
                            </h5>
                            <p className="text-[11px] text-slate-655 leading-relaxed font-semibold">
                              {tg.visual}
                            </p>
                          </div>

                          {/* 3. Kinesthetic */}
                          <div className="bg-white rounded-3xl p-4 border border-rose-105 shadow-xs space-y-2">
                            <h5 className="text-[11px] font-black text-indigo-600 flex items-center gap-1.5 uppercase tracking-wider">
                              🤸 Xúc Giác & Vận Động
                            </h5>
                            <p className="text-[11px] text-slate-655 leading-relaxed font-semibold">
                              {tg.kinesthetic}
                            </p>
                          </div>

                          {/* 4. Dinh dưỡng */}
                          <div className="bg-white rounded-3xl p-4 border border-rose-105 shadow-xs space-y-2">
                            <h5 className="text-[11px] font-black text-amber-600 flex items-center gap-1.5 uppercase tracking-wider">
                              🥦 Vị Giác (Thai Giáo Dinh Dưỡng)
                            </h5>
                            <p className="text-[11px] text-slate-655 leading-relaxed font-semibold">
                              {tg.dinhDuong}
                            </p>
                          </div>

                          {/* 5. Tinh thần */}
                          <div className="bg-white rounded-3xl p-4 border border-rose-105 shadow-xs space-y-2">
                            <h5 className="text-[11px] font-black text-purple-650 flex items-center gap-1.5 uppercase tracking-wider">
                              🧠 Trí Tuệ & Cảm Xúc
                            </h5>
                            <p className="text-[11px] text-slate-655 leading-relaxed font-semibold">
                              {tg.emotion}
                            </p>
                          </div>
                        </div>

                        {/* Lịch Trình Thực Hành Thai Giáo 7 Ngày Trong Tuần */}
                        <div className="bg-white rounded-3xl p-4.5 border border-pink-100 shadow-xs space-y-3.5">
                          <div className="border-b border-pink-50 pb-2">
                            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase">
                              🗓️ Lịch Trình Thực Hành Thai Giáo 7 Ngày (Tuần {selectedWeek})
                            </h4>
                            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                              Được thiết kế chuẩn khoa học cho từng ngày thai - Tuần thứ {selectedWeek} của thai kỳ
                            </p>
                          </div>

                          <div className="space-y-3">
                            {(() => {
                              const dailyTasks = generateCustomThaiGiaoDailyTasks(selectedWeek);
                              return dailyTasks.map((task) => (
                                <div 
                                  key={task.dayIndex}
                                  className="bg-gradient-to-r from-slate-50 to-pink-50/20 hover:from-pink-50/30 p-3 rounded-2xl border border-pink-50/50 flex flex-col gap-2 transition-all"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-5 h-5 bg-pink-100/80 text-pink-700 text-[10px] font-black rounded-lg flex items-center justify-center">
                                        D{task.dayIndex}
                                      </span>
                                      <span className="text-[9px] font-bold text-pink-650 bg-pink-50 px-2 py-0.5 rounded-full select-none">
                                        Ngày {task.pregnancyDay} Thai Kỳ
                                      </span>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                      {task.icon} {task.method}
                                    </span>
                                  </div>
                                  <div>
                                    <h5 className="text-[11px] font-black text-slate-800">
                                      {task.title}
                                    </h5>
                                    <p className="text-[10px] text-slate-600 leading-relaxed font-semibold mt-1">
                                      {task.description}
                                    </p>
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* Co-parent tips & Daily practicing rules */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          <div className="bg-orange-50/55 p-4 rounded-3xl border border-orange-100 space-y-2">
                            <h5 className="text-[10px] font-black text-orange-800 uppercase tracking-wider flex items-center gap-1.5">
                              👨‍👩‍👦 Vai Trò Của Bố (Chồng Cùng Thực Hành)
                            </h5>
                            <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                              {tg.fatherTask}
                            </p>
                          </div>

                          <div className="bg-emerald-50/40 p-4 rounded-3xl border border-emerald-100 space-y-2">
                            <h5 className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                              📝 Thử Thách Thực Hành Ngày Hôm Nay Cho Mẹ
                            </h5>
                            <p className="text-[11px] text-slate-705 leading-relaxed font-semibold">
                              {tg.dailyPractice}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* SUBTAB 6: Hospital Bag Checklist */}
                {handbookSubTab === "hospitalBag" && (
                  <HospitalBagChecklist />
                )}

                {/* Affiliate recommended products section */}
                {handbookSubTab !== "milestone" && handbookSubTab !== "hospitalBag" && (() => {
                  const filteredProducts = customRecommendProducts.filter(prod => {
                    if (activeProductCategory === "all") return true;
                    return prod.category === activeProductCategory;
                  });

                  return (
                    <div className="mt-6 pt-5 border-t border-rose-100/60 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[8px] uppercase font-black bg-rose-50 text-rose-500 px-2.5 py-1 rounded-xl border border-rose-100/50">
                            Khuyên Dùng
                          </span>
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5 mt-1.5">
                            🛒 Sản Phẩm Thai Kỳ Khuyên Dùng
                          </h4>
                          <p className="text-[9px] text-slate-400 font-normal leading-normal">
                            Lối tắt giúp mẹ sắm nhanh đồ dùng, dinh dưỡng khoa học. Nhấn icon bút chì sửa liên kết của bạn!
                          </p>
                        </div>
                      </div>

                      {/* Product Category Filter Tabs */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar flex-nowrap w-full">
                        {[
                          { id: "all", label: "✨ Tất cả" },
                          { id: "vitamin", label: "💊 Vitamin Bầu" },
                          { id: "stretch_mark", label: "🌱 Ngừa Rạn Da" },
                          { id: "food_drink", label: "🥑 Ăn - Uống" }
                        ].map((cat) => {
                          const isActive = activeProductCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setActiveProductCategory(cat.id as any)}
                              className={`cursor-pointer shrink-0 py-1.5 px-3 rounded-full text-[10px] font-black tracking-tight border transition-all active:scale-95 ${
                                isActive
                                  ? "bg-rose-500 text-white border-rose-500 shadow-xs shadow-rose-250/55"
                                  : "bg-slate-50 border-slate-205/60 text-slate-550 hover:border-slate-350"
                              }`}
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Mobile optimized 2-column grid */}
                      {filteredProducts.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-6 text-center text-slate-400">
                          <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <p className="text-[10px] font-bold">Chưa có sản phẩm nào thuộc danh mục này.</p>
                          <p className="text-[8px] mt-0.5">Mẹ có thể bấm nút sửa trên bất kỳ sản phẩm nào để đổi phân loại của nó!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {filteredProducts.slice(0, 12).map((prod) => (
                            <div 
                              key={prod.id} 
                              className="bg-white rounded-3xl p-3 border border-rose-50/70 shadow-xs flex flex-col relative transition-all duration-155 hover:-translate-y-0.5"
                            >
                              {/* Image Box */}
                              <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden relative mb-2 group">
                                <img 
                                  src={prod.imageUrl} 
                                  alt={prod.name} 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                                {/* Slick Pencil Button to change product details */}
                                <button
                                  onClick={() => {
                                    setEditingProduct(prod);
                                    setIsAffiliateEditModalOpen(true);
                                  }}
                                  className="absolute top-1.5 right-1.5 bg-white/95 hover:bg-rose-50 text-slate-650 hover:text-rose-600 w-7 h-7 rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90 z-20"
                                  title="Thay đổi sản phẩm"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Product Name (màu shopee orange #ee4d2d) */}
                              <h5 className="text-[#ee4d2d] font-bold text-[10px] leading-snug line-clamp-2 mb-1 min-h-[30px]">
                                {prod.name}
                              </h5>

                              {/* Price (màu đen) */}
                              <div className="flex items-center justify-between mt-0.5">
                                <span className="text-black font-black text-xs">
                                  {prod.price}
                                </span>
                              </div>

                              {/* Buy Button linked with affiliate hyperlink */}
                              <a 
                                href={prod.affiliateUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="mt-2.5 bg-gradient-to-r from-orange-500 to-[#ee4d2d] text-white font-black py-2 px-3 rounded-2xl text-[9px] text-center flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform"
                              >
                                <ShoppingBag className="w-3 h-3" />
                                <span>Mua ngay</span>
                                <ExternalLink className="w-2 h-2 opacity-80" />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

              </div>
            )}



            {/* ==================== TAB 5: BÁO CÁO AI CHUYÊN SÂU ==================== */}
            {activeTab === "aiReport" && (
              <div className="space-y-4 animate-fade-in flex flex-col min-h-[460px]">
                <div className="bg-white rounded-3xl p-4 border border-rose-50 shadow-xs flex-1 flex flex-col justify-start">
                  <div className="mb-4">
                    <span className="text-[8px] uppercase font-black bg-rose-50 text-rose-500 px-2.5 py-1 rounded-xl border border-rose-100/50">
                      Báo Cáo Chuyên Sâu
                    </span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5 mt-2">
                      📋 Thực Đơn & Đề Xuất Dinh Dưỡng Tuần {selectedWeek}
                    </h3>
                    <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                      Chế độ dinh dưỡng, bài rèn luyện và lời khuyên y học được cá nhân hóa bởi Trợ lý BaBiCare AI. Thích ứng theo tuần phát triển của bé.
                    </p>
                  </div>

                  {loadingReport ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 select-none">
                      <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-black text-rose-800">Trợ lý BaBiCare AI đang lắp ráp dữ liệu tuần {selectedWeek}...</p>
                      <p className="text-[9px] text-rose-400 italic">Quá trình này tốn khoảng 5 giây, mẹ bầu nghỉ tí nhé! 🍵</p>
                    </div>
                  ) : errorReport ? (
                    <div className="py-6 text-center text-red-650 bg-red-550 rounded-2xl p-4 border border-red-150 space-y-2">
                      <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
                      <p className="text-xs font-bold leading-relaxed">{errorReport}</p>
                      <p className="text-[9px] text-red-400">Hãy đảm bảo khóa GEMINI_API_KEY đã được khai báo chính xác trong secrets.</p>
                    </div>
                  ) : aiReport ? (
                    <div className="text-slate-700 leading-relaxed max-h-[380px] overflow-y-auto pr-1 no-scrollbar text-xs font-normal border border-slate-100 p-3 rounded-2xl bg-slate-50/50">
                      <div className="markdown-body prose prose-rose max-w-none text-xs leading-relaxed">
                        <ReactMarkdown>{aiReport}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center text-slate-500 space-y-3">
                      <p className="text-xs font-bold">Chưa tạo cẩm nang cho tuần thai thứ {selectedWeek}</p>
                      <p className="text-[10px] text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                        Trợ lý BaBiCare AI sẽ dựa trên chỉ số mẹ và các ghi chú gõ lúc nãy để kết xuất một thực đơn súc tích nhất.
                      </p>
                      <button
                        onClick={handleGenerateReport}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-2 px-5 rounded-xl text-[10px] shadow-xs cursor-pointer active:scale-95 transition-all"
                      >
                        Khởi Tạo Ngay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== TAB 6: THEO DÕI KỲ KINH & RỤNG TRỨNG ==================== */}
            {activeTab === "menstrual" && (() => {
              const stats = analyzeMenstrualCycles();
              const parsedCycleLength = Math.round(stats.avgCycleLength);
              const latestDateObj = new Date(stats.latestStartDate);

              // Projections builder
              const getProjections = () => {
                const list = [];
                let currentStart = new Date(latestDateObj);
                for (let i = 0; i < 3; i++) {
                  const startStr = formatLocalDate(currentStart);
                  
                  const endPeriod = new Date(currentStart);
                  endPeriod.setDate(endPeriod.getDate() + Math.round(stats.avgPeriodDays) - 1);
                  const endPeriodStr = formatLocalDate(endPeriod);

                  const ovulationDate = new Date(currentStart);
                  ovulationDate.setDate(ovulationDate.getDate() + parsedCycleLength - 14);
                  const ovulationStr = formatLocalDate(ovulationDate);

                  const fertileStart = new Date(ovulationDate);
                  fertileStart.setDate(fertileStart.getDate() - 5);
                  const fertileStartStr = formatLocalDate(fertileStart);
                  const fertileEndStr = ovulationStr;

                  list.push({
                    cycleIndex: i + 1,
                    startDate: startStr,
                    endDate: endPeriodStr,
                    ovulationDate: ovulationStr,
                    fertileStart: fertileStartStr,
                    fertileEnd: fertileEndStr,
                    nextLabel: `Kỳ dự kiến thứ ${i + 1}`,
                  });

                  // Setup next start date
                  const nextStart = new Date(currentStart);
                  nextStart.setDate(nextStart.getDate() + parsedCycleLength);
                  currentStart = nextStart;
                }
                return list;
              };

              const projections = getProjections();

              // Today's stance relative to 2026-05-23
              const getTodayStatus = () => {
                const today = new Date("2026-05-23");
                const latestStart = new Date(stats.latestStartDate);
                const diffTime = today.getTime() - latestStart.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                  return {
                    status: "Chưa bắt đầu chu kỳ mới",
                    color: "text-slate-500",
                    bg: "bg-slate-50 border-slate-205",
                    desc: "Vui lòng nhập ngày bắt đầu kỳ kinh thực tế của ngày gần đây."
                  };
                }

                const dayInCycle = (diffDays % parsedCycleLength) + 1;
                const periodLength = Math.round(stats.avgPeriodDays);
                const ovulationDay = parsedCycleLength - 14;

                if (dayInCycle <= periodLength) {
                  return {
                    status: "Giai Đoạn Hành Kinh 🩸",
                    color: "text-rose-500",
                    bg: "bg-rose-50 border-rose-100",
                    desc: `Đang ở ngày ${dayInCycle}/${periodLength} của chu kỳ kinh nguyệt. Lượng Estrogen và Progesterone xuống mức tối sinh học, mẹ cần uống nước ấm và nghỉ dưỡng kỹ lưỡng nhé!`
                  };
                } else if (dayInCycle >= ovulationDay - 5 && dayInCycle <= ovulationDay) {
                  const countdown = ovulationDay - dayInCycle;
                  return {
                    status: dayInCycle === ovulationDay ? "Hôm Nay: NGÀY RỤNG TRỨNG 🌟" : "CỬA SỔ THỤ THAI VÀNG 🔥",
                    color: dayInCycle === ovulationDay ? "text-amber-655 animate-pulse font-black" : "text-emerald-700 font-extrabold",
                    bg: "bg-emerald-50 border-emerald-100 shadow-sm",
                    desc: dayInCycle === ovulationDay 
                      ? "Nang trứng chín mùi và trứng đã phóng thích rời buồng thành công! Cơ hội đậu thai đang cao trúng đích nhất (5⭐) mẹ tròn bố khỏe!" 
                      : `Cách ngày rụng trứng ${countdown} ngày. Đây là thời gian khả thi tối đa kích thích thụ tinh. Hãy duy trì thả bầu ngọt ngào cùng ông xã!`
                  };
                } else if (dayInCycle > ovulationDay && dayInCycle <= ovulationDay + 1) {
                  return {
                    status: "Hậu Rụng Trứng (Cơ hội cuối cùng) 🌀",
                    color: "text-teal-605",
                    bg: "bg-teal-50 border-teal-100",
                    desc: "Trứng rụng từ hôm qua di chuyển chậm rãi qua vòi trứng và giữ nguyên khả năng hoạt động thụ thai trong khoảng 12 - 24 tiếng hữu hiệu."
                  };
                } else if (dayInCycle > periodLength && dayInCycle < ovulationDay - 5) {
                  return {
                    status: "Giai Đoạn Nang Trứng (An toàn tương đối) 🌿",
                    color: "text-indigo-605",
                    bg: "bg-indigo-50 border-indigo-100",
                    desc: "FSH vùng dưới đồi chỉ đạo phát triển đoàn hệ nang noãn mới. Cơ thể bắt đầu tích tụ sinh huyết làm dày lớp nội mạc tử cung đầm ấm."
                  };
                } else {
                  return {
                    status: "Giai Đoạn Hoàng Thể (An Toàn) 🛡️",
                    color: "text-purple-605",
                    bg: "bg-purple-50 border-purple-100",
                    desc: "Thể vàng tại buồng trứng hăng hái sản xuất hormone Progesterone nâng niu nội mạc tử cung chờ giao cấu thành phôi làm tổ hạnh phúc."
                  };
                }
              };

              const todayStatusState = getTodayStatus();

              const formatShortDate = (dateStr: string) => {
                const [year, month, day] = dateStr.split("-");
                return `${day}/${month}/${year}`;
              };

              return (
                <div className="space-y-4 animate-fade-in flex flex-col min-h-[460px]">
                  
                  {/* Điều hướng 2 button trong tab Thả Bầu */}
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-rose-100/40">
                    <button
                      type="button"
                      onClick={() => setMenstrualSubTab("calculator")}
                      className={`py-2 px-1.5 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        menstrualSubTab === "calculator"
                          ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                          : "text-slate-550 hover:text-rose-600 hover:bg-white/40"
                      }`}
                    >
                      <Sliders className="w-4 h-4 shrink-0" />
                      Công cụ tính toán y sinh
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenstrualSubTab("prePregnancy")}
                      className={`py-2 px-1.5 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        menstrualSubTab === "prePregnancy"
                          ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                          : "text-slate-550 hover:text-rose-600 hover:bg-white/40"
                      }`}
                    >
                      <Heart className="w-4 h-4 shrink-0" />
                      Kinh nghiệm tiền thai sản
                    </button>
                  </div>

                  {menstrualSubTab === "calculator" && (
                    <div className="space-y-4 animate-fade-in">
                      
                      {/* Top Header Card */}
                      <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-3xl border border-rose-100/50 shadow-xs">
                        <span className="text-[8px] uppercase font-black bg-rose-500 text-white px-2.5 py-1 rounded-xl">
                          Công Cụ Tính Toán Y Sinh
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 mt-2">
                          ⭐ Theo Dõi Kỳ Kinh Sinh Học & Canh Ngày Thả Bầu Bé Yêu
                        </h3>
                        <p className="text-[9.5px] text-slate-500 mt-1 leading-normal font-medium">
                          Nhập thông tin nhật ký hành kinh qua nhiều tháng để hệ quản trị dữ liệu lâm sàng tự động tính toán nhịp kinh của mẹ, đưa ra các cột mốc rụng trứng chính xác nhất theo phương pháp chu kỳ học máy!
                        </p>
                      </div>

                  {/* Machine Learning Statistics Dashboard */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Average Length card */}
                    <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-xs space-y-2 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Thời Lượng Chu Kỳ (Học Máy)
                        </span>
                        <span className="text-[9px] text-slate-400 cursor-help" title="Độ dài trung bình tính từ ngày đầu kỳ kinh này đến ngày đầu kỳ kinh tiếp theo">❓</span>
                      </div>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-3xl font-black text-rose-600 tracking-tight">
                          {stats.avgCycleLength}
                        </span>
                        <span className="text-xs text-slate-400 font-extrabold">ngày / chu kỳ</span>
                      </div>
                      <div className="text-[9px] text-rose-805 leading-normal flex items-start gap-1 font-semibold bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/40">
                        <span>🤖</span>
                        <p className="leading-snug">{stats.cycleLengthsSource}</p>
                      </div>
                    </div>

                    {/* Period Days and Today status */}
                    <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-xs space-y-2">
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Phân Tích Sức Khỏe Hôm Nay
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm">🔬</span>
                        <span className={`text-xs font-black ${todayStatusState.color}`}>
                          {todayStatusState.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-relaxed font-semibold bg-slate-50/60 p-2 rounded-xl border border-slate-100">
                        {todayStatusState.desc}
                      </p>
                    </div>

                  </div>

                  {/* Add Cycle Log & History Section */}
                  <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-rose-50 pb-2">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        Quản Lý Lịch Trình Kinh Nguyệt
                      </h4>
                      <span className="text-[8px] font-bold text-slate-400">Tối thiểu nhập 2-3 tháng để máy học nhịp chính xác hơn</span>
                    </div>

                    {/* Log Form Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50/70 p-3 rounded-2xl border border-slate-150">
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-slate-500 uppercase block">1. Ngày Đầu Kỳ Kinh:</label>
                        <input
                          type="date"
                          value={newLogStartDate}
                          onChange={(e) => setNewLogStartDate(e.target.value)}
                          className="w-full p-2 border border-slate-205 focus:border-rose-450 focus:ring-1 focus:ring-rose-450 bg-white rounded-xl text-xs outline-none text-slate-705 font-bold"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-slate-500 uppercase block">2. Số Ngày Kinh Nguyệt:</label>
                        <select
                          value={newLogPeriodDays}
                          onChange={(e) => setNewLogPeriodDays(Number(e.target.value))}
                          className="w-full p-2 border border-slate-205 focus:border-rose-450 focus:ring-1 focus:ring-rose-450 bg-white rounded-xl text-xs outline-none text-slate-705 font-bold"
                        >
                          {[3, 4, 5, 6, 7, 8, 9, 10].map(d => (
                            <option key={d} value={d}>{d} ngày</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-slate-500 uppercase block">3. Độ Dài Chu Kỳ Mẹ Ước Tính:</label>
                        <select
                          value={newLogCycleLength}
                          onChange={(e) => setNewLogCycleLength(Number(e.target.value))}
                          className="w-full p-2 border border-slate-205 focus:border-rose-450 focus:ring-1 focus:ring-rose-450 bg-white rounded-xl text-xs outline-none text-slate-705 font-bold"
                        >
                          {Array.from({ length: 25 }, (_, i) => i + 21).map(c => (
                            <option key={c} value={c}>{c} ngày</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          const isDuplicated = menstrualLogs.some(log => log.startDate === newLogStartDate);
                          if (isDuplicated) {
                            alert("Ngày bắt đầu kỳ kinh này đã tồn tại trong danh sách của mẹ!");
                            return;
                          }
                          const newLog = {
                            id: `custom-${Date.now()}`,
                            startDate: newLogStartDate,
                            periodDays: newLogPeriodDays,
                            cycleLength: newLogCycleLength
                          };
                          const updated = [...menstrualLogs, newLog].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
                          saveMenstrualLogs(updated);
                        }}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[10px] py-2 px-4 rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm Ghi Chép & Cập Nhật Lớp Học Máy
                      </button>
                    </div>

                    {/* Logs list representation */}
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      <span className="text-[8.5px] text-slate-400 font-extrabold block uppercase tracking-wider">Lịch Sử Các Kỳ Gần Nhất:</span>
                      
                      {menstrualLogs.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic text-center py-4">Chưa có chu kỳ nào được lưu trữ.</p>
                      ) : (
                        menstrualLogs.map((log) => (
                          <div 
                            key={log.id}
                            className="bg-slate-50 hover:bg-slate-100/55 p-2 rounded-xl border border-slate-150 flex items-center justify-between transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="bg-rose-50 text-rose-500 w-5 h-5 font-black rounded-lg flex items-center justify-center text-xs text-center leading-5 shadow-sm">🩸</span>
                              <div>
                                <span className="font-extrabold text-slate-800">Ngày đầu hành kinh: {formatShortDate(log.startDate)}</span>
                                <span className="text-slate-400 text-[8.5px] block font-semibold leading-relaxed">
                                  Hành kinh: {log.periodDays} ngày • Chu kỳ thiết lập: {log.cycleLength} ngày
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                confirm(`Xác nhận xóa chu kỳ ngày bắt đầu ${formatShortDate(log.startDate)} khỏi sơ đồ thuật toán?`) && saveMenstrualLogs(menstrualLogs.filter(item => item.id !== log.id));
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md text-[9px] font-extrabold cursor-pointer active:scale-90 transition-transform"
                            >
                              Xóa
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                  {/* 3-Month Projection Plan */}
                  <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-rose-50 pb-2">
                      <h4 className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                        🗓️ Biểu Đồ Dự Báo Thời Gian Rụng Trứng & Cửa Sổ Vàng Thả Bầu (3 Tháng Kế Tiếp)
                      </h4>
                      <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 animate-pulse select-none">
                        DỰ ĐOÁN CHUẨN XÁC
                      </span>
                    </div>

                    <div className="space-y-3">
                      {projections.map((proj) => (
                        <div 
                          key={proj.cycleIndex}
                          className="bg-gradient-to-br from-indigo-50/20 via-white to-rose-50/10 border border-rose-100/40 p-3.5 rounded-2xl relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-black px-2.5 py-1 rounded-bl-xl uppercase tracking-widest">
                            CHU KỲ #{proj.cycleIndex}
                          </div>

                          <div className="space-y-3">
                            {/* Visual Phase Timeline bar */}
                            <div className="flex items-center gap-1 relative overflow-hidden h-5 bg-slate-100/60 rounded-full p-0.5 border border-slate-150 mt-1">
                              {/* Period block */}
                              <div className="h-full bg-rose-400/90 rounded-full text-white text-[7.5px] font-black flex items-center justify-center px-1 truncate shrink-0" style={{ width: `${(stats.avgPeriodDays/parsedCycleLength)*100}%` }}>
                                Kinh Nguyệt 🩸
                              </div>
                              {/* Follicular gap */}
                              <div className="h-full bg-indigo-100/40 rounded-full text-indigo-750 text-[7.5px] font-bold flex items-center justify-center shrink-0 truncate" style={{ width: `${((parsedCycleLength - 14 - stats.avgPeriodDays)/parsedCycleLength)*100}%` }}>
                                Nang noãn
                              </div>
                              {/* Fertile/Ovulation Window block */}
                              <div className="h-full bg-emerald-500 text-white text-[7.5px] font-black flex items-center justify-center rounded-full animate-pulse shrink-0 shadow-xs" style={{ width: `${(6/parsedCycleLength)*100}%` }}>
                                THẢ BẦU 🔥
                              </div>
                              {/* Luteal gap */}
                              <div className="h-full bg-purple-100/50 text-purple-650 text-[7.5px] font-bold flex items-center justify-center rounded-full shrink-0" style={{ width: `${(8/parsedCycleLength)*100}%` }}>
                                Hoàng thể
                              </div>
                            </div>

                            {/* Precise Phase Milestone Timestamps */}
                            <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                              
                              <div className="bg-rose-50/40 border border-rose-100/50 p-2 rounded-xl text-center space-y-0.5">
                                <span className="text-[8px] font-black text-rose-550 uppercase block">Hành Kinh 🩸</span>
                                <span className="font-extrabold text-slate-750 block">{formatShortDate(proj.startDate)}</span>
                                <span className="text-[8px] text-slate-400 block leading-none">đến {formatShortDate(proj.endDate)}</span>
                              </div>

                              <div className="bg-emerald-50/70 border border-emerald-100 p-2 rounded-xl text-center space-y-0.5 animate-pulse">
                                <span className="text-[8px] font-black text-emerald-600 uppercase block">Thả Bầu Vàng 🔥</span>
                                <span className="font-extrabold text-slate-750 block">{formatShortDate(proj.fertileStart)}</span>
                                <span className="text-[8px] text-slate-400 block leading-none">đến {formatShortDate(proj.fertileEnd)}</span>
                              </div>

                              <div className="bg-amber-50 border border-amber-205 p-2 rounded-xl text-center space-y-0.5">
                                <span className="text-[8px] font-black text-amber-600 uppercase block">Rụng Trứng Dự Kiến 🌟</span>
                                <span className="font-extrabold text-amber-805 block">{formatShortDate(proj.ovulationDate)}</span>
                                <span className="text-[8px] text-slate-400 block leading-none">Cơ hội cao nhất</span>
                              </div>

                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scientific handbook on Menstrual cycles & conception */}
                  <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3 text-slate-800">
                    <div className="border-b border-rose-50 pb-2">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        📖 Chuyên Đề Y Học: Kỹ Thuật Canh Thả Bầu Khoa Học
                      </h4>
                      <p className="text-[9px] text-slate-400 font-medium">Lời khuyên lâm sàng từ Tổ chức Y tế thế giới và Giáo sư đầu ngành sản phụ khoa</p>
                    </div>

                    <div className="space-y-3">
                      
                      {/* Hormone breakdown */}
                      <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-wide flex items-center gap-1">
                          🧬 1. Chu Kỳ Hormone LH & Sự Phóng Noãn
                        </h5>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                          Chu kỳ rụng trứng chịu tác động bởi 4 hormone tuyến yên và buồng trứng: <strong>FSH</strong>, <strong>LH</strong>, <strong>Estrogen</strong> và <strong>Progesterone</strong>. Khoảng 24 - 36 giờ trước khi rụng trứng, hormone LH sẽ đạt đỉnh đột biến (LH Surge), tạo lực co bóp cơ nang đẩy trứng chín nứt rách lớp đệm bao ngoài và rụng xuống. Khắc ghi ngày này giúp vợ chồng chủ động thời gian sinh hoạt vợ chồng thích đáng.
                        </p>
                      </div>

                      {/* How to track vaginal mucus */}
                      <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-wide flex items-center gap-1">
                          💧 2. Độ Dai Nhầy Cổ Tử Cung (Cervical Mucus)
                        </h5>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                          Nồng độ Estrogen đạt cực đại kích thích tuyến cổ tử cung tiết dịch đặc hữu trước rụng trứng 3 - 4 ngày. Khi dịch nhầy có màu trong suốt, mướt mịn giống lòng trắng trứng gà sống và có thể kéo dài thành sợi từ 3-5 cm không đứt, đây chính là tín hiệu hóa sinh hoàn thiện nhất nuôi dưỡng tinh trùng sống sót và dẫn truyền tới chỗ trứng chờ đợi.
                        </p>
                      </div>

                      {/* BBT tracking guidelines */}
                      <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                          🌡️ 3. Thân Nhiệt Cơ Bản (Basal Body Temperature)
                        </h5>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                          Thân nhiệt đo tại vòm miệng ngay sau khi thức dậy chưa ra khỏi giường (BBT) sẽ dao động thấp trước rụng trứng, sau đó tăng bật lên 0.3°C - 0.5°C do tác dụng nhiệt của hormone Progesterone tiết ra từ thể vàng sau khi trứng đã rụng. Khi thấy nhiệt độ duy trì cao, chứng tỏ trứng đã rụng hiệu quả.
                        </p>
                      </div>

                      {/* Quick action button to trigger ChatGPT prompt on ovulation */}
                      <div className="bg-rose-50/50 p-3 rounded-2.5xl border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mt-2">
                        <div className="space-y-0.5">
                          <h6 className="text-[11px] font-black text-rose-800">
                            💬 Tư Vấn Thực Đơn & Dinh Dưỡng Thả Bầu Cùng Bác Sĩ AI?
                          </h6>
                          <p className="text-[9.5px] text-slate-550 font-medium leading-none">
                            Hệ thống AI sẽ tự động tạo chuỗi khuyến nghị thực đơn giúp làm khỏe noãn bào tử!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChatOpen(true);
                            handleSendMessage("Tôi muốn canh ngày thả bầu và tìm kiếm một chế độ ăn uống khoa học cho cả vợ và chồng giúp trứng chín noãn khỏe, tinh binh bơi khỏe để tăng tỷ lệ đậu thai nhanh nhất nhé.");
                          }}
                          className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[9.5px] py-1.5 px-3 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm"
                        >
                          Hỏi Bác Sĩ AI Tư Vấn Ngay 🚀
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* COMPONENT: Báo Cáo Kết Quả Thả Bầu (Moved to bottom of tab, only show simplified buttons) */}
                  <div className="bg-gradient-to-br from-indigo-50/20 via-pink-50/10 to-rose-50/20 rounded-3xl p-5 border border-pink-100/60 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-rose-100/30 pb-2.5">
                      <div>
                        <h4 className="text-xs font-black text-rose-800 flex items-center gap-1.5 uppercase tracking-wide">
                          👼 KẾT QUẢ THEO DÕI THẢ BẦU THÁNG NÀY
                        </h4>
                        <p className="text-[9px] text-slate-500 font-medium">Chọn một trạng thái bên dưới để ghi nhận hành trình của mẹ</p>
                      </div>
                      <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase">HOT</span>
                    </div>

                    {pregnancyReportState === "none" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Button 1: HAS PREGNANCY (Mẹ đã mang thai) */}
                        <button
                          onClick={() => {
                            setPregnancyReportState("success");
                            const todayStr = new Date().toISOString().split("T")[0];
                            setLmpInputDate(todayStr);
                            // Initial preview calculations
                            const lmp = new Date(todayStr);
                            const edd = new Date(lmp.getTime() + 280 * 24 * 3600 * 1000);
                            setCalculatedEdd(edd.toLocaleDateString("vi-VN"));
                            setCalculatedWeeks({ weeks: 4, days: 2 });
                          }}
                          className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
                        >
                          🤰 Mẹ đã mang thai
                        </button>

                        {/* Button 2: NOT PREGNANT (Chưa có bầu) */}
                        <button
                          onClick={() => {
                            setPregnancyReportState("not_yet");
                            const today = new Date();
                            const prev = new Date(today.getTime() - 28 * 24 * 3600 * 1000);
                            setNotPregnantStart(prev.toISOString().split("T")[0]);
                            setNotPregnantPeriodDays(5);
                            setNotPregnantCycleLength(28);
                          }}
                          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-black text-xs rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
                        >
                          🌸 Chưa có bầu tháng này
                        </button>
                      </div>
                    )}

                    {pregnancyReportState === "success" && (
                      <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-3xs space-y-3.5 animate-fade-in text-slate-800">
                        <div className="flex items-center gap-2 border-b border-rose-50 pb-2">
                          <span className="text-lg">📅</span>
                          <div>
                            <span className="text-[11px] font-black text-rose-800 block">XÁC NHẬN MỐC SINH KHỞI</span>
                            <span className="text-[9px] text-slate-400">Vui lòng nhập ngày đầu tiên của kỳ kinh nguyệt cuối (LMP) của mẹ</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-705 uppercase block">LMP - Ngày Đầu Kỳ Kinh Cuối Có Bầu:</label>
                            <input
                              type="date"
                              value={lmpInputDate}
                              onChange={(e) => {
                                setLmpInputDate(e.target.value);
                                // Calculate tentative dates in real-time
                                const lmp = new Date(e.target.value);
                                if (!isNaN(lmp.getTime())) {
                                  // EDD: lmp + 280 days
                                  const edd = new Date(lmp.getTime() + 280 * 24 * 3600 * 1000);
                                  setCalculatedEdd(edd.toLocaleDateString("vi-VN"));
                                  // Weeks:
                                  const diffMs = new Date().getTime() - lmp.getTime();
                                  const diffDays = Math.max(0, Math.floor(diffMs / (24 * 3600 * 1000)));
                                  const w = Math.floor(diffDays / 7);
                                  const d = diffDays % 7;
                                  setCalculatedWeeks({ weeks: w, days: d });
                                }
                              }}
                              className="w-full px-3 py-2 border border-slate-205 text-xs rounded-xl focus:border-rose-450 outline-none text-slate-900 font-extrabold bg-white"
                            />
                          </div>

                          {lmpInputDate && calculatedWeeks && (
                            <div className="p-3 bg-pink-50/40 rounded-xl border border-pink-100 text-[10px] leading-relaxed text-slate-700 space-y-1">
                              <div>✨ <strong>Ngày Dự Sanh (Ý niệm):</strong> <span className="text-rose-600 font-bold">{calculatedEdd}</span></div>
                              <div>🤰 <strong>Tuổi thai tạm tính:</strong> <span className="text-rose-600 font-bold">{calculatedWeeks.weeks} Tuần {calculatedWeeks.days} Ngày</span></div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (!lmpInputDate) {
                                  alert("Vui lòng chọn ngày đầu kỳ kinh cuối quý giá của mẹ nhé!");
                                  return;
                                }
                                // Transition to celebrate_modal
                                setPregnancyReportState("celebrate_modal");
                              }}
                              className="flex-1 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-[11px] rounded-xl shadow-md cursor-pointer hover:opacity-95 transition-all text-center"
                            >
                              💌 XÁC NHẬN - NHẬN LỜI CHÚC THẦN KỲ
                            </button>
                            <button
                              onClick={() => setPregnancyReportState("none")}
                              className="px-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-[10px] rounded-xl font-bold transition-all"
                            >
                              Quay Lại
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {pregnancyReportState === "not_yet" && (
                      <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-100 shadow-3xs space-y-3.5 animate-fade-in text-slate-800">
                        <div className="bg-white rounded-2xl p-3 border border-indigo-100 shadow-3xs space-y-2">
                          <p className="text-[11px] text-indigo-950 font-black flex items-center gap-1.5 uppercase tracking-tight">
                            🌸 GỬI MẸ KHOẢNG LẶNG BÌNH YÊN & HY VỌNG!
                          </p>
                          <p className="text-[10.5px] text-slate-655 leading-relaxed font-semibold">
                            Đừng buồn hay lo lắng mẹ nhé! Hành trình chuẩn bị đón thiên thần bé nhỏ luôn cần thời gian, sự ôm ấp dưỡng chất và một tinh thần thanh thản, tràn trề sinh lực! Hãy luôn nhớ giữ tinh thần thật lạc quan vui vẻ, ăn uống sung túc. Tránh lo âu và stress mỏi mệt để phôi thai dễ dàng đậu lành mạnh vào thời khắc vàng rụng trứng tiếp theo.
                          </p>
                          <div className="text-[10px] bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/30 text-slate-700 space-y-1">
                            <div>🍏 <strong>Ăn uống bồi bồi bơ sữa:</strong> Thêm nhiều rau cải sẫm màu, bơ sáp tươi ngon tự nhiên giàu Vitamin E, cá hồi nướng chín và ngũ cốc thô dồi dào.</div>
                            <div>😴 <strong>Nghỉ ngơi tĩnh tâm:</strong> Ngủ tuyệt đối trước 22h30 đêm, kết hợp thể dục nhẹ nhàng rèn luyện khí thở.</div>
                          </div>
                        </div>

                        {/* Input form to update next menstrual cycle to recalculate */}
                        <div className="bg-white rounded-2xl p-3 border border-slate-150 shadow-3xs space-y-3">
                          <span className="text-[10px] font-black text-rose-800 block border-b border-rose-51 pb-1.5 uppercase">
                            📅 CẬP NHẬT KỲ KINH MỚI - TỰ ĐỘNG LẬP SƠ ĐỒ AI THÁNG SAU
                          </span>

                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="space-y-1">
                              <label className="font-extrabold text-slate-600 block">Ngày Bắt Đầu Kinh Mới:</label>
                              <input
                                type="date"
                                value={notPregnantStart}
                                onChange={(e) => setNotPregnantStart(e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-xl outline-none text-[10px] font-semibold bg-white text-slate-800"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-extrabold text-slate-600 block">Số Ngày Hành Kinh:</label>
                              <input
                                type="number"
                                min={2}
                                max={10}
                                value={notPregnantPeriodDays}
                                onChange={(e) => setNotPregnantPeriodDays(Number(e.target.value))}
                                className="w-full p-2 border border-slate-200 rounded-xl outline-none text-[10px] font-semibold bg-white text-slate-800"
                              />
                            </div>
                          </div>

                          <div className="space-y-1 text-[10px]">
                            <label className="font-extrabold text-slate-600 block">Chu Kỳ Kinh Nguyệt Thường Gặp (ngày):</label>
                            <input
                              type="number"
                              min={20}
                              max={45}
                              value={notPregnantCycleLength}
                              onChange={(e) => setNotPregnantCycleLength(Number(e.target.value))}
                              className="w-full p-2 border border-slate-200 rounded-xl outline-none text-[10px] font-semibold bg-white text-slate-800"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const startDay = new Date(notPregnantStart);
                                if (!isNaN(startDay.getTime())) {
                                  const endDay = new Date(startDay.getTime() + (notPregnantPeriodDays - 1) * 24 * 3600 * 1000);
                                  const newLog = {
                                    id: `log-${Date.now()}`,
                                    startDate: notPregnantStart,
                                    periodDays: notPregnantPeriodDays,
                                    cycleLength: notPregnantCycleLength
                                  };
                                  const updatedLogs = [newLog, ...menstrualLogs];
                                  setMenstrualLogs(updatedLogs);
                                  localStorage.setItem("babicare_menstrual_logs", JSON.stringify(updatedLogs));
                                  setPregnancyReportState("none");
                                  alert("Lập lịch thụ tinh mới thành công! Sơ đồ thụ thai 3 tháng của mẹ đã được AI thiết lập lại tối ưu tuyệt đối!");
                                }
                              }}
                              className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-extrabold text-[10px] rounded-xl hover:opacity-95 transition-all cursor-pointer text-center"
                            >
                              📅 CẬP NHẬT KỲ KINH MỚI & AI ĐỊNH VỊ
                            </button>
                            <button
                              onClick={() => setPregnancyReportState("none")}
                              className="px-2.5 border border-slate-200 text-slate-500 text-[10px] rounded-xl font-bold hover:bg-slate-50 transition-all cursor-pointer"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {pregnancyReportState === "celebrate_modal" && (
                      <div className="bg-gradient-to-br from-[#ffe4e6] via-[#fff1f2] to-[#fecdd3] rounded-[32px] p-5 border-2 border-rose-100/80 overflow-hidden text-slate-800 animate-fade-in space-y-4">
                        <div className="text-center space-y-4 relative z-10 select-none">
                          <div className="flex justify-center gap-1.5 text-2xl animate-bounce">
                            <span>🎉</span><span>👶</span><span>🌟</span><span>🍼</span><span>💖</span><span>👼</span><span>🎉</span>
                          </div>

                          <h3 className="text-base sm:text-lg font-black text-rose-700 tracking-tight leading-snug uppercase">
                            VỠ ÒA HẠNH PHÚC! <br />
                            CHÚC MỪNG MẸ BẦU ĐÃ MANG THAI THÀNH CÔNG! 👼❤️
                          </h3>

                          <p className="text-[10.5px] leading-relaxed text-slate-655 font-bold max-w-sm mx-auto">
                            Kể từ khoảnh khắc diệu kỳ này, một mầm sống linh thiêng bé nhỏ đang bắt đầu thành hình bên trong cơ thể mẹ. Hãy để BaBiCare AI chăm chút từng tuần thai hoàn hảo nhất cho mẹ!
                          </p>

                          {/* Calculations and Data display */}
                          <div className="bg-white/95 rounded-2xl p-4 border border-rose-100/80 shadow-3xs text-left max-w-md mx-auto space-y-2">
                            <div className="flex items-center gap-2 border-b border-rose-100 pb-1.5">
                              <span className="text-sm">📅</span>
                              <span className="text-[9px] font-black text-rose-800 uppercase">HỆ THỐNG PHÂN TÍCH SẢN KHOA AI (LMP)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-[10.5px] leading-relaxed">
                              <div>
                                <strong className="text-slate-505 font-bold block text-[9px] uppercase">Ngày Kinh Cuối:</strong>
                                <span className="font-extrabold text-slate-800 text-[11px]">{lmpInputDate ? new Date(lmpInputDate).toLocaleDateString("vi-VN") : ""}</span>
                              </div>
                              <div>
                                <strong className="text-slate-505 font-bold block text-[9px] uppercase">Ngày Dự Sinh (Dự kiến):</strong>
                                <span className="font-extrabold text-rose-600 text-[11px]">{lmpInputDate ? new Date(new Date(lmpInputDate).getTime() + 280 * 24 * 3600 * 1000).toLocaleDateString("vi-VN") : ""}</span>
                              </div>
                              <div>
                                <strong className="text-slate-505 font-bold block text-[9px] uppercase">Tuổi Thai Hiện Tại:</strong>
                                <span className="font-extrabold text-rose-600 text-[11px]">
                                  {(() => {
                                    if (!lmpInputDate) return "4 Tuần 2 Ngày";
                                    const diff = new Date().getTime() - new Date(lmpInputDate).getTime();
                                    const days = Math.max(0, Math.floor(diff / (24 * 3600 * 1000)));
                                    return `${Math.floor(days / 7)} Tuần ${days % 7} Ngày`;
                                  })()}
                                </span>
                              </div>
                              <div>
                                <strong className="text-slate-550 font-bold block text-[9px] uppercase">Tam Cá Nguyệt:</strong>
                                <span className="font-extrabold text-pink-600 text-[11px]">Hành Trình Tam Cá Nguyệt I</span>
                              </div>
                            </div>
                          </div>

                          {/* 10 LỜI KHUYÊN MẪU MỰC CHO MẸ (MỚI MANG THAI) */}
                          <div className="text-left space-y-2.5 bg-white/60 p-4 rounded-[22px] border border-rose-100/60 shadow-3xs text-[10px]">
                            <span className="text-[11px] font-black text-slate-800 uppercase pb-1.5 border-b border-rose-500/15 block text-center tracking-normal">
                              ⛑️ 10 LỜI KHUYÊN VÀNG KHI MỚI BIẾT MANG THAI (3 THÁNG ĐẦU)
                            </span>
                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 text-slate-750 leading-normal scrollbar-thin">
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">1. 💊 Bổ sung Folic Acid (400 - 650mcg):</span>
                                <span>Uống ngay mỗi ngày sản phẩm sắt kèm axit folic bồi bổ để ngăn rủi ro dị tật cấu trúc ống thần kinh trước tuần thứ 7 của thai kỳ.</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">2. 📅 Đi khám mốc sớm (Tuần 5 - 8):</span>
                                <span>Đặt lịch hẹn siêu âm để bác sĩ tư vấn chuyên môn và xác định vị trí túi thai đã di chuyển vào trong tử cung làm tổ ổn định chưa.</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">3. 🛑 Tuyệt đối không tự ý dùng thuốc:</span>
                                <span>Không được tự mua dược chất trị ho, cảm hay uống kháng sinh bừa bãi khi chưa nhận chỉ định của bác sĩ chuyên khoa sản.</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">4. 🥗 Ăn chín uống sôi bồi dưỡng:</span>
                                <span>Tuyệt đối tránh ăn các loại hải sản sống (gỏi sushi), rau sống chưa rửa sạch hoàn toàn, phô mai chưa thanh trùng tránh vi khuẩn Listeria gây lưu thai.</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">5. 🚭 Tuyệt đối từ bỏ chất kích thích:</span>
                                <span>Cấm khói thuốc lá, từ bỏ hoàn toàn rượu bia, trà sâm hay cà phê liều cao có thể gây sảy thai sớm.</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">6. 🛌 Ngủ sâu tối thiểu 8 tiếng:</span>
                                <span>Hormone progesterone tăng cao khiến mẹ mệt ngủ rã rời, hãy ngủ sâu và không làm việc chân tay mang vác nặng nhọc xốc xếch.</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">7. 💧 Uống thật nhiều nước ấm:</span>
                                <span>Bổ sung 2.5 - 3 lít nước ấm hằng ngày tránh suy kiệt mệt mỏi, hỗ trợ gia tăng thể tích máu bơm đều đặn nuôi nhau thai.</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">8. 🩸 Chủ động quan sát âm đạo:</span>
                                <span>Mới mang thai có thể ra vài vệt máu báo thai màu hồng/nâu nhẹ. Nhưng nếu phát hiện chảy máu đỏ sẫm hay đau hông lâm râm, mẹ hãy lập tức đến cơ sở khám ngay.</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">9. 🧘 Giữ tâm thế bình thản:</span>
                                <span>Mẹ cười tươi và hít sâu thở chậm chính là phương thức Thai Giáo Cảm xúc tốt nhất, dòng máu yên bình kích thích trí óc con thanh thản.</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">10. 🤵 Chồng nâng niu việc nội trợ:</span>
                                <span>Hãy chia sẻ tin vui này đến ông xã ngay! Bố sẽ đảm đương mọi việc nặng nhọc để mẹ nghỉ dưỡng an sinh lành lặn tốt nhất.</span>
                              </div>
                            </div>
                          </div>

                          {/* Ultimate CTA button */}
                          <div className="pt-1 text-center">
                            <button
                              onClick={() => {
                                setMethod("LMP");
                                setLastPeriodDate(lmpInputDate);
                                setMotherPhase("pregnancy");
                                localStorage.setItem("babicare_mother_phase", "pregnancy");

                                const calculatedDueDate = new Date(new Date(lmpInputDate).getTime() + 280 * 24 * 3600 * 1000).toISOString().split("T")[0];
                                setDoctorDueDate(calculatedDueDate);

                                const updatedLogs = [
                                  {
                                    id: `log-${Date.now()}`,
                                    startDate: lmpInputDate,
                                    periodDays: 5,
                                    cycleLength: 28
                                  },
                                  ...menstrualLogs
                                ];
                                setMenstrualLogs(updatedLogs);
                                localStorage.setItem("babicare_menstrual_logs", JSON.stringify(updatedLogs));

                                const dataToSync = {
                                  uid: user?.uid || "demo_user",
                                  email: user?.email || "demo@babicare.vn",
                                  phase: "pregnancy",
                                  motherName,
                                  motherPhone,
                                  motherEmail: motherEmailState,
                                  motherAddress,
                                  motherBirthdate,
                                  motherAge,
                                  weightBefore,
                                  heightBefore,
                                  notes,
                                  method: "LMP",
                                  lastPeriodDate: lmpInputDate,
                                  doctorDueDate: calculatedDueDate,
                                  maternalWeeklyWeights,
                                  prePregChecklist,
                                  babyNotes,
                                  menstrualLogs: updatedLogs,
                                  ultrasoundInputs
                                };
                                saveUserData(dataToSync);

                                // Perform calculation immediately to sync gestation week count and progress
                                performCalculation("LMP", lmpInputDate, calculatedDueDate);

                                setActiveTab("info");
                                setPregnancyReportState("none");
                                
                                const diff = new Date().getTime() - new Date(lmpInputDate).getTime();
                                const days = Math.max(0, Math.floor(diff / (24 * 3600 * 1000)));
                                let calcWeek = Math.floor(days / 7);
                                if (calcWeek < 1) calcWeek = 1;
                                if (calcWeek > 40) calcWeek = 40;
                                setSelectedWeek(calcWeek);
                              }}
                              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-[11px] rounded-2xl shadow-lg cursor-pointer hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 border border-rose-300/40"
                            >
                              🌟 HOẠT HÓA CHU TRÌNH - BẮT ĐẦU THEO DÕI THAI KỲ NGAY
                            </button>
                            <p className="text-[9px] text-slate-500 mt-1.5 italic">
                              Nhấn nút trên để hệ quản trị AI kích hoạt giao diện thai kỳ 40 tuần của BaBiCare đồng hành cùng mẹ và bé yêu nhé!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

                  {menstrualSubTab === "prePregnancy" && (
                    <div className="space-y-4 animate-fade-in pb-12">
                      
                      {/* Top Header Card for Pre-pregnancy */}
                      <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-3xl border border-rose-100/50 shadow-xs">
                        <span className="text-[8px] uppercase font-black bg-rose-500 text-white px-2.5 py-1 rounded-xl">
                          Kiến Thức Chuẩn Bị Trước Khi Mang Thai
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 mt-2">
                          🌱 Hành Trang Vàng Tiền Thai Sản Cho Ba Mẹ
                        </h3>
                        <p className="text-[9.5px] text-slate-500 mt-1 leading-normal font-semibold">
                          Sự chuẩn bị khoa học từ 3 - 6 tháng đầu là chìa khóa tháo gỡ hoàn toàn các nguy cơ dị tật bẩm sinh, tối ưu hóa chất lượng mầm sống và mang lại sự an tâm tuyệt đối cho hai vợ chồng!
                        </p>
                      </div>

                      {/* Interactive Progress Indicator */}
                      {(() => {
                        const checkedCount = Object.values(prePregChecklist).filter(Boolean).length;
                        const totalCount = Object.keys(prePregChecklist).length;
                        const percent = Math.round((checkedCount / totalCount) * 100);
                        return (
                          <div className="bg-white p-4.5 rounded-3xl border border-pink-100 shadow-xs space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase text-pink-600 tracking-wider">
                                Tiến độ chuẩn bị của hai vợ chồng
                              </span>
                              <span className="text-[11px] font-extrabold text-slate-750 bg-pink-50 px-2.5 py-0.5 rounded-full">
                                Đã hoàn thành: {checkedCount}/{totalCount} ({percent}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                              <div 
                                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-300 rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}

                      {/* 4 Core preparation guides requested by user */}
                      <div className="space-y-3.5">
                        {/* 1. Vaccine */}
                        <div className="bg-white p-4.5 rounded-3xl border border-rose-100 shadow-xs space-y-3.5">
                          <div className="flex items-center gap-2 pb-2 border-b border-rose-50">
                            <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-black shadow-2xs">🧪</span>
                            <div>
                              <h4 className="text-[11px] font-extrabold text-slate-800">
                                Tiêm ngừa vắc xin tiền hôn nhân cả cha và mẹ
                              </h4>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Lá chắn miễn dịch phòng chống dị tật bẩm sinh cấp thiết</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                            <div className="p-3 rounded-2xl bg-teal-50/40 border border-teal-100/50 space-y-2">
                              <span className="font-bold text-teal-850 block">👩 Dành cho Mẹ (Trước bầu từ 1 - 3 tháng):</span>
                              <ul className="space-y-1 text-slate-600 font-semibold list-disc pl-3.5 leading-relaxed">
                                <li><strong>Sởi - Quai bị - Rubella (MMR):</strong> Đề phòng nhiễm độc dị tật tim bẩm sinh, đục thủy tinh thể, mất thính lực.</li>
                                <li><strong>Thủy đậu:</strong> Tránh hội chứng thủy đậu bẩm sinh gây sẹo da và teo chi.</li>
                                <li><strong>Cúm học đường:</strong> Tránh sốt cao dọa sảy thai thời kỳ đầu nhạy cảm.</li>
                                <li><strong>Viêm gan B:</strong> Cản đường truyền nhiễm virus trực tiếp sang em bé.</li>
                                <li><strong>Vắc xin HPV (Ngừa Ung Thư Cổ Tử Cung):</strong> Khuyên mẹ nên hoàn thành các mũi tiêm phòng HPV tối thiểu 1 tháng trước khi mang thai.</li>
                              </ul>
                            </div>
                            
                            <div className="p-3 rounded-2xl bg-blue-50/30 border border-blue-100/50 space-y-2">
                              <span className="font-bold text-blue-850 block">👨 Dành cho Cha (Chống lây nhiễm cộng đồng):</span>
                              <ul className="space-y-1 text-slate-600 font-semibold list-disc pl-3.5 leading-relaxed">
                                <li><strong>Cúm & Thủy đậu:</strong> Ngăn ngừa mang mầm bệnh về lây nhiễm cho vợ đang mang thai.</li>
                                <li><strong>Viêm gan B & Ho gà:</strong> Tạo dựng môi trường gia dịch vô trùng sạch khuẩn của cả cha và mẹ.</li>
                              </ul>
                            </div>
                          </div>

                          {/* Vaccine Interactive checklist items */}
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.vaccine_mmr}
                                onChange={() => toggleChecklistItem("vaccine_mmr")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Mẹ đã hoàn tất tiêm vắc xin MMR & Thủy đậu (Hoặc có kháng thể đầy đủ trước thai kỳ)
                              </div>
                            </label>
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.vaccine_hpv}
                                onChange={() => toggleChecklistItem("vaccine_hpv")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Mẹ đã tiêm vắc xin HPV đầy đủ trước khi thực hiện kế hoạch thả bầu
                              </div>
                            </label>
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.vaccine_flu}
                                onChange={() => toggleChecklistItem("vaccine_flu")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Cả cha và mẹ đã tiến hành tiêm phòng Cúm mùa định kỳ trước thời gian dự tính rụng trứng
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* 2. Dinh duong */}
                        <div className="bg-white p-4.5 rounded-3xl border border-rose-100 shadow-xs space-y-3.5">
                          <div className="flex items-center gap-2 pb-2 border-b border-rose-50">
                            <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-black shadow-2xs">💊</span>
                            <div>
                              <h4 className="text-[11px] font-extrabold text-slate-800">
                                Các dinh dưỡng như Axit Folic, DHA tiền thai sản cho mẹ
                              </h4>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Xây dựng kho chứa vi chất thiết yếu để nuôi dưỡng bào thai từ phôi hạt</p>
                            </div>
                          </div>

                          <div className="space-y-3 text-[10px] text-slate-600 font-semibold leading-relaxed">
                            {/* Axit Folic */}
                            <div className="bg-amber-50/20 p-3.5 rounded-2xl border border-amber-100/40 flex gap-3 items-start">
                              <div className="w-9 h-9 shrink-0 bg-amber-100 hover:scale-105 transition-transform rounded-xl flex items-center justify-center text-lg shadow-2xs font-bold text-amber-700">🥦</div>
                              <div className="space-y-1">
                                <span className="font-extrabold text-amber-900 text-[11px] block">🥦 Axit Folic (Vitamin B9):</span>
                                <p className="text-slate-650 text-[10px]">
                                  Cần nạp đều đặn <strong className="text-amber-955 font-extrabold bg-amber-100/50 px-1 rounded">400mcg - 800mcg/ngày</strong> từ <strong className="text-amber-955">ít nhất 3 tháng trước thai kỳ, trong suốt thai kỳ, cho đến khi sinh</strong>. Ống thần kinh của bé đóng kín vô cùng sớm (ngày 21-28 thai kì); Folic giúp tránh tới <strong className="text-rose-600 font-extrabold">70% dị tật ống thần kinh</strong> nguy hiểm.
                                </p>
                              </div>
                            </div>
                            
                            {/* DHA & EPA */}
                            <div className="bg-pink-50/15 p-3.5 rounded-2xl border border-pink-100/30 flex gap-3 items-start">
                              <div className="w-9 h-9 shrink-0 bg-pink-100 hover:scale-105 transition-transform rounded-xl flex items-center justify-center text-lg shadow-2xs font-bold text-pink-700">🐟</div>
                              <div className="space-y-1">
                                <span className="font-extrabold text-pink-900 text-[11px] block">🐟 DHA & EPA tiền sản:</span>
                                <p className="text-slate-650 text-[10px]">
                                  Khuyên dùng <strong className="text-pink-950 font-extrabold bg-pink-100/50 px-1 rounded">bổ sung từ trước khi mang thai 3 tháng</strong>, sau đó tạm nghỉ đoạn ngắn ban đầu và <strong className="text-pink-955 bg-pink-50 px-1 rounded">bắt đầu dùng lại sau khi mang thai tháng thứ 3</strong> (dùng tích cực trong suốt <strong className="text-pink-955">tam cá nguyệt thứ 2 và 3</strong>). Hàm lượng khuyến nghị tối thiểu 200mg DHA/ngày kiến tạo cấu trúc mô não bộ, tạo tiền đề tối hảo cho thùy não và giác mạc sơ khởi của phôi thai phát triển nhảy vọt về sau.
                                </p>
                              </div>
                            </div>

                            {/* Sắt & Canxi */}
                            <div className="bg-emerald-50/15 p-3.5 rounded-2xl border border-emerald-100/30 flex gap-3 items-start">
                              <div className="w-9 h-9 shrink-0 bg-emerald-100 hover:scale-105 transition-transform rounded-xl flex items-center justify-center text-lg shadow-2xs font-bold text-emerald-700">🥩</div>
                              <div className="space-y-1">
                                <span className="font-extrabold text-emerald-850 text-[11px] block">🥩 Sắt & Canxi tự nhiên:</span>
                                <p className="text-slate-650 text-[10px]">
                                  Chủ động <strong className="text-emerald-955 font-extrabold bg-emerald-100/50 px-1 rounded">bổ sung từ trước khi mang thai 3 tháng</strong>, sau đó <strong className="text-emerald-955 bg-emerald-50 px-1 rounded">bắt đầu dùng lại sau khi mang thai đến tháng thứ 3</strong> (dùng đều đặn trong suốt <strong className="text-emerald-955">tam cá nguyệt thứ 2 và 3</strong>). <strong>Sắt</strong> giúp đảm bảo dự trữ huyết sắc tố dồi dào, phòng thiếu máu thai kỳ. <strong>Canxi</strong> tích lũy mật độ xương của mẹ để tránh hiện tượng rút ngược khoáng xương khi bé yêu phát triển khung xương.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.folic_acid}
                                onChange={() => toggleChecklistItem("folic_acid")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Mẹ đã bắt đầu uống viên Vitamin tổng hợp bổ sung 400mcg - 800mcg Axit Folic mỗi ngày
                              </div>
                            </label>
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.dha_omega}
                                onChange={() => toggleChecklistItem("dha_omega")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Bổ sung dầu cá tinh khiết chất lượng cao chứa DHA/EPA sẵn sàng nuôi dưỡng trí não của bé
                              </div>
                            </label>
                          </div>

                          {/* Affiliate Recommendation for Nutrition */}
                          <div className="pt-3.5 border-t border-rose-50/60 mt-2">
                            <span className="text-[7.5px] uppercase font-black bg-orange-50 text-[#ee4d2d] px-2 py-0.5 rounded-md border border-orange-100">
                              Khuyên Dùng Tiền Thai Sản
                            </span>
                            <h5 className="font-extrabold text-[10px] text-slate-800 mt-1 mb-2 flex items-center gap-1">
                              🛒 Sản Phẩm Dinh Dưỡng Khuyên Dùng Cho Mẹ
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                              {prePregNutriProducts.map((prod) => (
                                <div 
                                  key={prod.id} 
                                  className="bg-slate-50/50 rounded-2xl p-2.5 border border-rose-50/60 flex flex-col relative transition-all duration-155 hover:bg-white"
                                >
                                  {/* Image Box */}
                                  <div className="w-full aspect-square bg-white rounded-xl overflow-hidden relative mb-1.5 group">
                                    <img 
                                      src={prod.imageUrl} 
                                      alt={prod.name} 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                    {/* Edit Button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProduct(prod);
                                        setIsAffiliateEditModalOpen(true);
                                      }}
                                      className="absolute top-1 right-1 bg-white/95 hover:bg-rose-50 text-slate-650 hover:text-rose-600 w-6 h-6 rounded-full shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-90 z-20"
                                      title="Thay đổi sản phẩm"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                  </div>

                                  {/* Product Name */}
                                  <h6 className="text-[#ee4d2d] font-bold text-[9px] leading-snug line-clamp-2 mb-1 min-h-[26px]">
                                    {prod.name}
                                  </h6>

                                  {/* Price */}
                                  <div className="flex items-center justify-between mt-auto">
                                    <span className="text-black font-black text-[10px]">
                                      {prod.price}
                                    </span>
                                  </div>

                                  {/* Buy Button */}
                                  <a 
                                    href={prod.affiliateUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="mt-1.5 bg-gradient-to-r from-orange-500 to-[#ee4d2d] text-white font-black py-1 px-2 rounded-xl text-[8px] text-center flex items-center justify-center gap-1 active:scale-95 transition-transform"
                                  >
                                    <ShoppingBag className="w-2.5 h-2.5" />
                                    <span>Mua ngay</span>
                                    <ExternalLink className="w-2 h-2 opacity-80" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* 3. Xet nghiem */}
                        <div className="bg-white p-4.5 rounded-3xl border border-rose-100 shadow-xs space-y-3.5">
                          <div className="flex items-center gap-2 pb-2 border-b border-rose-50">
                            <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black shadow-2xs">🩺</span>
                            <div>
                              <h4 className="text-[11px] font-extrabold text-slate-800">
                                Các bệnh cần xét nghiệm tiền thai sản cả cha và mẹ
                              </h4>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Tầm soát hệ thống di truyền học và sức khỏe nam khoa - phụ khoa chủ động</p>
                            </div>
                          </div>

                          <div className="space-y-3 text-[10px] text-slate-600 font-semibold leading-relaxed">
                            {/* Test 1 */}
                            <div className="p-3.5 bg-indigo-50/20 rounded-2xl border border-indigo-100/30 flex gap-3 items-start">
                              <div className="w-9 h-9 shrink-0 bg-indigo-100/80 rounded-xl flex items-center justify-center text-lg shadow-2xs text-indigo-700 font-bold">🩸</div>
                              <div className="space-y-1">
                                <h5 className="font-extrabold text-indigo-900 text-[11px]">🩸 1. Tầm soát di truyền & Thalassemia:</h5>
                                <p className="text-slate-650">
                                  <strong>Thalassemia (Tan máu bẩm sinh):</strong> Kiểm tra kích thước hồng cầu qua xét nghiệm tổng phân tích tế bào máu. Nếu cả cha và mẹ đều mang gen lặn biến dị, con sinh ra có 25% nguy cơ bị huyết tán nặng.
                                </p>
                              </div>
                            </div>

                            {/* Test 2 */}
                            <div className="p-3.5 bg-rose-50/20 rounded-2xl border border-rose-100/30 flex gap-3 items-start">
                              <div className="w-9 h-9 shrink-0 bg-rose-100/80 rounded-xl flex items-center justify-center text-lg shadow-2xs text-rose-700 font-bold">🦠</div>
                              <div className="space-y-1">
                                <h5 className="font-extrabold text-rose-900 text-[11px]">🦠 2. Xét nghiệm bệnh truyền nhiễm nguy cấp:</h5>
                                <p className="text-slate-650">
                                  Sàng lọc HIV, Giang mai (Syphilis), Viêm gan B, Viêm gan C, virus Rubella IgG & IgM. Điều này giúp loại trừ biến chứng lây dọc từ tử cung mẹ sang bào thai.
                                </p>
                              </div>
                            </div>

                            {/* Test 3 */}
                            <div className="p-3.5 bg-amber-50/20 rounded-2xl border border-amber-105/30 flex gap-3 items-start">
                              <div className="w-9 h-9 shrink-0 bg-amber-100/80 rounded-xl flex items-center justify-center text-lg shadow-2xs text-amber-700 font-bold">🧬</div>
                              <div className="space-y-1">
                                <h5 className="font-extrabold text-amber-900 text-[11px]">🧬 3. Nhóm máu & Bất đồng nhóm máu hệ Rh:</h5>
                                <p className="text-slate-650">
                                  Nhận diện mẹ có mang hệ máu hiếm Rh (-) hay Rh (+) không. Nhờ đó chủ động phương án tiêm phòng kháng thể chống bất đồng nhóm máu của mẹ đối với tế bào hồng cầu thai nhi ở thai kì sau.
                                </p>
                              </div>
                            </div>

                            {/* Test 4 */}
                            <div className="p-3.5 bg-emerald-50/20 rounded-2xl border border-emerald-100/30 flex gap-3 items-start">
                              <div className="w-9 h-9 shrink-0 bg-emerald-100/80 rounded-xl flex items-center justify-center text-lg shadow-2xs text-emerald-700 font-bold">🔬</div>
                              <div className="space-y-1">
                                <h5 className="font-extrabold text-emerald-950 text-[11px]">🔬 4. Khảo sát chức năng sinh học sinh sản:</h5>
                                <p className="text-slate-650">
                                  Kiểm tra tinh dịch đồ (đối với bố để xem mật độ bơi nhanh tinh binh), nội tiết tố và AMH buồng trứng (đối với mẹ) giúp phát hiện sớm hiếm muộn, tháo gỡ tắc nang noãn vòi trứng kịp thời.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.genetic_screening}
                                onChange={() => toggleChecklistItem("genetic_screening")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Hai vợ chồng đã làm xét nghiệm Thalassemia sàng lọc tan máu bẩm sinh lành mạnh
                              </div>
                            </label>
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.blood_test}
                                onChange={() => toggleChecklistItem("blood_test")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Đã kiểm tra nhóm máu Rh, Rubella, viêm gan siêu vi và các bệnh lây truyền tiền thụ tinh
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* 4. Tam ly */}
                        <div className="bg-white p-4.5 rounded-3xl border border-rose-100 shadow-xs space-y-3.5">
                          <div className="flex items-center gap-2 pb-2 border-b border-rose-50">
                            <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 text-xs flex items-center justify-center font-black shadow-2xs">🧘</span>
                            <div>
                              <h4 className="text-[11px] font-extrabold text-slate-800">
                                Chuẩn bị tâm lý, kiến thức vững tiền thai sản
                              </h4>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Khơi dậy dòng chảy năng lượng thảnh thơi, ổn định nhịp nội tiết hạnh phúc</p>
                            </div>
                          </div>

                          <div className="space-y-3 text-[10px] text-slate-600 leading-relaxed font-semibold">
                            <div className="flex gap-2.5 bg-pink-50/20 p-3 rounded-2xl border border-pink-100/40">
                              <span className="text-sm shrink-0">🍀</span>
                              <p>
                                <strong>Vui vẻ thư thái, tránh xa căng thẳng:</strong> Stress kinh niên phóng thích hormone Cortisol gây phong tỏa thùy trước tuyến yên, ảnh hưởng trực tiếp đến chu kỳ rụng trứng đều đặn ở vợ và suy hạ đáng kể lượng testosterone, làm suy giảm chất lượng tinh dịch đồ của người chồng.
                              </p>
                            </div>

                            <div className="flex gap-2.5 bg-amber-50/20 p-3 rounded-2xl border border-amber-100/40">
                              <span className="text-sm shrink-0">🧭</span>
                              <p>
                                <strong>Xây dựng kỹ năng nuôi dạy trẻ & kế hoạch tài chính vững vàng:</strong> Chủ động thảo luận cùng nhau định hướng nuôi con, thiết lập ngân sách tích lũy thai kì, tiền viện phí sinh, bỉm sữa, khám sức khỏe nhằm giải trừ áp lực vô hình sau này.
                              </p>
                            </div>

                            <div className="flex gap-2.5 bg-emerald-50/20 p-3 rounded-2xl border border-emerald-100/40">
                              <span className="text-sm shrink-0">🛡️</span>
                              <div className="space-y-1.5">
                                <p>
                                  <strong>Tránh xa độc chất & hóa chất làm đẹp:</strong> Kiên quyết nói không với khói thuốc lá thụ động, cồn, chất kích thích. Khuyên mẹ <strong>không sơn móng tay, uốn duỗi tóc, nhuộm tóc</strong> ở giai đoạn sẵn sàng thụ thai để tránh phơi nhiễm hóa chất bay hơi độc hại.
                                </p>
                                <p>
                                  <strong>Đảm bảo thể trạng phòng ngừa ốm sốt:</strong> Giữ ấm cơ thể, tăng sức đề kháng để <strong>đảm bảo sức khỏe trạng thái tốt nhất tránh bệnh sốt - ho - cảm - yếu người trước khi thả bầu</strong>. Việc sốt cao đột ngột trong thai kì sớm có thể ảnh hưởng đến quá trình phân chia phôi đợt đầu.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.stress_relief}
                                onChange={() => toggleChecklistItem("stress_relief")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Hai vợ chồng duy trì một tâm lý thoải mái, ngủ đủ giấc và cùng thấu hiểu giải quyết căng thẳng
                              </div>
                            </label>
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.no_toxins}
                                onChange={() => toggleChecklistItem("no_toxins")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Mẹ không sơn móng tay, uốn duỗi nhuộm tóc, kiêng cồn/thuốc lá và đảm bảo không bị ốm ho cảm sốt trước thả bầu
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* 5. Canh trứng bằng que thử */}
                        <div className="bg-white p-4.5 rounded-3xl border border-rose-100 shadow-xs space-y-3.5">
                          <div className="flex items-center gap-2 pb-2 border-b border-rose-50">
                            <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-750 text-xs flex items-center justify-center font-black shadow-2xs">🎯</span>
                            <div>
                              <h4 className="text-[11px] font-extrabold text-slate-800">
                                Hướng dẫn canh trứng rụng bằng que thử LH
                              </h4>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Cách tự xác định thời điểm vàng để thụ thai có tỷ lệ thành công cao nhất</p>
                            </div>
                          </div>

                          <div className="space-y-3 text-[10px] text-slate-600 font-semibold leading-relaxed">
                            {/* Nguyên lý */}
                            <div className="p-3.5 bg-rose-50/20 rounded-2xl border border-rose-100/30 flex gap-3 items-start">
                              <span className="text-lg shrink-0">🔬</span>
                              <div className="space-y-1">
                                <span className="font-extrabold text-rose-900 text-[11px] block">Nguyên lý hoạt động của que rụng trứng LH:</span>
                                <p>
                                  Que thử rụng trứng giúp phát hiện sự gia tăng nồng độ hormone <strong>Luteinizing Hormone (LH)</strong> trong nước tiểu. Nồng độ LH sẽ tăng vọt đạt đỉnh trước khi trứng rụng từ <strong>24 - 36 giờ</strong>. Đây chính là khoảng thời gian rụng trứng sắp tới để ba mẹ canh thả bầu chính xác!
                                </p>
                              </div>
                            </div>

                            {/* Quy trình */}
                            <div className="p-3.5 bg-amber-50/20 rounded-2xl border border-amber-100/30 flex gap-3 items-start">
                              <span className="text-lg shrink-0">⏱️</span>
                              <div className="space-y-1.5 w-full">
                                <span className="font-extrabold text-amber-900 text-[11px] block">⏱️ Quy trình thử trứng bằng que LH chuẩn 3 bước:</span>
                                <div className="space-y-1.5 text-slate-600 text-[9.5px]">
                                  <p>
                                    <strong className="text-amber-955 font-extrabold block">Bước ① - Thời điểm thử lý tưởng:</strong> Không dùng mẫu nước tiểu đầu tiên vào buổi sáng. Hãy thử từ <strong>10:00 sáng đến 20:00 tối</strong> hàng ngày.
                                  </p>
                                  <p>
                                    <strong className="text-amber-955 font-extrabold block">Bước ② - Thu mẫu nước tiểu chuẩn:</strong> Kiêng/hạn chế uống nhiều nước trước khi test khoảng 2 tiếng nhằm tránh làm loãng hormone LH trong mẫu nước tiểu.
                                  </p>
                                  <p>
                                    <strong className="text-amber-955 font-extrabold block">Bước ③ - Thực hiện bước test:</strong> Nhúng thẳng đứng que vào nước tiểu (dưới vạch nét Max) trong 5s. Đặt que nằm ngang trên mặt phẳng và đọc kết quả sau 5 - 10 phút.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Xem vach chi thi */}
                            <div className="p-3.5 bg-blue-50/20 rounded-2xl border border-blue-105/30 space-y-2">
                              <span className="font-bold text-blue-900 block flex items-center gap-1">📊 Cách đọc vạch chỉ thị trên que rụng trứng LH:</span>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-blue-100/50">
                                  <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-extrabold text-slate-700 block">1 vạch hoặc vạch test nhạt hơn hẳn vạch chứng:</span>
                                    <p className="text-[9px] text-slate-500 font-semibold leading-normal">Chưa tới ngày rụng trứng</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 p-2.5 bg-rose-50 rounded-xl border border-rose-150">
                                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-extrabold text-rose-600 block">2 vạch đỏ đậm ngang nhau hoặc vạch test đậm hơn (Đỉnh LH):</span>
                                    <p className="text-[9px] text-slate-600 font-semibold leading-normal mt-0.5">Sắp rụng trứng. Trứng sẽ rụng trong vòng 24 - 36 tiếng tới. Đây là thời kỳ thụ thai rực rỡ nhất để bố mẹ tích cực gần gũi!</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-blue-100/50">
                                  <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-extrabold text-slate-700 block">2 vạch nhạt dần đi sau chuỗi ngày đậm:</span>
                                    <p className="text-[9px] text-slate-500 font-semibold leading-normal">Trứng đã rụng</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.test_lh_egg}
                                onChange={() => toggleChecklistItem("test_lh_egg")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Đã nắm chắc cách theo dõi ngày rụng trứng qua que thử nồng độ LH để tối ưu hóa thời gian thả bầu
                              </div>
                            </label>
                          </div>

                          {/* Affiliate Recommendation for Ovulation */}
                          <div className="pt-3.5 border-t border-rose-50/60 mt-2">
                            <span className="text-[7.5px] uppercase font-black bg-orange-50 text-[#ee4d2d] px-2 py-0.5 rounded-md border border-orange-100">
                              Khuyên Dùng Tiền Thai Sản
                            </span>
                            <h5 className="font-extrabold text-[10px] text-slate-800 mt-1 mb-2 flex items-center gap-1">
                              🛒 Que thử rụng trứng LH thông dụng
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                              {ovulationProducts.map((prod) => (
                                <div 
                                  key={prod.id} 
                                  className="bg-slate-50/50 rounded-2xl p-2.5 border border-rose-50/60 flex flex-col relative transition-all duration-155 hover:bg-white"
                                >
                                  {/* Image Box */}
                                  <div className="w-full aspect-square bg-white rounded-xl overflow-hidden relative mb-1.5 group">
                                    <img 
                                      src={prod.imageUrl} 
                                      alt={prod.name} 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                    {/* Edit Button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProduct(prod);
                                        setIsAffiliateEditModalOpen(true);
                                      }}
                                      className="absolute top-1 right-1 bg-white/95 hover:bg-rose-50 text-slate-650 hover:text-rose-600 w-6 h-6 rounded-full shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-90 z-20"
                                      title="Thay đổi sản phẩm"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                  </div>

                                  {/* Product Name */}
                                  <h6 className="text-[#ee4d2d] font-bold text-[9px] leading-snug line-clamp-2 mb-1 min-h-[26px]">
                                    {prod.name}
                                  </h6>

                                  {/* Price */}
                                  <div className="flex items-center justify-between mt-auto">
                                    <span className="text-black font-black text-[10px]">
                                      {prod.price}
                                    </span>
                                  </div>

                                  {/* Buy Button */}
                                  <a 
                                    href={prod.affiliateUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="mt-1.5 bg-gradient-to-r from-orange-500 to-[#ee4d2d] text-white font-black py-1 px-2 rounded-xl text-[8px] text-center flex items-center justify-center gap-1 active:scale-95 transition-transform"
                                  >
                                    <ShoppingBag className="w-2.5 h-2.5" />
                                    <span>Mua ngay</span>
                                    <ExternalLink className="w-2 h-2 opacity-80" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* 6. Kiến thức nhận biết khi mang thai */}
                        <div className="bg-white p-4.5 rounded-3xl border border-rose-100 shadow-xs space-y-3.5">
                          <div className="flex items-center gap-2 pb-2 border-b border-rose-50">
                            <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 text-xs flex items-center justify-center font-black shadow-2xs">🤰</span>
                            <div>
                              <h4 className="text-[11px] font-extrabold text-slate-800">
                                Hướng dẫn nhận biết có thai sớm sau khi thả bầu
                              </h4>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Dấu hiệu phản ứng sinh học của cơ thể người mẹ và phương pháp thử hCG chuẩn</p>
                            </div>
                          </div>

                          <div className="space-y-3 text-[10px] text-slate-600 font-semibold leading-relaxed">
                            {/* Lam sang */}
                            <div className="p-3.5 bg-rose-50/15 rounded-2xl border border-rose-100/30 flex gap-3 items-start flex-col sm:flex-row">
                              <span className="text-lg shrink-0">🌟</span>
                              <div className="space-y-1.5 w-full">
                                <span className="font-extrabold text-rose-900 text-[11px] block">🌟 Biểu hiện lâm sàng trên cơ thể người mẹ (1 - 4 tuần đầu):</span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[9.5px]">
                                  <div className="bg-white/60 p-2 rounded-xl border border-rose-50 space-y-0.5">
                                    <strong className="text-rose-950 font-bold block">🚨 Trễ kinh (Chậm kinh):</strong>
                                    <span className="text-slate-550 leading-normal block">Biểu hiện cổ điển và chính xác nhất sau khi phôi vững vàng làm tổ thành công, cơ thể phát tín hiệu duy trì niêm mạc tử cung cổ tử cung.</span>
                                  </div>
                                  <div className="bg-white/60 p-2 rounded-xl border border-rose-50 space-y-0.5">
                                    <strong className="text-rose-950 font-bold block">🩸 Máu báo thai (Máu cấy làm tổ):</strong>
                                    <span className="text-slate-550 leading-normal block">Vệt máu phớt hồng hay nâu nhạt xuất hiện từ 6 - 12 ngày sau thụ hóa do phôi bào xâm nhập thành phôi mạc làm tổ rỉ nhẹ dịch đỏ.</span>
                                  </div>
                                  <div className="bg-white/60 p-2 rounded-xl border border-rose-50 space-y-0.5">
                                    <strong className="text-rose-950 font-bold block">✨ Căng tức ngực và núm vú sẫm màu:</strong>
                                    <span className="text-slate-550 leading-normal block">Biến đổi hormone estrogen và progesterone đột ngột khiến bầu ngực nhạy cảm, nở nhẹ tuyến sữa sơ sinh.</span>
                                  </div>
                                  <div className="bg-white/60 p-2 rounded-xl border border-rose-50 space-y-0.5">
                                    <strong className="text-rose-950 font-bold block">😪 Mệt mỏi, ngủ gật và rã rời:</strong>
                                    <span className="text-slate-550 leading-normal block">Do cơ thể tập trung năng lượng sản sinh progesterone nuôi phôi tế bào ban đầu. Nhạy cảm mùi vị và buồn nôn nhẹ buổi sáng sớm.</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Phuong phap thu */}
                            <div className="p-3.5 bg-indigo-50/15 rounded-2xl border border-indigo-105/30 flex gap-3 items-start">
                              <span className="text-lg shrink-0">🧪</span>
                              <div className="space-y-1.5">
                                <span className="font-extrabold text-indigo-900 text-[11px] block">🧪 Phương pháp sử dụng que thử thai HCG:</span>
                                <div className="space-y-1.5 text-slate-650 text-[9.5px]">
                                  <p><strong>Hormone hCG:</strong> Là nội tiết tố rau thai ban đầu, được tiết ra sau khi trứng thụ thai bám rễ thành công vào niêm mạc bụng mẹ. Nồng độ này tự động nhân đôi sau mỗi 48 tiếng.</p>
                                  <p><strong>Quy chuẩn kiểm tra que thử hCG:</strong> Thử nước tiểu bằng que thử thai HCG sau khoảng từ <strong>7 đến 14 ngày từ khi quan hệ thả bầu</strong> (hoặc tính từ những ngày đầu kỳ chậm trễ kinh).</p>
                                  <p><strong>Mẹo vàng chuẩn xác:</strong> <strong>Hãy thử vào ngay sáng sớm lúc vừa thức dậy thức giấc</strong>, thời điểm lượng nồng độ hormone hCG đậm đặc tập trung cao nhất trong mẫu nước tiểu giúp tránh hoàn toàn kết quả báo vạch mờ giả!</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/55 border border-slate-150 cursor-pointer transition-colors text-[10px]">
                              <input 
                                type="checkbox"
                                checked={!!prePregChecklist.hcg_pregnant}
                                onChange={() => toggleChecklistItem("hcg_pregnant")}
                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-1 cursor-pointer"
                              />
                              <div className="font-semibold text-slate-700">
                                Hiểu rõ các biến đổi thể chất và phương thức tự kiểm nghiệm que thử thai HCG chính xác tại nhà
                              </div>
                            </label>
                          </div>

                          {/* Affiliate Recommendation for Pregnancy Detection */}
                          <div className="pt-3.5 border-t border-rose-50/60 mt-2">
                            <span className="text-[7.5px] uppercase font-black bg-orange-50 text-[#ee4d2d] px-2 py-0.5 rounded-md border border-orange-100">
                              Khuyên Dùng Tiền Thai Sản
                            </span>
                            <h5 className="font-extrabold text-[10px] text-slate-800 mt-1 mb-2 flex items-center gap-1">
                              🛒 Que Thử Thai HCG & Sản Phẩm Nhận Biết Sớm Cho Mẹ
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                              {pregnancyDetectionProducts.map((prod) => (
                                <div 
                                  key={prod.id} 
                                  className="bg-slate-50/50 rounded-2xl p-2.5 border border-rose-50/60 flex flex-col relative transition-all duration-155 hover:bg-white"
                                >
                                  {/* Image Box */}
                                  <div className="w-full aspect-square bg-white rounded-xl overflow-hidden relative mb-1.5 group">
                                    <img 
                                      src={prod.imageUrl} 
                                      alt={prod.name} 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                    {/* Edit Button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProduct(prod);
                                        setIsAffiliateEditModalOpen(true);
                                      }}
                                      className="absolute top-1 right-1 bg-white/95 hover:bg-rose-50 text-slate-650 hover:text-rose-600 w-6 h-6 rounded-full shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-90 z-20"
                                      title="Thay đổi sản phẩm"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                  </div>

                                  {/* Product Name */}
                                  <h6 className="text-[#ee4d2d] font-bold text-[9px] leading-snug line-clamp-2 mb-1 min-h-[26px]">
                                    {prod.name}
                                  </h6>

                                  {/* Price */}
                                  <div className="flex items-center justify-between mt-auto">
                                    <span className="text-black font-black text-[10px]">
                                      {prod.price}
                                    </span>
                                  </div>

                                  {/* Buy Button */}
                                  <a 
                                    href={prod.affiliateUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="mt-1.5 bg-gradient-to-r from-orange-500 to-[#ee4d2d] text-white font-black py-1 px-2 rounded-xl text-[8px] text-center flex items-center justify-center gap-1 active:scale-95 transition-transform"
                                  >
                                    <ShoppingBag className="w-2.5 h-2.5" />
                                    <span>Mua ngay</span>
                                    <ExternalLink className="w-2 h-2 opacity-80" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Prompt to AI Doctor */}
                      <div className="bg-rose-50/50 p-4.5 rounded-3xl border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mt-2 shadow-2xs">
                        <div className="space-y-1">
                          <h6 className="text-[11px] font-black text-rose-800 flex items-center gap-1 justify-center sm:justify-start">
                            💬 Tư vấn chuẩn bị tiền thai sản cùng Trợ Lý BaBiCare AI?
                          </h6>
                          <p className="text-[9.5px] text-slate-550 font-semibold leading-relaxed">
                            Bác Sĩ BaBiCare AI sẽ phân tích chu kỳ, vắc xin, dinh dưỡng nâng cao và xây dựng thực đơn tối ưu hóa độ dày niêm mạc tử cung cho hai vợ chồng!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChatOpen(true);
                            handleSendMessage("Tôi muốn chuẩn bị mang thai tốt nhất. Hãy tư vấn cho hai vợ chồng lộ trình chi tiết về tiêm phòng, định lượng dinh dưỡng Axit Folic, DHA, các xét nghiệm cần thiết và chuẩn bị tâm lý để đón bé yêu khỏe mạnh.");
                          }}
                          className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[10px] py-2 px-4 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm"
                        >
                          Tư vấn tiền sản ngay 🚀
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              );
            })()}

          </div>

          {/* STICKY GLASS BOTTOM TAB BAR WITH 4 ICONS (Sleek Apple iOS/Material density bar) */}
          <div className="border-t border-rose-100/60 bg-white/95 p-1.5 pb-[calc(env(safe-area-inset-bottom,8px)+6px)] relative z-20 backdrop-blur-md shrink-0 shadow-lg select-none">
            <div className="flex flex-row justify-around items-center w-full max-w-4xl mx-auto gap-1">
              
              {/* Tab 1: Thả Bầu (Rụng Trứng) */}
              <button
                onClick={() => setActiveTab("menstrual")}
                className={`py-1.5 px-0.5 text-center flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all cursor-pointer active:scale-90 ${
                  activeTab === "menstrual"
                    ? "bg-rose-500 text-white font-black shadow-sm"
                    : "text-slate-455 hover:text-rose-600 hover:bg-rose-50/20"
                }`}
              >
                <Calendar className="w-5 h-5 shrink-0" />
                <span className="text-[8px] sm:text-[9px] font-black whitespace-nowrap">Thả Bầu</span>
              </button>

              {/* Tab 2: Thai kỳ */}
              <button
                onClick={() => setActiveTab("info")}
                className={`py-1.5 px-0.5 text-center flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all cursor-pointer active:scale-90 ${
                  activeTab === "info"
                    ? "bg-rose-500 text-white font-black shadow-sm"
                    : "text-slate-450 hover:text-rose-600 hover:bg-rose-50/20"
                }`}
              >
                <Baby className="w-5 h-5 shrink-0" />
                <span className="text-[8px] sm:text-[9px] font-black whitespace-nowrap">Thai Kỳ</span>
              </button>

              {/* Tab 3: Cẩm nang */}
              <button
                onClick={() => setActiveTab("handbook")}
                className={`py-1.5 px-0.5 text-center flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all cursor-pointer active:scale-90 ${
                  activeTab === "handbook"
                    ? "bg-rose-500 text-white font-black shadow-sm"
                    : "text-slate-450 hover:text-rose-600 hover:bg-rose-50/20"
                }`}
              >
                <Apple className="w-5 h-5 shrink-0" />
                <span className="text-[8px] sm:text-[9px] font-black whitespace-nowrap">Cẩm Nang</span>
              </button>

              {/* Tab 4: Báo cáo AI */}
              <button
                onClick={() => {
                  setActiveTab("aiReport");
                  if (!aiReport && !loadingReport) {
                    handleGenerateReport();
                  }
                }}
                className={`py-1.5 px-0.5 text-center flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all cursor-pointer active:scale-90 ${
                  activeTab === "aiReport"
                    ? "bg-rose-500 text-white font-black shadow-sm"
                    : "text-slate-455 hover:text-rose-600 hover:bg-rose-50/20"
                }`}
              >
                <FileText className="w-5 h-5 shrink-0" />
                <span className="text-[8px] sm:text-[9px] font-black whitespace-nowrap">Báo Cáo</span>
              </button>

            </div>
          </div>

          {/* FLOATING CHAT BUTTON (FAB) */}
          {!isChatOpen && (
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-[calc(env(safe-area-inset-bottom,8px)+60px)] right-4 sm:right-6 md:right-8 z-40 bg-gradient-to-r from-rose-550 to-pink-500 hover:from-rose-605 hover:to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl border border-rose-300 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 animate-bounce [animation-duration:3s]"
              style={{ boxShadow: '0 8px 30px rgba(244, 63, 94, 0.4)' }}
            >
              <div className="relative">
                <MessageSquare className="w-5.5 h-5.5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 font-extrabold border border-white"></span>
                </span>
              </div>
            </button>
          )}

          {/* FLOATING CHAT OVERLAY BOX */}
          {isChatOpen && (
            <div className="absolute inset-0 z-50 flex flex-col justify-end bg-slate-950/45 backdrop-blur-2xs">
              <div 
                onClick={() => setIsChatOpen(false)}
                className="absolute inset-0 bg-transparent"
              />
              
              <div className="relative bg-white rounded-t-[32px] shadow-2xl p-4 z-10 flex flex-col h-[75%] max-h-[580px] border-t border-rose-100 animate-fade-in">
                {/* Drag handle decoration */}
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto shrink-0 mb-3" />

                {/* Header with physician profile */}
                <div className="flex items-center justify-between border-b border-rose-50 pb-2.5 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shadow-xs">
                      <span className="text-xl">👩‍⚕️</span>
                    </div>
                    <div>
                      <h3 className="font-black text-xs text-slate-800 uppercase flex items-center gap-1">
                        Trợ lý Bác Sĩ BaBiCare AI <span className="text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-250 px-1 py-0.5 rounded-md lowercase tracking-normal">trực tuyến</span>
                      </h3>
                      <p className="text-[9px] text-slate-400 font-medium">Bản quyền tư vấn sức khoẻ Sản Nhi khoa thông minh</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChatOpen(false)}
                    className="w-7 h-7 bg-slate-100 hover:bg-rose-50 text-slate-650 hover:text-rose-600 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat History Box */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-1 py-3 flex flex-col justify-start">
                  {chatMessages.map((m) => {
                    const isAssistant = m.role === "assistant";
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-2 max-w-[85%] ${
                          isAssistant ? "self-start" : "self-end flex-row-reverse"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs text-sm ${
                          isAssistant ? "bg-rose-100 text-rose-600 border border-rose-200" : "bg-slate-200 text-slate-750"
                        }`}>
                          {isAssistant ? "👩‍⚕️" : "🤰"}
                        </div>

                        <div className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-2xs ${
                          isAssistant 
                            ? "bg-slate-50 border border-slate-105 text-slate-800 rounded-tl-none" 
                            : "bg-rose-500 text-white rounded-tr-none"
                        }`}>
                          <div className="markdown-body font-medium">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </div>
                          <span className={`block text-[8px] mt-1 text-right ${isAssistant ? "text-slate-400" : "text-rose-100"}`}>
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {loadingChat && (
                    <div className="flex gap-2 max-w-[80%] self-start pb-2">
                      <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-605 flex items-center justify-center border border-rose-206 shadow-xs text-sm">
                        👩‍⚕️
                      </div>
                      <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-2xl rounded-tl-none text-[10.5px] text-slate-500 flex items-center gap-1 shadow-2xs">
                        <span className="w-1.5 h-1.5 bg-rose-450 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-rose-450 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-rose-450 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        <span className="font-semibold text-[9.5px]">Trợ lý BaBiCare AI đang nghiên cứu tài liệu tư vấn...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick actions box inside chat drawer */}
                <div className="space-y-1.5 bg-slate-50 p-2 rounded-2xl border border-slate-100 shrink-0 mb-2">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Hỏi nhanh Bác Sĩ AI:</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar select-none">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(q)}
                        className="text-[9.5px] bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50 py-1 px-2.5 rounded-full text-slate-700 font-extrabold transition-all active:scale-95 shrink-0 cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input action fields */}
                <div className="flex gap-1.5 sticky bottom-0 pt-1 shrink-0 bg-white">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Hỏi về đau thắt lưng, gò tử cung, sữa, trứng..."
                    className="flex-1 h-11 px-3 border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl text-xs bg-white outline-none font-semibold text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={loadingChat || !userInput.trim()}
                    className="bg-rose-500 hover:bg-rose-600 text-white w-11 h-11 rounded-xl transition-all disabled:opacity-40 flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* ==================== MATERNAL PROFILE BOTTOM SHEET (SLIDE-UP DIALOG MODAL) ==================== */}
        {isProfileOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop glass overlay */}
            <div 
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
            />
            
            {/* Sliding physical container panel */}
            <div className="relative bg-white rounded-t-[32px] shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[85%] overflow-y-auto animate-fade-in">
              {/* iOS style notch drag point indicator */}
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto shrink-0" />

              {/* Heading Close row */}
              <div className="flex items-center justify-between border-b border-rose-50 pb-2.5 shrink-0">
                <div>
                  <h2 className="text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase">
                    <Settings className="w-4 h-4 text-rose-500 animate-spin-slow" /> Cài đặt thiết lập của mẹ
                  </h2>
                  <p className="text-[9px] text-slate-400 mt-0.5">Quản lý thông tin tài khoản mẹ và khoá API</p>
                </div>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-7 h-7 bg-slate-100 hover:bg-rose-50 text-slate-550 hover:text-rose-600 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Config Form */}
              <form onSubmit={handleUpdate} className="space-y-4 text-xs font-semibold">
                
                {/* Section 1: Thông tin của mẹ */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-black text-rose-500 uppercase tracking-wider pb-1.5 border-b border-rose-100/50">
                    🌸 THÔNG TIN CỦA MẸ QUÝ GIÁ:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-black text-slate-550">HỌ VÀ TÊN MẸ:</span>
                      <input
                        type="text"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        placeholder="Nhập tên của mẹ..."
                        required
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl outline-none font-bold text-slate-705 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[9px] font-black text-slate-550">SỐ ĐIỆN THOẠI:</span>
                      <input
                        type="tel"
                        value={motherPhone}
                        onChange={(e) => setMotherPhone(e.target.value)}
                        placeholder="Số điện thoại của mẹ..."
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl outline-none font-bold text-slate-705 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-black text-slate-550">EMAIL LIÊN LẠC:</span>
                      <input
                        type="email"
                        value={motherEmailState}
                        onChange={(e) => setMotherEmailState(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl outline-none font-bold text-slate-705 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[9px] font-black text-slate-550">ĐỊA CHỈ:</span>
                      <input
                        type="text"
                        value={motherAddress}
                        onChange={(e) => setMotherAddress(e.target.value)}
                        placeholder="Địa chỉ hiện tại của mẹ..."
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl outline-none font-bold text-slate-705 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-black text-slate-550">NGÀY THÁNG NĂM SINH:</span>
                      <input
                        type="date"
                        value={motherBirthdate}
                        onChange={(e) => {
                          setMotherBirthdate(e.target.value);
                          const derivedAge = calculateGregorianAge(e.target.value);
                          setMotherAge(String(derivedAge));
                        }}
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl outline-none font-bold text-slate-705 focus:bg-white"
                      />
                    </div>
                    
                    <div className="space-y-1 bg-rose-50/40 border border-rose-100/50 p-2.5 rounded-2xl flex flex-col justify-center gap-1">
                      <div className="text-[9.5px]/none font-extrabold text-rose-850 flex items-center justify-between">
                        <span>🌞 Tuổi Dương:</span>
                        <span className="font-black bg-white px-2 py-0.5 rounded-md text-rose-600 shadow-3xs">{calculateGregorianAge(motherBirthdate)} tuổi</span>
                      </div>
                      <div className="text-[9.5px]/none font-extrabold text-pink-850 flex items-center justify-between">
                        <span>🌙 Tuổi Âm (Mụ):</span>
                        <span className="font-black bg-white px-2 py-0.5 rounded-md text-pink-600 shadow-3xs">{getLunarAge(motherBirthdate)} tuổi</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-black text-slate-550 uppercase">Chiều cao của mẹ:</span>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          value={heightBefore}
                          onChange={(e) => {
                            setHeightBefore(e.target.value);
                            localStorage.setItem("babicare_height_before", e.target.value);
                          }}
                          placeholder="cm"
                          className="w-full px-3 py-2 pr-8 text-[11px] border border-slate-200 bg-slate-50 rounded-xl outline-none font-bold text-slate-705 focus:bg-white"
                        />
                        <span className="absolute right-2.5 text-[8.5px] text-slate-400 font-extrabold uppercase">cm</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[10px] font-black text-slate-550 uppercase">Cân nặng hiện tại:</span>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          value={weightBefore}
                          onChange={(e) => {
                            setWeightBefore(e.target.value);
                            localStorage.setItem("babicare_weight_before", e.target.value);
                          }}
                          placeholder="kg"
                          className="w-full px-3 py-2 pr-8 text-[11px] border border-slate-200 bg-slate-50 rounded-xl outline-none font-bold text-slate-705 focus:bg-white"
                        />
                        <span className="absolute right-2.5 text-[8.5px] text-slate-400 font-extrabold uppercase">kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maternal notes */}
                <div className="space-y-1 pt-1.5 border-t border-slate-100">
                  <span className="block text-[10px] font-black text-slate-500 uppercase">Triệu chứng & Ghi chú mệt mỏi ẩn:</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Mẹ mỏi lưng dưới, dạo này thèm thèm cua ghẹ chua ngọt..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl outline-none font-medium text-slate-705 leading-relaxed focus:bg-white text-left resize-none"
                  />
                </div>

                {/* Gemini API Key Configuration field for Client-side / Cloudflare compatibility */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="block text-[10px] font-black text-rose-500 uppercase tracking-wider flex items-center gap-1">
                    🔑 Gemini API Key (Cấu hình chạy Client-side):
                  </label>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Nhập AIzaSy... từ Google AI Studio"
                    className="w-full px-3 py-2.5 bg-rose-50/20 border border-rose-200 focus:border-rose-400 rounded-xl font-mono text-[11px] outline-none block text-rose-700"
                  />
                  <p className="text-[8.5px] text-slate-400 leading-normal">
                    * Khoá này sẽ được lưu bảo mật trong trình duyệt của mẹ (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[8px]">localStorage</code>) để chạy trực tiếp từ browser, tương thích hoàn toàn khi mẹ deploy lên <strong className="text-slate-605">Cloudflare Pages</strong>.
                  </p>
                </div>

                {/* Submit action */}
                <button
                  type="submit"
                  className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                >
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  Mẹ Lưu Thiết Lập
                </button>

                {/* Logged in User Summary & Sign out Actions */}
                {user && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <img 
                        src={user.photoURL || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
                        alt={user.displayName} 
                        className="w-9 h-9 rounded-full border border-rose-100" 
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-[11px] text-slate-805 truncate">{user.displayName || "Mẹ Bầu"}</p>
                        <p className="font-semibold text-[8.5px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      {isAdminUser && (
                        <span className="bg-rose-50 text-rose-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-md border border-rose-100 shrink-0">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {isAdminUser && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsAdminPanelOpen(true);
                          }}
                          className="flex-1 cursor-pointer bg-slate-100 text-slate-705 font-extrabold py-2.5 rounded-xl text-[10px] uppercase border border-slate-200 hover:bg-slate-200 transition-colors active:scale-95"
                        >
                          🛠️ Mở Admin
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          setIsProfileOpen(false);
                          if (user.isDemo) {
                            setUser(null);
                            setIsAdminUser(false);
                          } else {
                            await signOut(auth);
                          }
                        }}
                        className="flex-1 cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-650 font-extrabold py-2.5 rounded-xl text-[10px] uppercase border border-rose-100/55 transition-colors active:scale-95"
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* ==================== AFFILIATE PRODUCT EDIT BOTTOM SHEET ==================== */}
        {isAffiliateEditModalOpen && editingProduct && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end select-none">
            {/* Backdrop glass overlay */}
            <div 
              onClick={() => { setIsAffiliateEditModalOpen(false); setEditingProduct(null); }}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
            />
            
            {/* Sliding physical container panel */}
            <div className="relative bg-white rounded-t-[32px] shadow-2xl p-5 z-10 flex flex-col gap-4 max-h-[85%] overflow-y-auto animate-fade-in text-xs">
              {/* iOS style notch drag point indicator */}
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto shrink-0" />

              {/* Heading Close row */}
              <div className="flex items-center justify-between border-b border-rose-50 pb-2.5 shrink-0">
                <div>
                  <h2 className="text-[11px] font-black text-slate-800 flex items-center gap-1.5 uppercase">
                    <ShoppingBag className="w-4 h-4 text-[#ee4d2d]" /> Cấu Hình Sản Phẩm Affiliate
                  </h2>
                  <p className="text-[9px] text-slate-400 mt-0.5">Tùy chỉnh thông tin và liên kết hoa hồng cá nhân của mẹ</p>
                </div>
                <button
                  onClick={() => { setIsAffiliateEditModalOpen(false); setEditingProduct(null); }}
                  className="w-7 h-7 bg-slate-100 hover:bg-rose-50 text-slate-550 hover:text-rose-600 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Edit form */}
              <div className="space-y-3.5 pb-2">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-[#ee4d2d] uppercase">Tên sản phẩm (Màu Shopee):</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:border-orange-400 outline-none text-slate-700 font-bold"
                    placeholder="Chưa điền tên sản phẩm..."
                  />
                </div>

                {/* Cover Image URL */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase">Đường dẫn ảnh sản phẩm (Tỷ lệ 1:1):</label>
                  <input
                    type="text"
                    value={editingProduct.imageUrl}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:border-rose-400 outline-none text-slate-700 font-semibold"
                    placeholder="Dán link ảnh vuông 1:1..."
                  />
                  <p className="text-[8px] text-slate-450 leading-relaxed italic">
                    💡 Mẹo: Hỗ trợ dán link hình ảnh từ nguồn chụp sản phẩm, Unsplash, hoặc Shopee.
                  </p>
                </div>

                {/* Affiliate Link with intelligent auto parser */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-black text-slate-500 uppercase">Liên kết mua hàng (Link Affiliate):</label>
                    {isParsingLink && (
                      <span className="text-[9px] text-[#ee4d2d] font-bold animate-pulse flex items-center gap-1">
                        🔄 Đang phân tích deals & quét ảnh sản phẩm...
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingProduct.affiliateUrl}
                      onChange={(e) => {
                        const newUrl = e.target.value;
                        setEditingProduct({ ...editingProduct, affiliateUrl: newUrl });
                        if (newUrl.startsWith("http://") || newUrl.startsWith("https://")) {
                          // Allow quick typing, trigger parsing when a full link is pasted
                          if (newUrl.length > 15) {
                            handleAutoParseLink(newUrl);
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:border-orange-400 outline-none text-slate-700 font-semibold flex-1"
                      placeholder="Dán link shopee, lazada hoặc tiki ở đây..."
                    />
                    <button
                      type="button"
                      disabled={isParsingLink}
                      onClick={() => handleAutoParseLink(editingProduct.affiliateUrl)}
                      className="bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 disabled:opacity-50 text-[10px] px-3 rounded-xl font-bold flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                      title="Nhấn để hệ thống quét giá tốt nhất sau mã giảm, tự tìm ảnh chính"
                    >
                      ⚡ Quét Deal & Ảnh
                    </button>
                  </div>
                  <p className="text-[8px] text-slate-400 leading-snug">
                    💡 <strong className="text-rose-500">Tự động hóa:</strong> Hệ thống sẽ phân tích link, dò mã giảm giá hời nhất và gán ảnh mặt hàng từ Shopee/Lazada cho mẹ!
                  </p>
                </div>

                {/* Price (Màu đen) */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-700 uppercase">Giá bán hiển thị (Màu Đen):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:border-emerald-400 outline-none text-slate-900 font-extrabold"
                      placeholder="Ví dụ: 195.000đ"
                    />
                    
                    {/* Simulated price auto sync helper button */}
                    <button
                      type="button"
                      disabled={isParsingLink}
                      onClick={() => handleAutoParseLink(editingProduct.affiliateUrl)}
                      className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 disabled:opacity-50 text-[10px] px-3 rounded-xl font-bold flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                    >
                      {isParsingLink ? "Đang đồng bộ..." : "Đồng Bộ Giá"}
                    </button>
                  </div>
                  <p className="text-[8px] text-slate-400 italic">
                    ⚡ Giá cập nhật trực tiếp hoặc nhập thủ công tự do theo tỷ giá chiến dịch affiliate.
                  </p>
                </div>

                {/* Product Category Selector */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-rose-500 uppercase">Phân loại sản phẩm khuyên dùng:</label>
                  <select
                    value={editingProduct.category || "vitamin"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:border-rose-450 outline-none text-slate-700 font-bold bg-white"
                  >
                    <option value="vitamin">💊 Vitamin Bầu</option>
                    <option value="stretch_mark">🌱 Dầu chống rạn da</option>
                    <option value="food_drink">🥑 Thực phẩm ăn - uống</option>
                  </select>
                </div>

                {/* CTA Action Bar */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAffiliateEditModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer active:scale-95 text-center"
                  >
                    Bỏ qua
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingProduct) return;
                      const pid = editingProduct.id;
                      if (pid.startsWith("pn")) {
                        setPrePregNutriProducts(prev =>
                          prev.map(p => p.id === pid ? editingProduct : p)
                        );
                      } else if (pid.startsWith("ov")) {
                        setOvulationProducts(prev =>
                          prev.map(p => p.id === pid ? editingProduct : p)
                        );
                      } else if (pid.startsWith("pd")) {
                        setPregnancyDetectionProducts(prev =>
                          prev.map(p => p.id === pid ? editingProduct : p)
                        );
                      } else {
                        setAffiliateProducts(prev => 
                          prev.map(p => p.id === pid ? editingProduct : p)
                        );
                      }

                      // Update customRecommendProducts state so edits take effect immediately mapping over correct ID matching
                      setCustomRecommendProducts(prev =>
                        prev.map(p => p.id === pid ? editingProduct : p)
                      );

                      // Save to Firestore if Firebase is active
                      if (isFirebaseConfigured()) {
                        setDoc(doc(db, "recommendedProducts", pid), editingProduct).catch(e => {
                          console.error("Failed to update product in firestore:", e);
                        });
                      } else {
                        // Otherwise save fallback to local storage customs
                        const savedCustom = localStorage.getItem("babicare_custom_recommend_products");
                        let parsedGroup = [];
                        if (savedCustom) {
                          try {
                            parsedGroup = JSON.parse(savedCustom);
                          } catch (_) {}
                        } else {
                          parsedGroup = [...DEFAULT_AFFILIATE_PRODUCTS];
                        }
                        const updatedGroup = parsedGroup.map((p: any) => p.id === pid ? editingProduct : p);
                        localStorage.setItem("babicare_custom_recommend_products", JSON.stringify(updatedGroup));
                      }

                      setIsAffiliateEditModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#ee4d2d] to-orange-500 text-white font-extrabold rounded-xl shadow-md cursor-pointer hover:opacity-95 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    Lưu thông tin
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
            </>
          )}

        </div>

        {/* Global Admin panel sidebar modal drawer */}
        <AnimatePresence>
          {isAdminPanelOpen && (
            <AdminPanel
              currentTexts={appTexts}
              onSaveTexts={async (newTexts) => {
                setAppTexts(newTexts);
                if (isFirebaseConfigured()) {
                  try {
                    await setDoc(doc(db, "appSettings", "texts"), newTexts);
                  } catch (e) {
                    console.error("Failed to write app settings:", e);
                  }
                }
              }}
              recommendedProducts={customRecommendProducts}
              onAddProduct={async (newProduct) => {
                setCustomRecommendProducts((prev) => [...prev, newProduct]);
                if (isFirebaseConfigured()) {
                  try {
                    await setDoc(doc(db, "recommendedProducts", newProduct.id), newProduct);
                  } catch (e) {
                    console.error("Failed to add product to Firestore:", e);
                  }
                }
              }}
              onDeleteProduct={async (id) => {
                setCustomRecommendProducts((prev) => prev.filter((p) => p.id !== id));
                if (isFirebaseConfigured()) {
                  try {
                    await deleteDoc(doc(db, "recommendedProducts", id));
                  } catch (e) {
                    console.error("Failed to remove product from Firestore:", e);
                  }
                }
              }}
              vitaminData={customVitaminData}
              onSaveVitaminData={handleSaveVitaminData}
              nutritionStages={customNutritionStages}
              onSaveNutritionStages={handleSaveNutritionStages}
              clinicalMilestones={customClinicalMilestones}
              onSaveClinicalMilestones={handleSaveClinicalMilestones}
              massageAndSkinSecrets={customMassageAndSkinSecrets}
              onSaveMassageAndSkinSecrets={handleSaveMassageAndSkinSecrets}
              thaiGiaoMilestones={customThaiGiaoMilestones}
              onSaveThaiGiaoMilestones={handleSaveThaiGiaoMilestones}
              onClose={() => setIsAdminPanelOpen(false)}
            />
          )}

          {/* Removed obsolete duplicate celebrate_modal absolute overlay */}
          
          {showPWAInstallPrompt && !isAlreadyStandalone && !pwaInstallDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white border-t border-rose-100 rounded-t-[32px] shadow-[0_-12px_40px_rgba(244,63,94,0.12)] p-6 z-50 overflow-hidden font-sans no-scrollbar"
            >
              {/* Handle indicator bar for premium iOS feel */}
              <div className="w-12 h-1.5 bg-slate-205 rounded-full mx-auto mb-4 bg-slate-200" />

              <div className="flex items-start gap-4 mb-4 text-left">
                {/* Generated Icon preview */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-rose-100 shadow-md shrink-0 bg-pink-100 flex items-center justify-center">
                  <img src="/icon.png" alt="BabiCare AI Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full select-none">Tiện ích PWA</span>
                  <h4 className="text-sm font-black text-slate-850 leading-tight mt-1 text-slate-800">Cài Đặt BabiCare AI</h4>
                  <p className="text-xs text-slate-500 leading-normal mt-1">Cài ứng dụng trực tiếp về điện thoại để có trải nghiệm mượt mà, nhanh hơn và dùng được khi ngoại tuyến!</p>
                </div>
                <button
                  onClick={() => handlePWADismiss(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* DYNAMIC OS DIRECTIVES */}
              <div className="bg-rose-50/50 border border-rose-100/50 rounded-2xl p-4 mb-4 text-left">
                <span className="text-[10px] font-black text-rose-900 uppercase block mb-2.5">
                  👉 HƯỚNG DẪN CÀI ĐẶT TRÊN {/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? "IPHONE (SAFARI)" : "ANDROID / CHROME"}
                </span>
                
                {/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? (
                  <div className="space-y-3.5 text-xs text-slate-700 font-semibold leading-relaxed">
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-rose-100 text-rose-700 text-[11px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <p className="text-slate-650">
                        Chạm vào biểu tượng <strong>Chia sẻ (Share)</strong> <span className="inline-block p-1 bg-white rounded-md border border-slate-200 text-[10px] shadow-3xs leading-none">📤</span> dưới khay công cụ Safari.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-rose-100 text-rose-700 text-[11px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <p className="text-slate-650">
                        Cuộn xuống phía dưới menu và chọn dòng <strong>Thêm vào MH chính (Add to Home Screen)</strong> <span className="inline-block p-1 bg-white rounded-md border border-slate-200 text-[10px] shadow-3xs leading-none">➕</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-rose-100 text-rose-700 text-[11px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <p className="text-slate-650">
                        Nhấn nút <strong>Thêm (Add)</strong> ở góc phải trên cùng để hoàn tất cài đặt ứng dụng.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 text-xs text-slate-700 font-semibold leading-relaxed">
                    {deferredPrompt ? (
                      <div>
                        <p className="text-slate-655 mb-3">Bấm nút bên dưới để cài ứng dụng trực tiếp, tự động lên điện thoại của mẹ:</p>
                        <button
                          onClick={handlePWAInstallClick}
                          className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Smartphone className="w-4 h-4" />
                          Bấm Cài Đặt Ngay
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        <div className="flex items-start gap-3">
                          <span className="w-5 h-5 bg-rose-100 text-rose-700 text-[11px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                          <p className="text-slate-655 font-medium">
                            Nhấn biểu tượng <strong>Menu Ba chấm (⋮)</strong> ở góc trên bên phải thanh trình duyệt Chrome.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="w-5 h-5 bg-rose-100 text-rose-700 text-[11px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                          <p className="text-slate-655 font-medium">
                            Chọn mục <strong>Cài đặt ứng dụng (Install App)</strong> hoặc <strong>Thêm vào màn hình chính</strong> <span className="inline-block p-1 bg-white rounded-md border border-slate-200 text-[10px] shadow-3xs leading-none">➕</span> và xác nhận đồng ý.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ACTION COMMAND BAR */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => handlePWADismiss(false)}
                  className="flex-1 py-3 border border-slate-205 hover:bg-slate-50 text-slate-500 font-extrabold rounded-2xl text-xs text-center transition-all cursor-pointer border-slate-200 active:scale-95"
                >
                  Để sau mẹ tự làm
                </button>
                <button
                  onClick={() => handlePWADismiss(true)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-150 text-slate-600 font-extrabold rounded-2xl text-xs text-center transition-all cursor-pointer active:scale-95 text-slate-600 hover:bg-slate-200"
                  title="Không hiển thị banner này nữa"
                >
                  Không nhắc lại nữa 🤫
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
}
