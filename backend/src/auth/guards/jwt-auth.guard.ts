import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// Calls the strategy jwt based on the Passport documentation (invoked in module -> Providers).
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}