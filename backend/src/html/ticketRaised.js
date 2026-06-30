export const getTicketRaisedHTML = (
    sellerName,
    ticketId,
    orderId,
    issueType,
    description,
    buyerName = 'Customer',
    buyerEmail = 'N/A',
    buyerPhone = 'N/A'
) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Support Ticket Raised - FlexDrip Portal</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafaf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);">
                    <!-- Header Banner -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 30px 40px; background-color: #000000; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; font-family: 'Helvetica Neue', Arial, sans-serif;">FLEXDRIP SUPPORT</h1>
                            <span style="font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #a8a29e; display: block; margin-top: 5px;">New Issue Ticket</span>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            <h2 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1c1917;">Support Action Required</h2>
                            <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Hello ${sellerName || 'Partner'},
                            </p>
                            <p style="margin: 0 0 30px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                A customer has raised a support ticket for order <strong>#${orderId || 'N/A'}</strong>. Please review their problem and resolve it on your seller dashboard.
                            </p>

                            <!-- Ticket Details Info -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; border-radius: 16px; border: 1px solid #e7e5e4; margin-bottom: 25px; font-size: 13px;">
                                <tr>
                                    <td style="padding: 20px; border-bottom: 1px solid #e7e5e4;">
                                        <h3 style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 700;">Ticket ID</h3>
                                        <p style="margin: 0; color: #1c1917; font-weight: 600; font-family: monospace;">#${ticketId}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px; border-bottom: 1px solid #e7e5e4;">
                                        <h3 style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 700;">Issue Type</h3>
                                        <p style="margin: 0; color: #1c1917; font-weight: 600;">${issueType}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px; border-bottom: 1px solid #e7e5e4;">
                                        <h3 style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 700;">Customer Description</h3>
                                        <p style="margin: 0; line-height: 1.5; color: #1c1917; font-weight: 500;">
                                            ${description}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 700;">Customer Contact</h3>
                                        <p style="margin: 0 2px 0 0; color: #1c1917; font-weight: 600; font-size: 12px;">Name: ${buyerName}</p>
                                        <p style="margin: 2px 0 0 0; color: #57534e; font-weight: 500; font-size: 12px;">Email: ${buyerEmail} | Phone: ${buyerPhone}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Seller Dashboard Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/seller/tickets" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border-radius: 12px; transition: background-color 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                            View Support Tickets
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
                                This is an automated notification from FlexDrip Support Systems.<br>
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
