export interface FetalStats {
  week: number;
  weight: string; // Cân nặng em bé (g)
  length: string; // Chiều dài (cm/mm)
  lengthType: "CRL" | "HeadToHeel"; // CRL (Đầu mông) hay Head to Heel (Đầu chân)
  hc: string; // Chu vi đầu (mm)
  ac: string; // Chu vi bụng (mm)
  fl: string; // Chiều dài xương đùi (mm)
  fruitComparison: string; // So sánh kích thước trái cây
  description: string; // Đặc điểm hình thái nổi bật
}

export const fetalDevelopmentData: Record<number, FetalStats> = {
  4: {
    week: 4,
    weight: "~0.1g",
    length: "1.0mm",
    lengthType: "CRL",
    hc: "Chưa đo được",
    ac: "Chưa đo được",
    fl: "Chưa đo được",
    fruitComparison: "Hạt thuốc phiện (Poppy seed)",
    description: "Phôi thai nhỏ xíu đang bám chắc vào thành tử cung. Các tế bào phân chia thành 3 lớp chính để sau này hình thành nên các hệ cơ quan phức tạp nhất của bé."
  },
  5: {
    week: 5,
    weight: "~0.5g",
    length: "1.5mm",
    lengthType: "CRL",
    hc: "Chưa đo được",
    ac: "Chưa đo được",
    fl: "Chưa đo được",
    fruitComparison: "Hạt táo (Apple seed)",
    description: "Hỗn hợp tế bào đang nhanh chóng phát triển ống thần kinh sơ khai. Tim thai bé bỏng chuẩn bị hình thành và sắp sửa có những nhịp co bóp đầu tiên."
  },
  6: {
    week: 6,
    weight: "~1.0g",
    length: "4.0 - 5.0mm",
    lengthType: "CRL",
    hc: "Chưa đo được",
    ac: "Chưa đo được",
    fl: "Chưa đo được",
    fruitComparison: "Hạt đậu ngọt (Sweet pea)",
    description: "Tim thai đã đập rộn ràng gấp đôi nhịp tim người mẹ (100 - 160 lần/phút). Các chồi chi nhỏ bé nhô ra, chuẩn bị phát triển thành tay và chân."
  },
  7: {
    week: 7,
    weight: "~1.5g",
    length: "8.0 - 10.0mm",
    lengthType: "CRL",
    hc: "Chưa đo được",
    ac: "Chưa đo được",
    fl: "Chưa đo được",
    fruitComparison: "Quả việt quất (Blueberry)",
    description: "Bộ não phát triển thần tốc với tốc độ hàng ngàn tế bào thần kinh mỗi phút. Bàn tay và bàn chân có màng đang nhô dần ra."
  },
  8: {
    week: 8,
    weight: "~2.0g",
    length: "14 - 16mm",
    lengthType: "CRL",
    hc: "Chưa đo được",
    ac: "Chưa đo được",
    fl: "Chưa đo được",
    fruitComparison: "Quả mâm xôi (Raspberry)",
    description: "Bé chính thức mất đi 'chiếc đuôi nhỏ' của phôi thai. Đầu bé phát triển rất to so với thân mình để nhường chỗ cho tế bào não bộ đang nhân lên chóng mặt."
  },
  9: {
    week: 9,
    weight: "~3.0g",
    length: "22 - 30mm",
    lengthType: "CRL",
    hc: "Chưa đo được",
    ac: "Chưa đo được",
    fl: "Chưa đo được",
    fruitComparison: "Quả nho xanh (Grape)",
    description: "Các khớp khuỷu tay phát triển, mắt bé được bảo vệ bởi lớp mi mọc mỏng. Bé bắt đầu có thể làm những cử động gập dũi khẽ khàng."
  },
  10: {
    week: 10,
    weight: "~4.0g",
    length: "31 - 40mm",
    lengthType: "CRL",
    hc: "Chưa đo được",
    ac: "Chưa đo được",
    fl: "Chưa đo được",
    fruitComparison: "Quả quất (Kumquat)",
    description: "Giai đoạn phôi kết thúc, bé chính thức trở thành một 'thai nhi'. Các cơ quan như thận, ruột, não và gan đã bắt đầu tự hoạt động phối hợp."
  },
  11: {
    week: 11,
    weight: "~7.0g",
    length: "41 - 52mm",
    lengthType: "CRL",
    hc: "~55mm",
    ac: "~48mm",
    fl: "~6mm",
    fruitComparison: "Quả sung (Fig)",
    description: "Bé đã biết nuốt nước ối và tập cử động đá chân nhẹ nhàng. Cơ quan sinh dục đang hình thành rõ nét dần ở sâu bên trong."
  },
  12: {
    week: 12,
    weight: "~14g",
    length: "53 - 65mm",
    lengthType: "CRL",
    hc: "~70mm",
    ac: "~56mm",
    fl: "~9mm",
    fruitComparison: "Quả chanh ta (Lime)",
    description: "Mốc quan trọng kết thúc giai đoạn nhạy cảm nhất. Bé đã có những phản ứng phản xạ tự nhiên như khép mở ngón tay, mấp máy môi hoặc nheo mắt."
  },
  13: {
    week: 13,
    weight: "~23g",
    length: "67 - 80mm",
    lengthType: "CRL",
    hc: "~84mm",
    ac: "~68mm",
    fl: "~11mm",
    fruitComparison: "Quả chanh tây (Lemon)",
    description: "Nối liền tam cá nguyệt thứ nhất và thứ hai. Ruột bé đã di chuyển hoàn toàn từ dây rốn về khoang bụng, các vân tay độc bản bắt đầu hình thành."
  },
  14: {
    week: 14,
    weight: "~43g",
    length: "9.0 - 10.0cm",
    lengthType: "HeadToHeel",
    hc: "~96mm",
    ac: "~78mm",
    fl: "~14mm",
    fruitComparison: "Quả đào (Peach)",
    description: "Cổ bé dài ra rõ rệt giúp giữ đầu đứng thẳng hơn. Em bé bắt đầu mọc một lớp lông măng mịn phủ khắp cơ thể để bảo vệ da khỏi môi trường nước ối ấm áp."
  },
  15: {
    week: 15,
    weight: "~70g",
    length: "~10.5cm",
    lengthType: "HeadToHeel",
    hc: "~110mm",
    ac: "~90mm",
    fl: "~18mm",
    fruitComparison: "Quả táo ta (Apple)",
    description: "Làn da bé vô cùng mỏng manh, lộ rõ các mạng lưới mạch máu li ti bên dưới. Bé rất thích gập chân, tay, mút ngón tay cái và thỉnh thoảng nấc cụt nhè nhẹ."
  },
  16: {
    week: 16,
    weight: "~100g",
    length: "~12.0cm",
    lengthType: "HeadToHeel",
    hc: "~124mm",
    ac: "~105mm",
    fl: "~21mm",
    fruitComparison: "Quả bơ (Avocado)",
    description: "Mắt và tai chuyển về đúng vị trí chuẩn mực. Hệ thống xương sụn đang cứng dần thành các thớ xương chắc khoẻ, khớp chuyển động linh hoạt hơn nhiều."
  },
  17: {
    week: 17,
    weight: "~140g",
    length: "~13.0cm",
    lengthType: "HeadToHeel",
    hc: "~138mm",
    ac: "~119mm",
    fl: "~24mm",
    fruitComparison: "Quả lựu (Pomegranate)",
    description: "Các lớp mỡ tích tụ tinh tế dưới da để giúp giữ ấm thân nhiệt. Bé bắt đầu nghe được những âm thanh trầm bổng phát ra từ nhịp thở và giọng nói của mẹ."
  },
  18: {
    week: 18,
    weight: "~190g",
    length: "~14.2cm",
    lengthType: "HeadToHeel",
    hc: "~151mm",
    ac: "~132mm",
    fl: "~27mm",
    fruitComparison: "Quả khoai tây (Potato)",
    description: "Bé ngáp, duỗi người và đạp thành thục. Mẹ có thể bắt đầu cảm nhận rõ ràng những cử động đấm, đạp nhẹ nhàng đầu tiên này (máy thai)."
  },
  19: {
    week: 19,
    weight: "~240g",
    length: "~15.3cm",
    lengthType: "HeadToHeel",
    hc: "~164mm",
    ac: "~146mm",
    fl: "~30mm",
    fruitComparison: "Quả xoài (Mango)",
    description: "Lớp chất gây (vernix) màu trắng sữa phủ quanh da bé để ngăn nước chống thấm và dưỡng ẩm sâu. Các vùng não phụ trách giác quan bắt đầu phân hóa chuyên biệt."
  },
  20: {
    week: 20,
    weight: "~300g",
    length: "~25.6cm",
    lengthType: "HeadToHeel",
    hc: "~177mm",
    ac: "~160mm",
    fl: "~33mm",
    fruitComparison: "Quả chuối tiêu (Banana)",
    description: "Mốc nửa chặng đường vàng ngọc. Em bé nuốt dịch ối nhiều hơn, hỗ trợ đắc lực cho hệ tiêu hoá tập dượt hoạt động và bài tiết ra phân su màu đen xanh."
  },
  21: {
    week: 21,
    weight: "~360g",
    length: "~26.7cm",
    lengthType: "HeadToHeel",
    hc: "~188mm",
    ac: "~173mm",
    fl: "~36mm",
    fruitComparison: "Quả cà rốt lớn (Carrot)",
    description: "Bé đạp nhịp nhàng và thậm chí xoay đổi tư thế liên tục. Hệ thống miễn dịch của bé bắt đầu sản sinh kháng thể tự nhiên để tự bảo vệ cơ thể."
  },
  22: {
    week: 22,
    weight: "~430g",
    length: "~27.8cm",
    lengthType: "HeadToHeel",
    hc: "~200mm",
    ac: "~186mm",
    fl: "~40mm",
    fruitComparison: "Quả đu đủ lớn (Papaya)",
    description: "Mắt bé định hình đầy đủ lông mi và chân mày. Lúc này bộ não và các đầu dây thần kinh phản xạ phát triển rất nhạy, bé phản hồi tích cực với các cái xoa nhẹ của mẹ trên thành bụng."
  },
  23: {
    week: 23,
    weight: "~500g",
    length: "~28.9cm",
    lengthType: "HeadToHeel",
    hc: "~211mm",
    ac: "~198mm",
    fl: "~43mm",
    fruitComparison: "Quả bưởi chùm (Grapefruit)",
    description: "Mạch máu trong phổi nhân lên để chuẩn bị cho chu trình hô hấp khí thở đầu tiên. Đôi tai bé nhạy cảm rõ rệt so với tiếng động to bất ngờ."
  },
  24: {
    week: 24,
    weight: "~600g",
    length: "~30.0cm",
    lengthType: "HeadToHeel",
    hc: "~223mm",
    ac: "~210mm",
    fl: "~46mm",
    fruitComparison: "Bắp ngô ngọt (Corn on the cob)",
    description: "Làn da bé căng mịn lên từng ngày nhờ cấu mỡ bồi đắp. Vị giác của bé đã hoạt động tốt, bé có thể cảm nhận vị ngọt nhạt khác nhau của các loại thực phẩm mẹ ăn thông qua nước ối."
  },
  25: {
    week: 25,
    weight: "~660g",
    length: "~34.6cm",
    lengthType: "HeadToHeel",
    hc: "~232mm",
    ac: "~219mm",
    fl: "~48mm",
    fruitComparison: "Cây súp lơ (Cauliflower)",
    description: "Cấu mỡ tích tụ nhanh hơn dưới biểu bì. Các cấu trúc phế quản trong phổi phát triển rầm rộ, lồng ngực bắt đầu nhấp nhô nhẹ mô phỏng nhịp thở nông."
  },
  26: {
    week: 26,
    weight: "~760g",
    length: "~35.6cm",
    lengthType: "HeadToHeel",
    hc: "~242mm",
    ac: "~229mm",
    fl: "~50mm",
    fruitComparison: "Bắp cải tím (Red cabbage)",
    description: "Dây thần kinh thính giác phát triển gắn kết chặt chẽ với não bộ. Bé có thể phản hồi bằng cách tăng nhịp tim hoặc đạp nhẹ mỗi khi nghe nhạc nhẹ yêu thích."
  },
  27: {
    week: 27,
    weight: "~875g",
    length: "~36.6cm",
    lengthType: "HeadToHeel",
    hc: "~252mm",
    ac: "~240mm",
    fl: "~52mm",
    fruitComparison: "Cây xà lách (Lettuce)",
    description: "Bé bắt đầu thiết lập thói quen chu kỳ thức - ngủ điều hòa hơn. Kết mạc mắt mở hoàn toàn, bé chớp mắt ngắm nhìn luồng ánh sáng hắt dịu qua da mẹ."
  },
  28: {
    week: 28,
    weight: "~1000g",
    length: "~37.6cm",
    lengthType: "HeadToHeel",
    hc: "~262mm",
    ac: "~250mm",
    fl: "~54mm",
    fruitComparison: "Quả dừa xiêm (Coconut)",
    description: "Chào mừng đến với tam cá nguyệt thứ ba! Võng mạc phía sau mắt đã định dạng hoàn thiện giúp bé phản xạ đồng tử linh hoạt, co nhỏ lại khi chiếu sáng."
  },
  29: {
    week: 29,
    weight: "~1150g",
    length: "~38.6cm",
    lengthType: "HeadToHeel",
    hc: "~271mm",
    ac: "~261mm",
    fl: "~56mm",
    fruitComparison: "Quả bí ngòi (Butternut squash)",
    description: "Hệ xương phát triển và hóa cứng liên tục, tuy nhiên các khớp sọ vẫn rời rạc và mềm mại để đảm bảo sinh nở dễ lọt qua cổ tử cung mẹ rộng mở sắp tới."
  },
  30: {
    week: 30,
    weight: "~1300g",
    length: "~39.9cm",
    lengthType: "HeadToHeel",
    hc: "~280mm",
    ac: "~271mm",
    fl: "~58mm",
    fruitComparison: "Cải bắp lớn (Cabbage)",
    description: "Tủy xương bắt đầu làm nhiệm vụ nòng cốt để tạo ra các huyết sắc tố hồng cầu chuyên chở oxy. Lông tơ lợt lạt mọc mịn màng đang rụng bớt dần."
  },
  31: {
    week: 31,
    weight: "~1500g",
    length: "~41.1cm",
    lengthType: "HeadToHeel",
    hc: "~290mm",
    ac: "~281mm",
    fl: "~61mm",
    fruitComparison: "Quả dưa lưới (Cantaloupe)",
    description: "Hệ thống thần kinh trung ương đã có khả năng điều dưỡng thân nhiệt tự thân độc lập. Bé quay đầu qua lại thường xuyên hơn trong buồng ối."
  },
  32: {
    week: 32,
    weight: "~1700g",
    length: "~42.4cm",
    lengthType: "HeadToHeel",
    hc: "~298mm",
    ac: "~292mm",
    fl: "~63mm",
    fruitComparison: "Quả dứa sáp lớn (Pineapple)",
    description: "Tỷ lệ mỡ phát triển dồi dào chiếm tới hơn 15% tổng trọng lượng. Các móng chân, móng tay bé nhỏ đã cứng và mọc nhú dài chạm đầu ngón."
  },
  33: {
    week: 33,
    weight: "~1900g",
    length: "~43.7cm",
    lengthType: "HeadToHeel",
    hc: "~307mm",
    ac: "~302mm",
    fl: "~65mm",
    fruitComparison: "Củ sắn lớn (Jicama)",
    description: "Lượng nước ối trong tử cung bắt đầu đạt đỉnh điểm và sẽ giữ ổn định hoặc giảm bớt để nhường chỗ hoàn toàn cho cơ thể ngày một lớn nhanh của bé."
  },
  34: {
    week: 34,
    weight: "~2100g",
    length: "~45.0cm",
    lengthType: "HeadToHeel",
    hc: "~315mm",
    ac: "~312mm",
    fl: "~66mm",
    fruitComparison: "Quả dưa hấu vừa (Melon)",
    description: "Sự bảo hộ kép từ hệ kháng thể truyền trực tiếp từ mẹ sang bé giúp củng cố bức tường bảo vệ hệ miễn nhiễm khỏe mạnh, sẵn sàng ứng biến sau sinh."
  },
  35: {
    week: 35,
    weight: "~2400g",
    length: "~46.2cm",
    lengthType: "HeadToHeel",
    hc: "~322mm",
    ac: "~322mm",
    fl: "~68mm",
    fruitComparison: "Quả bí đỏ dài (Butternut pumpkin)",
    description: "Cơ thể bé đã trơn trụi và tròn lẳn đáng yêu. Gan và thận của bé đã hoàn thiện 100% chức năng chuyển dưỡng và thanh lọc độc tốt của cơ thể bé."
  },
  36: {
    week: 36,
    weight: "~2600g",
    length: "~47.4cm",
    lengthType: "HeadToHeel",
    hc: "~329mm",
    ac: "~332mm",
    fl: "~70mm",
    fruitComparison: "Quả đu đủ siêu lớn chín",
    description: "Mốc thai đủ tháng cận kề. Mọi cơ quan của bé như hệ tuần hoàn, não bộ và tiêu hóa đã sẵn sàng cho đời sống bên ngoài tử cung mẹ."
  },
  37: {
    week: 37,
    weight: "~2850g",
    length: "~48.6cm",
    lengthType: "HeadToHeel",
    hc: "~335mm",
    ac: "~341mm",
    fl: "~72mm",
    fruitComparison: "Bó rau cải cúc khổng lồ (Swiss Chard)",
    description: "Được định danh là mốc 'thai kỳ đủ tháng sớm'. Bé hoạt động cơ dẻo dai tập dượt cơ hàm mút bú mớm sữa rất khỏe qua phản xạ tự nhiên."
  },
  38: {
    week: 38,
    weight: "~3100g",
    length: "~49.8cm",
    lengthType: "HeadToHeel",
    hc: "~340mm",
    ac: "~350mm",
    fl: "~73mm",
    fruitComparison: "Quả bí ngô tròn (Pumpkin)",
    description: "Lớp mỡ thừa tích trữ sâu quanh các khớp vai và bắp để duy trì nhiệt sinh học chuẩn. Bé sẵn sàng dốc ngược đầu xuống vùng chậu mẹ thấp để chuẩn bị sinh (ngôi đầu thuận)."
  },
  39: {
    week: 39,
    weight: "~3300g",
    length: "~50.7cm",
    lengthType: "HeadToHeel",
    hc: "~345mm",
    ac: "~358mm",
    fl: "~74mm",
    fruitComparison: "Quả dưa hấu tròn lớn",
    description: "Bé chính thức đạt mốc 'đủ tháng lý tưởng hoàn hảo'. Em bé tích mỡ liên tục ở hai bên má phúng bính để phục vụ hoạt động cơ bú ngậm ti mẹ tốt nhất."
  },
  40: {
    week: 40,
    weight: "~3500g",
    length: "~51.2cm",
    lengthType: "HeadToHeel",
    hc: "~349mm",
    ac: "~364mm",
    fl: "~76mm",
    fruitComparison: "Quả bí ngồi siêu to khổng lồ",
    description: "Mốc dự sinh huy hoàng chính thức gõ cửa! Bé nằm cuộn tròn khép chặt gối nhẫn nại đợi chờ những cơn co thắt mở đường chào đón ngày mở mắt đầu đời."
  },
  41: {
    week: 41,
    weight: "~3600g",
    length: "~51.7cm",
    lengthType: "HeadToHeel",
    hc: "~352mm",
    ac: "~370mm",
    fl: "~77mm",
    fruitComparison: "Quả mít non chín cây siêu lớn",
    description: "Quá ngày dự sinh một tuần đầu tiên. Hãy an tâm theo dõi sát xao tim thai và lưu lượng nước ối cùng bác sĩ sản khoa chuẩn xác hàng ngày."
  },
  42: {
    week: 42,
    weight: "~3700g",
    length: "~52.2cm",
    lengthType: "HeadToHeel",
    hc: "~355mm",
    ac: "~375mm",
    fl: "~78mm",
    fruitComparison: "Quả mít chín cây đại thụ",
    description: "Mốc thai kỳ già tháng thực thụ. Mẹ bầu cần thảo luận cùng bác sĩ chuyên khoa phụ sản để kích hoạt quá trình chỉ định khởi phát chuyển dạ an toàn."
  }
};
