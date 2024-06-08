import { UserModel } from "../db"; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {

  constructor(userModel) {
    this.userModel = userModel;
  }

    //로그인
    async getUserToken(loginInfo) {
      try{
      const { email, password } = loginInfo;

      const user = await this.userModel.findByEmail(email);
      if(!user) {
        throw new Error('해당 이메일은 가입내역이 없습니다.');
      }

      //비밀번호 일치여부
      const correctPasswordHash = user.password;

      const isPasswordCorrect = await bcrypt.compare(
        password,
        correctPasswordHash
      );

      if(!isPasswordCorrect) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      };

    //로그인 성공 => 웹토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey);

    return { token };
  }catch(err) {
    throw err;
  }
}

  //사용자 목록
  async getUsers() {
    try{
    const users = await this.userModel.findAll();
    if(!users) {
      throw new Error('해당 사용자를 찾을 수 없습니다.');
    }
    return users;
  }catch(err) {
    throw err;
  }
  }

  //개별 사용자(수정페이지)
  async getUser(email) {
    try{
    const user = await this.userModel.findByEmail(email);
    if(!user) {
      throw new Error('해당 사용자를 찾을 수 없습니다.');
    }
    return user;
  }catch(err) {
    throw err;
  }
}

  //유저정보 수정(비밀번호 소유시)
  async setUser(userInfoRequired, toUpdate) {
    try{
    const { email, currentPassword } = userInfoRequired;

    let user = await this.userModel.findByEmail(email);

    if(!user) {
      throw new Error('해당 사용자를 찾을 수 없습니다.');
    }

    //비밀번호 일치 여부확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if(!isPasswordCorrect) {
     throw new Error('비밀번호가 일치하지 않습니다.');
    }

    //비밀번호 변경 해쉬화
    const { password } = toUpdate;

    if(password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    //업데이트
    user = await this.userModel.update({
      email,
      update: toUpdate,
    });

    return user;
  }catch(err) {
    throw err;
  }
}

  //사용자 정보 삭제
  async deleteUser(userInfoRequired) {
    try{
    const { email, currentPassword } = userInfoRequired;

    let user = await this.userModel.findByEmail(email);

    if(!user) {
      throw new Error('해당 사용자를 찾을 수 없습니다.');
    };

  const correctPasswordHash = user.password;

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    correctPasswordHash
  );

  if(!isPasswordCorrect) {
    throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
  }
  await this.userModel.delete(email);
  return user;
}catch(err) {
  throw err;
}}
};

const userService = new UserService(UserModel);

export { userService };