import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  secretKey = "NcRfUjXn2r5u7x!A%D*G-KaPdSgVkYp3";

  constructor() { }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey, CryptoJS.mode.ECB).toString();
  }

  decrypt(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey, CryptoJS.mode.ECB).toString(CryptoJS.enc.Utf8);
  }

}
