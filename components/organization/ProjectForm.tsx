"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Calendar, MapPin, Users, Tag, Building2, Loader2 } from "lucide-react";

interface ProjectFormProps {
  formData: {
    title: string;
    description: string;
    type: number;
    location: string;
    startDate: string;
    endDate: string;
    requiredVolunteers: number;
    categories: number[];
    status?: number;
  };
  imagePreview: string | null;
  categories: any[];
  loadingCategories: boolean;
  projectTypes: Array<{ value: number; label: string }>;
  statusOptions?: Array<{ value: number; label: string; color: string }>;
  isEdit?: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCategoryToggle: (categoryId: number, checked: boolean) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  submitText?: string;
}

export default function ProjectForm({
  formData,
  imagePreview,
  categories,
  loadingCategories,
  projectTypes,
  statusOptions,
  isEdit = false,
  onInputChange,
  onCategoryToggle,
  onImageChange,
  onImageRemove,
  onSubmit,
  loading,
  submitText = "Tạo dự án"
}: ProjectFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Hình ảnh dự án
        </label>
        <div className="flex items-center gap-6">
          <div className="w-48 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => document.getElementById('imageInput')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Tải lên hình ảnh
            </Button>
            {imagePreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-red-600 hover:text-red-700"
                onClick={onImageRemove}
              >
                Xóa ảnh
              </Button>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              PNG, JPG, GIF tối đa 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tên dự án *
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="Nhập tên dự án"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Mô tả *
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Mô tả chi tiết về dự án..."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Loại dự án *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={onInputChange}
              className="w-full px-3 py-2 border rounded-lg bg-background"
              required
            >
              <option value="">Chọn loại dự án</option>
              {projectTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Field - Only for Edit */}
          {isEdit && statusOptions && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Trạng thái *
              </label>
              <select
                name="status"
                value={formData.status || 0}
                onChange={onInputChange}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                required
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Location & Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Địa điểm & Thời gian</h3>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Địa điểm
          </label>
          <Input
            name="location"
            value={formData.location}
            onChange={onInputChange}
            placeholder="Nhập địa điểm thực hiện dự án"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ngày bắt đầu
            </label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={onInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ngày kết thúc
            </label>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={onInputChange}
            />
          </div>
        </div>
      </div>

      {/* Volunteers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Tình nguyện viên</h3>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Số lượng tình nguyện viên cần *
          </label>
          <Input
            type="number"
            name="requiredVolunteers"
            value={formData.requiredVolunteers}
            onChange={onInputChange}
            min="1"
            required
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Danh mục *</h3>
          {loadingCategories && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải danh mục...
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Chọn ít nhất một danh mục phù hợp với dự án
        </p>
        
        {loadingCategories ? (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-4 border rounded-lg bg-yellow-50">
            <p className="text-yellow-700">Không có danh mục nào khả dụng</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.categories.includes(category.id)}
                  onChange={(e) => onCategoryToggle(category.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  {category.icon && category.icon.includes('fa-') ? (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: category.color || '#4CAF50' }}
                    >
                      <span className="text-xs text-white">
                        {category.icon.replace('fa-', '').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color || '#4CAF50' }}
                    />
                  )}
                  <span className="text-sm text-foreground">
                    {category.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
        
        {formData.categories.length === 0 && !loadingCategories && categories.length > 0 && (
          <p className="text-sm text-red-600 mt-2">
            * Vui lòng chọn ít nhất một danh mục
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#77E5C8]"
        disabled={loading || loadingCategories}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          submitText
        )}
      </Button>
    </form>
  );
}