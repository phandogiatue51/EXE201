"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Save, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateProgramPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([
    "Giáo dục AI",
    "Lập trình",
    "Dự án AI",
    "Robotics & AI",
    "Machine Learning",
  ]);

  useEffect(() => {
    const stored = localStorage.getItem("adminTags");
    if (stored) {
      setCategories(JSON.parse(stored));
    }
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    domesticDescription: "",
    internationalDescription: "",
    isInternational: false,
    category: "",
    location: "",
    startDate: "",
    endDate: "",
    duration: "",
    schedule: "",
    timeSlots: "",
    volunteersNeeded: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "organization") {
      alert("Chỉ tổ chức mới có thể tạo chương trình");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store in localStorage for demo
    const newProgram = {
      id: `prog-${Date.now()}`,
      ...formData,
      schedule: formData.schedule
        ? formData.schedule.split(",").map((s) => s.trim())
        : [],
      organizationId: user.id,
      organizationName: user.name,
      volunteersNeeded: parseInt(formData.volunteersNeeded),
      volunteersJoined: 0,
      status: "active",
    };

    const existingPrograms = JSON.parse(
      localStorage.getItem("customPrograms") || "[]",
    );
    localStorage.setItem(
      "customPrograms",
      JSON.stringify([...existingPrograms, newProgram]),
    );

    setIsLoading(false);
    router.push("/organization/dashboard");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!user || user.role !== "organization") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">
            Chỉ tổ chức mới có thể truy cập trang này
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/organization/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </Button>

          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Tạo chương trình mới
            </h1>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên chương trình *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      placeholder="Nhập tên chương trình"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả chung *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    required
                    rows={3}
                    placeholder="Mô tả ngắn gọn về chương trình"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isInternational"
                      checked={formData.isInternational}
                      onChange={(e) =>
                        handleInputChange("isInternational", e.target.checked)
                      }
                      className="rounded"
                    />
                    <Label htmlFor="isInternational">
                      Chương trình quốc tế
                    </Label>
                  </div>

                  {formData.isInternational && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="domesticDescription">
                          Mô tả tiếng Việt
                        </Label>
                        <Textarea
                          id="domesticDescription"
                          value={formData.domesticDescription}
                          onChange={(e) =>
                            handleInputChange(
                              "domesticDescription",
                              e.target.value,
                            )
                          }
                          rows={3}
                          placeholder="Mô tả bằng tiếng Việt"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="internationalDescription">
                          Mô tả tiếng Anh
                        </Label>
                        <Textarea
                          id="internationalDescription"
                          value={formData.internationalDescription}
                          onChange={(e) =>
                            handleInputChange(
                              "internationalDescription",
                              e.target.value,
                            )
                          }
                          rows={3}
                          placeholder="Description in English"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Địa điểm *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      required
                      placeholder="Nhập địa điểm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volunteersNeeded">
                      Số tình nguyện viên cần *
                    </Label>
                    <Input
                      id="volunteersNeeded"
                      type="number"
                      min="1"
                      value={formData.volunteersNeeded}
                      onChange={(e) =>
                        handleInputChange("volunteersNeeded", e.target.value)
                      }
                      required
                      placeholder="Nhập số lượng"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Thời lượng</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        handleInputChange("duration", e.target.value)
                      }
                      placeholder="VD: 3 tháng, 6 tháng"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule">Lịch trình hoạt động</Label>
                    <Input
                      id="schedule"
                      value={formData.schedule}
                      onChange={(e) =>
                        handleInputChange("schedule", e.target.value)
                      }
                      placeholder="VD: Thứ 2, Thứ 4, Thứ 6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeSlots">Khung giờ hoạt động</Label>
                    <Input
                      id="timeSlots"
                      value={formData.timeSlots}
                      onChange={(e) =>
                        handleInputChange("timeSlots", e.target.value)
                      }
                      placeholder="VD: 08:00 - 17:00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL hình ảnh</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#6085F0] hover:opacity-90"
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isLoading ? "Đang tạo..." : "Tạo chương trình"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/organization/dashboard")}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
