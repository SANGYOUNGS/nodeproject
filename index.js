import 'dotenv/config'
import { app } from "./src/app";

//.env 파일 상의 환경변수를 사용하며,만약에 없을 시 기본값으로 5000을 할당함. 
const PORT = process.env.SERVER_PORT || 8000;

app.listen(PORT, () => {
  console.log(`정상적으로 서버를 시작하였습니다.  http://localhost:${PORT}`);
});