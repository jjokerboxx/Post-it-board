import { atom } from "recoil";

export const writeOpenState = atom({
  key: "writeOpenState",
  default: false,
});

export const deleteState = atom({
  key: "deleteState",
  default: false,
});
