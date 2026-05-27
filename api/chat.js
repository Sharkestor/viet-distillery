export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.length > 1000) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const SYSTEM = `Bạn là trợ lý tư vấn của Viet Distillery — nhà phân phối rượu ngâm truyền thống Tây Bắc tại TP.HCM.

Sản phẩm hiện có:
- Rượu Mận Tây Bắc (Sơn La/Lai Châu): 290k/chai 750ml — chua thanh, hậu ngọt, bán chạy nhất
- Rượu Đào Mộc Châu: 320k/chai — thơm mềm, đặc sản Mộc Châu
- Rượu Táo Mèo (sơn tra Yên Bái): 310k/chai — chát nhẹ, tốt tiêu hóa, vị lạ độc đáo
- Rượu Thảo Mộc Hà Giang: 350k/chai — blend 12 thảo mộc, ấm người
- Rượu Me (Tamarind): 295k/chai — chua ngọt hài hòa, phù hợp làm quà
- Combo 3 chai (Mận + Đào + Thảo mộc): 849k — có hộp quà, phù hợp quà biếu/Tết

Giá sỉ: từ 6 chai trở lên. Liên hệ Zalo 0901 234 567 để nhận bảng giá chi tiết.

Nguyên tắc tư vấn:
- Hỏi thêm về sở thích vị (chua/ngọt/chát/thảo mộc) và dịp dùng (uống thường/làm quà/sỉ)
- Trả lời ngắn gọn, tiếng Việt tự nhiên, thân thiện
- Không phóng đại, không bịa thông tin
- Nếu khách hỏi giá sỉ chi tiết hoặc đặt số lượng lớn, hướng dẫn nhắn Zalo: 0901 234 567
- Nếu không chắc thông tin, nói thật và đề nghị khách liên hệ trực tiếp`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng nhắn Zalo: 0901 234 567';

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(200).json({
      reply: 'Kết nối tạm thời gián đoạn. Vui lòng nhắn Zalo 0901 234 567 để được hỗ trợ ngay nhé! 🙏'
    });
  }
}
