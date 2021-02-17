const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  //   user
  // .save()
  // .then(() => {
  //   res.send(user);
  // })
  // .catch((error) => {
  //   res.status(400).send(error);
  // });

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    // const userprofile=user.getPublicProfile();
    // let value=await userprofile;
    // // console.log(value);
    // res.send({value,token});
    res.send({ user, token });
  } catch (error) {
    //   console.log(e);
    res.send(error);
  }
});
router.post("/users/logout", auth, async (req, res) => {
  try {
    // console.log(req.user.tokens)
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    console.log(req.user);
    req.user.tokens = [];
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/users/me", auth, async (req, res) => {
  // User.find({}).then((user)=>{
  //     res.send(user)
  // }).catch((error) => {res.status(500).send(error);});
  try {
    res.send(req.user);
  } catch (e) {
    //   console.log(e);
    res.status(500).send(e);
  }
});
router.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  //     User.findById(id).then((user)=>{
  //      if(!user)return res.status(404).send;
  //      res.send(user);
  //    }).catch((error)=>{res.status(500).send(error)})
  try {
    // console.log(1);
    const user = await User.findById(id);

    if (!user) return res.status(404).send;
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});
// router.patch("/users/:id", async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdate = ["name", "email", "password", "age"];
//   const isValidOperation = updates.every((update) => {
//     return allowedUpdate.includes(update);
//   });
//   if (!isValidOperation) {
//     return res.status(400).send({ error: "invalid updates" });
//   }
//   try {
//       const user= await User.findById(req.params.id);
//       updates.forEach((update)=>{
//           user[update]=req.body[update];
//       });
//       await user.save();
//     // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     //   new: true,
//     //   runValidators: true,
//     // });
//     if (!user) return res.status(404).send();
//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdate.includes(update);
  });
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    // const user= await User.findById(req.params.id);
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findOneAndDelete(req.params._id);
    // if (!user) return res.status(404).send();
    console.log(req.user);
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must pe jpg or jpeg or png"));
    }
    cb(undefined, true);
  },
});
router.post("/users/me/avatar", auth,upload.single("avatar"), async (req, res) => {
  console.log(req.file);
  req.user.avatar=req.file.buffer;
  await req.user.save();
  res.send();
});
module.exports = router;
