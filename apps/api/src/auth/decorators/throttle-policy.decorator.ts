export const ThrottlePolicy = (
  policy: keyof typeof THROTTLE_POLICIES,
) =>
  SetMetadata(
    'throttle-policy',
    policy,
  );