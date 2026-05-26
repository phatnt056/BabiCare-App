export interface VitaminInfo {
  name: string;
  role: string; // Vai trò cốt lõi
  dosage: string; // Liều lượng khuyến nghị
  timing: string; // Thời điểm uống tốt nhất
  sources: string[]; // Nguồn tự nhiên dồi dào
  notice: string; // Lưu ý quan trọng khi uống
}

export interface FoodNutrition {
  stage: string;
  recommendedFoods: string[]; // Các thực phẩm mấu chốt
  dishes: string[]; // Gợi ý món ăn Việt Nam dưỡng thai cực tốt
  dislikes: string[]; // Thực phẩm tuyệt đối kiêng kỵ
  dietaryTip: string; // Lời khuyên vàng tự nhiên
}

export interface ImmunizationMilestone {
  timeframe: string;
  name: string; // Tên mũi tiêm / xét nghiệm / siêu âm
  purpose: string; // Mục đích tầm soát, bảo vệ
  importance: "CRITICAL" | "HIGH" | "RECOMMENDED"; // Mức độ quan trọng
  doctorTip: string; // Lời khuyên trực tiếp của bác sĩ
}

export interface MassageSpaSkin {
  topic: string;
  benefits: string;
  instructionSteps: string[]; // Các bước tự thực hiện massage tại nhà
  stretchPreventions: string; // Bí quyết chống rạn nứt da (bụng, đùi, ngực, mỡ sáp)
  recommendedOils: string[]; // Những dầu chống rạn lành tính an toàn tối đa cho bé
  warning: string; // Chống chỉ định tư thế massage nguy hiểm
}

export const vitaminData: VitaminInfo[] = [
  {
    name: "Acid Folic (Vitamin B9)",
    role: "Phát triển ống thần kinh sơ khai của bé, ngăn dị tật sứt môi, hở hàm ếch và nứt đốt sống.",
    dosage: "400 mcg - 600 mcg / ngày.",
    timing: "Uống trước khi có bầu 3 tháng và duy trì suốt 3 tháng đầu thai kỳ.",
    sources: ["Rau cải bó xôi", "Súp lơ xanh", "Măng tây", "Lòng đỏ trứng", "Quả bơ", "Các loại hạt ngũ cốc"],
    notice: "Uống vào buổi sáng khi bụng rỗng (trước ăn 30 phút) cùng nước cam giàu vitamin C để hấp thụ tối đa."
  },
  {
    name: "Sắt (Iron)",
    role: "Cấu tạo hồng cầu, chuyển chở oxy nuôi thai nhi và phòng ngừa thiếu máu, băng huyết lúc sinh.",
    dosage: "30 mg - 60 mg Sắt nguyên tố / ngày.",
    timing: "Mẹ nên bổ sung từ lúc biết có thai đến sau sinh tối thiểu 1 tháng.",
    sources: ["Thịt bò phi lê", "Lòng đỏ trứng gà", "Huyết heo/bò luộc", "Rau bina", "Nghêu sò tôm"],
    notice: "Không uống bổ sung Sắt cùng thời điểm với Canxi hoặc sữa sấy nóng vì canxi làm ức chế hấp tụ sắt. Uống cách nhau ít nhất 2 giờ."
  },
  {
    name: "Canxi (Calcium)",
    role: "Kiến tạo hệ xương - khớp, mầm răng và hộp sọ chắc khỏe của bé; tránh cho mẹ bị chuột rút, loãng xương sau sinh.",
    dosage: "800 mg (3 tháng đầu) -> 1200 mg (3 tháng giữa) -> 1500 mg (3 tháng cuối) / ngày.",
    timing: "Uống bắt đầu nhiều từ tuần thứ 12 trở đi khi bé tăng tốc hóa xương dài.",
    sources: ["Sữa tươi không đường", "Phô mai", "Thủy hải sản vỏ mềm (tép, tôm nhỏ)", "Đậu hũ", "Cải xoăn"],
    notice: "Uống vào buổi sáng, sau bữa ăn tầm 1 giờ. Nên chọn dòng Canxi hữu cơ (L-Methylfolate) đi kèm Vitamin D3 và K2 để canxi gắn thẳng vào xương bé."
  },
  {
    name: "DHA (Omega-3)",
    role: "Chiếm tỷ lệ cực cao trong võng mạc mắt và chất xám của não bộ bé. Giúp bé thông minh vượt trội, mắt sáng tinh anh.",
    dosage: "200 mg - 300 mg DHA / ngày.",
    timing: "Uống đều đặn từ tuần thứ 10 trở đi, đặc biệt tích lũy lớn trong tam cá nguyệt thứ 2 và 3.",
    sources: ["Cá hồi", "Cá trích", "Trứng gà omega-3", "Hạt óc chó", "Hạt chia", "Quả macca"],
    notice: "DHA tan trong dầu, hãy uống ngay trong hoặc ngay sau bữa ăn giàu chất béo lành mạnh để tối ưu hiệu suất hấp thụ vào màng tế bào."
  }
];

