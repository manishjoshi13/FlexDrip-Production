export const getVerifyAccountHTML = (fullName, token, frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173') => {
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account - FlexDrip</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafaf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px 40px; border-bottom: 1px solid #fafaf9;">
                            <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #000000; font-family: 'Helvetica Neue', Arial, sans-serif;">FLEXDRIP</h1>
                            <span style="font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #a8a29e; display: block; margin-top: 5px;">Elevated Streetwear</span>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            <h2 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1c1917;">Confirm Your Email</h2>
                            <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Hello ${fullName || 'there'},
                            </p>
                            <p style="margin: 0 0 30px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 400;">
                                Thank you for joining FlexDrip. Before you can start building your streetwear wardrobe and place orders, please confirm your email address by clicking the verification link below.
                            </p>
                            
                            <!-- Button CTA -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <a href="${verificationUrl}" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border-radius: 12px; transition: background-color 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                            Verify Account
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 10px 0; font-size: 11px; line-height: 1.5; color: #a8a29e; font-weight: 400; text-align: center;">
                                If the button above doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #78716c; font-weight: 500; text-align: center; word-break: break-all;">
                                <a href="${verificationUrl}" target="_blank" style="color: #78716c; text-decoration: underline;">
                                    ${verificationUrl}
                                </a>
                            </p>
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

export const getErrorHTML = (message) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Failed - FlexDrip</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #fafaf9;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .card {
            max-width: 400px;
            width: 100%;
            background-color: #ffffff;
            border: 1px solid #e7e5e4;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
            text-align: center;
        }
        h1 {
            margin: 0 0 10px 0;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #b91c1c;
        }
        p {
            font-size: 14px;
            line-height: 1.6;
            color: #57534e;
            margin: 0 0 30px 0;
        }
        .btn {
            display: inline-block;
            background-color: #000000;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            text-decoration: none;
            padding: 16px 36px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Failed</h1>
        <p>${message}</p>
        <a href="${frontendUrl}/register" class="btn">Try Again</a>
    </div>
</body>
</html>`;
};

export const getSuccessHTML = () => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verified - FlexDrip</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #fafaf9;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .card {
            max-width: 400px;
            width: 100%;
            background-color: #ffffff;
            border: 1px solid #e7e5e4;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
            text-align: center;
        }
        h1 {
            margin: 0 0 10px 0;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #000000;
        }
        p {
            font-size: 14px;
            line-height: 1.6;
            color: #57534e;
            margin: 0 0 30px 0;
        }
        .btn {
            display: inline-block;
            background-color: #000000;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            text-decoration: none;
            padding: 16px 36px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Verified</h1>
        <p>Your email address has been verified successfully. Welcome to the FlexDrip family.</p>
        <a href="${frontendUrl}/login" class="btn">Login</a>
    </div>
</body>
</html>`;
};
