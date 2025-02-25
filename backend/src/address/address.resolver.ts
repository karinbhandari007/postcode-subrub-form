import { Resolver, Query, Args } from '@nestjs/graphql';
import { AddressService } from './address.service';

@Resolver()
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Query(() => AddressValidationResponse)
  async checkAddress(
    @Args('searchQuery') searchQuery: string,
    @Args('state') state: string,
  ): Promise<AddressValidationResponse> {
    return this.addressService.validateAddress(searchQuery, state);
  }
}

import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class Locality {
  @Field()
  category: string;

  @Field()
  id: number;

  @Field({ nullable: true })
  latitude?: number;

  @Field()
  location: string;

  @Field({ nullable: true })
  longitude?: number;

  @Field()
  postcode: number;

  @Field()
  state: string;
}

@ObjectType()
class AddressValidationResponse {
  @Field()
  isValid: boolean;

  @Field()
  errorMessage: string;

  @Field(() => [Locality], { nullable: true })
  localities?: Locality[];
}