export const nutritionStages: FoodNutrition[] = [
  {
    stage: "Tam cá nguyệt 1 (Tuần 1 - 13)",
    recommendedFoods: ["Cháo bồ câu", "Thịt gà chưng nấm hương", "Nước dừa (uống ít, vừa phải sau tuần 12)", "Chuối chín", "Trà gừng ấm"],
    dishes: [
      "Canh gà hầm hạt sen táo đỏ (giúp giảm nghén, an thần, ngủ sâu ngon giấc)",
      "Cháo cá hồi bông bí (giàu omega-3 lành tính, dễ nuốt vào bữa sáng)",
      "Sinh tố bơ hạt dẻ (bổ sung béo thực vật dồi dào canxi và acid folic)"
    ],
    dislikes: [
      "Đu đủ xanh (chứa chất latex kích thích co thắt tử cung dọa sẩy thai)",
      "Rau răm, ngải cứu (không ăn nhiều trong 3 tháng đầu gây xuất huyết)",
      "Trứng, cá hồi sống (phòng nhiễm khuẩn Listeria)"
    ],
    dietaryTip: "Nếu mẹ bầu bị ốm nghén nặng, hãy chia nhỏ bữa ăn thành 6 bữa/ngày, uống trà gừng ấm buổi sáng và ngậm một lát gừng mỏng để xoa dịu dạ dày."
  },
  {
    stage: "Tam cá nguyệt 2 (Tuần 14 - 27)",
    recommendedFoods: ["Thịt bò tơ", "Cá thu/Cá hồi áp chảo", "Sữa tươi hạt", "Trứng vịt lộn (ăn 1-2 quả/tuần)", "Rau xanh đậm màu"],
    dishes: [
      "Canh bí đỏ hầm sườn non (bổ não em bé, giàu sắt chất lượng cao cho mẹ)",
      "Bắp bò hấp gừng sả chấm tương đậu (giàu chất sắt dồi dào tăng cân bé cốt lõi)",
      "Cháo chim câu hầm hạt sen đậu xanh (bồi dưỡng khí huyết hồng hào)"
    ],
    dislikes: [
      "Nước ngọt có ga, trà sữa trân châu (gây tiền đề tiểu đường thai kỳ)",
      "Đồ ăn nhanh chiên ngập dầu cọ tái chế (ức chế hấp thụ dinh dưỡng lành mạnh)",
      "Măng tre muối chua chát ( chứa độc tố canxi oxalat)"
    ],
    dietaryTip: "Giai đoạn bé phát triển răng xương thần tốc, mẹ hãy uống đều đặn 2 ly sữa tươi không đường mỗi ngày kèm sữa hạt nguyên chất để không bị vôi hóa bánh nhau."
  },
  {
    stage: "Tam cá nguyệt 3 (Tuần 28 - 42)",
    recommendedFoods: ["Mè đen", "Nước dừa tươi", "Quả óc chó bóc vỏ", "Cá chép chưng tương gừng", "Đường thốt nốt (uống trà hoa nhẹ)"],
    dishes: [
      "Canh cá chép nướng chưng thì là (món ăn cổ truyền dưỡng thai thông sữa cực nổi tiếng)",
      "Chè mè đen (vừng đen) nấu lọt sắn dây (vừa bổ canxi vừa nhuận tràng dễ tiêu phòng ngừa trĩ thụ động, giúp sinh thường nhanh mở)",
      "Gà ác hầm thuốc bắc hạt sen kỷ tử (bồi bổ thể lực chịu đựng cơ dẻo dai lúc đau đè đẻ vỡ ối)"
    ],
    dislikes: [
      "Muối mặn (tránh tích nước gây phù nề cổ chân và cao huyết áp thai kỳ / tiền sản giật)",
      "Rượu hay các chất kích thích mạnh",
      "Thực phẩm cay nóng nồng (gây táo bón nặng thêm)"
    ],
    dietaryTip: "Tháng cuối cùng mẹ nên massage đầu vú với dầu dừa ấm, tập rặn thở nhẹ nhàng, uống nước ấm dừa sau tuần 38 để làm sạch đục nước ối và dễ sinh."
  }
];

