import User from "../models/userModel.js";
import Lead from "../models/leadModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create users" });
    }

    const { name, email, password, role, managerId } = req.body;

    // Check email already exists before creating
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      managerId: role === "agent" ? managerId : null,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        managerId: newUser.managerId,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update users" });
    }

    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "Email already exists" });
      user.email = email;
    }

    if (name) user.name = name;
    if (role) user.role = role;

    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete users" });
    }

    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const assignLeadToUser = async (req, res) => {
//   try {
//     const { leadEmail, userEmail } = req.body;
//     if (req.user.role !== "admin")
//       return res.status(403).json({ message: "Only admin can assign leads" });

//     const lead = await Lead.findOne({ email: leadEmail });
//     const user = await User.findOne({ email: userEmail });
//     if (!lead || !user)
//       return res.status(404).json({ message: "Lead/User not found" });

//     lead.assignedTo = user.name;
//     lead.status = "contacted";
//     await lead.save();

//     res.json({ message: "Lead assigned successfully", lead });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getManagers = async (req, res) => {
  const managers = await User.find({ role: "manager" })
    .select("_id name");

  res.json(managers);
};
export const getAgentsWithManagers = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" })
      .populate("managerId", "name email role") // show manager details
      .select("-password");

    res.json(agents);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAgents = async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Only managers can view their agents" });
    }

    const agents = await User.find({
      role: "agent",
      managerId: req.user._id
    }).select("-password");

    res.json(agents);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
