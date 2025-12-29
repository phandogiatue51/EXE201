"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BlogFormFieldsProps {
  formData: {
    title: string;
    subtitle: string;
    excerpt: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export function BlogFormFields({ formData, errors, onChange }: BlogFormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <Label htmlFor="title" className="text-base font-medium mb-2 block">
          Tiêu đề bài viết *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
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
          onChange={(e) => onChange("subtitle", e.target.value)}
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
          onChange={(e) => onChange("excerpt", e.target.value)}
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
  );
}