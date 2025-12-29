"use client";

import { useBlogForm } from "./useBlogForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogPost } from "@/lib/type";
import { ArrowLeft, Save, Eye, Upload, Plus, Trash2 } from "lucide-react";

interface BlogFormProps {
  blog?: BlogPost | null;
  isEdit?: boolean;
}

export function BlogForm({ blog = null, isEdit = false }: BlogFormProps) {
  const {
    loading,
    featuredImagePreview,
    imagePreviews,
    formData,
    errors,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
    handleChange,
    handleParagraphChange,
    handlePreview,
    addParagraph,
    router,
  } = useBlogForm({ blog, isEdit });

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      {/* Back button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      {/* Main Form */}
      <div className="space-y-8">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Thông tin cơ bản</h2>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-base font-medium mb-2 block">
                Tiêu đề bài viết *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Nhập tiêu đề bài viết"
                className={`text-lg ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Subtitle */}
            <div>
              <Label htmlFor="subtitle" className="text-base font-medium mb-2 block">
                Phụ đề
              </Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Nhập phụ đề (nếu có)"
              />
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt" className="text-base font-medium mb-2 block">
                Tóm tắt bài viết *
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                rows={3}
                className={`${errors.excerpt ? "border-red-500" : ""}`}
              />
              {errors.excerpt && (
                <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Tóm tắt sẽ hiển thị ở trang danh sách bài viết
              </p>
            </div>
          </div>
        </Card>

        {/* Featured Image */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Ảnh đại diện</h2>
          
          <div className="space-y-4">
            {featuredImagePreview ? (
              <div className="relative">
                <img
                  src={featuredImagePreview}
                  alt="Featured preview"
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveImage(-1)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                
                <label htmlFor="featuredImage" className="cursor-pointer inline-block">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => document.getElementById('featuredImage')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Tải ảnh đại diện lên
                  </Button>
                </label>
                
                <input
                  id="featuredImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, -1)}
                  className="hidden"
                />
                
                <p className="text-sm text-gray-500 mt-4">
                  Ảnh đại diện sẽ hiển thị ở đầu bài viết và trang danh sách
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG, JPEG, WEBP (tối đa 5MB)
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Content Sections */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Nội dung bài viết</h2>
            <Button
              type="button"
              variant="outline"
              onClick={addParagraph}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm đoạn văn
            </Button>
          </div>

          {errors.paragraphs && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.paragraphs}</p>
            </div>
          )}

          <div className="space-y-8">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} id={`paragraph-${index}`} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">
                    Đoạn văn {index + 1}
                  </h3>
                  {(formData.paragraphs[index] || imagePreviews[index]) && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Đã có nội dung
                    </span>
                  )}
                </div>

                {/* Image Upload for this paragraph */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">
                    Ảnh cho đoạn văn {index + 1}
                  </Label>
                  {imagePreviews[index] ? (
                    <div className="relative">
                      <img
                        src={imagePreviews[index]}
                        alt={`Paragraph ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                      <label htmlFor={`image-${index}`} className="cursor-pointer inline-block">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => document.getElementById(`image-${index}`)?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Thêm ảnh
                        </Button>
                      </label>
                      
                      <input
                        id={`image-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, index)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Paragraph Text */}
                <div>
                  <Label htmlFor={`paragraph-${index}`} className="text-sm font-medium mb-2 block">
                    Nội dung đoạn văn {index + 1}
                  </Label>
                  <Textarea
                    id={`paragraph-${index}`}
                    value={formData.paragraphs[index]}
                    onChange={(e) => handleParagraphChange(index, e.target.value)}
                    placeholder={`Nhập nội dung đoạn văn ${index + 1}...`}
                    rows={5}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Status & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Trạng thái</h2>
            <div className="space-y-4">
              <Select
                value={formData.status.toString()}
                onValueChange={(value) => handleChange("status", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Bản nháp</SelectItem>
                  <SelectItem value="2">Đăng công khai</SelectItem>
                  <SelectItem value="3">Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Bài viết "Đăng công khai" sẽ hiển thị công khai
              </p>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Hành động</h2>
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#77E5C8]"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Đang lưu..." : isEdit ? "Cập nhật bài viết" : "Tạo bài viết"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </Button>

              <div className="text-sm text-gray-500 mt-4">
                <p className="font-medium">Lưu ý:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Tiêu đề và tóm tắt là bắt buộc</li>
                  <li>Cần ít nhất một đoạn văn có nội dung</li>
                  <li>Ảnh đại diện sẽ hiển thị ở trang danh sách</li>
                  <li>Bài viết "Đã đăng" sẽ hiển thị công khai</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}