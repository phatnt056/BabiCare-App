export interface MetricEvaluation {
  metricName: string;
  actualValue: number;
  standardValue: number;
  unit: string;
  deviation: number;   // Percentage deviation (e.g. +5%)
  status: "normal" | "low" | "high" | "unknown";
  statusText: string;
  advice: string;
}

export function parseFetalMetric(str: string): { value: number; unit: string } {
  if (!str || str.toLowerCase().includes("chưa") || str.toLowerCase().includes("không")) {
    return { value: 0, unit: "" };
  }

  // Detect unit
  const lower = str.toLowerCase();
  let unit = "mm";
  if (lower.includes("cm")) {
    unit = "cm";
  } else if (lower.includes("g") || lower.includes("g")) {
    unit = "g";
  }

  // Extract all numbers inside the string
  const numbers = str.match(/[\d.]+/g);
  if (!numbers || numbers.length === 0) {
    return { value: 0, unit };
  }

  // If standard specifies a range like "14 - 16mm", calculate the average
  const parsed = numbers.map(Number);
  const sum = parsed.reduce((a, b) => a + b, 0);
  const average = sum / parsed.length;

  return { value: Math.round(average * 10) / 10, unit };
}

/**
 * Compares actual user inputs against standard ranges for the chosen week
 */
