import { UserModel } from "../db"; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { customError } from '@error';

class userAuthService {

  constructor(UserModel) {
    this.UserModel = UserModel;
  }
  
  //비밀번호 해쉬화 위한 삽입
  async addUser(userInfo) {
    const { email, name, password } = userInfo;

    const user = await this.UserModel.findByEmail(email);
    if(user) {
      throw new customError(400, '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.');
    }

     // 비밀번호 해쉬화
     const hashedPassword = await bcrypt.hash(password, 10);

     // id 는 유니크 값 부여
     const id = uuidv4();
     const newUser = { id, name, email, password: hashedPassword };
 
     // db에 저장
     const createdNewUser = await this.UserModel.create(newUser);
     createdNewUser.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.
 
     return createdNewUser;
   }
   
    //로그인
    async getUserToken(loginInfo) {
      const { email, password } = loginInfo;

      const user = await this.UserModel.findByEmail(email);
      if(!user) {
        throw new customError(400, '해당 이메일은 가입내역이 없습니다.');
      }

      //비밀번호 일치여부
      const correctPasswordHash = user.password;

      const isPasswordCorrect = await bcrypt.compare(
        password,
        correctPasswordHash
      );

      if(!isPasswordCorrect) {
        throw new customError(400, '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
      };

    //로그인 성공 => 웹토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey);

    return { token };
  }

  //사용자 목록
  async getUsers() {
    const users = await this.UserModel.findAll();
    if(!users) {
      throw new customError('해당 사용자 목록을 찾을 수 없습니다.');
    }
    return users;
  }

  //개별 사용자(수정페이지)
  async getUser(useremail) {
    const user = await this.UserModel.findByEmail(useremail);
    if(!user) {
      throw new customError(400, '해당 사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  //유저정보 수정(비밀번호 소유시)
  async setUser(userInfoRequired, toUpdate) {
    const { useremail, currentPassword } = userInfoRequired;

    let user = await this.UserModel.findByEmail(useremail);

    if(!user) {
      throw new customError(400, '해당 사용자를 찾을 수 없습니다.');
    }

    //비밀번호 일치 여부확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if(!isPasswordCorrect) {
      throw new customError(400, '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
    }

    //비밀번호 변경 해쉬화
    const { password } = toUpdate;

    if(password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    //업데이트
    user = await this.UserModel.update({
      useremail,
      update: toUpdate,
    });

    return user;
  }

  //사용자 정보 삭제
  async deleteUser(userInfoRequired) {
    const { useremail, currentPassword } = userInfoRequired;

    let user = await this.UserModel.findByEmail(useremail);

    if(!user) {
      throw new customError(400, '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    };

  const correctPasswordHash = user.password;

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    correctPasswordHash
  );

  if(!isPasswordCorrect) {
    throw new customError(400, '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
  }
  await this.UserModel.delete(useremail);
  return;
}
}

const userAuthService = new userAuthService(UserModel);

export { userAuthService };

    // 반환할 loginuser 객체를 위한 변수 설정
    // const id = user.id;
    // const name = user.name;
    // const description = user.description;

    // const loginUser = {
    //   token,
    //   id,
    //   email,
    //   name,
    //   description,
    //   errorMessage: null,
    // };

    // return loginUser;