export const clinicalMilestones: ImmunizationMilestone[] = [
  {
    timeframe: "Tuần thai 11 - 13 tuần 6 ngày",
    name: "Siêu âm đo độ mờ da gáy & Sàng lọc NIPT hoặc Double Test",
    purpose: "Phát hiện sớm hội chứng Down, Edwards, Patau nguy cơ dị tật nhiễm sắc thể sọ gốc.",
    importance: "CRITICAL",
    doctorTip: "Mốc quan trọng KHÔNG THỂ BỎ LỠ. Xét nghiệm NIPT lấy máu tĩnh mạch mẹ có tính chính xác cực cao tới 99.9%, an toàn và thực hiện được ngay từ tuần thứ 9."
  },
  {
    timeframe: "Tuần thai 20 - 24",
    name: "Siêu âm hình thái học thai nhi 4D / 5D chuyên sâu",
    purpose: "Khảo sát toàn diện tim thai, mô hở hàm ếch, đầy đủ ngón tay chân sứt mẻ và các nếp sọ não, xương chậu.",
    importance: "CRITICAL",
    doctorTip: "Bác sĩ sản khoa sẽ đo chính xác các chiều dài xương đùi FL, chu vi vòng đầu HC của con giúp đánh giá sự phát triển của em bé so với tốc độ chuẩn tuần."
  },
  {
    timeframe: "Tuần thai 20 trở đi",
    name: "Tiêm vắc-xin Uốn ván (VAT)",
    purpose: "Ngăn ngừa uốn ván sơ sinh nguy hiểm cho cả mẹ và bé trong cuộc sinh nở.",
    importance: "CRITICAL",
    doctorTip: "Nếu mang thai con so (lần đầu), mẹ cần tiêm đủ 2 mũi cách nhau tối thiểu 1 tháng và mũi thứ 2 phải trước ngày dự sinh ít nhất 1 tháng."
  },
  {
    timeframe: "Tuần thai 24 - 28",
    name: "Xét nghiệm dung nạp đường huyết (Tầm soát tiểu đường thai kỳ)",
    purpose: "Phát hiện tiểu đường tiềm ẩn gây các mốc biến chứng thai to bất thường, suy hô hấp sơ sinh.",
    importance: "HIGH",
    doctorTip: "Mẹ cần nhịn ăn sáng trước khi đến lấy máu xét nghiệm. Bác sĩ sẽ cho mẹ uống nước đường cô quánh và lấy máu 3 lần để đối chiếu."
  },
  {
    timeframe: "Tuần thai 32 - 35",
    name: "Siêu âm màu Doppler & Tầm soát vi khuẩn GBS (Liên cầu khuẩn nhóm B)",
    purpose: "Đánh giá lưu lượng máu cuống rốn nuôi bé, nước ối và ngăn ngừa lây nhiễm vi khuẩn đường âm đạo khi sinh thường.",
    importance: "HIGH",
    doctorTip: "Nếu mẹ dương tính với GBS, bác sĩ sẽ truyền kháng sinh ngừa lây chéo bảo vệ mắt phổi em bé ngay khi cơ co thắt chuyển dạ xuất hiện."
  }
];

export const massageAndSkinSecrets: MassageSpaSkin[] = [
  {
    topic: "Massage Bầu Giảm Đau Nhức",
    benefits: "Tăng lưu thông bạch huyết, giảm ứ trệ phù chân, ngủ ngon giảm chuột rút nửa đêm, hạ hoocmon căng thẳng.",
    instructionSteps: [
      "Massage Lưng: Mẹ nằm nghiêng bên trái dưới đùi gối ôm êm. Chồng dùng lòng bàn tay xoa xoa vòng tròn nhẹ dọc hai bên cơ thắt sống lưng (không ấn vuốt trực tiếp đè vào xương cột sống).",
      "Massage Chân: Vuốt dọc mềm từ cổ chân lên đùi để dẫn dòng máu trở về tim nhanh hơn, tránh miết bóp mạnh gân khoeo gót chân.",
      "Massage Bụng: Chỉ xoa vuốt bụng nhẹ nhàng bằng các đầu ngón tay mềm lướt nhẹ, vuốt từ dưới lên trên. Tuyệt đối không bật xoa mạnh vòng tròn miết mạnh vì dễ gây kích thích co thắt tử cung."
    ],
    stretchPreventions: "Bôi thoa dầu khóa ẩm chống rạn da đều đặn 2 lần mỗi ngày bắt đầu từ tháng thứ 3 trở đi để gia tăng độ đàn hồi, làm dịu cơn ngứa châm chích khi bụng to nhanh.",
    recommendedOils: [
      "Dầu dừa tinh khiết ép lạnh (Lành tính 100%, chứa nhiều acid lauric kháng khuẩn kháng viêm da cổ)",
      "Dầu hạnh nhân ngọt (Sweet Almond Oil giàu Vitamin E tự nhiên kéo thớ đàn hồi cao)",
      "Bơ hạt mỡ tự nhiên (Shea Butter khóa ẩm chuyên sâu cực tốt tránh thâm sạm)"
    ],
    warning: "Tránh xa các huyệt đạo nhạy cảm gây kích thích tử cung ở gót chân (Huyệt tam âm giao) và vai gáy (Huyệt kiên tỉnh). Tránh xoa bụng quá 5 phút/lần."
  }
];