export function evaluateUltrasound(
  week: number,
  actual: {
    weight?: string;
    length?: string;
    hc?: string;
    ac?: string;
    fl?: string;
  },
  standards: {
    weight: string;
    length: string;
    hc: string;
    ac: string;
    fl: string;
  }
): MetricEvaluation[] {
  const results: MetricEvaluation[] = [];

  const metricsDefs = [
    { key: "weight", name: "Cân nặng Thai nhi", inputVal: actual.weight, stdStr: standards.weight, defaultUnit: "g" },
    { key: "length", name: "Chiều dài cơ thể", inputVal: actual.length, stdStr: standards.length, defaultUnit: "cm" },
    { key: "hc", name: "Chu vi vòng đầu (HC)", inputVal: actual.hc, stdStr: standards.hc, defaultUnit: "mm" },
    { key: "ac", name: "Chu vi vòng bụng (AC)", inputVal: actual.ac, stdStr: standards.ac, defaultUnit: "mm" },
    { key: "fl", name: "Chiều dài xương đùi (FL)", inputVal: actual.fl, stdStr: standards.fl, defaultUnit: "mm" },
  ];

  for (const def of metricsDefs) {
    if (!def.inputVal || isNaN(Number(def.inputVal)) || Number(def.inputVal) <= 0) {
      continue; // Skip if no user input provided for this metric
    }

    const actualNum = Number(def.inputVal);
    const parsedStd = parseFetalMetric(def.stdStr);

    if (parsedStd.value === 0) {
      // Standard is not measurable yet for this small week
      results.push({
        metricName: def.name,
        actualValue: actualNum,
        standardValue: 0,
        unit: parsedStd.unit || def.defaultUnit,
        deviation: 0,
        status: "unknown",
        statusText: "Chưa đối sánh được",
        advice: `Chỉ số của bé là ${actualNum}${parsedStd.unit || def.defaultUnit}. Ở tuần thứ ${week}, y khoa thường chưa phổ cập chỉ số so sánh này.`
      });
      continue;
    }

    const stdVal = parsedStd.value;
    const deviation = Math.round(((actualNum - stdVal) / stdVal) * 100 * 10) / 10;

    let status: "normal" | "low" | "high" = "normal";
    let statusText = "Cân đối tốt";
    let advice = "";

    // Tolerance thresholds (15% for weight, 10% for other measurements)
    const threshold = def.key === "weight" ? 15 : 10;

    if (deviation < -threshold) {
      status = "low";
      statusText = "Nhẹ hơn chuẩn";
    } else if (deviation > threshold) {
      status = "high";
      statusText = "Lớn hơn chuẩn";
    }

    // Set specialized advices
    if (def.key === "weight") {
      if (status === "normal") {
        advice = "Cân nặng lý tưởng tuyệt vời! Con đang chuyển hóa dinh dưỡng qua bánh nhau vô cùng ăn ý. Mẹ cứ duy trì thực đơn lành mạnh hiện tại nhé.";
      } else if (status === "low") {
        advice = "Mẹ nên nhắm tới các nhóm thực phẩm bổ sung Đạm sạch (Thịt bò, trứng gà, cá hồi, các loại hạt quả khô). Hãy ngủ sớm trước 10h tối để tăng tối đa tuần hoàn tử cung truyền dưỡng chất nuôi thai.";
      } else {
        advice = "Cân nặng của bé đang nhỉnh hơn bình thường. Mẹ nên giảm bớt tinh bột trắng lọc, hạn chế uống đồ có ga/sữa bầu quá ngọt để kiểm soát đường huyết và ngừa tiểu đường thai kỳ.";
      }
    } else if (def.key === "length") {
      if (status === "normal") {
        advice = "Chiều dài thai nhi đạt chuẩn tuyệt hảo. Con đang phát triển hệ cơ xương dài cân đối trong bọc ối ấm sáp dưỡng khí.";
      } else if (status === "low") {
        advice = "Mẹ nên chú ý bổ sung dồi dào Canxi hữu cơ kèm sắt, thực hiện phơi nắng ban mai nhẹ nhàng hoặc đi bộ chậm để hỗ trợ trao đổi vitamin D3 đẩy nhanh kích hoạt xương dài.";
      } else {
        advice = "Bé có chiều dài siêu việt! Cơ xương dài phát triển vượt chuẩn, hứa hẹn một em bé cao ráo khỏe khoắn sau này.";
      }
    } else if (def.key === "hc") {
      if (status === "normal") {
        advice = "Chu vi vòng đầu nằm trong mức cực đẹp, não bộ phát triển thông suốt cân bằng.";
      } else if (status === "low") {
        advice = "Chỉ số hơi thấp nhưng nằm trong độ dung sai chấp nhận được của tuần. Mẹ cần tham khảo thêm bác sĩ đo mốc siêu âm màu 4D để khảo sát kỹ hơn cấu trúc phế sọ của bé.";
      } else {
        advice = "Kích thước đầu lớn hơn tuổi thai một chút. Đừng quá lo lắng mẹ nhé, hãy kiểm soát siêu âm định vị mốc tiếp theo để loại trừ yếu tố cấu trúc gia đình đầu to di truyền.";
      }
    } else if (def.key === "ac") {
      if (status === "normal") {
        advice = "Cơ vòng bụng mềm mại, cơ quan tiêu hóa của con đang tự hoạt động co nén nước ối rất trôi chảy.";
      } else if (status === "low") {
        advice = "Bụng nhỏ hơn một tý so với trung bình tuần thai. Mẹ hãy chia nhỏ bữa ăn ra làm 5-6 bữa một ngày để hấp thụ dinh dưỡng hiệu quả hơn.";
      } else {
        advice = "Kích thước bụng to nhỉnh hơn, biểu hiện tích mỡ sáp khỏe mạnh. Mẹ lưu ý điều tiết bớt lượng tinh bột và trái cây cực ngọt để tránh béo phì sớm cho thai.";
      }
    } else if (def.key === "fl") {
      if (status === "normal") {
        advice = "Xương đùi phát triển đồng đều cùng các chi, mật độ canxi được duy trì chắc khỏe.";
      } else if (status === "low") {
        advice = "Xương đùi ngắn nhẹ so với chuẩn trung bình. Mẹ cần củng cố và tăng cường năng lượng canxi, uống thêm sữa tươi không đường giàu canxi và hạt hạnh nhân cô đặc.";
      } else {
        advice = "Xương đùi dài lý tưởng! Em bé mang gen chiều cao tốt, mẹ tiếp tục uống canxi đều đặn theo y lệnh.";
      }
    }

    results.push({
      metricName: def.name,
      actualValue: actualNum,
      standardValue: stdVal,
      unit: parsedStd.unit || def.defaultUnit,
      deviation,
      status,
      statusText,
      advice
    });
  }

  return results;
}
