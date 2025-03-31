import { UseGuards } from '@nestjs/common';
import { JwtAuthGuards } from '../quards/jwt_auht_quards';

export const Auth = () => UseGuards(JwtAuthGuards);
