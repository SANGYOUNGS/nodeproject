import is from "@sindresorhus/is";
import { Router } from "express";
import { userService } from "../services/userService";

const userRouter = Router();

//로그인
userRouter.post("/user-login", 
  async (req, res) => {
    try{
    // req (request) 에서 데이터 가져오기
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).send('이메일과 비밀번호를 확인해 주세요.');
    }

    // 위 데이터를 이용하여 유저 db에서 유저 찾기
    const userToken = await userService.getUserToken({ email, password });

    res.json(userToken);
}catch(e) {
  res.status(500).send('서버 오류');
}
});

//전체 사용자 가져오기
userRouter.get(
  "/",
  async (req, res) => {
    try {
      const users = await userService.getUsers();
      res.json(users);
    }catch(e) {
      res.status(500).send('서버 오류');
    }});
  
  //개별 사용자 정보 조회
  userRouter.get(
    "/my-info/:id",
    async (req, res) => {
      try{
        const { id } = req.params;

        if (!id) {
          return res.status(400).send('id를 확인해 주세요.');
        }

      const user = await userService.getUserInfo({ id });
    }catch(e) {
      res.status(500).send('서버 오류');
    }});

//사용자 정보 수정
userRouter.put(
  '/my-info/:id',
  async (req, res) => {
    try {
    if(is.emptyObject(req.body)) {
      return res.status(400).send('정보를 입력해 주세요.');
    }

    const { id } = req.params;
    const { email, name, password, address, phoneNumber, role, currentPassword } = req.body;

    if(!currentPassword) {
      return res.status(400).send('비밀번호를 입력해 주세요.');
    }

    const userInfoRequired = { id, currentPassword };
    const toUpdate = { email, name, password, address, phoneNumber, role };
    
    const updateUserInfo = await userService.setUser(userInfoRequired, toUpdate);

    res.json(updateUserInfo);
  } catch(e) {
    res.status(500).send('서버 오류');
  }});

  //정보 삭제
  userRouter.delete(
    '/my-info/:id',
    async (req, res) => {
      try {

        const { id } = req.params;
        const { password: currentPassword } = req.body;

      if(!currentPassword) {
        return res.status(400).send('비밀번호를 입력해 주세요.');
      }

      const userInfoRequired = { id , currentPassword};

      await userService.deleteUser(userInfoRequired);

      res.status(200).json({message: '삭제되었습니다.'});
      }catch(e) {
        res.status(500).send('서버 오류');
      }});

    //로그아웃
    userRouter.get('/logout', async (req, res) => {
      await userService.logout();
      res.status(200).json({ message: '로그아웃 되었습니다.'})
    });
     
export { userRouter };