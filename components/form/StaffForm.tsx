"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Upload,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function StaffForm({
  formData,
  imagePreview,
  isEdit,
  showPassword,
  loading,
  staffRoles,
  onInputChange,
  onGenderChange,
  onRoleChange,
  onImageChange,
  onImageRemove,
  onPasswordToggle,
  onSubmit,
  submitText = "Thêm nhân sự"
}: StaffFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Ảnh đại diện {!isEdit && "(tùy chọn)"}
        </label>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
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
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => document.getElementById('imageInput')?.click()}
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
                PNG, JPG, GIF tối đa 5MB. Tỉ lệ 1:1 khuyến khích.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Account Info */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground pb-2 border-b">
          Thông tin tài khoản
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Họ và tên *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email *
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="user@example.com"
              required
            />
          </div>

          {/* Password fields - only for create */}
          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mật khẩu *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password || ""}
                    onChange={onInputChange}
                    placeholder="Ít nhất 6 ký tự"
                    required={!isEdit}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={onPasswordToggle}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Xác nhận mật khẩu *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword || ""}
                    onChange={onInputChange}
                    placeholder="Nhập lại mật khẩu"
                    required={!isEdit}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Personal Info */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground pb-2 border-b">
          Thông tin cá nhân
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Số điện thoại
            </label>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={onInputChange}
              placeholder="0123 456 789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ngày sinh
            </label>
            <Input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={onInputChange}
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.isFemale === true}
                  onChange={() => onGenderChange(true)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-foreground">Nữ</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.isFemale === false}
                  onChange={() => onGenderChange(false)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-foreground">Nam</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground pb-2 border-b">
          Vai trò trong tổ chức
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staffRoles.map((role) => (
            <label
              key={role.value}
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${formData.role === role.value
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={formData.role === role.value}
                onChange={() => onRoleChange(role.value)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">
                  {role.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {role.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Status - Only for edit */}
      {isEdit && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground pb-2 border-b">
            Trạng thái
          </h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isActive"
                checked={formData.isActive === true}
                onChange={() => onInputChange({
                  target: { name: 'isActive', value: 'true' }
                } as React.ChangeEvent<HTMLInputElement>)}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-green-700">Đang hoạt động</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isActive"
                checked={formData.isActive === false}
                onChange={() => onInputChange({
                  target: { name: 'isActive', value: 'false' }
                } as React.ChangeEvent<HTMLInputElement>)}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-red-700">Ngừng hoạt động</span>
            </label>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!isEdit && (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-yellow-800">
                Về vai trò
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• <strong>Quản lý</strong>: Có quyền quản lý toàn bộ tổ chức, bao gồm thêm/xóa nhân sự</li>
                <li>• <strong>Người duyệt</strong>: Có quyền duyệt đơn đăng ký chương trình từ tình nguyện viên</li>
                <li>• <strong>Nhân viên</strong>: Thành viên thông thường, có thể tham gia quản lý chương trình</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
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
    </form>
  );
}