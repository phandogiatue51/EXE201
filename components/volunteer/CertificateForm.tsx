"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2, FolderOpen } from "lucide-react";
import { Category } from "@/lib/type";

interface CertificateFormProps {
  formData: {
    certificateName: string;
    certificateNumber: string;
    categoryId: string;
    issuingOrganization: string;
    issueDate: string;
    expiryDate: string;
    description: string;
  };
  categories: Category[];
  loadingCategories: boolean;
  imagePreview: string | null;
  loading: boolean;
  isViewMode?: boolean;
  onInputChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCategoryChange?: (value: string) => void;
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove?: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  submitText?: string;
}

export default function CertificateForm({
  formData,
  categories,
  loadingCategories,
  imagePreview,
  loading,
  isViewMode = false,
  onInputChange,
  onCategoryChange,
  onImageChange,
  onImageRemove,
  onSubmit,
  submitText = "Thêm chứng chỉ",
}: CertificateFormProps) {
  const readOnly = isViewMode;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <div className="flex justify-center gap-6">
          <div className="w-200 h-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-200 h-100 object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No image</p>
              </div>
            )}
          </div>
          {!readOnly && (
            <div className="flex-1">
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => document.getElementById("imageInput")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Tải lên ảnh
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={onImageRemove}
                  >
                    Xóa ảnh
                  </Button>
                )}
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, GIF tối đa 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground pb-2 border-b">
          Thông tin chứng chỉ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tên chứng chỉ *
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-foreground">
                  {formData.certificateName || "—"}
                </p>
              </div>
            ) : (
              <Input
                name="certificateName"
                value={formData.certificateName}
                onChange={onInputChange}
                required
                disabled={readOnly}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Số chứng chỉ *
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-foreground">
                  {formData.certificateNumber || "—"}
                </p>
              </div>
            ) : (
              <Input
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={onInputChange}
                required
                disabled={readOnly}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FolderOpen className="w-4 h-4 inline mr-2" />
              Phân loại *
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-foreground">
                  {categories.find(
                    (c) => c.id.toString() === formData.categoryId
                  )?.name || "—"}
                </p>
              </div>
            ) : (
              <Select
                value={formData.categoryId}
                onValueChange={onCategoryChange}
                disabled={readOnly || loadingCategories}
              >
                <SelectTrigger>
                  {loadingCategories ? (
                    <span className="text-muted-foreground">
                      Đang tải danh mục...
                    </span>
                  ) : (
                    <SelectValue placeholder="Chọn danh mục" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cấp phát bởi tổ chức *
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-foreground">
                  {formData.issuingOrganization || "—"}
                </p>
              </div>
            ) : (
              <Input
                name="issuingOrganization"
                value={formData.issuingOrganization}
                onChange={onInputChange}
                required
                disabled={readOnly}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Ngày phát hành *
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-foreground">
                  {formData.issueDate
                    ? new Date(formData.issueDate).toLocaleDateString("vi-VN")
                    : "—"}
                </p>
              </div>
            ) : (
              <Input
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={onInputChange}
                required
                disabled={readOnly}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Ngày hết hạn
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-foreground">
                  {formData.expiryDate
                    ? new Date(formData.expiryDate).toLocaleDateString("vi-VN")
                    : "—"}
                </p>
              </div>
            ) : (
              <Input
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={onInputChange}
                disabled={readOnly}
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Mô tả
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg border min-h-[80px]">
                <p className="text-foreground whitespace-pre-wrap">
                  {formData.description || "—"}
                </p>
              </div>
            ) : (
              <Textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows={3}
                placeholder="Mô tả về chứng chỉ..."
                disabled={readOnly}
              />
            )}
          </div>
        </div>
      </div>

      {!readOnly && (
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#77E5C8]"
          disabled={loading}
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
      )}
    </form>
  );
}
