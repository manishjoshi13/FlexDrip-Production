import { Router } from "express";
import { optionalAuthenticate } from "../middleware/auth.middleware.js";
import { handleChatMessage } from "../controller/chatbot.controller.js";

const chatbotRouter = Router();

chatbotRouter.post("/message", optionalAuthenticate, handleChatMessage);

export default chatbotRouter;
