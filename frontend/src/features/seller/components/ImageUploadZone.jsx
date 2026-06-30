import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

const MAX_IMAGES = 7;
const MAX_FILE_SIZE_MB = 5;

const ImageUploadZone = ({ images, onChange, maxImages = 7 }) => {
    const [dragActive, setDragActive] = useState(false);
    const [validationError, setValidationError] = useState('');
    const fileInputRef = useRef(null);

    const validateAndAddFiles = (fileList) => {
        setValidationError('');
        const newFiles = Array.from(fileList);
        
        // Filter out non-image files
        const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== newFiles.length) {
            setValidationError('Only image files are allowed.');
            return;
        }

        // Validate size (5MB limit)
        const sizeLimit = MAX_FILE_SIZE_MB * 1024 * 1024;
        const oversizedFiles = imageFiles.filter(file => file.size > sizeLimit);
        if (oversizedFiles.length > 0) {
            setValidationError(`Some images exceed the ${MAX_FILE_SIZE_MB}MB size limit.`);
            return;
        }

        // Check if adding these would exceed max limit
        if (images.length + imageFiles.length > maxImages) {
            setValidationError(`You can upload a maximum of ${maxImages} images.`);
            return;
        }

        // Combine existing files and new ones
        onChange([...images, ...imageFiles]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndAddFiles(e.dataTransfer.files);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndAddFiles(e.target.files);
        }
    };

    const removeImage = (indexToRemove) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        onChange(updatedImages);
        setValidationError('');
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="space-y-4">
            {/* Header / Limit Tracker */}
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Product Images ({images.length}/{maxImages})</span>
                <span>Max {MAX_FILE_SIZE_MB}MB per image</span>
            </div>

            {/* Drag Drop Area */}
            <div 
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 
                    ${dragActive 
                        ? 'border-black bg-gray-50/50 scale-[0.99]' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/30'
                    }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >
                <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:scale-110 transition-transform mb-4">
                    <Upload className="w-6 h-6 text-gray-900 stroke-[1.5]" />
                </div>

                <div className="text-center">
                    <p className="text-sm font-bold text-gray-900 mb-1">
                        Drag & drop images here, or <span className="underline underline-offset-2">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 font-normal">
                        Supports PNG, JPG, JPEG, WEBP (Up to {maxImages} images)
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {validationError && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-xs text-red-600 font-medium">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{validationError}</span>
                </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mt-4">
                    {images.map((file, index) => {
                        const previewUrl = URL.createObjectURL(file);
                        return (
                            <div 
                                key={index} 
                                className="relative aspect-square rounded-xl border border-gray-100 bg-gray-50 overflow-hidden group/item shadow-sm"
                            >
                                <img 
                                    src={previewUrl} 
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                                />
                                
                                {/* Overlay / Remove Button */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(index);
                                        }}
                                        className="p-1.5 bg-white text-gray-900 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors active:scale-90 shadow-sm"
                                    >
                                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                    </button>
                                </div>

                                {/* Primary Image Badge */}
                                {index === 0 && (
                                    <div className="absolute bottom-1.5 left-1.5 bg-black/85 text-[8px] font-bold tracking-wider uppercase text-white px-1.5 py-0.5 rounded-md">
                                        Cover
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ImageUploadZone;
