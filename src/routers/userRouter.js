import is from "@sindresorhus/is";
import { Router } from "express";
import { userAuthService } from "../services/userService";
import { customError } from '@error';
import { asyncHandler } from '@asyncHandler';

const userAuthRouter = Router();

//로그인
userAuthRouter.post("/api/v1/user-login", 
  asyncHandler(async function (req, res, next) {

    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 위 데이터를 이용하여 유저 db에서 유저 찾기
    const userToken = await userAuthService.getUserToken({ email, password });

    res.status(200).json(userToken);
})
);

//전체 사용자 가져오기
userAuthRouter.get(
  "/api/v1/userlist",
  asyncHandler(async function (req, res, next) {

        const users = await userAuthService.getUsers();

     //HTTP 200 응답과 함께 위에서 추출된 사용자 목록을 반환
      res.status(200).send(users);
    }));
  
  //개별 사용자 정보 조회
  userAuthRouter.get(
    "/api/v1/my-info/:id",
    asyncHandler(async function (req, res, next) {

      if(is.emptyObject(req.params)) {
        throw new customError(400, '조회하려는 이름이 정확한지 확인해주세요.');
      }
        // URI로부터 id를 추출하고, 서비스 층의 getUserInfo 함수에 인자로 전달
        const id = req.params.id;
        const user = await userAuthService.getUserInfo({ id });
        // errorMessage 가 있는 경우, 에러를 생성
        console.log('user from router: ', user);
        res.status(200).json(user);
    })
  );

//사용자 정보 수정
userAuthRouter.put(
  '/api/v1/my-info/:id',
  asyncHandler(async function (req, res, next) {
    if(is.emptyObject(req.body)) {
      throw new customError(400, '변경할 정보를 입력해 주세요.');
    }

    const id = req.params.id;

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;
    const role = req.body.role;

    const currentPassword = req.body.currentPassword;

    if(!currentPassword) {
      throw new customError(400, '정보를 변경하려면 비밀번호를 입력해 주세요.');
    }

    const userInfoRequired = { id, currentPassword };

    const toUpdate = {
      ...(email && {email}),
      ...(name && {name}),
      ...(password && {password}),
      ...(address && {address}),
      ...(phoneNumber && {phoneNumber}),
      ...(role && {role}),
    };

    const updateUserInfo = await userAuthService.setUser(userInfoRequired, toUpdate);

    res.status(200).json(updateUserInfo);
  })
);

  //정보 삭제
  userAuthRouter.delete(
    '/api/v1/my-info/:id', 
    asyncHandler(async function (req, res, next) {
  
      if(is.emptyObject(req.body)) {
        throw new customError(400, '정보를 변경하려면 비밀번호를 입력해 주세요.');
      }

      const id = req.params.id;

      const currentPassword = req.body.password;

      if(!currentPassword) {
        throw new customError(400, '정보를 변경하려면 비밀번호를 입력해 주세요.');
      }

      const userInfoRequired = { id , currentPassword};

      await userAuthService.deleteUser(userInfoRequired);

      res.status(200).json({message: '성공'});
      })
    );

    userAuthRouter.get('/api/v1/logout', (req, res) => {
      res.status(200).json({ message: '로그아웃 되었습니다.'})
    });

export { userAuthRouter };