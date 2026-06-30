export const getAccountRegisteredHTML = (fullName, frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173') => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to FlexDrip</title>
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
                            <span style="font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #a8a29e; display: block; margin-top: 5px;">Welcome to the family</span>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            <h2 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1c1917;">A New Standard of Style</h2>
                            <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Hello ${fullName || 'there'},
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Welcome to FlexDrip. We believe streetwear is more than just clothing; it is a canvas of self-expression. Our collections focus on heavy premium fabrics, clean structural shapes, and minimalist earth tones designed to outlast temporary trends.
                            </p>
                            <p style="margin: 0 0 30px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Log in to your profile now to complete your setup, browse our latest oversized collections, and prepare your first order.
                            </p>
                            
                            <!-- Button CTA -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <a href="${frontendUrl}" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border-radius: 12px; transition: background-color 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                            Enter Store
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
                                flexdrip clothing co.
                            </p>
                            <p style="margin: 0; font-size: 9px; line-height: 1.4; color: #a8a29e; font-weight: 550;">
                                You are receiving this email because you registered on flexdrip.com.<br>
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
