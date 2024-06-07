import { UserModel } from "../schemas/user";

class User {
    
    static async findAll() {
    // Mongoose 모델의 find 함수를 이용하여 목록 추출 후 반환
    const users = await User.find();
    return users;
  }


  static async findById({ user_id }) {
    // 입력 받은 user_id를 db에서 검색하여 사용자 추출
    const user = await UserModel.findOne({ id: user_id });
    return user;
  }


  static async create({ newUser }) {
    const createdNewUser = await UserModel.create(newUser);
    return createdNewUser;
  }

  static async findByEmail({ email }) {
    // 입력 받은 email을 db에서 검색하여 사용자 추출
    const user = await UserModel.findOne({ email });
    return user;
  }
  static async update({ useremail, update }) {
    const filter = { email: useremail };
    const option = { returnOriginal: false };

    const updatedUser = await UserModel.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  static async findUser(userName) {
    const user = await UserModel.findOne({ Name: userName });
    return user;
  }

  static async delete(useremail) {
    await UserModel.findOneAndDelete({ email: useremail });
    return;
  }

}

export { User };