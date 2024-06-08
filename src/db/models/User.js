import mongoose from 'mongoose';
import { UserSchema } from "../schemas/user";

const User = mongoose.model('users', UserSchema);

export class UserModel {
  
  async findAll() {
    // Mongoose 모델의 find 함수를 이용하여 목록 추출 후 반환
    const users = await User.find();
    return users;
  }
  
  async findById({ userId }) {
    // 입력 받은 user_id를 db에서 검색하여 사용자 추출
    const user = await User.findOne({ _id: userId });
    return user;
  }
  
  async create({ newUser }) {
    const createdNewUser = await User.create(newUser);
    return createdNewUser;
  }
  
  
  async findByEmail({ email }) {
    // 입력 받은 email을 db에서 검색하여 사용자 추출
    const user = await User.findOne({ email });
    return user;
  }
  
  async update({ useremail, update }) {
    const filter = { email: useremail };
    const option = { new: true };  //업데이트 정보 반환

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }
  
  async findUser(userName) {
    const user = await User.findOne({ name: userName });
    return user;
  }
  
  async delete(useremail) {
    await User.findOneAndDelete({ email: useremail });
    return;
  }

}

const userModel = new UserModel();

export { userModel };