import { runChatbotAgent } from "../services/ai.service.js";
import { asyncHandler } from "../utils/asyncWrapper.js";
import { AppError } from "../utils/appError.js";

// POST: /api/chatbot/message
export const handleChatMessage = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        throw new AppError("Message content is required", 400);
    }

    // Call the AI agent executor with user context (if available)
    const response = await runChatbotAgent(message, history, req.user || null);

    res.status(200).json({
        success: true,
        response
    });
});
