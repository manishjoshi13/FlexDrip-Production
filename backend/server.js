import app from "./src/app.js";
import {config} from "./src/config/config.js";
import { connectDB } from "./src/config/database.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import authRouter from "./src/routes/auth.route.js";
import buyerRouter from "./src/routes/buyer.routes.js";
import productRouter from "./src/routes/product.routes.js";
import cartRouter from "./src/routes/cart.routes.js";
import orderRouter from "./src/routes/order.route.js";
import reviewRouter from "./src/routes/review.route.js";
import issueRouter from "./src/routes/issue.route.js";
import chatbotRouter from "./src/routes/chatbot.route.js";
app.listen(config.PORT,()=>{
    console.log(`Server is running on port ${config.PORT}`);
})
connectDB()

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use('/api/auth',authRouter)
app.use('/api/product',productRouter)
app.use('/api/buyer',buyerRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/review',reviewRouter)
app.use('/api/issue',issueRouter)
app.use('/api/chatbot',chatbotRouter)
app.use(errorHandler)

export default app;