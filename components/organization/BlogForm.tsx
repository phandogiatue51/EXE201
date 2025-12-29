"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/hooks/use-auth";
import { blogAPI } from "@/services/api";
import { BlogPost } from "@/lib/type";
import { ArrowLeft, Save, Eye, Upload, Plus, Trash2 } from "lucide-react";

interface BlogFormProps {
  blog?: BlogPost | null;
  isEdit?: boolean;
}

export function BlogForm({ blog = null, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const organizationId = user?.organizationId;
  const [loading, setLoading] = useState(false);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>(Array(5).fill(""));

  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    excerpt: string;
    featuredImageUrl: string;
    imageUrls: string[];
    paragraphs: string[];
    status: number;
  }>({
    title: blog?.title || "",
    subtitle: blog?.subtitle || "",
    excerpt: blog?.excerpt || "",
    featuredImageUrl: blog?.featuredImageUrl || "",
    imageUrls: [
      blog?.imageUrl1 || "",
      blog?.imageUrl2 || "",
      blog?.imageUrl3 || "",
      blog?.imageUrl4 || "",
      blog?.imageUrl5 || "",
    ],
    paragraphs: [
      blog?.paragraph1 || "",
      blog?.paragraph2 || "",
      blog?.paragraph3 || "",
      blog?.paragraph4 || "",
      blog?.paragraph5 || "",
    ],
    status: blog?.status || 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize previews when blog data is loaded
  useEffect(() => {
    if (blog) {
      if (blog.featuredImageUrl) {
        setFeaturedImagePreview(blog.featuredImageUrl);
      }
      
      const previews = [];
      for (let i = 1; i <= 5; i++) {
        const key = `imageUrl${i}` as keyof BlogPost;
        const url = blog[key];
        if (url) {
          previews[i-1] = url as string;
        }
      }
      setImagePreviews(previews);
    }
  }, [blog]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Tóm tắt là bắt buộc";
    }

    // Validate at least one paragraph has content
    const hasContent = formData.paragraphs.some(p => p.trim().length > 0);
    if (!hasContent) {
      newErrors.paragraphs = "Ít nhất một đoạn văn phải có nội dung";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number = -1) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        
        if (index === -1) {
          // Featured image
          setFeaturedImagePreview(result);
          setFormData(prev => ({ ...prev, featuredImageUrl: result }));
        } else {
          // Content image
          const newPreviews = [...imagePreviews];
          newPreviews[index] = result;
          setImagePreviews(newPreviews);
          
          const newImageUrls = [...formData.imageUrls];
          newImageUrls[index] = result;
          setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number = -1) => {
    if (index === -1) {
      // Remove featured image
      setFeaturedImagePreview(null);
      setFormData(prev => ({ ...prev, featuredImageUrl: "" }));
    } else {
      // Remove content image
      const newPreviews = [...imagePreviews];
      newPreviews[index] = "";
      setImagePreviews(newPreviews);
      
      const newImageUrls = [...formData.imageUrls];
      newImageUrls[index] = "";
      setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!organizationId) {
      alert("Không tìm thấy tổ chức");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data matching the BlogPost interface
      const blogData = {
        title: formData.title,
        subtitle: formData.subtitle,
        excerpt: formData.excerpt,
        featuredImageUrl: formData.featuredImageUrl,
        imageUrl1: formData.imageUrls[0] || null,
        imageUrl2: formData.imageUrls[1] || null,
        imageUrl3: formData.imageUrls[2] || null,
        imageUrl4: formData.imageUrls[3] || null,
        imageUrl5: formData.imageUrls[4] || null,
        paragraph1: formData.paragraphs[0] || null,
        paragraph2: formData.paragraphs[1] || null,
        paragraph3: formData.paragraphs[2] || null,
        paragraph4: formData.paragraphs[3] || null,
        paragraph5: formData.paragraphs[4] || null,
        status: formData.status,
        organizationId: parseInt(organizationId),
        authorId: Number(user?.accountId),
      };

      let result;
      if (isEdit && blog?.id) {
        result = await blogAPI.update(blog.id, blogData);
        alert("Cập nhật bài viết thành công!");
      } else {
        result = await blogAPI.create(blogData);
        alert("Tạo bài viết thành công!");
      }

      router.push(`/organization/blogs/${result.id}`);
      router.refresh();

    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Có lỗi xảy ra khi lưu bài viết!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleParagraphChange = (index: number, value: string) => {
    const newParagraphs = [...formData.paragraphs];
    newParagraphs[index] = value;
    setFormData(prev => ({ ...prev, paragraphs: newParagraphs }));
    
    if (errors.paragraphs) {
      setErrors(prev => ({ ...prev, paragraphs: "" }));
    }
  };

  const handlePreview = () => {
    const previewContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Preview: ${formData.title}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .featured-image { max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px; }
          .content-image { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
          h1 { color: #333; margin-bottom: 10px; }
          h2 { color: #666; margin-bottom: 20px; font-weight: normal; }
          .excerpt { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; font-style: italic; }
          p { line-height: 1.6; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        ${formData.featuredImageUrl ? `<img src="${formData.featuredImageUrl}" alt="${formData.title}" class="featured-image" />` : ''}
        <h1>${formData.title}</h1>
        ${formData.subtitle ? `<h2>${formData.subtitle}</h2>` : ''}
        ${formData.excerpt ? `<div class="excerpt">${formData.excerpt}</div>` : ''}
        
        ${formData.paragraphs.map((paragraph, index) => {
          const imageUrl = formData.imageUrls[index];
          let content = '';
          if (paragraph) {
            content += `<p>${paragraph}</p>`;
          }
          if (imageUrl) {
            content += `<img src="${imageUrl}" alt="Image ${index + 1}" class="content-image" />`;
          }
          return content;
        }).join('')}
      </body>
      </html>
    `;
    
    const previewWindow = window.open();
    if (previewWindow) {
      previewWindow.document.write(previewContent);
      previewWindow.document.close();
    }
  };

  const addParagraph = () => {
    // Find first empty paragraph slot
    const emptyIndex = formData.paragraphs.findIndex(p => !p.trim());
    if (emptyIndex === -1) {
      alert("Đã đạt tối đa 5 đoạn văn");
      return;
    }
    
    // You might want to scroll to the newly added paragraph
    const element = document.getElementById(`paragraph-${emptyIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="featuredImage" className="cursor-pointer">
                  <Button type="button" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Tải ảnh đại diện lên
                  </Button>
                  <input
                    id="featuredImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, -1)}
                    className="hidden"
                  />
                </Label>
                <p className="text-sm text-gray-500 mt-4">
                  Ảnh đại diện sẽ hiển thị ở đầu bài viết và trang danh sách
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG, WEBP (tối đa 5MB)
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
                      <Label htmlFor={`image-${index}`} className="cursor-pointer">
                        <Button type="button" variant="ghost" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Thêm ảnh
                        </Button>
                        <input
                          id={`image-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, index)}
                          className="hidden"
                        />
                      </Label>
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
                  <SelectItem value="2">Đã đăng</SelectItem>
                  <SelectItem value="3">Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Bài viết "Đã đăng" sẽ hiển thị công khai
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