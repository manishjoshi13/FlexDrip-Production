export const getSellerOrderCancelledHTML = (
    sellerName,
    orderId,
    items = [],
    totalAmount = 0,
    buyerName = 'Customer',
    reason = 'Cancelled by buyer'
) => {
    const itemsHtml = items.map(item => {
        const name = item.productName || (item.productId && (item.productId.title || item.productId.name)) || 'Streetwear Item';
        const price = item.price || 0;
        const qty = item.quantity || 1;
        const sizeInfo = item.size || (item.variantId && item.variantId.size) ? `Size: ${item.size || item.variantId.size}` : '';
        const colorInfo = item.color || (item.variantId && item.variantId.color) ? `Color: ${item.color || item.variantId.color}` : '';
        const variantDetails = [sizeInfo, colorInfo].filter(Boolean).join(' | ') || 'Default';

        return `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4;">
                <p style="margin: 0; font-size: 13px; font-weight: 700; color: #78716c; text-decoration: line-through;">${name}</p>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #a8a29e;">${variantDetails} | Qty: ${qty}</p>
            </td>
            <td align="right" style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; font-size: 13px; font-weight: 700; color: #a8a29e; text-decoration: line-through;">
                ₹${(price * qty).toLocaleString('en-IN')}
            </td>
        </tr>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancelled by Buyer - FlexDrip Portal</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafaf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);">
                    <!-- Header Banner -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 30px 40px; background-color: #78716c; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; font-family: 'Helvetica Neue', Arial, sans-serif;">FLEXDRIP PORTAL</h1>
                            <span style="font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #e7e5e4; display: block; margin-top: 5px;">Cancellation Alert</span>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            <h2 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1c1917;">Order Cancelled by Buyer</h2>
                            <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Hello ${sellerName || 'Partner'},
                            </p>
                            <p style="margin: 0 0 30px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                The buyer <strong>${buyerName}</strong> has cancelled order <strong>#${orderId || 'N/A'}</strong>. Please stop preparation and logistics processing for this shipment. The items have been automatically returned to your store inventory.
                            </p>

                            <!-- Cancelled Order Info -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; border-radius: 16px; border: 1px solid #e7e5e4; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 700;">Reason for Cancellation</h3>
                                        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #1c1917; font-weight: 500;">
                                            ${reason}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <div style="border-top: 1px solid #f5f5f4; margin-bottom: 20px;"></div>

                            <!-- Cancelled Items List -->
                            <h3 style="margin: 0 0 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 700;">Cancelled Items</h3>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                                <tbody>
                                    ${itemsHtml}
                                    <tr>
                                        <td style="padding: 20px 0 10px 0; font-size: 13px; font-weight: 600; color: #78716c;">Total Cancelled Value</td>
                                        <td align="right" style="padding: 20px 0 10px 0; font-size: 16px; font-weight: 800; color: #78716c; text-decoration: line-through;">
                                            ₹${Number(totalAmount).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Seller Dashboard Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/seller/dashboard" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border-radius: 12px; transition: background-color 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                            View Seller Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="border-top: 1px solid #f5f5f4;"></div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 30px 40px 40px 40px; background-color: #fafaf9;">
                            <p style="margin: 0 0 10px 0; font-size: 10px; line-height: 1.5; color: #78716c; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
                                flexdrip partner network
                            </p>
                            <p style="margin: 0; font-size: 9px; line-height: 1.4; color: #a8a29e; font-weight: 550;">
                                This is an automated email from the FlexDrip Seller Dashboard.<br>
                                © 2026 FlexDrip Clothing Co. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
