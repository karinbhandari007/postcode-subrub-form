import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

type Locality = {
  category: string;
  id: number;
  latitude?: number;
  location: string;
  longitude?: number;
  postcode: number;
  state: string;
};

interface Localities {
  locality: Locality[];
}

interface ValidateAddressResp {
  localities: Localities;
}

interface AddressValidationResponse {
  isValid: boolean;
  errorMessage: string;
  localities: Locality[];
}

@Injectable()
export class AddressService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async validateAddress(
    searchQuery: string,
    state: string,
  ): Promise<AddressValidationResponse> {
    try {
      const headers = {
        Authorization: `Bearer ${this.configService.get<string>('BEARER_TOKEN')}`,
      };

      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('q', searchQuery);
      }
      if (state) {
        params.append('state', state);
      }

      const response: AxiosResponse<ValidateAddressResp> = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get<string>('BASE_URL')}?${params.toString()}`,
          {
            headers,
          },
        ),
      );

      const localities = response.data.localities?.locality || [];

      if (localities.length > 0) {
        return { isValid: true, errorMessage: '', localities };
      } else {
        return {
          isValid: false,
          errorMessage: 'No valid locality found for the given address.',
          localities: [],
        };
      }
    } catch (error: unknown) {
      let errorMessage = '';
      if (error instanceof Error) {
        errorMessage = error.message || 'Failed to validate address.';
      } else {
        errorMessage = 'Failed to validate address';
      }
      return { isValid: false, errorMessage, localities: [] };
    }
  }
}
