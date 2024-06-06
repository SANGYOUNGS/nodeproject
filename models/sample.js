const mongoose = require("mongoose");

// URI: mongodb+srv://oneitwoh-db-user:4mQClUsDcVcfEWnu@oneitwoh-mongo-cluster0.fyhr1ce.mongodb.net/Test
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const ItemSchema = new mongoose.Schema({
    name: {
      type: String,
      // 열거형: americano, cappuccino, latte 중 하나 값인 경우에만 허용
      enum: ["americano", "cappuccino", "latte"],
      // 필수 값
      required: true,
    },
    count: {
      type: Number,
      // 필수 값
      required: true,
    },
  });

  const OrderSchema = new mongoose.Schema(
    {
      items: {
        // 다른 스키마를 타입으로 사용 가능
        type: [ItemSchema],
        // 추가 검증을 위한 함수. 삽입/수정 전 해당 값이 최소 하나 이상의 값을 가지고 있는 배열인지 체크하는 함수
        validate: (v) => Array.isArray(v) && v.length > 0,
        required: true,
      },
      orderedBy: {
        type: String,
        required: true,
        // orderedBy에 아무 값도 없으면 Anomymous로 초기화해서 mongoDB에 삽입/수정
        default: "Anonymous",
      },
    },
    {
      collection: "Order", // 주의 collection 이름을 명시하지 않으면 아래 mongoose.model의 첫 번째 인자로 전달된 값을 복수형으로 해서 사용한다.
    }
  );

  const Order = mongoose.model("Order", OrderSchema);

  // 일단 Order collection에 document가 있다면 모두 삭제해서 초기화
  await Order.deleteMany({});

  // 문제 없음
  await Order.create({
    items: [
      {
        name: "americano",
        count: 1,
      },
    ],
    orderedBy: "Dr. Doom",
  });

  // 문제 없음
  await Order.create({
    items: [
      {
        name: "latte",
        count: 2,
      },
    ],
    // orderedBy는 필수값이지만 default 속성이 설정되어있기 때문에 값을 설정하지 않다도 default값인 "Anonymous"로 됨
  });

  try {
    // 문제 있음: 필수값인 items 명시하지 않음
    await Order.create({
      orderedBy: "John Doe",
    });
  } catch (error) {
    console.log(error);
    console.log("=> 필수값인 items가 없어서 에러");
  }

  try {
    // 문제 있음: items의 element 중 하나의 name이 enum중의 하나가 아님
    await Order.create({
      items: [
        {
          name: "mojito",
          count: 1,
        },
        {
          name: "americano",
          count: 2,
        },
      ],
      orderedBy: "Ernest Hemingway",
    });
  } catch (error) {
    console.log(error);
    console.log(
      "=> items의 첫 element의 name 값이 americano, cappuccino, latte 중 하나가 아니라서 에러"
    );
  }
  process.exit(0);
}

main();