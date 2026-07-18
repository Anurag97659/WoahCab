import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { optionalJWT } from "../middlewares/auth.middleware.js";
import {
  createWord,
  getWords,
  getWordById,
  updateWord,
  saveNote,
  deleteNote,
  toggleWordStar,
  deleteWord,
  searchWords,
  generateTest
} from "../controllers/word.controllers.js";
const router = Router();

router.route("/createword").post(verifyJWT, createWord);
router.route("/getwords").get(optionalJWT, getWords);
router.route("/generatetest").get(optionalJWT, generateTest);
router.route("/getword/:id").get(optionalJWT, getWordById);
router.route("/updateword/:id").put(verifyJWT, updateWord);
router.route("/note/:id").put(verifyJWT, saveNote).delete(verifyJWT, deleteNote);
router.route("/star/:id").patch(verifyJWT, toggleWordStar);
// Dedicated DELETE route for notes — mirrors /deleteword/:id to avoid CORS preflight issues on Android
router.route("/deletenote/:id").delete(verifyJWT, deleteNote);
router.route("/deleteword/:id").delete(verifyJWT, deleteWord);
router.route("/search").get(optionalJWT, searchWords);


export default router;
