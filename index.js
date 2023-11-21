import express from 'express'
import userRouter from "./routes/userRoutes.js"
import orderRouter from "./routes/orderRoutes.js"

const app = express()

app.get("/", (req, res) => {
    res.send("Hello new App!")
})

app.use("/users", userRouter)
app.use("/orders", orderRouter)

app.listen(8080, ()=> console.log("listening on localhost:8080"))