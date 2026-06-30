import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['SHIRTS', 'DENIM', 'ACCESSORIES', 'ESSENTIALS'],
        default: 'ESSENTIALS'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true,
            enum: ['INR', 'USD', 'EUR', 'GBP'],
            default: 'INR'
        }
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            fileId: {
                type: String
            }
        }
    ],
    hasVariants: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 0 // Stock for simple products
    },
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    },
                    fileId: {
                        type: String
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                amount: {
                    type: Number
                },
                currency: {
                    type: String,
                    enum: ['INR', 'USD', 'EUR', 'GBP']
                }
            }
        }
    ]
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema)
