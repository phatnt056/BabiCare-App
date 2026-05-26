import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely using the guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for fetching personalized deep-dive pregnancy information
app.post("/api/pregnancy-info", async (req, res) => {
  const { week, motherAge, weightBefore, notes } = req.body;
  
  if (!week || isNaN(Number(week))) {
    return res.status(400).json({ error: "Vui lòng cung cấp tuần thai kỳ hợp lệ." });
  }

  const pregnancyWeek = Number(week);

  try {
    const prompt = `Bạn là một bác sĩ sản khoa và chuyên gia dinh dưỡng thai kỳ ưu tú với hơn 20 năm kinh nghiệm của Việt Nam. 
Hãy viết một bản "Cẩm nang & Báo cáo Sức khỏe Chuyên Sâu" bằng tiếng Việt cho người mẹ đang mang thai ở TUẦN thứ ${pregnancyWeek}.
Thông tin thêm về sản phụ nếu có:
${motherAge ? `- Tuổi hiện tại của mẹ: ${motherAge} tuổi` : ""}
${weightBefore ? `- Cân nặng trước khi mang thai: ${weightBefore} kg` : ""}
${notes ? `- Triệu chứng mệt mỏi hoặc lưu ý sức khỏe của mẹ: ${notes}` : ""}

Hãy cung cấp báo cáo chi tiết, chuyên nghiệp nhưng vô cùng ân cần, ấm áp dưới dạng Markdown với các phần cụ thể sau:

1. **🌟 Tổng quan sự phát triển kì diệu của bé ở Tuần ${pregnancyWeek}**
   - Mô tả sinh động về sự phát triển hình thái kỳ này (ví dụ: tay chân, tóc móng, tim thai, não bộ phát triển thế nào).
   - Hãy liệt kê một cách rõ ràng các chỉ số phát triển trung bình cho tuần ${pregnancyWeek} (mẹ bầu rất mong mỏi các chỉ số này):
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
   - Các triệu chứng thường gặp ở cơ thể mẹ vào tuần ${pregnancyWeek} (ốm nghén, đau lưng, ngủ kém, thay đổi nội sắc tố hoặc tâm lý...) và các mẹo dân gian/y học an toàn để làm giảm sự mệt mỏi.

4. **📅 Lịch trình Khám thai & Xét nghiệm cốt lõi tại mốc này**
   - Giải thích cho mẹ hiểu tuần ${pregnancyWeek} có nằm trong hoặc gần một mốc siêu âm đặc biệt quan trọng hay xét nghiệm sàng lọc dị tật, tiểu đường, xét nghiệm máu, tiêm phòng uốn ván nào không. Nếu có thì cần thực hiện những gì.

5. **🧘‍♀️ Chăm sóc tinh thần & Gợi ý Vận động nhẹ nhàng**
   - Bài tập phù hợp cho tuần thai này cùng mẹo chia sẻ cùng chồng hoặc thai giáo âm nhạc, tinh thần hạnh phúc.

Hãy kết luận bằng lời chúc bình an, tự tin và một ghi chú y khoa nhỏ nhắc nhở rằng báo cáo này mang tính chất định hướng khoa học và không thay thế hoàn toàn cho các chẩn đoán khám chữa trực tiếp từ bác sĩ chuyên môn chăm sóc khám thai định kỳ của mẹ.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error("Gemini API error in /api/pregnancy-info:", error);
    res.status(500).json({ error: error.message || "Không thể tải báo cáo từ bác sĩ AI." });
  }
});

// API endpoint for interactive chatbot
app.post("/api/pregnancy-chat", async (req, res) => {
  const { week, messages } = req.body;

  if (!week) {
    return res.status(400).json({ error: "Thiếu thông tin tuần thai học để hỗ trợ." });
  }

  try {
    const systemInstruction = `Bạn là "Trợ lý Bác Sĩ BaBiCare AI", trợ lý thông minh chuyên gia y khoa sản phụ khoa và tư vấn thai sản tận tâm số 1 Việt Nam. 
Bạn đang trò chuyện, gỡ rối nỗi lo và trả lời các thắc mắc chuyên biệt về sức khỏe cho mẹ bầu đang ở TUẦN THỨ ${week} của thai kỳ.
Hãy trả lời vô cùng ân cần, nhẹ nhàng, dùng từ ngữ ấm áp, gần gũi như người thân trong nhà nhưng bảo đảm tính chính xác và an toàn y khoa.
Nếu người mẹ hỏi các biểu hiện nguy hiểm trực tiếp (đau bụng quặn thắt, ra máu đỏ tươi, rỉ nước ối, thai kém máy hoặc không máy bất ngờ sau tuần 20...), hãy khuyên mẹ bình tĩnh nhưng cần đến ngay cơ sở y tế gần nhất hoặc liên hệ bác sĩ chuyên khoa phụ sản để thăm khám kịp thời, không tự điều trị qua mạng.`;

    // Map high-level history into readable formatted text for Gemini
    const formattedHistory = (messages || []).map((m: any) => {
      const roleName = m.role === "user" ? "Mẹ bầu" : "Trợ lý Bác sĩ";
      return `${roleName}: ${m.content || ""}`;
    }).join("\n");

    const promptText = `${systemInstruction}\n\nLịch sử trò chuyện cũ:\n${formattedHistory}\n\nTrợ lý Bác sĩ:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
    });

    const replyText = response.text || "Xin lỗi, tôi gặp chút gián đoạn. Mẹ bầu hỏi lại giúp tôi nhé!";
    res.json({ 
      success: true,
      reply: replyText, 
      content: replyText 
    });
  } catch (error: any) {
    console.error("Gemini API error in /api/pregnancy-chat:", error);
    res.status(500).json({ error: "Không thể nhận câu trả lời từ bác sĩ AI." });
  }
});

