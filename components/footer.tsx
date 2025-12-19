"use client";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Together</h3>
            <p className="text-muted-foreground text-sm">
              Nền tảng kết nối tình nguyện viên với các chương trình thiện
              nguyện
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Liên kết</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-[#6085F0] transition">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/programs" className="hover:text-[#6085F0] transition">
                  Chương trình
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#6085F0] transition">
                  Về chúng tôi
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/help" className="hover:text-[#6085F0] transition">
                  Trợ giúp
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#6085F0] transition">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-[#6085F0] transition">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Pháp lý</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/privacy" className="hover:text-[#6085F0] transition">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-[#6085F0] transition">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Together. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
