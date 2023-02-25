import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { appConfigurations } from '../config/configuration';
import { ConfigType } from '@nestjs/config';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { Farmer, LoginTokenDto } from './dto/login-token.dto';
import { LeekOpponentsGarden } from './dto/leek-opponent-garden.dto';
import { StartFightDto } from './dto/start-fight.dto';

@Injectable()
export class LeekwarsService {
  apiUrl = 'https://leekwars.com/api';
  token: string;
  cookies: string[];

  constructor(
    private readonly httpService: HttpService,
    @Inject(appConfigurations.KEY)
    private readonly configurations: ConfigType<typeof appConfigurations>,
  ) {}

  login(): Observable<LoginTokenDto> {
    const loginForm = new URLSearchParams();
    loginForm.append('login', this.configurations.leekwarsLogin);
    loginForm.append('password', this.configurations.leekwarsPassword);
    loginForm.append('keep_connected', 'false');
    return this.httpService
      .post(`${this.apiUrl}/farmer/login-token`, loginForm, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true,
      })
      .pipe(
        map((response: AxiosResponse<LoginTokenDto>) => {
          this.token = response.data.token;
          this.cookies = response.headers['set-cookie'];
          return response.data;
        }),
      );
  }

  getGarden(): Observable<LeekOpponentsGarden> {
    Logger.debug(this.token, 'TOKEN');
    return this.httpService
      .get(`${this.apiUrl}/garden/get`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        withCredentials: true,
      })
      .pipe(
        map((response: AxiosResponse<LeekOpponentsGarden>) => response.data),
      );
  }

  getGardenForLeek(leek: string): Observable<LeekOpponentsGarden> {
    Logger.debug(this.token, 'TOKEN');
    return this.httpService
      .get(`${this.apiUrl}/garden/get-leek-opponents/${leek}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Cookie: this.cookies.join('; ') + ';',
        },
        withCredentials: true,
      })
      .pipe(
        map((response: AxiosResponse<LeekOpponentsGarden>) => response.data),
      );
  }

  startSoloFight(leek: string, opponent: string): Observable<StartFightDto> {
    const soloFightForm = new URLSearchParams();
    soloFightForm.append('leek_id', leek);
    soloFightForm.append('target_id', opponent);
    return this.httpService
      .post(`${this.apiUrl}/garden/start-solo-fight`, soloFightForm, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.token}`,
          Referer: `https://leekwars.com/garden/solo/${leek}`,
          Cookie: this.cookies.join('; ') + ';',
        },
        withCredentials: true,
      })
      .pipe(
        map((response: AxiosResponse<StartFightDto>) => {
          return response.data;
        }),
      );
  }

  async pickAFight(): Promise<string> {
    const { farmer } = await firstValueFrom(this.login());
    const leek = Object.keys(farmer.leeks)[0];
    const garden = await firstValueFrom(this.getGarden());
    const leekGarden = await firstValueFrom(this.getGardenForLeek(leek));
    const opponent = await Object.values(leekGarden.opponents)[0].id;
    const { fight } = await firstValueFrom(this.startSoloFight(leek, opponent));
    return fight;
  }
}
