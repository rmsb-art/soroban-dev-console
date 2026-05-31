@Injectable()
export class RateLimitGuard
  implements CanActivate
{
  async canActivate(
    context: ExecutionContext,
  ) {
    const request =
      context.switchToHttp().getRequest();

    const identifier =
      request.user?.id ??
      request.ip;

    return this.rateLimitService.consume(
      identifier,
      policy,
    );
  }
}