import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import ImageUploadZone from '../components/ImageUploadZone';
import Navbar from '../../buyer/components/Navbar';
import { ArrowLeft, Loader2, AlertCircle, ShoppingBag, Save, Trash2, X, Upload, Check } from 'lucide-react';
const getOptionsFromVariants = (variantsList) => {
    const optionsMap = {};
    variantsList.forEach(v => {
        const attrs = v.attributes || {};
        const entries = attrs instanceof Map ? Array.from(attrs.entries()) : Object.entries(attrs);
        entries.forEach(([key, val]) => {
            if (!optionsMap[key]) {
                optionsMap[key] = new Set();
            }
            optionsMap[key].add(val);
        });
    });
    return Object.entries(optionsMap).map(([name, set]) => ({
        name,
        values: Array.from(set)
    }));
};

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoading, error, myProducts, getProductById, updateProduct } = useProduct();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('ESSENTIALS');
    const [priceAmount, setPriceAmount] = useState('');
    const [priceCurrency, setPriceCurrency] = useState('INR');
    
    // Images States
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    // Simple Product Stock
    const [stock, setStock] = useState('0');

    // Variants States
    const [hasVariants, setHasVariants] = useState(false);
    const [options, setOptions] = useState([]); // Array of { name: String, values: [String] }
    const [variants, setVariants] = useState([]); // Array of { _id: String, attributes: Map, stock: Number, price: Number }
    const [colorImages, setColorImages] = useState([]); // Array of existing { color: String, images: [{ url, fileId }] }
    const [colorNewFilesMap, setColorNewFilesMap] = useState({}); // Maps color name -> Array of newly uploaded Files

    // Inputs for adding options
    const [newOptionName, setNewOptionName] = useState('Color'); // Defaults
    const [customOptionName, setCustomOptionName] = useState('');
    const [newTagValues, setNewTagValues] = useState({}); // Maps option name -> current text input

    const [pageLoading, setPageLoading] = useState(true);
    const [localValidationError, setLocalValidationError] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            const cachedProduct = myProducts?.find(p => p._id === id || p.id === id);
            
            if (cachedProduct) {
                populateForm(cachedProduct);
                setPageLoading(false);
            } else {
                const result = await getProductById(id);
                if (result?.success && result.product) {
                    populateForm(result.product);
                } else {
                    setLocalValidationError('Could not load product details.');
                }
                setPageLoading(false);
            }
        };

        loadProduct();
    }, [id, myProducts]);

    const populateForm = (product) => {
        setTitle(product.title || '');
        setDescription(product.description || '');
        setCategory(product.category || 'ESSENTIALS');
        setPriceAmount(product.price?.amount || '');
        setPriceCurrency(product.price?.currency || 'INR');
        setExistingImages(product.images || []);
        setStock(product.stock?.toString() || '0');
        setHasVariants(product.hasVariants || false);
        
        if (product.hasVariants && product.variants?.length > 0) {
            const extractedOptions = getOptionsFromVariants(product.variants);
            setOptions(extractedOptions);
            setVariants(product.variants);
            
            // Extract color images mapping (find unique colors and their images)
            const colorOption = extractedOptions.find(o => o.name.toLowerCase() === 'color');
            if (colorOption) {
                const extractedColorImages = [];
                colorOption.values.forEach(color => {
                    // Find first variant of this color that has images
                    const match = product.variants.find(v => {
                        const attrs = v.attributes || {};
                        const entries = attrs instanceof Map ? Array.from(attrs.entries()) : Object.entries(attrs);
                        const colorEntry = entries.find(([k]) => k.toLowerCase() === 'color');
                        return colorEntry && colorEntry[1] === color && v.images?.length > 0;
                    });
                    if (match) {
                        extractedColorImages.push({ color, images: match.images });
                    }
                });
                setColorImages(extractedColorImages);
            }
        } else {
            setOptions([]);
            setVariants([]);
            setColorImages([]);
        }
    };

    // Generate Cartesian product combinations of options
    const getCombinations = (opts) => {
        const validOptions = opts.filter(opt => opt.name && opt.values && opt.values.length > 0);
        if (validOptions.length === 0) return [];

        const recurse = (index, currentAttr) => {
            if (index === validOptions.length) {
                return [{ attributes: currentAttr, stock: 0, price: '' }];
            }

            const option = validOptions[index];
            let results = [];
            for (const val of option.values) {
                results = results.concat(recurse(index + 1, { ...currentAttr, [option.name]: val }));
            }
            return results;
        };

        return recurse(0, {});
    };

    // Whenever options change, regenerate/merge variants
    useEffect(() => {
        if (!hasVariants || pageLoading) return;

        const generated = getCombinations(options);
        
        // Merge with existing variants to preserve stock, price overrides and variantId
        const merged = generated.map(newV => {
            const match = variants.find(extV => 
                Object.keys(newV.attributes).every(k => extV.attributes[k] === newV.attributes[k])
            );
            return match ? { ...match, attributes: newV.attributes } : newV;
        });

        setVariants(merged);

        // Sync colorNewFilesMap keys with unique colors defined in option "Color"
        const colorOption = options.find(o => o.name.toLowerCase() === 'color');
        if (colorOption) {
            const currentColors = colorOption.values;
            
            // Clean up files map
            const newFilesMap = {};
            currentColors.forEach(c => {
                newFilesMap[c] = colorNewFilesMap[c] || [];
            });
            setColorNewFilesMap(newFilesMap);

            // Clean up existing color images map
            setColorImages(colorImages.filter(ci => currentColors.includes(ci.color)));
        } else {
            setColorNewFilesMap({});
            setColorImages([]);
        }
    }, [options, hasVariants, pageLoading]);

    // Add Option Handler
    const handleAddOption = () => {
        const optionName = newOptionName === 'Custom' ? customOptionName.trim() : newOptionName;
        if (!optionName) {
            setLocalValidationError('Please specify an option name.');
            return;
        }

        const nameExists = options.some(opt => opt.name.toLowerCase() === optionName.toLowerCase());
        if (nameExists) {
            setLocalValidationError(`Option "${optionName}" is already added.`);
            return;
        }

        setOptions([...options, { name: optionName, values: [] }]);
        setCustomOptionName('');
        setLocalValidationError('');
    };

    // Remove Option Handler
    const handleRemoveOption = (indexToRemove) => {
        setOptions(options.filter((_, idx) => idx !== indexToRemove));
    };

    // Add Value/Tag to Option
    const handleAddTagValue = (optionName) => {
        const value = (newTagValues[optionName] || '').trim();
        if (!value) return;

        setOptions(options.map(opt => {
            if (opt.name === optionName) {
                if (opt.values.includes(value)) return opt;
                return { ...opt, values: [...opt.values, value] };
            }
            return opt;
        }));

        setNewTagValues({ ...newTagValues, [optionName]: '' });
    };

    // Remove Value/Tag from Option
    const handleRemoveTagValue = (optionName, tagToRemove) => {
        setOptions(options.map(opt => {
            if (opt.name === optionName) {
                return { ...opt, values: opt.values.filter(val => val !== tagToRemove) };
            }
            return opt;
        }));
    };

    // Update variant stock/price overrides
    const handleUpdateVariantField = (idx, field, value) => {
        setVariants(variants.map((v, i) => {
            if (i === idx) {
                return { ...v, [field]: value };
            }
            return v;
        }));
    };

    // Delete a specific combination row (dependent variants)
    const handleDeleteCombinationRow = (idx) => {
        setVariants(variants.filter((_, i) => i !== idx));
    };

    // Handle New Color Files
    const handleColorFilesChange = (color, filesList) => {
        const filesArray = Array.from(filesList);
        setColorNewFilesMap({
            ...colorNewFilesMap,
            [color]: [...(colorNewFilesMap[color] || []), ...filesArray]
        });
    };

    // Remove a new color file
    const handleRemoveNewColorFile = (color, fileIdx) => {
        setColorNewFilesMap({
            ...colorNewFilesMap,
            [color]: colorNewFilesMap[color].filter((_, idx) => idx !== fileIdx)
        });
    };

    // Remove an existing color image
    const handleRemoveExistingColorImage = (color, imgUrl) => {
        setColorImages(colorImages.map(ci => {
            if (ci.color.toLowerCase() === color.toLowerCase()) {
                return { ...ci, images: ci.images.filter(img => img.url !== imgUrl) };
            }
            return ci;
        }).filter(ci => ci.images.length > 0));
    };

    const handleRemoveExistingImage = (indexToRemove) => {
        const removedImg = existingImages[indexToRemove];
        setExistingImages(existingImages.filter((_, idx) => idx !== indexToRemove));
        
        // Also cleanup in existing color images if it was linked
        if (removedImg) {
            setColorImages(colorImages.map(ci => ({
                ...ci,
                images: ci.images.filter(img => img.url !== removedImg.url)
            })).filter(ci => ci.images.length > 0));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalValidationError('');

        // Basic Validations
        if (!title.trim()) {
            setLocalValidationError('Product title is required.');
            return;
        }
        if (!description.trim()) {
            setLocalValidationError('Product description is required.');
            return;
        }
        if (!priceAmount || isNaN(priceAmount) || Number(priceAmount) <= 0) {
            setLocalValidationError('Please enter a valid price greater than zero.');
            return;
        }

        const totalImagesCount = existingImages.length + newImages.length;
        if (totalImagesCount === 0) {
            setLocalValidationError('Please keep or upload at least one product image.');
            return;
        }

        if (hasVariants) {
            if (options.length === 0 || options.every(o => o.values.length === 0)) {
                setLocalValidationError('Please define at least one option and add values for variants.');
                return;
            }
            if (variants.length === 0) {
                setLocalValidationError('At least one variant combination is required.');
                return;
            }
            // Check stock of all variants
            for (const v of variants) {
                if (v.stock === undefined || v.stock === '' || isNaN(v.stock) || Number(v.stock) < 0) {
                    setLocalValidationError(`Please enter a valid stock count for all variants.`);
                    return;
                }
            }
        } else {
            if (!stock || isNaN(stock) || Number(stock) < 0) {
                setLocalValidationError('Please enter a valid stock count.');
                return;
            }
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('category', category);
        formData.append('priceAmount', priceAmount.toString());
        formData.append('priceCurrency', priceCurrency);
        formData.append('existingImages', JSON.stringify(existingImages));

        if (hasVariants) {
            formData.append('hasVariants', 'true');
            
            // Compile new uploads and construct new color image mappings
            const allNewFiles = [...newImages];
            const colorNewIndices = {};
            let fileIndex = newImages.length;

            Object.entries(colorNewFilesMap).forEach(([color, files]) => {
                if (files && files.length > 0) {
                    colorNewIndices[color] = [];
                    files.forEach(file => {
                        allNewFiles.push(file);
                        colorNewIndices[color].push(fileIndex);
                        fileIndex++;
                    });
                }
            });

            // Map files to individual variants by color attribute match
            const formattedVariants = variants.map(v => {
                const attrs = v.attributes || {};
                const entries = attrs instanceof Map ? Array.from(attrs.entries()) : Object.entries(attrs);
                const colorEntry = entries.find(([k]) => k.toLowerCase() === 'color');
                const colorVal = colorEntry ? colorEntry[1] : null;

                // 1. Gather existing images for this color
                const existingColorEntry = colorImages.find(ci => ci.color.toLowerCase() === colorVal?.toLowerCase());
                const existingColorPhotos = existingColorEntry ? existingColorEntry.images : [];

                // 2. Gather new image indices for this color
                const newImageIndices = colorVal ? (colorNewIndices[colorVal] || []) : [];

                // Format price override
                let resolvedPrice = undefined;
                if (v.price && v.price !== '') {
                    if (v.price.amount !== undefined) {
                        resolvedPrice = { amount: Number(v.price.amount), currency: v.price.currency || priceCurrency };
                    } else {
                        resolvedPrice = { amount: Number(v.price), currency: priceCurrency };
                    }
                }

                return {
                    _id: v._id,
                    attributes: v.attributes,
                    stock: Number(v.stock) || 0,
                    price: resolvedPrice,
                    images: existingColorPhotos,
                    newImageIndices: newImageIndices
                };
            });

            formData.append('variants', JSON.stringify(formattedVariants));
            
            allNewFiles.forEach(file => {
                formData.append('images', file);
            });
        } else {
            formData.append('hasVariants', 'false');
            formData.append('stock', stock.toString());
            newImages.forEach(file => {
                formData.append('images', file);
            });
        }

        // Call API
        const result = await updateProduct(id, formData);
        if (result?.success) {
            navigate('/seller');
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const remainingImageCapacity = 7 - existingImages.length;

    if (pageLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-sm font-semibold">Loading product details...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10 w-full flex-grow">
                {/* Back Arrow & Title */}
                <div className="mb-8">
                    <button
                        onClick={handleBackClick}
                        className="group inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors mb-3 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Back to listings
                    </button>
                    <div className="flex items-center gap-3 border-b border-neutral-200/50 pb-6">
                        <div className="p-2 bg-black text-white rounded-xl">
                            <ShoppingBag className="w-5 h-5 stroke-[2]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                                <span>Seller Dashboard</span>
                                <span>/</span>
                                <NavLink to="/" className="hover:text-black transition-colors underline decoration-neutral-350 hover:decoration-black">Go to Home</NavLink>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Edit Product</h1>
                            <p className="text-sm text-neutral-500 font-medium">Modify listings, configure variants, adjust prices, or edit photos.</p>
                        </div>
                    </div>
                </div>

                {/* Error alerts */}
                {(localValidationError || error) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-red-800">Error</h4>
                            <p className="text-xs text-red-600 font-medium mt-0.5">{localValidationError || error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Information Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 sm:p-8 space-y-6">
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-3 border-b border-neutral-50">General Information</h3>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Vintage Denim Jacket"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={80}
                                className="w-full bg-gray-50 border border-gray-100 focus:border-gray-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400"
                            />
                            <div className="flex justify-end">
                                <span className="text-[10px] text-gray-400 font-medium">{title.length}/80 characters</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Describe materials, size guidelines, fit details, or custom notes..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={1000}
                                className="w-full bg-gray-50 border border-gray-100 focus:border-gray-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all resize-none placeholder:text-gray-400"
                            />
                            <div className="flex justify-end">
                                <span className="text-[10px] text-gray-400 font-medium">{description.length}/1000 characters</span>
                            </div>
                        </div>

                        {/* Price & Currency */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Base Price Amount</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="any"
                                    placeholder="0.00"
                                    value={priceAmount}
                                    onChange={(e) => setPriceAmount(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 focus:border-gray-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div className="col-span-1 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Currency</label>
                                <select
                                    value={priceCurrency}
                                    onChange={(e) => setPriceCurrency(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold outline-none focus:border-gray-350 cursor-pointer"
                                >
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold outline-none focus:border-gray-350 cursor-pointer"
                            >
                                <option value="ESSENTIALS">ESSENTIALS</option>
                                <option value="SHIRTS">SHIRTS</option>
                                <option value="DENIM">DENIM</option>
                                <option value="ACCESSORIES">ACCESSORIES</option>
                            </select>
                        </div>

                        {/* Current Saved Images */}
                        <div className="space-y-3 pt-2 border-t border-neutral-100">
                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                                <span>Currently Saved Base Images ({existingImages.length})</span>
                                <span>First image will be the cover</span>
                            </div>
                            {existingImages.length === 0 ? (
                                <p className="text-xs text-gray-400 font-normal italic">No saved images. Please upload new ones below.</p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                                    {existingImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl border border-gray-100 overflow-hidden group shadow-sm bg-gray-50">
                                            <img src={img.url} alt={`Saved ${idx + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(idx)}
                                                    className="p-1.5 bg-white text-gray-900 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors active:scale-90 shadow-sm cursor-pointer"
                                                    title="Delete image"
                                                >
                                                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                                </button>
                                            </div>
                                            {idx === 0 && (
                                                <div className="absolute bottom-1.5 left-1.5 bg-black/85 text-[8px] font-bold tracking-wider uppercase text-white px-1.5 py-0.5 rounded-md">
                                                    Cover
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Image Upload Zone */}
                        {remainingImageCapacity > 0 ? (
                            <div className="pt-4 border-t border-neutral-100">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Upload New Base Images</label>
                                <ImageUploadZone 
                                    images={newImages} 
                                    onChange={setNewImages}
                                    maxImages={remainingImageCapacity}
                                />
                            </div>
                        ) : (
                            <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-400 font-normal italic">
                                You have reached the maximum catalog limit of 7 images. Delete existing images above if you want to upload new ones.
                            </div>
                        )}
                    </div>

                    {/* Variant and Inventory Matrix Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 sm:p-8 space-y-6">
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-3 border-b border-neutral-50">Inventory & Variants</h3>
                        
                        <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <input
                                type="checkbox"
                                id="hasVariants"
                                checked={hasVariants}
                                onChange={(e) => setHasVariants(e.target.checked)}
                                className="w-4.5 h-4.5 rounded text-black border-neutral-300 focus:ring-black cursor-pointer accent-black"
                            />
                            <label htmlFor="hasVariants" className="text-xs font-bold uppercase tracking-wider text-neutral-800 cursor-pointer select-none">
                                This product has variant combinations (e.g. colors, sizes, fabrics)
                            </label>
                        </div>

                        {!hasVariants ? (
                            /* Simple Stock Input */
                            <div className="space-y-2 max-w-xs animate-in fade-in duration-300">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Stock Qty</label>
                                <input
                                    type="number"
                                    required={!hasVariants}
                                    min="0"
                                    placeholder="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 focus:border-gray-200 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                        ) : (
                            /* Advanced Variant Section */
                            <div className="space-y-8 animate-in fade-in duration-300">
                                {/* Option Manager */}
                                <div className="space-y-4 bg-neutral-50/50 p-5 rounded-2xl border border-neutral-100/50">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-800">1. Setup Variant Options</h4>
                                    
                                    {/* Add Option Controls */}
                                    <div className="flex flex-wrap items-end gap-3 pb-4 border-b border-neutral-200/40">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Option Name</label>
                                            <select
                                                value={newOptionName}
                                                onChange={(e) => setNewOptionName(e.target.value)}
                                                className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-neutral-350 cursor-pointer"
                                            >
                                                <option value="Color">Color (e.g. Red, Blue)</option>
                                                <option value="Size">Size (e.g. S, M, XL)</option>
                                                <option value="Fabric">Fabric (e.g. Cotton, Linen)</option>
                                                <option value="Custom">Custom...</option>
                                            </select>
                                        </div>

                                        {newOptionName === 'Custom' && (
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Custom Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Fit"
                                                    value={customOptionName}
                                                    onChange={(e) => setCustomOptionName(e.target.value)}
                                                    className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-neutral-350"
                                                />
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleAddOption}
                                            className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                                        >
                                            Add Option
                                        </button>
                                    </div>

                                    {/* Options tag builders */}
                                    <div className="space-y-4">
                                        {options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex flex-col gap-2 p-3 bg-white border border-neutral-100 rounded-xl">
                                                <div className="flex justify-between items-center border-b border-neutral-50 pb-2">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-850">{opt.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveOption(oIdx)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Tags list */}
                                                <div className="flex flex-wrap gap-1.5 py-1">
                                                    {opt.values.length === 0 ? (
                                                        <span className="text-[10px] text-gray-400 italic">No values added yet. Add tags below.</span>
                                                    ) : (
                                                        opt.values.map((val, vIdx) => (
                                                            <span key={vIdx} className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg">
                                                                {val}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveTagValue(opt.name, val)}
                                                                    className="text-gray-400 hover:text-gray-900"
                                                                >
                                                                    <X className="w-2.5 h-2.5" />
                                                                </button>
                                                            </span>
                                                        ))
                                                    )}
                                                </div>

                                                {/* Input for adding tag */}
                                                <div className="flex gap-2 max-w-xs mt-1">
                                                    <input
                                                        type="text"
                                                        placeholder={`Add value to ${opt.name}`}
                                                        value={newTagValues[opt.name] || ''}
                                                        onChange={(e) => setNewTagValues({ ...newTagValues, [opt.name]: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddTagValue(opt.name);
                                                            }
                                                        }}
                                                        className="bg-gray-50 border border-gray-100 focus:border-gray-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none flex-grow"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddTagValue(opt.name)}
                                                        className="px-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Specific Galleries (Conditional) */}
                                {options.some(o => o.name.toLowerCase() === 'color' && o.values.length > 0) && (
                                    <div className="space-y-4 bg-neutral-50/50 p-5 rounded-2xl border border-neutral-100/50">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-800">2. Color-Specific Images (Optional)</h4>
                                        <p className="text-[10px] text-gray-400 font-medium">Add images specific to color tags. Sizes of the same color inherit these photos automatically.</p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {options.find(o => o.name.toLowerCase() === 'color').values.map((col, idx) => {
                                                const existingEntry = colorImages.find(ci => ci.color.toLowerCase() === col.toLowerCase());
                                                const existingPhotos = existingEntry?.images || [];
                                                const newPhotos = colorNewFilesMap[col] || [];

                                                return (
                                                    <div key={idx} className="p-4 bg-white border border-neutral-100 rounded-xl space-y-3">
                                                        <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
                                                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-850">{col} Gallery</span>
                                                            <span className="text-[9px] font-bold text-gray-405 uppercase">Saved: {existingPhotos.length} | New: {newPhotos.length}</span>
                                                        </div>

                                                        {/* Existing Images list */}
                                                        {existingPhotos.length > 0 && (
                                                            <div className="space-y-1">
                                                                <span className="text-[8px] font-bold text-gray-450 uppercase block">Saved Photos:</span>
                                                                <div className="grid grid-cols-5 gap-1">
                                                                    {existingPhotos.map((img, iIdx) => (
                                                                        <div key={iIdx} className="relative aspect-square rounded-lg border border-neutral-100 overflow-hidden bg-neutral-50 group">
                                                                            <img src={img.url} alt="Saved" className="w-full h-full object-cover" />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveExistingColorImage(col, img.url)}
                                                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* File upload input */}
                                                        <div className="flex items-center justify-center border-2 border-dashed border-neutral-200 hover:border-black rounded-xl p-3 bg-neutral-50/35 transition-colors cursor-pointer relative">
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                onChange={(e) => handleColorFilesChange(col, e.target.files)}
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                            />
                                                            <div className="text-center space-y-1">
                                                                <Upload className="w-4.5 h-4.5 text-gray-400 mx-auto" />
                                                                <span className="text-[10px] font-semibold text-gray-500 block">Upload new photos</span>
                                                            </div>
                                                        </div>

                                                        {/* New Upload Previews */}
                                                        {newPhotos.length > 0 && (
                                                            <div className="space-y-1">
                                                                <span className="text-[8px] font-bold text-gray-455 uppercase block">New Uploads:</span>
                                                                <div className="grid grid-cols-5 gap-1">
                                                                    {newPhotos.map((file, fIdx) => (
                                                                        <div key={fIdx} className="relative aspect-square rounded-lg border border-neutral-100 overflow-hidden bg-neutral-50">
                                                                            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveNewColorFile(col, fIdx)}
                                                                                className="absolute top-1 right-1 p-0.5 bg-black/75 text-white rounded hover:bg-black transition-colors"
                                                                            >
                                                                                <X className="w-2.5 h-2.5" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Variant Matrix */}
                                {variants.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-800">3. Variant Matrix (Prices & Stock)</h4>
                                        <p className="text-[10px] text-gray-400 font-medium">Configure individual stock count and optional pricing overrides. Delete rows to deactivate dynamic combinations.</p>
                                        
                                        <div className="border border-neutral-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                        <th className="py-3.5 px-4">Variant Options</th>
                                                        <th className="py-3.5 px-4 w-36">Stock (Qty) *</th>
                                                        <th className="py-3.5 px-4 w-40">Price Override (INR)</th>
                                                        <th className="py-3.5 px-4 w-16 text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {variants.map((v, idx) => {
                                                        const label = Object.entries(v.attributes)
                                                            .map(([k, val]) => `${k}: ${val}`)
                                                            .join(' / ');
                                                        return (
                                                            <tr key={idx} className="border-b border-neutral-50 text-xs font-semibold text-neutral-700 hover:bg-neutral-50/40">
                                                                <td className="py-4 px-4 font-bold uppercase text-[10px] tracking-wide text-neutral-900">{label}</td>
                                                                <td className="py-2 px-4">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        required
                                                                        value={v.stock}
                                                                        onChange={(e) => handleUpdateVariantField(idx, 'stock', e.target.value)}
                                                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-2.5 outline-none font-semibold text-xs"
                                                                    />
                                                                </td>
                                                                <td className="py-2 px-4">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Use base price"
                                                                        min="1"
                                                                        value={v.price && typeof v.price === 'object' ? (v.price.amount !== undefined ? v.price.amount : '') : (v.price || '')}
                                                                        onChange={(e) => handleUpdateVariantField(idx, 'price', e.target.value)}
                                                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-2.5 outline-none font-semibold text-xs"
                                                                    />
                                                                </td>
                                                                <td className="py-2 px-4 text-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteCombinationRow(idx)}
                                                                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                                                        title="Delete variant"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Submit / Cancel Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleBackClick}
                            disabled={isLoading}
                            className="px-6 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-md cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 stroke-[2]" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditProduct;
