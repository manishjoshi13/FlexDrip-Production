export const getOrderPlacedHTML = (fullName, orderId, items = [], totalAmount = 0, shippingAddress = {}) => {
    const formattedAddress = typeof shippingAddress === 'object' && shippingAddress
        ? `${shippingAddress.addressLine || ''}, ${shippingAddress.city || ''}, ${shippingAddress.state || ''} - ${shippingAddress.postalCode || ''}`.replace(/^,\s*|,\s*$/g, '')
        : shippingAddress || 'N/A';

    const itemsHtml = items.map(item => {
        const name = item.productName || (item.productId && (item.productId.title || item.productId.name)) || 'Streetwear Item';
        const price = item.price || 0;
        const qty = item.quantity || 1;
        const sizeInfo = item.size || (item.variantId && item.variantId.size) ? `Size: ${item.size || item.variantId.size}` : '';
        const colorInfo = item.color || (item.variantId && item.variantId.color) ? `Color: ${item.color || item.variantId.color}` : '';
        const variantDetails = [sizeInfo, colorInfo].filter(Boolean).join(' | ') || 'Default';

        return `
        <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f4;">
                <p style="margin: 0; font-size: 13px; font-weight: 700; color: #1c1917;">${name}</p>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #78716c;">${variantDetails} | Qty: ${qty}</p>
            </td>
            <td align="right" style="padding: 16px 0; border-bottom: 1px solid #f5f5f4; font-size: 13px; font-weight: 700; color: #1c1917;">
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
    <title>Your FlexDrip Order Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafaf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);">
                    <!-- Header Banner -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 30px 40px; background-color: #000000; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; color: #ffffff; font-family: 'Helvetica Neue', Arial, sans-serif;">FLEXDRIP</h1>
                            <span style="font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #a8a29e; display: block; margin-top: 5px;">Order Confirmed</span>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            <h2 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1c1917;">Thank You For Your Order</h2>
                            <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Hello ${fullName || 'there'},
                            </p>
                            <p style="margin: 0 0 30px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Your order has been placed successfully and is being prepared. Here is a summary of your streetwear collection purchase.
                            </p>

                            <!-- Order Details Info -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                                <tr>
                                    <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 600; padding-bottom: 5px;">
                                        Order ID
                                    </td>
                                    <td align="right" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 600; padding-bottom: 5px;">
                                        Date
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 13px; font-weight: 700; color: #1c1917;">
                                        #${orderId || 'N/A'}
                                    </td>
                                    <td align="right" style="font-size: 13px; font-weight: 700; color: #1c1917;">
                                        ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </td>
                                </tr>
                            </table>

                            <div style="border-top: 1px solid #f5f5f4; margin-bottom: 15px;"></div>

                            <!-- Items Table -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                                <thead>
                                    <tr>
                                        <th align="left" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 600; padding-bottom: 8px;">Item</th>
                                        <th align="right" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 600; padding-bottom: 8px;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                    <!-- Order Total -->
                                    <tr>
                                        <td style="padding: 20px 0 10px 0; font-size: 13px; font-weight: 600; color: #78716c;">Total Amount</td>
                                        <td align="right" style="padding: 20px 0 10px 0; font-size: 16px; font-weight: 800; color: #1c1917;">
                                            ₹${Number(totalAmount).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Shipping Address Card -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; border-radius: 16px; border: 1px solid #e7e5e4;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 700;">Shipping Address</h3>
                                        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #1c1917; font-weight: 500;">
                                            ${formattedAddress}
                                        </p>
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
                                flexdrip clothing co.
                            </p>
                            <p style="margin: 0; font-size: 9px; line-height: 1.4; color: #a8a29e; font-weight: 550;">
                                You are receiving this email because you made a purchase on flexdrip.com.<br>
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
