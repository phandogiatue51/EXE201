import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag, Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function AdminTags() {
  const defaultTags = [
    "Giáo dục AI",
    "Lập trình",
    "Chương trình AI",
    "Robotics & AI",
    "Machine Learning",
  ];
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    // Load tags
    const tagsStored = localStorage.getItem("adminTags");
    if (tagsStored) {
      try {
        const parsedTags = JSON.parse(tagsStored);
        if (Array.isArray(parsedTags) && parsedTags.length > 0) {
          setTags(parsedTags);
        } else {
          localStorage.setItem("adminTags", JSON.stringify(defaultTags));
          setTags(defaultTags);
        }
      } catch (e) {
        localStorage.setItem("adminTags", JSON.stringify(defaultTags));
        setTags(defaultTags);
      }
    } else {
      localStorage.setItem("adminTags", JSON.stringify(defaultTags));
    }
  }, []);

  const handleAddTag = () => {
    if (!newTag.trim()) {
      alert("Vui lòng nhập tên tag");
      return;
    }

    if (tags.includes(newTag.trim())) {
      alert("Tag này đã tồn tại");
      return;
    }

    const updatedTags = [...tags, newTag.trim()];
    setTags(updatedTags);
    localStorage.setItem("adminTags", JSON.stringify(updatedTags));
    setNewTag("");
    alert(`Đã thêm tag "${newTag.trim()}" thành công!`);
  };

  const handleEditTag = (tag: string) => {
    setEditingTag(tag);
    setEditValue(tag);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      alert("Tên tag không được để trống");
      return;
    }

    if (editValue.trim() !== editingTag && tags.includes(editValue.trim())) {
      alert("Tag này đã tồn tại");
      return;
    }

    const updatedTags = tags.map((tag) =>
      tag === editingTag ? editValue.trim() : tag,
    );
    setTags(updatedTags);
    localStorage.setItem("adminTags", JSON.stringify(updatedTags));
    setEditingTag(null);
    setEditValue("");
    alert("Đã cập nhật tag thành công!");
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditValue("");
  };

  const handleDeleteTag = (tagToDelete: string) => {
    if (confirm(`Bạn có chắc muốn xóa tag "${tagToDelete}"?`)) {
      const updatedTags = tags.filter((tag) => tag !== tagToDelete);
      setTags(updatedTags);
      localStorage.setItem("adminTags", JSON.stringify(updatedTags));
      alert(`Đã xóa tag "${tagToDelete}" thành công!`);
    }
  };

  return (
    <div className="max-w-4xl">
      <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Quản lý Tags chương trình
        </h2>

        {/* Add New Tag */}
        <div className="mb-8">
          <div className="flex gap-3">
            <Input
              placeholder="Nhập tag mới..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              className="flex-1"
            />
            <Button onClick={handleAddTag} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Tag
            </Button>
          </div>
        </div>

        {/* Tags List */}
        <div className="space-y-3">
          {tags.map((tag) => (
            <div
              key={tag}
              className="p-4 border border-[#77E5C8] rounded-lg bg-[#77E5C8]/5 flex items-center justify-between"
            >
              {editingTag === tag ? (
                <>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                    className="flex-1 mr-3"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      className="gradient-primary"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-[#6085F0]" />
                    <span className="font-semibold text-foreground text-lg">
                      {tag}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTag(tag)}
                      className="border-[#77E5C8] hover:bg-[#77E5C8]/10"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTag(tag)}
                      className="border-red-200 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {tags.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Chưa có tag nào. Thêm tag đầu tiên!
          </p>
        )}
      </Card>
    </div>
  );
}