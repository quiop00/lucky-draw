
/**
 * Lưu ý: File này được giữ tên cũ để tránh phải cập nhật import ở nhiều nơi,
 * nhưng logic đã được chuyển sang sử dụng các câu chúc cố định thay vì gọi AI.
 */

export const generateWinnerMessage = async (prizeName: string): Promise<string> => {
  // Chuẩn hóa tên quà để so sánh
  const name = prizeName.toLowerCase();

  if (name.includes('500.000') || name.includes('500k')) {
    return "Vạn sự như ý - Tỷ sự như mơ! Chúc mừng bạn trúng lộc 500k cực lớn, khởi đầu năm Bính Ngọ đại cát đại lợi, mã đáo thành công!";
  }
  
  if (name.includes('200.000') || name.includes('200k')) {
    return "Mã Đáo Thành Công! Chúc mừng bạn đã trúng lộc xuân 200k. Chúc năm mới công việc hanh thông, sức khỏe dồi dào, phi nước đại tới thành công!";
  }
  
  if (name.includes('100.000') || name.includes('100k')) {
    return "Phát tài phát lộc! Lộc xuân 100k đã về tay, chúc bạn năm mới bình an, gia đình hạnh phúc, mọi điều suôn sẻ như ý!";
  }

  // Câu chúc mặc định cho các phần quà khác được setup từ Admin
  return `Chúc mừng bạn đã hái được lộc xuân "${prizeName}"! Chúc bạn năm mới Bính Ngọ 2026 an khang thịnh vượng, vạn sự như ý!`;
};
