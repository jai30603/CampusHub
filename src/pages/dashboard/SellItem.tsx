import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FormInput } from '@/components/auth/FormInput';
import { SelectField } from '@/components/auth/SelectField';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import { apiRequest } from '@/services/api';
import { Upload, X, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const CONDITION_OPTIONS = [
  { label: 'Select Condition...', value: '' },
  { label: 'Brand New', value: 'Brand New' },
  { label: 'Like New', value: 'Like New' },
  { label: 'Good', value: 'Good' },
  { label: 'Fair', value: 'Fair' },
];

export const SellItem: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');

  // Category Specific Attributes State
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  // Image Upload State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest('/categories');
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleAttributeChange = (key: string, value: string) => {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (imageFiles.length + files.length > 5) {
      setError('Maximum 5 images allowed per listing.');
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedCategoryName = categories.find((c) => String(c.id) === selectedCategoryId)?.name || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !price || !selectedCategoryId || !condition || !description.trim()) {
      setError('Please fill in all required listing fields.');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Upload images if any selected
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        setIsUploadingImages(true);
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append('files', file));

        const token = localStorage.getItem('campushub_token');
        const uploadResp = await fetch('http://localhost:8000/api/v1/listings/upload-images', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const uploadData = await uploadResp.json();
        if (uploadResp.ok && uploadData.data) {
          uploadedImageUrls = uploadData.data;
        } else {
          throw new Error(uploadData.message || 'Image upload failed.');
        }
      }

      // Step 2: Post listing data to FastAPI backend
      const response = await apiRequest('/listings', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price),
          condition: condition,
          category_id: parseInt(selectedCategoryId, 10),
          attributes: attributes,
          images: uploadedImageUrls,
        }),
      });

      if (response.success) {
        navigate(ROUTES.MARKETPLACE);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to post new listing.');
    } finally {
      setIsLoading(false);
      setIsUploadingImages(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Post New Campus Listing"
        description="Sell or donate your textbooks, study notes, electronics, and dorm gear to campus peers"
      />

      {error && <ErrorMessage title="Listing Error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">1. Listing Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Item Title *"
              placeholder="e.g. Organic Chemistry 8th Edition (Wade) or TI-84 Plus Calculator"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SelectField
                label="Category *"
                options={[
                  { label: 'Select Category...', value: '' },
                  ...categories.map((c) => ({ label: c.name, value: String(c.id) })),
                ]}
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setAttributes({});
                }}
              />

              <FormInput
                label="Price ($) *"
                type="number"
                step="0.01"
                placeholder="25.00 (Set 0 for Free Donation)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <SelectField
                label="Item Condition *"
                options={CONDITION_OPTIONS}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Detailed Description *</label>
              <textarea
                rows={4}
                className="w-full p-3 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Describe item condition, highlighted pages, included accessories, campus pickup location..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Attributes Card */}
        {selectedCategoryId && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">
                2. {selectedCategoryName} Specifics (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCategoryName.includes('Books') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Author"
                    placeholder="e.g. L. G. Wade Jr."
                    value={attributes.author || ''}
                    onChange={(e) => handleAttributeChange('author', e.target.value)}
                  />
                  <FormInput
                    label="Edition"
                    placeholder="e.g. 8th Edition"
                    value={attributes.edition || ''}
                    onChange={(e) => handleAttributeChange('edition', e.target.value)}
                  />
                  <FormInput
                    label="Publisher"
                    placeholder="e.g. Pearson"
                    value={attributes.publisher || ''}
                    onChange={(e) => handleAttributeChange('publisher', e.target.value)}
                  />
                  <FormInput
                    label="Course / Semester"
                    placeholder="e.g. CHEM 2301 / Fall 2024"
                    value={attributes.semester || ''}
                    onChange={(e) => handleAttributeChange('semester', e.target.value)}
                  />
                </div>
              )}

              {selectedCategoryName.includes('Notes') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Subject / Course Code"
                    placeholder="e.g. CS 1301 Data Structures"
                    value={attributes.subject || ''}
                    onChange={(e) => handleAttributeChange('subject', e.target.value)}
                  />
                  <FormInput
                    label="Format Type"
                    placeholder="Handwritten / Printed PDF"
                    value={attributes.format || ''}
                    onChange={(e) => handleAttributeChange('format', e.target.value)}
                  />
                </div>
              )}

              {selectedCategoryName.includes('Electronics') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Brand"
                    placeholder="e.g. Apple, Dell, Sony"
                    value={attributes.brand || ''}
                    onChange={(e) => handleAttributeChange('brand', e.target.value)}
                  />
                  <FormInput
                    label="Model"
                    placeholder="e.g. MacBook Air M2 2022"
                    value={attributes.model || ''}
                    onChange={(e) => handleAttributeChange('model', e.target.value)}
                  />
                  <FormInput
                    label="Battery Health"
                    placeholder="e.g. 92% Maximum Capacity"
                    value={attributes.battery_health || ''}
                    onChange={(e) => handleAttributeChange('battery_health', e.target.value)}
                  />
                  <FormInput
                    label="Warranty Status"
                    placeholder="e.g. AppleCare+ until Dec 2025"
                    value={attributes.warranty || ''}
                    onChange={(e) => handleAttributeChange('warranty', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Multi Image Uploader Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">3. Product Images (Up to 5)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative h-28 bg-muted rounded-xl overflow-hidden group border border-border">
                  <img src={preview} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-danger transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {imageFiles.length < 5 && (
                <label
                  htmlFor="listing-image-upload"
                  className="h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center text-muted-foreground hover:text-foreground"
                >
                  <Upload className="w-6 h-6 mb-1 text-primary" />
                  <span className="text-[11px] font-semibold">Add Photo</span>
                  <span className="text-[9px]">{imageFiles.length}/5</span>
                </label>
              )}
            </div>
            <input
              id="listing-image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageFileChange}
            />
          </CardContent>
        </Card>

        <div className="pt-2">
          <LoadingButton type="submit" variant="primary" isLoading={isLoading || isUploadingImages} className="w-full">
            {isUploadingImages ? 'Uploading Images...' : 'Publish Campus Listing'}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
