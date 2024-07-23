import { atom } from 'recoil';
export const userState = atom({
    key: 'userState',
    default: {
        "user_id": '',
        "hoten": '',
        "taikhoan": '',
        "token": ''
    }
});