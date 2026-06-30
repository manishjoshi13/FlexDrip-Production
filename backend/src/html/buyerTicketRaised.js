export const getBuyerTicketRaisedHTML = (
    buyerName,
    ticketId,
    orderId,
    issueType,
    description
) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Support Ticket Confirmed - FlexDrip Portal</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafaf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);">
                    <!-- Header Banner -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 30px 40px; background-color: #000000; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; font-family: 'Helvetica Neue', Arial, sans-serif;">FLEXDRIP</h1>
                            <span style="font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #a8a29e; display: block; margin-top: 5px;">Ticket Confirmation</span>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            <h2 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1c1917;">We've received your request</h2>
                            <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Hello ${buyerName || 'Customer'},
                            </p>
                            <p style="margin: 0 0 30px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Your support ticket has been raised successfully <strong>via our Chatbot assistant (Flexy)</strong> for order <strong>#${orderId || 'N/A'}</strong>. Our merchant partner has been notified and is currently reviewing the issue.
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
                                        <h3 style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 700;">Category</h3>
                                        <p style="margin: 0; color: #1c1917; font-weight: 600;">${issueType}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; font-weight: 700;">Your Problem Description</h3>
                                        <p style="margin: 0; line-height: 1.5; color: #1c1917; font-weight: 500; white-space: pre-wrap;">
                                            ${description}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 30px 0; font-size: 12px; line-height: 1.6; color: #78716c; text-align: center;">
                                You can track the status of this ticket inside your FlexDrip Orders dashboard.
                            </p>

                            <!-- Buyer Dashboard Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border-radius: 12px; transition: background-color 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
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
                            <p style="margin: 0; font-size: 9px; line-height: 1.4; color: #a8a29e; font-weight: 550;">
                                This is an automated confirmation from FlexDrip Support Systems.<br>
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
