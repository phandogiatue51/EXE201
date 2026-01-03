import { Category } from "@/lib/type";

export interface CertificateFormProps {
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