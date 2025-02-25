import { Test, TestingModule } from '@nestjs/testing';
import { AddressResolver } from './address.resolver';
import { AddressService } from './address.service';

// Mock the entire AddressService module
jest.mock('./address.service', () => ({
  AddressService: jest.fn().mockImplementation(() => ({
    validateAddress: jest.fn(),
  })),
}));

// Mock the constants
jest.mock('../core/constants.ts', () => ({
  BASE_URL: 'mock-url',
  BEARER_TOKEN: 'mock-token',
}));

describe('AddressResolver', () => {
  let resolver: AddressResolver;
  let addressService: jest.Mocked<AddressService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressResolver, AddressService],
    }).compile();

    resolver = module.get<AddressResolver>(AddressResolver);
    addressService = module.get<AddressService>(
      AddressService,
    ) as jest.Mocked<AddressService>;
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('checkAddress', () => {
    it('should validate an address successfully', async () => {
      const mockResponse = {
        isValid: true,
        errorMessage: '',
        localities: [
          {
            category: 'Delivery Area',
            id: 123,
            latitude: -33.865143,
            location: 'SYDNEY',
            longitude: 151.2099,
            postcode: 2000,
            state: 'NSW',
          },
        ],
      };

      (addressService.validateAddress as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await resolver.checkAddress('Sydney', 'NSW');

      expect(result).toEqual(mockResponse);
      expect(addressService.validateAddress).toHaveBeenCalledWith(
        'Sydney',
        'NSW',
      );
    });

    it('should handle invalid address', async () => {
      const mockResponse = {
        isValid: false,
        errorMessage: 'Address not found',
        localities: [],
      };

      (addressService.validateAddress as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await resolver.checkAddress('Invalid Address', 'NSW');

      expect(result).toEqual(mockResponse);
      expect(addressService.validateAddress).toHaveBeenCalledWith(
        'Invalid Address',
        'NSW',
      );
    });
  });
});
