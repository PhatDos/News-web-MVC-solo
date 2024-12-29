import { Tag } from "../Models/tag.js"; // Adjust the path as needed

export const tagController = {
  // Create a new tag
  createTag: async (name) => {
    try {
      // Check if a tag with the same name exists
      const existingTag = await Tag.findOne({ name });
      if (existingTag) {
        return { status: 400, message: "Tag already exists" };
      }

      // Create and save the new tag
      const newTag = new Tag({ name });
      await newTag.save();

      return { status: 201, message: "Tag created successfully", data: newTag };
    } catch (err) {
      console.error(err);
      return { status: 500, message: "Server error" };
    }
  },

  // Get all tags
  getAllTags: async () => {
    try {
      const tags = await Tag.find().lean();
      return tags;
    } catch (err) {
      console.error(err);
      return { status: 500, message: "Server error" };
    }
  },

  // Get a tag by ID
  getTagById: async (id) => {
    try {
      const tag = await Tag.findById(id);
      if (!tag) {
        return { status: 404, message: "Tag not found" };
      }

      return { status: 200, data: tag };
    } catch (err) {
      console.error(err);
      return { status: 500, message: "Server error" };
    }
  },

  // Update a tag by ID
  updateTag: async (id, name) => {
    try {
      const updatedTag = await Tag.findByIdAndUpdate(
        id,
        { name, updatedAt: Date.now() },
        { new: true } // Return the updated document
      );

      if (!updatedTag) {
        return { status: 404, message: "Tag not found" };
      }

      return {
        status: 200,
        message: "Tag updated successfully",
        data: updatedTag,
      };
    } catch (err) {
      console.error(err);
      return { status: 500, message: "Server error" };
    }
  },

  // Delete a tag by ID
  deleteTag: async (id) => {
    try {
      const deletedTag = await Tag.findByIdAndDelete(id);

      if (!deletedTag) {
        return { status: 404, message: "Tag not found" };
      }

      return { status: 200, message: "Tag deleted successfully" };
    } catch (err) {
      console.error(err);
      return { status: 500, message: "Server error" };
    }
  },
};
