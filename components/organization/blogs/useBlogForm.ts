"use client";
import { mapToCreateDtoField, mapToUpdateDtoField } from "@/lib/type";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { blogAPI } from "@/services/api";
import { BlogPost } from "@/lib/type";
import { useToast } from "@/hooks/use-toast";

interface UseBlogFormProps {
    blog?: BlogPost | null;
    isEdit?: boolean;
}

export const useBlogForm = ({ blog = null, isEdit = false }: UseBlogFormProps) => {
    const router = useRouter();
    const { user } = useAuth();
    const organizationId = user?.organizationId;
    const { toast } = useToast();
    // State
    const [loading, setLoading] = useState(false);
    const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>(Array(5).fill(""));

    // Store actual File objects for new uploads
    const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<(File | null)[]>(Array(5).fill(null));

    // Form data
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

    const [imagesToRemove, setImagesToRemove] = useState({
        featured: false,
        image1: false,
        image2: false,
        image3: false,
        image4: false,
        image5: false,
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
                    previews[i - 1] = url as string;
                }
            }
            setImagePreviews(previews);
        }
    }, [blog]);

    // Validation
    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Tiêu đề là bắt buộc";
        }

        if (!formData.excerpt.trim()) {
            newErrors.excerpt = "Tóm tắt là bắt buộc";
        }

        const hasContent = formData.paragraphs.some(p => p.trim().length > 0);
        if (!hasContent) {
            newErrors.paragraphs = "Ít nhất một đoạn văn phải có nội dung";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData.title, formData.excerpt, formData.paragraphs]);

    // Image handlers
    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number = -1) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert("Vui lòng chọn file ảnh (PNG, JPG, JPEG, WEBP).");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;

            if (index === -1) {
                // Featured image
                setFeaturedImagePreview(result);
                setFeaturedImageFile(file);
                setFormData(prev => ({ ...prev, featuredImageUrl: result }));
            } else {
                // Content image
                const newPreviews = [...imagePreviews];
                newPreviews[index] = result;
                setImagePreviews(newPreviews);

                const newFiles = [...imageFiles];
                newFiles[index] = file;
                setImageFiles(newFiles);

                const newImageUrls = [...formData.imageUrls];
                newImageUrls[index] = result;
                setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
            }
        };
        reader.readAsDataURL(file);
    }, [imagePreviews, imageFiles, formData.imageUrls]);

    const handleRemoveImage = useCallback((index: number = -1) => {
        if (index === -1) {
            setFeaturedImagePreview(null);
            setFeaturedImageFile(null);
            setFormData(prev => ({ ...prev, featuredImageUrl: "" }));
            setImagesToRemove(prev => ({ ...prev, featured: true }));
            return;
        }

        const newPreviews = [...imagePreviews];
        newPreviews[index] = "";
        setImagePreviews(newPreviews);

        const newFiles = [...imageFiles];
        newFiles[index] = null;
        setImageFiles(newFiles);

        const newImageUrls = [...formData.imageUrls];
        newImageUrls[index] = "";
        setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));

        const key = `image${index + 1}` as keyof typeof imagesToRemove;
        setImagesToRemove(prev => ({ ...prev, [key]: true }));
    }, [imagePreviews, imageFiles, formData.imageUrls]);


    // Prepare blog data for API
    const prepareBlogData = useCallback(() => {
        const baseData: Record<string, any> = {
            title: formData.title,
            subtitle: formData.subtitle,
            excerpt: formData.excerpt,
            status: formData.status,
            authorId: Number(user?.accountId),
            paragraph1: formData.paragraphs[0] || "",
            paragraph2: formData.paragraphs[1] || "",
            paragraph3: formData.paragraphs[2] || "",
            paragraph4: formData.paragraphs[3] || "",
            paragraph5: formData.paragraphs[4] || "",
        };

        if (organizationId) {
            baseData.organizationId = Number(organizationId);
        }

        const payload: Record<string, any> = {};

        const mapper = isEdit ? mapToUpdateDtoField : mapToCreateDtoField;

        // map text fields
        for (const [key, value] of Object.entries(baseData)) {
            payload[mapper(key)] = value;
        }

        // featured image
        if (featuredImageFile) {
            payload[mapper("featuredImage")] = featuredImageFile;
        } else if (isEdit && imagesToRemove.featured) {
            payload[mapper("removeFeaturedImage")] = true;
        }

        // content images
        for (let i = 0; i < 5; i++) {
            const imageKey = `image${i + 1}`;
            const removeKey = `removeImage${i + 1}`;

            if (imageFiles[i]) {
                payload[mapper(imageKey)] = imageFiles[i];
            } else if (isEdit && imagesToRemove[imageKey as keyof typeof imagesToRemove]) {
                payload[mapper(removeKey)] = true;
            }
        }

        return payload;
    }, [
        formData,
        user?.accountId,
        organizationId,
        featuredImageFile,
        imageFiles,
        imagesToRemove,
        isEdit,
    ]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const blogData = prepareBlogData();

            let result;
            if (isEdit && blog?.id) {
                const response = await blogAPI.update(blog.id, blogData);
                toast({
                    description: response.message,
                    variant: "success",
                    duration: 3000,
                });
            } else {
                const response = await blogAPI.create(blogData);
                toast({
                    description: response.message,
                    variant: "success",
                    duration: 3000,
                });
            }

            router.push(`/organization/blogs`);
            router.refresh();

        } catch (error: any) {
            console.error("Error saving blog:", error);
            toast({
                description: error?.message || "Có lỗi xảy ra!",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    }, [validateForm, prepareBlogData, isEdit, blog?.id, router]);

    // Form field handlers
    const handleChange = useCallback((field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    }, [errors]);

    const handleParagraphChange = useCallback((index: number, value: string) => {
        const newParagraphs = [...formData.paragraphs];
        newParagraphs[index] = value;
        setFormData(prev => ({ ...prev, paragraphs: newParagraphs }));

        if (errors.paragraphs) {
            setErrors(prev => ({ ...prev, paragraphs: "" }));
        }
    }, [formData.paragraphs, errors.paragraphs]);

    // Preview handler
    const handlePreview = useCallback(() => {
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
    }, [formData]);

    // Add paragraph handler
    const addParagraph = useCallback(() => {
        const emptyIndex = formData.paragraphs.findIndex(p => !p.trim());
        if (emptyIndex === -1) {
            alert("Đã đạt tối đa 5 đoạn văn");
            return;
        }

        const element = document.getElementById(`paragraph-${emptyIndex}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [formData.paragraphs]);

    return {
        // State
        loading,
        featuredImagePreview,
        imagePreviews,
        formData,
        errors,

        // Handlers
        handleImageChange,
        handleRemoveImage,
        handleSubmit,
        handleChange,
        handleParagraphChange,
        handlePreview,
        addParagraph,

        // Navigation
        router,
    };
};