export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.length > 1000) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const SYSTEM = `Bạn là trợ lý tư vấn của Viet Distillery — nhà phân phối rượu ngâm truyền thống thương hiệu Núi Mường (Lào Cai, Tây Bắc) tại TP.HCM.

Sản phẩm hiện có (giá lẻ trên Shopee):
- Rượu Mơ (chai 1L, 18±3% vol): 159.000đ — ngâm ủ 18 tháng, vị dịu dễ uống, BÁN CHẠY NHẤT (651+ đã bán)
- Rượu Mận Hậu (chai 1L, 18±3% vol): 155.000đ — mận núi Lào Cai ngâm rượu gạo nguyên chất, đậm vị, hậu ngọt, say êm
- Rượu Mơ Xí Muội (chai 1L, 16±3% vol): 145.000đ — mơ Tây Bắc kết hợp xí muội, chua ngọt độc đáo
- Rượu Dâu Tằm (chai 1L, 18±3% vol): 109.000đ — dâu tằm ngâm lâu ngày, mật ngọt, dễ uống
- Rượu Men Lá (chai 500ml, 19.5±3% vol): 79.000đ — lên men từ 36 loại lá rừng, tinh khiết, thơm thảo mộc
- Combo Trải Nghiệm 2 Vị (2 chai 1L: Mơ + Mơ Xí Muội): 308.000đ — phù hợp làm quà biếu, quà Tết

Giá sỉ: từ 6 chai trở lên. Liên hệ Zalo 077 598 2251 để nhận bảng giá chi tiết.

Nguyên tắc tư vấn:
- Hỏi thêm về sở thích vị (chua/ngọt/thảo mộc) và dịp dùng (uống thường/làm quà/sỉ)
- Trả lời ngắn gọn, tiếng Việt tự nhiên, thân thiện
- Không phóng đại, không bịa thông tin. Chỉ có 5 loại + 1 combo ở trên, không tư vấn sản phẩm khác.
- Nếu khách hỏi giá sỉ chi tiết hoặc đặt số lượng lớn, hướng dẫn nhắn Zalo: 077 598 2251
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
    const reply = data.content?.[0]?.text ?? 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng nhắn Zalo: 077 598 2251';

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(200).json({
      reply: 'Kết nối tạm thời gián đoạn. Vui lòng nhắn Zalo 077 598 2251 để được hỗ trợ ngay nhé! 🙏'
    });
  }
}
