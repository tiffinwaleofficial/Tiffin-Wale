import { ApiProperty } from "@nestjs/swagger";

export class TicketDto {
  @ApiProperty({
    example: "1678886400000",
    description: "The unique identifier for the ticket.",
  })
  id: string;

  @ApiProperty({
    example: "user-123",
    description: "The ID of the user who created the ticket.",
  })
  userId: string;

  @ApiProperty({
    example: "Login Issue",
    description: "The subject of the support ticket.",
  })
  subject: string;

  @ApiProperty({
    example: "I am unable to log in to my account.",
    description: "The detailed message of the support ticket.",
  })
  message: string;

  @ApiProperty({
    example: "Technical Support",
    description: "The category of the support ticket.",
  })
  category: string;

  @ApiProperty({
    example: "2023-03-15T12:00:00.000Z",
    description: "The date and time when the ticket was created.",
  })
  createdAt: Date;
}
