export interface HospitalBagItem {
  id: string;
  category: "mother" | "baby" | "document" | "custom";
  name: string;
  isCrucial: boolean; // Tuyên quyết - Cấp thiết
  qty: string; // Số lượng khuyên dùng
  desc: string; // Lý do / kinh nghiệm chuẩn bị
}

export const INITIAL_HOSPITAL_BAG_ITEMS: HospitalBagItem[] = [
  // GIẤY TỜ CẦN CHUẨN BỊ (document)
  {
    id: "doc_id_card",
    category: "document",
    name: "Căn cước công dân (CCCD) & Bảo hiểm y tế (BHYT)",
    isCrucial: true,
    qty: "Bản gốc + 3 bản photo",
    desc: "Cực kỳ quan trọng để làm thủ tục nhập viện khẩn cấp, tạm ứng viện phí và làm căn cứ cấp Giấy chứng sinh cho bé sau này."
  },
  {
    id: "doc_pregnancy_record",
    category: "document",
    name: "Sổ khám thai, phiếu siêu âm & các xét nghiệm",
    isCrucial: true,
    qty: "Toàn bộ hồ sơ thai kỳ",
    desc: "Đặc biệt là kết quả xét nghiệm máu, siêu âm 36 tuần và hồ sơ đăng ký sinh. Giúp bác sĩ trực nắm bắt ngay nhóm máu, tiền sử thai sản để xử lý an toàn."
  },
  {
    id: "doc_cash",
    category: "document",
    name: "Tiền mặt tạm ứng & Thẻ ngân hàng",
    isCrucial: true,
    qty: "5 - 10 triệu VNĐ",
    desc: "Dùng để đóng tiền tạm ứng nhập viện ngay lập tức (nhiều viện chưa nhận chuyển khoản tại quầy cấp cứu) và chi tiêu các dịch vụ phát sinh tại viện."
  },
  {
    id: "doc_household_book",
    category: "document",
    name: "Thông tin cư trú (Số hộ khẩu cũ/VNeID định danh)",
    isCrucial: false,
    qty: "App VNeID cấp độ 2",
    desc: "Cần thiết phục vụ đối chiếu thông tin khi làm giấy chứng sinh và thủ tục khai sinh trực tuyến cho bé sau khi ra viện."
  },

  // ĐỒ DÙNG CHO MẸ (mother)
  {
    id: "mom_disposable_underwear",
    category: "mother",
    name: "Quần lót giấy dùng 1 lần (loại cotton tốt)",
    isCrucial: true,
    qty: "10 - 15 chiếc",
    desc: "Sản dịch sau sinh ra rất nhiều và liên tục. Dùng quần lót giấy sẽ cực kỳ tiện lợi, vệ sinh, không cần giặt giũ, bẩn là có thể thay bỏ luôn."
  },
  {
    id: "mom_maternity_pads",
    category: "mother",
    name: "Bỉm người lớn & Băng vệ sinh sản phụ",
    isCrucial: true,
    qty: "1 gói bỉm + 1 gói BVS dầy",
    desc: "Trong 1-2 ngày đầu sản dịch ra lượng lớn cần dùng bỉm dán người lớn để chống tràn. Các ngày sau giảm dần có thể chuyển qua băng vệ sinh sản phụ dầy."
  },
  {
    id: "mom_socks_hat",
    category: "mother",
    name: "Tất (vớ) chân ấm & Mũ trùm che tai",
    isCrucial: true,
    qty: "3 - 5 đôi tất + 1 mũ trùm",
    desc: "Sau khi vượt cạn cơ thể mẹ bị mất nhiệt, suy giảm đề kháng nên cực kỳ dễ bị lạnh đường huyết. Cần đeo tất chân và đội mũ trùm che tai ấm áp ngay lập tức."
  },
  {
    id: "mom_clothing",
    category: "mother",
    name: "Trang phục mặc khi xuất viện",
    isCrucial: false,
    qty: "1 - 2 bộ (rộng rãi, kín gió)",
    desc: "Tại viện mẹ sẽ mặc đồ của bệnh viện cung cấp. Mẹ chỉ cần chuẩn bị một bộ quần áo dài tay, chất liệu cotton thấm hút tốt và mũ/khăn ấm để mặc lúc ra viện về nhà."
  },
  {
    id: "mom_thermos_cup",
    category: "mother",
    name: "Bình giữ nhiệt & Cốc có ống hút dài",
    isCrucial: true,
    qty: "1 bình giữ nhiệt + 1 cốc ống hút",
    desc: "Uống nước ấm liên tục là bí quyết vàng kích sữa về nhanh. Cốc có ống hút giúp mẹ dễ dàng uống nước khi đang nằm truyền dịch hoặc còn đau sau mổ."
  },
  {
    id: "mom_toiletries",
    category: "mother",
    name: "Đồ dùng vệ sinh cá nhân cho mẹ",
    isCrucial: false,
    qty: "1 bộ cá nhân mini",
    desc: "Bao gồm bàn chải đánh răng lông siêu mềm (tránh ê răng), kem đánh răng, nước súc miệng sinh học, lược và dung dịch vệ sinh phụ nữ dịu nhẹ."
  },
  {
    id: "mom_breast_pump",
    category: "mother",
    name: "Máy hút sữa & Bình sữa sơ sinh",
    isCrucial: false,
    qty: "1 bộ máy hút + 1 bình sữa",
    desc: "Đặc biệt cần thiết cho mẹ sinh mổ sữa chưa về ngay, hoặc đầu ti phẳng/thụt chưa cho bé ngậm đúng khớp được. Hút kích sữa giúp tránh tắc tia và nứt đầu ti."
  },
  {
    id: "mom_breast_pads",
    category: "mother",
    name: "Miếng lót thấm sữa",
    isCrucial: false,
    qty: "12 - 15 miếng",
    desc: "Giúp thấm hút lượng sữa thừa rỉ ra bên ngoài, giữ cho ngực và áo của mẹ luôn khô thoáng, tránh ẩm mốc và vi khuẩn xâm nhập đầu ti."
  },
  {
    id: "mom_scarf_glasses",
    category: "mother",
    name: "Khăn choàng cổ & Kính râm che bụi",
    isCrucial: false,
    qty: "1 khăn + 1 kính",
    desc: "Sử dụng khi xuất viện từ phòng bệnh ra xe để tránh gió lùa, bụi bẩn ảnh hưởng đến mắt và họng của mẹ còn yếu."
  },

  // ĐỒ DÙNG CHO BÉ (baby)
  {
    id: "baby_swaddle",
    category: "baby",
    name: "Khăn quấn bé / Nhộng chũn sơ sinh",
    isCrucial: true,
    qty: "2 - 3 cái",
    desc: "Giúp quấn chặt giữ ấm, mang lại cho bé cảm giác an toàn như trong tử cung của mẹ, phòng chống giật mình giật móng hiệu quả."
  },
  {
    id: "baby_clothes",
    category: "baby",
    name: "Áo quần sơ sinh mềm (loại cúc lệch)",
    isCrucial: false,
    qty: "2 - 3 bộ dài tay",
    desc: "Bệnh viện thường cung cấp quần áo hàng ngày cho bé. Tuy nhiên mẹ nên chuẩn bị sẵn vài bộ cotton mềm mại, khuy lệch tránh cọ vào rốn bé để mặc khi ra viện."
  },
  {
    id: "baby_mitten_socks",
    category: "baby",
    name: "Mũ thóp sơ sinh & Bao tay bao chân",
    isCrucial: true,
    qty: "2 mũ + 3 - 4 bộ bao tay chân",
    desc: "Bộ phận thóp, lòng bàn tay bàn chân trẻ sơ sinh cần được giữ ấm tuyệt đối. Đồng thời bao tay giúp bé không tự cào xước mặt mình."
  },
  {
    id: "baby_diapers",
    category: "baby",
    name: "Tã dán quả sơ sinh (Size Newborn NB)",
    isCrucial: true,
    qty: "15 - 20 miếng dán",
    desc: "Những ngày đầu bé đi phân su liên tục (đại tiện nhiều lần). Tã dán sơ sinh giúp thay sửa nhanh chóng, tránh làm bé hăm tã."
  },
  {
    id: "baby_washcloths",
    category: "baby",
    name: "Khăn sữa cotton / Khăn xô muslin",
    isCrucial: true,
    qty: "20 - 30 chiếc",
    desc: "Món đồ tiêu tốn nhiều nhất! Dùng để lau sữa tràn, lau mặt cho con, lót cổ khi bú, vệ sinh lưỡi cho bé bằng nước muối sinh lý."
  },
  {
    id: "baby_underpads",
    category: "baby",
    name: "Tấm lót chống thấm sơ sinh",
    isCrucial: false,
    qty: "3 - 5 miếng lót",
    desc: "Dùng để lót dưới mông bé mỗi khi mẹ thay tã hoặc vệ sinh tại giường bệnh, tránh chất thải tràn ra ga giường phòng bệnh gây bẩn tủi."
  },
  {
    id: "baby_saline_cotton",
    category: "baby",
    name: "Nước muối sinh lý 0.9% & Tăm bông sơ sinh",
    isCrucial: true,
    qty: "5 tép nhỏ + 1 hộp tăm bông",
    desc: "Nước muối tép nhỏ vệ sinh mắt, mũi, tai bé mỗi ngày và rơ lưỡi trẻ sơ sinh sạch mảng bám sữa; tăm bông đầu cực nhỏ chuyên dụng sơ sinh."
  },
  {
    id: "baby_wet_wipes",
    category: "baby",
    name: "Khăn ướt không mùi dịu nhẹ cho bé",
    isCrucial: false,
    qty: "1 - 2 bịch",
    desc: "Hỗ trợ lau phân su dính chắc cực sạch và nhanh mà không làm trầy xước làn da siêu mỏng manh của trẻ sơ sinh."
  },
  {
    id: "baby_formula_spoon",
    category: "baby",
    name: "Sữa công thức thanh/hộp nhỏ & Thìa silicon nhỏ",
    isCrucial: false,
    qty: "1 hộp nhỏ + 1 thìa dẻo",
    desc: "Phòng khi mẹ sinh mổ sữa chưa về kịp. Chú ý pha sữa đút bằng thìa nhỏ thay vì bú bình núm giả quá sớm để bảo vệ phản xạ mút ti mẹ của con."
  }
];
