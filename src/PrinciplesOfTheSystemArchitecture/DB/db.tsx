const db = {
  users: [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  items: [
    {
      id: "1",
      name: "Item 1",
      price: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Item 2",
      price: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  orders: [
    {
      id: "1",
      userId: "1",
      itemId: "1",
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      userId: "2",
      itemId: "2",
      quantity: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

export default db;
