import { IsNotEmpty } from "class-validator";

export class payDto {
    @IsNotEmpty()
    amount: string
}