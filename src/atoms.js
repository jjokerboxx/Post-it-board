import { atom } from "recoil";

export const writeOpenState = atom({
  key: "writeOpenState",
  default: false,
});

export const deleteState = atom({
  key: "deleteState",
  default: false,
});

export const userState = atom({
  key: "userState",
  default: { id: "", nickname: "" },
});

export const likedPostIdArr = atom({
  key: "likedPostIdArr",
  default: [],
});
