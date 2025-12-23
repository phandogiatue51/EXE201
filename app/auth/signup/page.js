import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { accountAPI } from "@/services/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [role] = useState("volunteer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    dateOfBirth: "",
    isFemale: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || null,
        dateOfBirth: formData.dateOfBirth || null,
        isFemale: formData.isFemale,
      };

      const result = await accountAPI.signUp(signupData);
      
      console.log("Signup successful:", result);
      
      alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      navigate("/auth/login");
      
    } catch (err) {
      console.error("Signup error:", err);
      
      const errorMessage = err?.message || err?.toString() || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl p-8 border-[#77E5C8]">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Đăng ký tài khoản
          </h1>
          <p className="text-muted-foreground mb-8">
            Tạo tài khoản mới để bắt đầu
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Đăng ký với vai trò Tình nguyện viên
              </label>
            </div>

            <div className="min-h-[480px]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Họ và tên
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={"Nguyễn Văn A"}
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="0123456789"
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mật khẩu
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Giới tính
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isFemale"
                        checked={formData.isFemale === true}
                        onChange={() => setFormData({...formData, isFemale: true})}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      Nữ
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isFemale"
                        checked={formData.isFemale === false}
                        onChange={() => setFormData({...formData, isFemale: false})}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      Nam
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-90 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                to="/auth/login"
                className="text-[#6085F0] hover:underline font-semibold"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}