export interface ThaiGiaoMilestone {
  minWeek: number;
  maxWeek: number;
  stageName: string;
  focusDesc: string;
  auditory: string;
  visual: string;
  kinesthetic: string;
  dinhDuong: string;
  emotion: string;
  fatherTask: string;
  dailyPractice: string;
}

export const thaiGiaoMilestones: ThaiGiaoMilestone[] = [
  {
    minWeek: 4,
    maxWeek: 8,
    stageName: "Giai Đoạn Khởi Đầu Đầy Nhiệm Màu (Tuần 4 - 8)",
    focusDesc: "Phôi thai lúc này đang cấy sâu tế bào tinh hoa để tạo cấu trúc sơ khai của hệ thần kinh. Trọng tâm thai giáo mấu chốt lúc này chính là THAI GIÁO TÂM LÝ & CẢM XÚC. Khung cảm xúc an yên của mẹ tiết ra Endorphin giúp phôi phát triển trọn vẹn nhất.",
    auditory: "Lắng nghe những điệu nhạc Baroque nhịp độ chậm (60 nhịp/phút) như các bản nhạc của Bach hay Mozart. Âm điệu dịu đều đặn hỗ trợ cân bằng tần số sóng não của mẹ bầu, truyền năng lượng an nhiên cho con.",
    visual: "Mẹ hãy chăm chỉ ngắm nhìn những bức tranh gia đình ấm áp, phong cảnh thiên nhiên ngập nắng hoặc xem các bộ phim tài liệu hoa cỏ rực rỡ sắc màu tươi sáng để duy trì năng lượng tích cực.",
    kinesthetic: "Tuyệt đối không xoa bụng mạnh vì đây là thời kỳ phôi bám tổ chưa chắc chắn. Thay vào đó, mẹ hãy đặt nhẹ hai lòng bàn tay thầm lặng lên vùng bụng dưới vào mỗi sáng tối, thở sâu gửi tình yêu thương.",
    dinhDuong: "Uống đều axit folic mỗi sáng, ăn các món thanh dịu như cháo sườn sen ấm, trà gừng tươi giảm thiểu các cơn nghén tự nhiên đầu đời để bé nhận nguồn nuôi dưỡng bình yên.",
    emotion: "Thực hành 'Mỗi ngày ghi chép 3 điều mẹ biết ơn'. Tránh xem tin tức tiêu cực hay giật gân làm tăng nồng độ cortisol (hormone stress) ảnh hưởng tiêu cực cấu trúc phôi.",
    fatherTask: "Bố hãy ôm mẹ thật nhiều mỗi ngày, cùng mẹ trò chuyện thầm thì và gánh vác việc nội trợ nặng nhọc, tạo điểm tựa tâm lý tuyệt vời cho người bạn đời của mình.",
    dailyPractice: "Ngồi tĩnh tâm 5-10 phút trước khi ngủ, hít thở sâu bằng mũi, phình bụng nhẹ nhàng và thầm nhủ: 'Cảm ơn con yêu đã đến bên ba mẹ khỏe mạnh an lành!'"
  },
  {
    minWeek: 9,
    maxWeek: 12,
    stageName: "Giai Đoạn Kiến Tạo Nền Móng Giác Quan (Tuần 9 - 12)",
    focusDesc: "Kích thước của bé bằng quả chanh nhỏ, mầm răng xương, cấu trúc tai trong dần hình thành. Thai giáo trọng tâm: THAI GIÁO NGỒN NGỮ & MỸ HỌC để nuôi dưỡng mầm mống tri thức đầu tiên cho em bé.",
    auditory: "Mẹ hãy bắt đầu đọc to thành tiếng các câu chuyện thiếu nhi nhân văn hoặc các dòng thơ lục bát mượt mà. Giọng đọc nhẹ có trầm bổng cao thấp giúp hệ thính giác sơ khai của bé làm quen nhịp điệu tiếng mẹ đẻ.",
    visual: "Tận hưởng ánh nắng ban mai rực rỡ tươi sáng (từ 7h - 8h sáng). Khi mẹ nhìn ngắm vẻ đẹp của thiên nhiên, võng mạc ghi nhận sự ấm áp sáng mịn và chuyển tiếp cảm giác an nhiên tốt lành qua nhau thai.",
    kinesthetic: "Vẫn đặt tay nhẹ nhàng lên bụng, áp sát lòng bàn tay hơi ấm để truyền dẫn dòng chảy năng lượng. Mẹ có thể nhún nhảy nhẹ theo điệu nhạc Val-se vui tươi để em bé cảm nhận nhịp cơ chuyển động dịu dàng.",
    dinhDuong: "Tăng cường axit béo Omega-3 từ hạt óc chó, bơ và cá hồi chín kỹ để kích hoạt cấu trúc hàng triệu tế bào chất xám trong não bộ bé phát triển vượt trội.",
    emotion: "Gửi gắm niềm vui qua nét vẽ tự do hoặc cắm hoa tươi đặt trong phòng. Sự thư thái nghệ thuật này đưa não bộ mẹ về tần số sóng Alpha thư giãn nhất.",
    fatherTask: "Bố bắt đầu ghé sát bụng mẹ trò chuyện: 'Alo, ba đây con yêu ơi!'. Giọng nam có tần số âm thanh trầm ấm xuyên qua nước ối tốt hơn giọng nữ, bé cực kỳ thích thú và ghi nhớ sâu đậm.",
    dailyPractice: "Đọc 1 trang truyện cổ tích hoặc ngâm thơ 5 phút vào khung giờ cố định buổi tối trước khi bé chợp mắt đi ngủ."
  },
  {
    minWeek: 13,
    maxWeek: 16,
    stageName: "Tam Cá Nguyệt Thứ Hai - Khởi Sắc Giác Quan (Tuần 13 - 16)",
    focusDesc: "Bé đã biết mút ngón tay, nếm được hương vị nước ối thông qua các nụ vị giác hình thành sớm. Trọng tâm thai giáo mới kết hợp: THAI GIÁO DINH DƯỠNG & VẬN ĐỘNG NHẸ để kích hoạt xúc giác và vị giác nhạy bén.",
    auditory: "Lắng nghe các bài hát ru truyền thống Việt Nam ngọt ngào hoặc các điệu nhạc dân ca êm dịu. Hãy bắt đầu chọn tên gọi ở nhà thật dễ thương cho bé và gọi tên con đều đặn khi trò chuyện.",
    visual: "Tập trung trí tưởng tượng khi đọc sách khoa học hay giải toán câu đố đơn giản. Việc tư duy logic này kích hoạt trực tiếp các xung thần kinh của cả hai mẹ con liên kết nhịp nhàng.",
    kinesthetic: "Bắt đầu những cái vuốt nhẹ từ trái qua phải bằng đầu ngón tay mềm mại (1-2 lần/ngày, mỗi lần 2 phút). Con có thể phản hồi bằng cách xoay nhẹ mình trong túi ối ấm áp.",
    dinhDuong: "Ăn đa dạng các hương vị thuần khiết tự nhiên (chua ngọt của trái cây dâu bơ, đậm đà hạt dẻ nấu súp). Mùi hương của thực phẩm mẹ ăn sẽ khuếch tán vào nước ối, giúp bé học cách cảm nhận mùi vị sớm.",
    emotion: "Viết nhật ký mang thai gửi con yêu. Ghi lại những mốc phát triển mới, những mong chờ của ba mẹ kèm hình ảnh siêu âm đầu tiên để giữ năng lượng tình mẫu tử.",
    fatherTask: "Cùng mẹ đi dạo công viên xanh mát rộng rãi dưới rặng bóng râm mát mẻ, nắm tay mẹ nói lời trân trọng động viên mỗi sáng để thắt chặt tình cảm gia đình.",
    dailyPractice: "Mỗi tối xoa một giọt dầu dừa mỏng lên bụng từ dưới hướng lên nhẹ nhàng và kể cho con nghe ngày hôm nay của mẹ thế nào."
  },
  {
    minWeek: 17,
    maxWeek: 21,
    stageName: "Giai Đoạn Thính Giác Hoàn Thiện Tối ƯU (Tuần 17 - 21)",
    focusDesc: "Tay chân bé đã hoàn thiện, bé có thể nghe rõ mồn một nhịp tim, nhịp thở sâu và tiếng nhu động ruột co bóp của mẹ bầu. Trọng tâm thai giáo cốt lõi nhất: THAI GIÁO ÂM THANH CHUYÊN SÂU & TƯƠNG TÁC XÚC GIÁC.",
    auditory: "Cho bé nghe nhạc không lời, nhạc hòa tấu sáo trúc hay piano nhẹ nhàng. Âm lượng mở bên ngoài loa ngoài nhỏ vừa phải (khoảng 50-60 dB), tuyệt đối không áp trực tiếp headphone tai nghe vào da bụng vì nước ối là môi trường truyền âm rất mạnh, làm bé chói tai.",
    visual: "Mẹ đọc các cuốn sách hội họa nghệ thuật giàu hình ảnh sinh động hoặc nghiên cứu các ngôn ngữ mới. Sự hoạt động tích cực của não bộ mẹ chính là nguồn kích thích phát triển bán cầu não trái tuyệt vời cho bé.",
    kinesthetic: "Khi cảm nhận thấy con máy hoặc đạp nhẹ, mẹ hãy áp nhẹ ngón tay vào điểm đó thầm thì: 'Mẹ chào con yêu, con vừa đạp mẹ à?', tạo kỹ năng phản xạ hai chiều thần kỳ.",
    dinhDuong: "Bổ sung sắt dồi dào từ các thớ thịt bò phi lê nướng, canh sườn súp súp để phòng ngừa thiếu máu, cung cấp oxy lên đại não bé thúc đẩy tăng cân tối ưu thế hệ gen.",
    emotion: "Dành 15 phút nghe thiền tĩnh tâm hoặc nhạc thư giãn tĩnh lặng giữa ngày để xóa bỏ mọi muộn phiền stress phát sinh từ áp lực công việc thường nhật.",
    fatherTask: "Chồng massage vai gáy cho vợ giảm mệt mỏi, ghé sát tai nói chuyện thủ thỉ cùng con tối thiểu 5 phút mỗi tối trước khi cả gia đình đi ngủ.",
    dailyPractice: "Tương tác ngón tay 'gõ nhịp': Khi con đạp nhẹ 1 cái, gõ nhẹ lên bụng phản hồi lại 1 cái và mỉm cười gọi: 'Bé cưng ơi!'"
  },
  {
    minWeek: 22,
    maxWeek: 27,
    stageName: "Bùng Nổ Phản Xạ Đạp Máy Kỳ Diệu (Tuần 22 - 27)",
    focusDesc: "Bé mở mi mắt nhấp nháy, chu kỳ ngủ-thức phân định rõ rệt và thường xuyên giao tiếp bằng cú đạp nảy thon thót. Trọng tâm thai giáo xuất sắc: THAI GIÁO VẬN ĐỘNG & THAI GIÁO TƯƠNG TÁC ÁNH SÁNG.",
    auditory: "Đa dạng hóa danh sách nhạc: Có thể thêm nhạc tiếng Anh vui nhộn nhịp điệu trung bình tươi vui, bài hát thiếu nhi trong sáng để tinh thần của hai mẹ con tươi mới phấn chấn hơn.",
    visual: "Áp dụng thai giáo ánh sáng dịu nhẹ bằng cách dùng một chiếc đèn pin có ánh sáng vàng nhạt ấm áp lướt nhẹ nhàng cách da bụng 10cm từ trên xuống dưới, bật tắt nhẹ nhàng 15-30 giây để con tập điều tiết mống mắt cảm thụ.",
    kinesthetic: "Mẹ thực hành tập thở Yoga nhẹ hướng dẫn bởi huấn luyện viên, tập bơi thủy liệu ấm giúp cơ chậu mẹ dẻo dai và bé trong bụng cảm giác bồng bềnh êm ái.",
    dinhDuong: "Đảm bảo cung cấp nguồn Canxi chất lượng cao cùng D3 và sữa hạt để đáp ứng nhu cầu tăng tốc mật độ hóa xương đùi và xương sọ của em bé khỏe khoắn.",
    emotion: "Gửi gắm tình cảm qua những lời ca tiếng hát tự do tự tại. Hãy cứ nghêu ngao hát những giai điệu yêu thích, giọng ca mộc mạc nguyên bản của mẹ luôn là bài thuốc chữa lành tâm hồn tốt nhất cho con.",
    fatherTask: "Cùng chơi trò 'Đuổi bắt ngón tay' với con trên bụng mẹ. Khi bé đạp nhô một chỗ, bố chạm nhẹ ngón tay vào để con nhận diện bàn tay ấm áp vững chãi của ba.",
    dailyPractice: "Thực hành bài tập yoga thở đều đặn và tương tác ánh sáng đèn pin dịu nhẹ 3 phút vào lúc chiều tối khi con thức giấc máy động nhiều."
  },
  {
    minWeek: 28,
    maxWeek: 32,
    stageName: "Phát Triển Tư Duy Não Bộ Vượt Bậc (Tuần 28 - 32)",
    focusDesc: "Bé tích lũy mỡ dưới da tròn phân, bộ não hình thành sâu nhiều nếp nhăn giúp khả năng ghi nhớ vượt trội xuất hiện. Trọng tâm thai giáo đỉnh cao: THAI GIÁO TRÍ TUỆ NGÔN NGỮ & LIÊN KẾT GIA ĐÌNH.",
    auditory: "Trao đổi nói chuyện thủ thỉ đa ngôn ngữ hoặc đọc to các từ vựng tiếng Anh đơn giản, bài thơ đồng dao nhịp 2/4 giàu hình tượng để đánh thức thớ liên kết nơ-ron bán cầu não ngôn ngữ.",
    visual: "Tiếp tục dạo bước dưới bóng mát râm tự nhiên mỗi chiều, ngắm nhìn bầu trời xanh trong vắt để truyền tải xúc cảm bao la, khoan dung nâng đỡ nhân cách bé sau này.",
    kinesthetic: "Xoa vuốt nhẹ nhàng quanh rốn theo chiều kim đồng hồ thật chậm để thư giãn và trấn an khi bé nấc cụt hoặc xoay đầu nghịch ngợm bên hốc hông.",
    dinhDuong: "Ăn mè đen chè, nước ấm, các quả sấy thơm ngon óc chó để hỗ trợ đắc lực bộ não tích trữ màng phospholipid lipid dồi dào, bé tư duy nhanh nhạy.",
    emotion: "Mơ mộng tưởng tượng về ngày con chào đời có khuôn mặt rạng rỡ của ai, làn da mịn màng thơm sữa. Sự tưởng tượng tích cực định hình năng lượng thu hút niềm vui tương lai.",
    fatherTask: "Bố ghé tai kể truyện cười vui vẻ cho hai mẹ con cùng nghe, xoa bóp massage gót chân vuốt phẳng nhẹ giúp mẹ vượt qua cơn nhức sưng phù nề bàn chân cuối ngày.",
    dailyPractice: "Đọc to truyện tư duy hoặc bảng chữ cái ngộ nghĩnh kèm lướt nhẹ các mẩu tiếng anh giao tiếp ngắn nhẹ nhàng 5-10 phút."
  },
  {
    minWeek: 33,
    maxWeek: 36,
    stageName: "Hoàn Thiện Bộ Nhớ & Tư Duy Ngôn Ngữ (Tuần 33 - 36)",
    focusDesc: "Hình dáng búp bê hoàn chỉnh, bé có thể xoay đầu hướng ngôi thuận xuống dưới xương chậu mẹ. Trọng tâm thai giáo lúc này: THAI GIÁO ÔN TẬP ÂM THANH & CHUẨN BỊ TÂM LÝ CHÀO ĐỜI AN TOÀN.",
    auditory: "Ôn tập lại những bài hát ru hoặc các bản nhạc không lời cổ điển quen thuộc mà mẹ thường mở từ tuần 12 đến tuần 20. Trí nhớ của con lúc này rất phát triển, con sẽ lập tức dịu đi và dễ ngủ mỗi khi nghe thấy thanh điệu quen thuộc ấy tái hiện.",
    visual: "Thiết kế phòng ngủ tươi sáng ấm áp, chuẩn bị nôi xếp nhỏ gọn thanh tao tươm tất với các sắc pastel dịu con mắt để kích hoạt cảm quan an toàn sẵn sàng cho cuộc sống mới.",
    kinesthetic: "Tuyệt đối không xoa miết bụng quá đà thời điểm nhạy cảm này vì dễ kích thích cơn gò giả Braxton Hicks chuyển tiến thành chuyển dạ sớm. Mẹ chỉ cần ôm nâng nhẹ ở bệ đỡ bụng dưới ấm áp.",
    dinhDuong: "Giảm muối để hạn chế giữ nước phù nề mặt móng chân, uống nước râu ngô dừa tươi thanh lọc bánh nhau bóng loáng ngập tràn oxy cho bé hô hấp tự do.",
    emotion: "Học các kỹ thuật thở rặn đẻ khoa học không đau (Thở nông, thở sâu nhịp nhàng). Thần thái kiên cường vượt qua thử thách chuyển dạ đem lại cho bé tính tự lập cao.",
    fatherTask: "Đồng hành cùng vợ đóng gói đồ đạc đi sinh, tháp tùng vợ đi khám định kỳ mỗi tuần ở mốc cuối gãy hông, sẵn sàng là bờ vai vững chắc bao dung nâng niu.",
    dailyPractice: "Mở nhạc dịu thắt chặt sợi dây liên kết gia đình, cả bố cả mẹ đặt tay lên bụng bé cùng gửi những lời chúc bình an nhất cho ngày gặp mặt."
  },
  {
    minWeek: 37,
    maxWeek: 42,
    stageName: "Giai Đoạn Gặp Gỡ Đầy Cảm Xúc Thăng Hoa (Tuần 37 - 42)",
    focusDesc: "Xương bé cứng cáp dài thẳng, nước ối lắng cặn vàng nhạt chuẩn bị cho ngày chuyển dạ lịch sử mở cánh cổng thế giới rực rỡ. Trọng tâm thai giáo cuối cùng: THAI GIÁO TRÍ TUỆ GIẢI TỔA LO ÂU & TRANH THỦ CHĂM SÓC TINH THẦN KHỎE.",
    auditory: "Thì thầm những điều cam kết của ba mẹ: 'Ba mẹ yêu con hết lòng, luôn bên con nâng đỡ, con ngoan cường hãy ra gặp ba mẹ nhé!'. Nghe bài hát ngân vang tiếng ghi-ta ấm mộc mạc mến yêu.",
    visual: "Tự tay vuốt ve giặt giũ phơi mền tã bông nhỏ mềm màu trắng nhạt thơm tinh tươm. Cảm giác ấm áp gia đình lan tỏa ngập tràn phòng ốc đưa tinh thần mẹ hồi sinh căng tràn rạng rỡ.",
    kinesthetic: "Mẹ dạo bước chân thả lỏng nhẹ nhõm thảnh thơi tại hành lang ngập gió thoáng mát để hỗ trợ ngôi thai tụt mở cổ tử cung thuận lợi dễ dàng vượt cạn.",
    dinhDuong: "Uống trà lá mâm xôi đỏ sấy ấm ấm (nếu được bác sĩ chỉ định hỗ trợ mềm cổ tử cung tự nhiên sau tuần 38) giúp cuộc chuyển dạ trơn tru nhanh gọn súc tích.",
    emotion: "Giữ tinh thần an nhiên tự tại xem cuộc đau chuyển dạ là thử thách thiêng liêng rèn giũa bản lĩnh làm mẹ. Hoàn toàn tin tưởng vào đội ngũ bác sĩ trợ lý y khoa.",
    fatherTask: "Nắm thật chặt bàn tay vợ lúc chuyển dạ xuất hiện, liên tục động viên động tác thở đều của vợ để dồn sức rặn nhanh đưa con chào đời viên mãn lành lặn.",
    dailyPractice: "Nghe các bài nhạc thiền chuẩn bị an toàn sinh nở thư thái tinh tế nhất 10 phút mỗi ngày thư giãn tuyệt đối cơ thắt hông chậu bầu."
  }
];

