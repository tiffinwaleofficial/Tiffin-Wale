import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCorporateQuoteDto {
  @ApiProperty({
    description: 'Company name',
    example: 'Acme Corporation',
  })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({
    description: 'Contact person full name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  contactPerson: string;

  @ApiProperty({
    description: 'Contact email address',
    example: 'john.doe@acme.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+91 9876543210',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Number of employees',
    example: '21-50',
  })
  @IsNotEmpty()
  @IsString()
  employeeCount: string;

  @ApiProperty({
    description: 'Additional requirements',
    example: 'We need vegetarian options for 30% of our employees',
    required: false,
  })
  @IsOptional()
  @IsString()
  requirements?: string;
}

export class CorporateQuoteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  contactPerson: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  employeeCount: string;

  @ApiProperty({ required: false })
  requirements?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
} 