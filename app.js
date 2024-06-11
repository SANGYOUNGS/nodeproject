// import cors from "cors";
// import express from "express";
// import mongoose from 'mongoose';
// import router from "../routers/userRouter.js";
// import errorHandler from "./middlewares/errorhandler.js";

// const app = express();
// const PORT = process.env.PORT || 8000;

// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     autoIndex: true
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));
// // CORS 에러 방지
// app.use(cors());

// // express 기본 제공 middleware
// // express.json(): POST 등의 요청과 함께 오는 json형태의 데이터를 인식하고 핸들링할 수 있게 함.
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use('/api', router);
// app.use(errorHandler);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// export default app;