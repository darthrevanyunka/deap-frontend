import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  secretKey = "my_super_secret_key_ho_ho_ho";

  constructor() { }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey, { mode: CryptoJS.mode.ECB}).toString();
  }

  decrypt(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey, { mode: CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8);
  }

}