function extractKeywordFromUrl(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    const q = u.searchParams.get("keyword") || u.searchParams.get("q");
    if (q) return decodeURIComponent(q).trim();
    
    const parts = u.pathname.split("/");
    const lastPart = parts[parts.length - 1];
    if (lastPart) {
      const decoded = decodeURIComponent(lastPart);
      // Shopee and other platforms often encode products in url endings like "Ten-San-Pham-i.123456.7899"
      const cleaned = decoded.split("-i.")[0];
      if (cleaned && cleaned.length > 3) {
        return cleaned.replace(/-/g, " ").trim();
      }
    }
  } catch (e) {
    // catch URL parse issues
  }
  return "";
}

app.post("/api/parse-affiliate", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Vui lòng cung cấp link liên kết hợp lệ." });
  }

  // 1. Resolve short URLs (like shope.ee links)
  let resolvedUrl = url;
  try {
    const redirectRes = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      },
      redirect: "follow"
    });
    resolvedUrl = redirectRes.url || url;
  } catch (e: any) {
    console.warn("Could not follow redirect directly, using original URL:", e.message);
  }

  // 2. Fetch page and extract OG metadata or headings
  let meta: any = { title: "", description: "", imageUrl: "", headBlock: "" };
  try {
    // Standard User-Agent to prevent basic bot blocking
    const htmlRes = await fetch(resolvedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7"
      },
      signal: AbortSignal.timeout(6000)
    });

    if (htmlRes.ok) {
      const html = await htmlRes.text();
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : "";

      const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) || 
                           html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
      const ogTitle = ogTitleMatch ? ogTitleMatch[1] : "";

      const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
      const ogImage = ogImageMatch ? ogImageMatch[1] : "";

      const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
      const ogDesc = ogDescMatch ? ogDescMatch[1] : "";

      const headBlock = html.substring(0, 15000);

      meta = {
        title: ogTitle || title,
        description: ogDesc,
        imageUrl: ogImage,
        headBlock: headBlock.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // clean script tags to reduce size
      };
    }
  } catch (err: any) {
    console.warn("Could not fetch page HTML direct content:", err.message);
  }

  // 2b. Fallback keyword extraction from URLs if meta.title is empty or highly restricted
  if (!meta.title) {
    const fallbackKeyword = extractKeywordFromUrl(resolvedUrl) || extractKeywordFromUrl(url);
    if (fallbackKeyword) {
      meta.title = fallbackKeyword;
      console.log("Using fallback decoded keyword name from URLs:", fallbackKeyword);
    }
  }

  // 3. Command Gemini to intelligently extract, analyze coupons, determine best price, and find/recommend the perfect visual asset
  try {
    const prompt = `Bạn là trợ lý AI xử lý dữ liệu liên kết tiếp thị (affiliate link parser) chuyên nghiệp tại Việt Nam.
Phân tích liên kết sản phẩm và các thông tin thu thập được dưới đây để trích xuất ra:
1. Tên sản phẩm gọn gàng, súc tích (mẫu mã thực, loại bỏ chữ dán quảng cáo dư thừa, mã freeship bộc lột phụ, nhãn SKU rườm rà).
2. Giá bán tốt nhất hoàn hảo kèm chữ đ (ví dụ: "1.150.000đ" hoặc "365.000đ"). Tìm kiếm trong tiêu đề, mô tả hoặc dữ liệu thô. Nếu không thấy, hãy tự động phân tích loại sản phẩm và ước tính một khoảng giá thực tế, sát thị trường nhất tại Việt Nam của mặt hàng sản phẩm đó (ví dụ: Vitamin Elevit 100v bầu khoảng 1.150.000đ, dầu chống rạn Bio-oil 200ml khoảng 365.000đ, Sắt Blackmores hũ khoảng 195.000đ, Sữa bầu Frisomum 900g khoảng 495.000đ, kem Palmer rạn khoảng 340.000đ).
3. Ảnh đại diện hoàn hảo:
   - Nếu ảnh OG có định dạng hợp lệ (http/https và không phải ảnh banner đen/svg lỗi), hãy giữ lại.
   - Nếu không, đề cử một liên kết ảnh vuông Unsplash độ phân giải cao trích từ kho ảnh Unsplash phù hợp mô tả sản phẩm (ví dụ dưỡng da, vitamin bầu bồi bổ, ly sữa dinh dưỡng sạch, hạt ngũ cốc tự nhiên).

Dữ liệu đầu vào:
- Liên kết nhập ban đầu: ${url}
- Liên kết chuyển hướng chuẩn: ${resolvedUrl}
- Metadata trích xuất:
  + Tiêu đề sản phẩm/Từ khóa: ${meta.title || "Trống"}
  + Mô tả: ${meta.description || "Trống"}
  + Ảnh OG: ${meta.imageUrl || "Trống"}
  + Header mẫu: ${meta.headBlock ? meta.headBlock.substring(0, 3050) : "Trống"}

Hãy trả về một đối tượng JSON duy nhất theo đúng cấu trúc sau:
{
  "name": "Tên sản phẩm đẹp nhất",
  "price": "Giá bán tốt nhất kèm chữ đ",
  "imageUrl": "Link ảnh sản phẩm trực tiếp hoặc link Unsplash đại diện hoàn hảo nhất"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const textOutput = response.text || "";
    
    try {
      const parsed = JSON.parse(textOutput.trim());
      res.json({
        success: true,
        name: parsed.name || "Sản Phẩm Thai Kỳ",
        price: parsed.price || "250.000đ",
        imageUrl: parsed.imageUrl || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60"
      });
    } catch (parseErr) {
      console.warn("Could not parse Gemini JSON response direct:", textOutput);
      const nameMatch = textOutput.match(/"name"\s*:\s*"([^"]+)"/);
      const priceMatch = textOutput.match(/"price"\s*:\s*"([^"]+)"/);
      const imageMatch = textOutput.match(/"imageUrl"\s*:\s*"([^"]+)"/);
      
      res.json({
        success: true,
        name: nameMatch ? nameMatch[1] : "Sản Phẩm Tiếp Thị",
        price: priceMatch ? priceMatch[1] : "250.000đ",
        imageUrl: imageMatch ? imageMatch[1] : "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60"
      });
    }
  } catch (error: any) {
    console.error("Gemini API error in /api/parse-affiliate:", error);
    res.status(500).json({ error: "Lỗi phân tích cú pháp liên kết tự động." });
  }
});

// Vite middleware flow for developer or productive server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Development Server running on http://localhost:${PORT}`);
  });
}

startServer();
