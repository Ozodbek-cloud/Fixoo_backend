import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { SMSSendResponse } from '../types/sms';

@Injectable()
export class SmsService {
  private token: string;
  private readonly $axios = axios.create({
    baseURL: 'https://notify.eskiz.uz/api',
  });

  constructor(private readonly config: ConfigService) {}

  private async login() {
    try {
      const { data } = await this.$axios.post<{ data: { token: string } }>(
        '/auth/login',
        {
          email: this.config.get('SMS_LOGIN'),
          password: this.config.get('SMS_PASSWORD'),
        },
      );
      this.token = data.data.token;
    } catch (err) {
      throw new HttpException(
        'Eskiz login failed: ' + (err?.response?.data?.message || 'Unknown error'),
        err?.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async sendSMS(message: string, to: string) {
    try {
      if (!this.token) {
        await this.login();
      }

      await this.$axios.post<SMSSendResponse>(
        '/message/sms/send',
        {
          from: this.config.get('SMS_FROM'),
          message,
          mobile_phone: to.replace(/\s+/g, ''),
          callback_url: this.config.get('SMS_CALLBACK_URL') || '',
        },
        {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        },
      );

      return true;
    } catch (err) {
      throw new HttpException(
        'SMS yuborishda xatolik: ' + (err?.response?.data?.message || 'Unknown error'),
        err?.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
