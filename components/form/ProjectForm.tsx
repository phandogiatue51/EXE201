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
import {
  Upload,
  Calendar,
  MapPin,
  Users,
  Tag,
  Building2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ProjectStatusBadge,
  toProjectStatus,
} from "@/components/status-badge/ProjectStatusBadge";
import { ProjectFormProps } from "@/lib/interface/ProjectFormProps";

export default function ProjectForm({
  formData,
  imagePreview,
  categories,
  loadingCategories,
  projectTypes,
  statusOptions = [],
  isEdit = false,
  isViewMode = false,
  onInputChange,
  onCategoryToggle,
  onImageChange,
  onImageRemove,
  onSubmit,
  loading,
  submitText = "Tạo chương trình",
}: ProjectFormProps) {
  const readOnly = isViewMode;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Image Section */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Hình ảnh chương trình
        </label>
        <div className="flex items-center gap-6">
          <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
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
          {!readOnly && (
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
                onClick={() => document.getElementById("imageInput")?.click()}
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
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tên chương trình *
          </label>
          {readOnly ? (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-foreground font-medium">
                {formData.title || "—"}
              </p>
            </div>
          ) : (
            <Input
              name="title"
              value={formData.title}
              onChange={onInputChange}
              placeholder="Nhập tên chương trình"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Mô tả *
          </label>
          {readOnly ? (
            <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
              <p className="text-foreground whitespace-pre-wrap">
                {formData.description || "—"}
              </p>
            </div>
          ) : (
            <Textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="Mô tả chi tiết về chương trình..."
              rows={4}
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Thử thách
          </label>
          {readOnly ? (
            <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
              <p className="text-foreground whitespace-pre-wrap">
                {formData.challenges || "—"}
              </p>
            </div>
          ) : (
            <Textarea
              name="challenges"
              value={formData.challenges}
              onChange={onInputChange}
              placeholder="Thử thách của chương trình..."
              rows={4}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Mục tiêu *
          </label>
          {readOnly ? (
            <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
              <p className="text-foreground whitespace-pre-wrap">
                {formData.goals || "—"}
              </p>
            </div>
          ) : (
            <Textarea
              name="goals"
              value={formData.goals}
              onChange={onInputChange}
              placeholder="Mục tiêu của chương trình..."
              rows={4}
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Hoạt động *
          </label>
          {readOnly ? (
            <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
              <p className="text-foreground whitespace-pre-wrap">
                {formData.activities || "—"}
              </p>
            </div>
          ) : (
            <Textarea
              name="activities"
              value={formData.activities}
              onChange={onInputChange}
              placeholder="Hoạt động diễn ra trong chương trình..."
              rows={4}
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Sự ảnh hưởng
          </label>
          {readOnly ? (
            <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
              <p className="text-foreground whitespace-pre-wrap">
                {formData.impacts || "—"}
              </p>
            </div>
          ) : (
            <Textarea
              name="impacts"
              value={formData.impacts}
              onChange={onInputChange}
              placeholder=" Sự ảnh hưởng cua chương trình..."
              rows={4}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Quyền lợi
          </label>
          {readOnly ? (
            <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
              <p className="text-foreground whitespace-pre-wrap">
                {formData.benefits || "—"}
              </p>
            </div>
          ) : (
            <Textarea
              name="benefits"
              value={formData.benefits}
              onChange={onInputChange}
              placeholder="Quyền lợi của tình nguyện viên..."
              rows={4}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Yêu cầu *
          </label>
          {readOnly ? (
            <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
              <p className="text-foreground whitespace-pre-wrap">
                {formData.requirements || "—"}
              </p>
            </div>
          ) : (
            <Textarea
              name="requirements"
              value={formData.requirements}
              onChange={onInputChange}
              placeholder="Yêu cầu về tình nguyện viên..."
              rows={4}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Loại chương trình *
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-foreground">
                  {projectTypes?.find((t) => t.value === formData.type)
                    ?.label ||
                    formData.type ||
                    "—"}
                </p>
              </div>
            ) : (
              <Select
                value={formData.type?.toString() || ""}
                onValueChange={(value) => {
                  if (onInputChange) {
                    const syntheticEvent = {
                      target: {
                        name: "type",
                        value: parseInt(value),
                      },
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    onInputChange(syntheticEvent);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại chương trình" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes?.map((type) => (
                    <SelectItem key={type.value} value={type.value.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {(isEdit || readOnly) && statusOptions && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Trạng thái *
              </label>
              {readOnly ? (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <ProjectStatusBadge
                    status={toProjectStatus(formData.status || 0)}
                    showIcon={true}
                    showText={true}
                    size="sm"
                  />
                </div>
              ) : (
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
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Địa điểm & Thời gian
        </h3>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Địa điểm
          </label>
          {readOnly ? (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-foreground">{formData.location || "—"}</p>
            </div>
          ) : (
            <Input
              name="location"
              value={formData.location}
              onChange={onInputChange}
              placeholder="Nhập địa điểm thực hiện chương trình"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ngày bắt đầu
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-foreground">
                  {formData.startDate
                    ? new Date(formData.startDate).toLocaleString("vi-VN")
                    : "—"}
                </p>
              </div>
            ) : (
              <Input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={onInputChange}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ngày kết thúc
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-foreground">
                  {formData.endDate
                    ? new Date(formData.endDate).toLocaleString("vi-VN")
                    : "—"}
                </p>
              </div>
            ) : (
              <Input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={onInputChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Volunteers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Tình nguyện viên
        </h3>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Số lượng tình nguyện viên cần *
          </label>
          {readOnly ? (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-foreground">
                {formData.requiredVolunteers || "0"}
              </p>
            </div>
          ) : (
            <Input
              type="number"
              name="requiredVolunteers"
              value={formData.requiredVolunteers}
              onChange={onInputChange}
              min="1"
              required
            />
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Danh mục *</h3>
          {loadingCategories && !readOnly && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải danh mục...
            </div>
          )}
        </div>
        {!readOnly && (
          <p className="text-sm text-muted-foreground mb-2">
            Chọn ít nhất một danh mục phù hợp với chương trình
          </p>
        )}

        {loadingCategories && !readOnly ? (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-4 border rounded-lg bg-yellow-50">
            <p className="text-yellow-700">Không có danh mục nào khả dụng</p>
          </div>
        ) : readOnly ? (
          // View mode: show selected categories as badges
          <div className="flex flex-wrap gap-2">
            {formData.categories && formData.categories.length > 0 ? (
              formData.categories.map((categoryId: number) => {
                const category = categories.find((c) => c.id === categoryId);
                if (!category) return null;
                return (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    style={{
                      backgroundColor: category.color || "#4CAF50",
                      color: "white",
                    }}
                  >
                    {category.name}
                  </Badge>
                );
              })
            ) : (
              <p className="text-muted-foreground">Không có danh mục nào</p>
            )}
          </div>
        ) : (
          // Form mode: show checkboxes
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.categories?.includes(category.id) || false}
                  onChange={(e) =>
                    onCategoryToggle?.(category.id, e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  {category.icon && category.icon.includes("fa-") ? (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: category.color || "#4CAF50" }}
                    >
                      <span className="text-xs text-white">
                        {category.icon
                          .replace("fa-", "")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color || "#4CAF50" }}
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

        {!readOnly &&
          formData.categories?.length === 0 &&
          !loadingCategories &&
          categories.length > 0 && (
            <p className="text-sm text-red-600 mt-2">
              * Vui lòng chọn ít nhất một danh mục
            </p>
          )}
      </div>

      {/* Submit Button - Only show in form mode */}
      {!readOnly && (
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
      )}
    </form>
  );
}
