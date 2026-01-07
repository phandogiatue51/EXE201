export interface ProjectFormProps {
  formData: any;
  imagePreview: string | null;
  categories: any[];
  loadingCategories: boolean;
  projectTypes?: { value: string | number; label: string }[];
  statusOptions?: { value: number; label: string }[];
  isEdit?: boolean;
  isViewMode?: boolean;
  onInputChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onCategoryToggle?: (categoryId: number, checked: boolean) => void;
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove?: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  loading?: boolean;
  submitText?: string;
}