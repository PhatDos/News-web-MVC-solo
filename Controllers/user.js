import { User } from "../Models/user.js";
import bcrypt from "bcryptjs";
export const userController = {
  getAllUsers: async () => {
    try {
      const users = await User.find().lean();
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  addAvailableCategory: async (userId, categoryId) => {
    if (!userId || !categoryId) {
      throw new Error("User ID and Category ID are required");
    }

    try {
      // Tìm người dùng theo userId
      const user = await User.findById(userId).select("avaiCategory");
      if (!user) {
        throw new Error("User not found");
      }

      // Kiểm tra nếu categoryId chưa có trong avaiCategory
      if (!user.avaiCategory.includes(categoryId)) {
        user.avaiCategory.push(categoryId);

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();
      }

      return user; // Trả về đối tượng user đã cập nhật
    } catch (error) {
      console.error("Error adding available category:", error);
      throw error;
    }
  },
  getEditorsOnly: async () => {
    try {
      // Tìm tất cả người dùng có vai trò là "editor" và populate avaiCategory
      const editors = await User.find({ role: "editor" })
        .populate("avaiCategory") // Lấy thông tin đầy đủ của các category
        .lean();

      return editors;
    } catch (error) {
      console.error("Error fetching editors:", error);
      throw new Error(error.message);
    }
  },
  getPendingArticlesByUser: async (userId) => {
    if (!userId) {
      console.error("User ID is required");
      return [];
    }

    try {
      const user = await User.findById(userId).select("avaiCategory").lean();
      if (!user || !user.avaiCategory || user.avaiCategory.length === 0) {
        console.warn("User not found or avaiCategory is empty");
        return [];
      }

      const articles = await Article.find({
        status: "pending",
        category: { $in: user.avaiCategory },
      })
        .populate("category")
        .populate("tags")
        .populate("author")
        .lean();

      return articles;
    } catch (error) {
      console.error("Error fetching pending articles for user:", error);
      return [];
    }
  },
  // CREATE a new user
  createUser: async (userData) => {
    try {
      // Encrypt the password
      const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 is the saltRounds

      // Create a new user object with the hashed password
      const user = new User({
        ...userData,
        password: hashedPassword, // Replace the plain password with the hashed one
      });

      // Save the user to the database
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // READ all users
  getAllUsers: async () => {
    try {
      const users = await User.find().lean();
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // READ a single user by ID
  getUserById: async (id) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // UPDATE a user by ID
  updateUser: async (id, updateData) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // DELETE a user by ID
  deleteUser: async (id) => {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new Error("User not found");
      }
      return { message: "User deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default userController;
