"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { mockPrograms } from "@/lib/mock-data"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft, Save } from "lucide-react"

export default function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [customPrograms, setCustomPrograms] = useState<any[]>([])
  const [categories, setCategories] = useState(["Giáo dục", "Môi trường", "Y tế", "Cộng đồng", "Bảo vệ động vật"])

  useEffect(() => {
    // Load custom programs
    const stored = localStorage.getItem("customPrograms")
    if (stored) {
      setCustomPrograms(JSON.parse(stored))
    }

    // Load tags
    const tagsStored = localStorage.getItem("adminTags")
    if (tagsStored) {
      setCategories(JSON.parse(tagsStored))
    }
  }, [])

  const allPrograms = [...mockPrograms, ...customPrograms]
  const program = allPrograms.find((p) => p.id === id)

  const [formData, setFormData] = useState({
    name: program?.name || "",
    category: program?.category || "",
    location: program?.location || "",
    startDate: program?.startDate || "",
    endDate: program?.endDate || "",
    volunteersNeeded: program?.volunteersNeeded || 10,
    domesticDescription: program?.domesticDescription || program?.description || "",
    internationalDescription: program?.internationalDescription || "",
    isInternational: program?.isInternational || false,
    duration: program?.duration || "",
    schedule: program?.schedule?.join(", ") || "",
    timeSlots: program?.timeSlots || "",
  })

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name,
        category: program.category,
        location: program.location,
        startDate: program.startDate,
        endDate: program.endDate,
        volunteersNeeded: program.volunteersNeeded,
        domesticDescription: program.domesticDescription || program.description,
        internationalDescription: program.internationalDescription || "",
        isInternational: program.isInternational || false,
        duration: program.duration || "",
        schedule: program.schedule?.join(", ") || "",
        timeSlots: program.timeSlots || "",
      })
    }
  }, [program])

  if (!user || user.role !== "organization") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Chỉ tổ chức mới có thể chỉnh sửa chương trình</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!program || program.organizationId !== user.id) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Không tìm thấy chương trình hoặc bạn không có quyền chỉnh sửa</p>
        </main>
        <Footer />
      </div>
    )
  }

  // Check if program has volunteers
  if (program.volunteersJoined > 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto p-8 border-[#77E5C8] text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Không thể chỉnh sửa</h2>
            <p className="text-muted-foreground mb-6">
              Chương trình đã có {program.volunteersJoined} tình nguyện viên tham gia. Bạn không thể chỉnh sửa chương trình này.
            </p>
            <Button asChild variant="outline">
              <Link href="/organization/dashboard">Quay lại Dashboard</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Update program
    const updatedProgram = {
      ...program,
      name: formData.name,
      category: formData.category,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      volunteersNeeded: formData.volunteersNeeded,
      domesticDescription: formData.domesticDescription,
      internationalDescription: formData.internationalDescription,
      isInternational: formData.isInternational,
      duration: formData.duration,
      schedule: formData.schedule.split(",").map((s) => s.trim()),
      timeSlots: formData.timeSlots,
      description: formData.domesticDescription, // Fallback
    }

    const updatedPrograms = customPrograms.map((p) => (p.id === id ? updatedProgram : p))
    setCustomPrograms(updatedPrograms)
    localStorage.setItem("customPrograms", JSON.stringify(updatedPrograms))

    setIsLoading(false)
    alert("Đã cập nhật chương trình!")
    router.push("/organization/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/organization/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </Button>

          <Card className="max-w-4xl mx-auto p-8 border-[#77E5C8]">
            <h1 className="text-3xl font-bold text-foreground mb-2">Chỉnh sửa chương trình</h1>
            <p className="text-muted-foreground mb-8">{program.name}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Tên chương trình *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Danh mục *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="location">Địa điểm *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="volunteersNeeded">Số tình nguyện viên cần *</Label>
                  <Input
                    id="volunteersNeeded"
                    type="number"
                    value={formData.volunteersNeeded}
                    onChange={(e) => setFormData({ ...formData, volunteersNeeded: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Ngày kết thúc *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="domesticDescription">Mô tả trong nước *</Label>
                <Textarea
                  id="domesticDescription"
                  value={formData.domesticDescription}
                  onChange={(e) => setFormData({ ...formData, domesticDescription: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isInternational"
                  checked={formData.isInternational}
                  onChange={(e) => setFormData({ ...formData, isInternational: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isInternational" className="cursor-pointer">
                  Chương trình quốc tế
                </Label>
              </div>

              {formData.isInternational && (
                <div>
                  <Label htmlFor="internationalDescription">Mô tả quốc tế</Label>
                  <Textarea
                    id="internationalDescription"
                    value={formData.internationalDescription}
                    onChange={(e) => setFormData({ ...formData, internationalDescription: e.target.value })}
                    rows={4}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="duration">Thời lượng</Label>
                  <Input
                    id="duration"
                    placeholder="VD: 3 tháng"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="schedule">Lịch trình hoạt động</Label>
                  <Input
                    id="schedule"
                    placeholder="VD: T2, T4, T6"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="timeSlots">Khung giờ hoạt động</Label>
                  <Input
                    id="timeSlots"
                    placeholder="VD: 8:00 - 17:00"
                    value={formData.timeSlots}
                    onChange={(e) => setFormData({ ...formData, timeSlots: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