export function getThaiGiaoByWeek(week: number): ThaiGiaoMilestone {
  const milestone = thaiGiaoMilestones.find(m => week >= m.minWeek && week <= m.maxWeek);
  if (milestone) return milestone;
  return thaiGiaoMilestones[thaiGiaoMilestones.length - 1];
}

export interface DailyThaiGiaoTask {
  dayIndex: number;
  pregnancyDay: number;
  title: string;
  method: string;
  icon: string;
  description: string;
}

export function generateThaiGiaoDailyTasks(week: number): DailyThaiGiaoTask[] {
  const milestone = getThaiGiaoByWeek(week);
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
      title: "Thai Giáo Xúc Giác & Massage Gắn Kết",
      method: "Xúc Giác",
      icon: "🤸",
      description: `Hôm nay là ngày củng cố xúc giác. Thao tác thực hành: ${milestone.kinesthetic}. Hãy giữ động tác thật tinh tế, dịu nhẹ để bé cảm nhận sự ấm áp.`
    },
    {
      dayIndex: 3,
      pregnancyDay: startDay + 2,
      title: "Thai Giáo Vị Giác: Dưỡng Chất Thanh Lọc",
      method: "Vị Giác / Dinh Dưỡng",
      icon: "🥦",
      description: `Khơi mở các nụ vị giác đầu tiên của bé ngày hôm nay: ${milestone.dinhDuong}. Tránh tối đa đồ ăn cay nóng, muối mặn, giữ mạch máu cuống rốn trong lành cho con.`
    },
    {
      dayIndex: 4,
      pregnancyDay: startDay + 3,
      title: "Thai Giáo Thị Giác: Cảm Quan Ánh Sáng",
      method: "Thị Giác / Mỹ Học",
      icon: "👁️",
      description: `Mắt bé đang tiếp nhận xung lực thế giới ngoài da bụng: ${milestone.visual}. Nếu thời tiết đẹp, mẹ hãy tắm nắng sớm nhấp nháy mắt nhẹ đón dương quang.`
    },
    {
      dayIndex: 5,
      pregnancyDay: startDay + 4,
      title: "Thai Giáo Trí Tuệ & Bình Yên Tâm Thức",
      method: "Bình Yên / Trí Tuệ",
      icon: "🧠",
      description: `Một tinh thần hạnh phúc là cốt lõi của gen thông thái: ${milestone.emotion}. Thực hành thiền tĩnh tâm bằng cách nghe tiếng thở nhịp nhàng của chính mình.`
    },
    {
      dayIndex: 6,
      pregnancyDay: startDay + 5,
      title: "Thai Giáo Gắn Kết: Ba Đồng Hành Yêu Thương",
      method: "Ba Đồng Hành",
      icon: "👨",
      description: `Giai đoạn này giọng nam có sức tác động tuyệt vời lên tế bào tủy sọ của con: ${milestone.fatherTask}. Ba hãy ghé sát tai kể chuyện cười hoặc cùng xoa tinh dầu chống rạn lưng cho mẹ.`
    },
    {
      dayIndex: 7,
      pregnancyDay: startDay + 6,
      title: "Thử Thách Cuối Tuần: Thư Giãn Tuyệt Đối",
      method: "Thử Thách Cuối Tuần",
      icon: "📝",
      description: `${milestone.dailyPractice}. Sau đó, mẹ hãy ghi nhanh cảm nhận hạnh phúc của cả tuần thai thứ ${week} vào phần Nhật ký gửi gắm bé cưng bên dưới nhé!`
    }
  ];
}


