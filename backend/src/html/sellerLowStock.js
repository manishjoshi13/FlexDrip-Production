export const getSellerLowStockHTML = (
    sellerName,
    productName,
    variantDetails = 'Default Variant',
    currentStock = 0
) => {
    const isOutOfStock = currentStock <= 0;
    const alertTitle = isOutOfStock ? 'OUT OF STOCK ALERT' : 'LOW STOCK ALERT';
    const alertSubtitle = isOutOfStock ? 'Item inventory is fully depleted' : 'Item inventory is running low';
    const bannerColor = isOutOfStock ? '#b91c1c' : '#d97706'; // Red for out of stock, orange/amber for low stock.

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${alertTitle} - FlexDrip Portal</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafaf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);">
                    <!-- Header Banner -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 30px 40px; background-color: ${bannerColor}; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; font-family: 'Helvetica Neue', Arial, sans-serif;">FLEXDRIP PORTAL</h1>
                            <span style="font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #fecaca; display: block; margin-top: 5px;">${alertSubtitle}</span>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            <h2 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1c1917;">Inventory Attention Needed</h2>
                            <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Hello ${sellerName || 'Partner'},
                            </p>
                            <p style="margin: 0 0 30px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                The following item in your store has reached or fallen below your critical inventory thresholds. Please replenish the stock to prevent sales interruption.
                            </p>

                            <!-- Stock Alert Box -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; border-radius: 16px; border: 1px solid #e7e5e4; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 700;">Product Details</h3>
                                        <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #1c1917;">
                                            ${productName}
                                        </p>
                                        <p style="margin: 0 0 12px 0; font-size: 12px; color: #78716c;">
                                            Variant: ${variantDetails}
                                        </p>
                                        <div style="border-top: 1px solid #e7e5e4; margin-bottom: 12px;"></div>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="font-size: 12px; color: #78716c;">Current Stock:</td>
                                                <td align="right" style="font-size: 14px; font-weight: 800; color: ${isOutOfStock ? '#b91c1c' : '#d97706'};">
                                                    ${currentStock} units
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Restock Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/seller/dashboard" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border-radius: 12px; transition: background-color 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                            Update Inventory
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
                                You are receiving this warning alert because you are a registered seller on flexdrip.com.<br>
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
